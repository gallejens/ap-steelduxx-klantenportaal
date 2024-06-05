package com.ap.steelduxxklantenportaal.services;

import com.ap.steelduxxklantenportaal.dtos.externalapi.ExternalApiOrderRequestDto;
import com.ap.steelduxxklantenportaal.dtos.externalapi.OrderDocumentUploadDto;
import com.ap.steelduxxklantenportaal.dtos.externalapi.OrderDto;
import com.ap.steelduxxklantenportaal.dtos.orderrequests.*;
import com.ap.steelduxxklantenportaal.enums.OrderTransportTypeEnum;
import com.ap.steelduxxklantenportaal.enums.StatusEnum;
import com.ap.steelduxxklantenportaal.models.*;
import com.ap.steelduxxklantenportaal.repositories.*;
import com.ap.steelduxxklantenportaal.utils.ResponseHandler;
import jakarta.mail.MessagingException;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class OrderRequestService {
    private final OrderRequestRepository orderRequestRepository;
    private final OrderRequestProductRepository orderRequestProductRepository;
    private final OrderRequestDocumentRepository orderRequestDocumentRepository;
    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;
    private final UserPreferenceRepository userPreferenceRepository;
    private final NotificationService notificationService;
    private final EmailService emailService;
    private final FileSystemStorageService fileSystemStorageService;
    private final ExternalApiService externalApiService;

    public OrderRequestService(
            OrderRequestRepository orderRequestRepository,
            OrderRequestProductRepository orderRequestProductRepository,
            OrderRequestDocumentRepository orderRequestDocumentRepository,
            CompanyRepository companyRepository, UserRepository userRepository, UserPreferenceRepository userPreferenceRepository, NotificationService notificationService, EmailService emailService,
            ExternalApiService externalApiService,
            FileSystemStorageService fileSystemStorageService) {
        this.orderRequestRepository = orderRequestRepository;
        this.orderRequestProductRepository = orderRequestProductRepository;
        this.orderRequestDocumentRepository = orderRequestDocumentRepository;
        this.companyRepository = companyRepository;
        this.userRepository = userRepository;
        this.userPreferenceRepository = userPreferenceRepository;
        this.notificationService = notificationService;
        this.emailService = emailService;
        this.fileSystemStorageService = fileSystemStorageService;
        this.externalApiService = externalApiService;
    }

    public ResponseEntity<Object> approveOrderRequest(Long id) {
        var orderRequest = orderRequestRepository.findById(id).orElse(null);
        if (orderRequest == null) {
            return ResponseHandler.generate("orderRequestReviewPage:response:failed", HttpStatus.NO_CONTENT);
        }

        var company = companyRepository.findById(orderRequest.getCompanyId()).orElseThrow();

        var requestBody = buildExternalApiOrderRequestDto(orderRequest);
        var createdOrder = externalApiService.doRequest(company.getReferenceCode(), "/order/new", HttpMethod.POST, requestBody, OrderDto.class);

        var orderRequestDocuments = orderRequestDocumentRepository.findAllByOrderRequestId(orderRequest.getId());
        for (var orderRequestDocument : orderRequestDocuments) {
            var resource = fileSystemStorageService.load(orderRequestDocument.getFileName());
            var byteArray = FileSystemStorageService.convertFileToByteArray(resource);
            if (byteArray == null) {
                continue;
            }

            var uploadBody = new OrderDocumentUploadDto(createdOrder.referenceNumber(), orderRequestDocument.getType(), byteArray);
            externalApiService.doRequest(company.getReferenceCode(), "/document/upload", HttpMethod.POST, uploadBody, Void.class);
        }

        updateOrderRequestStatus(id, StatusEnum.APPROVED);
        notifyUsers(id, orderRequest.getCustomerReferenceNumber(), StatusEnum.APPROVED);

        return ResponseHandler.generate("orderRequestReviewPage:response:success", HttpStatus.CREATED);
    }

    private ExternalApiOrderRequestDto buildExternalApiOrderRequestDto(OrderRequest orderRequest) {
        String portCode;
        if (orderRequest.getTransportType() == OrderTransportTypeEnum.IMPORT) {
            portCode = orderRequest.getPortOfOriginCode();
        } else {
            portCode = orderRequest.getPortOfDestinationCode();
        }

        var orderRequestProducts = orderRequestProductRepository
                .findAllByOrderRequestId(orderRequest.getId()).stream()
                .map(OrderRequestProduct::toDto)
                .toList();

        return new ExternalApiOrderRequestDto(
                orderRequest.getCustomerReferenceNumber(),
                orderRequest.getTransportType(),
                portCode,
                orderRequest.getOrderType(),
                orderRequestProducts);
    }

    public ResponseEntity<Object> denyOrderRequest(Long id) {
        var orderRequest = orderRequestRepository.findById(id).orElse(null);
        if (orderRequest == null) {
            return ResponseHandler.generate("orderRequestReviewPage:response:failed", HttpStatus.NO_CONTENT);
        }

        updateOrderRequestStatus(id, StatusEnum.DENIED);
        notifyUsers(id, orderRequest.getCustomerReferenceNumber(), StatusEnum.DENIED);

        return ResponseHandler.generate("orderRequestReviewPage:response:denied", HttpStatus.OK);
    }

    private void notifyUsers(Long id, String customerReferenceNumber, StatusEnum newStatus) {
        Long companyId = getCompanyIdOfOrderRequest(id);
        List<User> users = userRepository.findAllByCompanyId(companyId);

        for (User user : users) {
            var userPreference = userPreferenceRepository.findByUserId(user.getId()).orElse(null);
            if (userPreference == null) continue;

            if (userPreference.isSystemNotificationOrderRequest()) {
                Notification newNotification = new Notification(
                        user.getId(),
                        "Order request has been " + newStatus.toString().toLowerCase(),
                        String.format("The status of order request with reference code '%s' has been %s.", customerReferenceNumber, newStatus.toString().toLowerCase()),
                        Timestamp.valueOf(LocalDateTime.now()).getTime(), false
                );
                notificationService.createNotification(newNotification);
            }

            if (userPreference.isEmailNotificationOrderRequest()) {
                try {
                    emailService.sendOrderRequestStatusUpdate(user, customerReferenceNumber, newStatus.toString().toLowerCase());
                } catch (MessagingException ignored) {
                }
            }
        }
    }

    private Long getCompanyIdOfOrderRequest(Long orderRequestId) {
        OrderRequest orderRequest = orderRequestRepository.findById(orderRequestId).orElseThrow();
        return orderRequest.getCompanyId();
    }

    public Long addOrderRequest(NewOrderRequestDto newOrderRequestDto) {
        var user = AuthService.getCurrentUser();
        if (user == null)
            return null;

        var company = companyRepository.findByUserId(user.getId());
        if (company.isEmpty())
            return null;

        var companyId = company.get().getId();

        OrderRequest orderRequest = new OrderRequest(
                companyId,
                newOrderRequestDto.customerReferenceNumber(),
                newOrderRequestDto.transportType(),
                newOrderRequestDto.portOfOriginCode(),
                newOrderRequestDto.portOfDestinationCode(),
                StatusEnum.PENDING,
                newOrderRequestDto.orderType());

        OrderRequest savedOrderRequest = orderRequestRepository.save(orderRequest);

        List<OrderRequestProduct> orderRequestProducts = newOrderRequestDto.products().stream()
                .map(orderRequestProductDto -> {
                    var product = OrderRequestProduct.fromDto(orderRequestProductDto);
                    product.setOrderRequestId(savedOrderRequest.getId());
                    return product;
                })
                .collect(Collectors.toList());

        orderRequestProductRepository.saveAll(orderRequestProducts);

        return savedOrderRequest.getId();
    }

    public ResponseEntity<Object> createNewOrderRequest(NewOrderRequestDto newOrderRequestDto) {
        var orderRequestId = addOrderRequest(newOrderRequestDto);
        if (orderRequestId == null) {
            return ResponseHandler.generate("newOrderPage:failed", HttpStatus.BAD_REQUEST);
        }

        return ResponseHandler.generate("newOrderPage:success", HttpStatus.CREATED, orderRequestId);
    }

    public OrderRequestDto buildOrderRequestDto(OrderRequest orderRequest) {
        List<OrderRequestProductDto> products = orderRequestProductRepository
                .findAllByOrderRequestId(orderRequest.getId()).stream()
                .map(OrderRequestProduct::toDto)
                .toList();

        var company = companyRepository.findById(orderRequest.getCompanyId()).orElse(null);
        if (company == null) {
            return null;
        }

        return new OrderRequestDto(
                orderRequest.getId(),
                company.getName(),
                orderRequest.getStatus(),
                orderRequest.getOrderType(),
                orderRequest.getTransportType(),
                orderRequest.getPortOfOriginCode(),
                orderRequest.getPortOfDestinationCode(),
                products);
    }

    public List<OrderRequestDto> getAll() {
        List<OrderRequest> orderRequests = orderRequestRepository.findAll();
        return orderRequests.stream()
                .map(this::buildOrderRequestDto)
                .filter(Objects::nonNull)
                .toList();
    }

    public OrderRequestDto getOrderRequest(Long id) {
        OrderRequest orderRequest = orderRequestRepository.findById(id).orElse(null);
        if (orderRequest == null) {
            return null;
        }
        return buildOrderRequestDto(orderRequest);
    }

    public void saveOrderRequestDocument(OrderRequestDocumentUploadDto orderRequestDocumentUploadDto) {
        var fileName = fileSystemStorageService.store(orderRequestDocumentUploadDto.file());
        if (fileName == null)
            return;

        var orderRequestDocument = new OrderRequestDocument(orderRequestDocumentUploadDto.orderRequestId(),
                orderRequestDocumentUploadDto.type(), fileName);
        orderRequestDocumentRepository.save(orderRequestDocument);
    }

    public void updateOrderRequestStatus(Long orderId, StatusEnum status) {
        orderRequestRepository.findById(orderId).map(orderRequest -> {
            orderRequest.setStatus(status);
            return orderRequestRepository.save(orderRequest);
        });
    }

    public void editOrderRequest(Long id, OrderRequestEditDto orderRequestEditDto) {
        orderRequestRepository.findById(id).map(orderRequest -> {
                    orderRequest.setTransportType(orderRequestEditDto.transportType());
                    orderRequest.setPortOfOriginCode(orderRequestEditDto.portOfOriginCode());
                    orderRequest.setPortOfDestinationCode(orderRequestEditDto.portOfDestinationCode());
                    return orderRequestRepository.save(orderRequest);
                })
                .orElseThrow();
    }

    public void editOrderRequestProduct(Long productId, OrderRequestProductEditDto orderRequestProductEditDto) {
        orderRequestProductRepository.findById(productId)
                .map(orderRequestProduct -> {
                    orderRequestProduct.setQuantity(orderRequestProductEditDto.quantity());
                    orderRequestProduct.setWeight(orderRequestProductEditDto.weight());
                    orderRequestProduct.setContainerNumber(orderRequestProductEditDto.containerNumber());
                    orderRequestProduct.setContainerSize(orderRequestProductEditDto.containerSize());
                    orderRequestProduct.setContainerType(orderRequestProductEditDto.containerType());
                    return orderRequestProductRepository.save(orderRequestProduct);
                })
                .orElseThrow();
    }
}
