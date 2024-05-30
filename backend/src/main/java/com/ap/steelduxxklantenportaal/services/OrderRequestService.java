package com.ap.steelduxxklantenportaal.services;

import com.ap.steelduxxklantenportaal.dtos.orderrequests.NewOrderRequestDto;
import com.ap.steelduxxklantenportaal.dtos.orderrequests.OrderRequestDto;
import com.ap.steelduxxklantenportaal.dtos.orderrequests.OrderRequestListDto;
import com.ap.steelduxxklantenportaal.dtos.orderrequests.OrderRequestProductDto;
import com.ap.steelduxxklantenportaal.dtos.orderrequests.OrderRequestUploadDto;
import com.ap.steelduxxklantenportaal.enums.OrderTypeEnum;
import com.ap.steelduxxklantenportaal.enums.StatusEnum;
import com.ap.steelduxxklantenportaal.enums.TransportTypeEnum;
import com.ap.steelduxxklantenportaal.models.*;
import com.ap.steelduxxklantenportaal.repositories.*;
import com.ap.steelduxxklantenportaal.utils.ResponseHandler;

import jakarta.mail.MessagingException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrderRequestService {
    private final OrderRequestRepository orderRequestRepository;
    private final OrderRequestProductRepository orderRequestProductRepository;
    private final OrderRequestDocumentRepository orderRequestDocumentRepository;
    private final CompanyRepository companyRepository;
    private final UserCompanyRepository userCompanyRepository;
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
            CompanyRepository companyRepository, UserCompanyRepository userCompanyRepository, UserRepository userRepository, UserPreferenceRepository userPreferenceRepository, NotificationService notificationService, EmailService emailService,
            ExternalApiService externalApiService,
            FileSystemStorageService fileSystemStorageService) {
        this.orderRequestRepository = orderRequestRepository;
        this.orderRequestProductRepository = orderRequestProductRepository;
        this.orderRequestDocumentRepository = orderRequestDocumentRepository;
        this.companyRepository = companyRepository;
        this.userCompanyRepository = userCompanyRepository;
        this.userRepository = userRepository;
        this.userPreferenceRepository = userPreferenceRepository;
        this.notificationService = notificationService;
        this.emailService = emailService;
        this.fileSystemStorageService = fileSystemStorageService;
        this.externalApiService = externalApiService;
    }

    public ResponseEntity<Object> approveOrderRequest(Long id) {
        OrderRequestDto orderRequestDto = getOrderRequestDto(id);
        updateOrderRequestStatus(id, StatusEnum.APPROVED);
        externalApiService.createOrder(orderRequestDto);
        notifyUsers(id, StatusEnum.APPROVED);
        return ResponseHandler.generate("orderRequestReviewPage:response:success", HttpStatus.CREATED);
    }

    public ResponseEntity<Object> denyOrderRequest(Long id) {
        updateOrderRequestStatus(id, StatusEnum.DENIED);
        notifyUsers(id, StatusEnum.DENIED);
        return ResponseHandler.generate("orderRequestReviewPage:response:denied", HttpStatus.OK);
    }

    private void notifyUsers (Long id, StatusEnum newStatus) {
        Long companyId = getCompanyIdByOrderRequestId(id);
        List<User> users = getUsersByCompanyId(companyId);

        for (User user : users) {
            Optional<UserPreference> userPreference = userPreferenceRepository.findByUserId(user.getId());
            if (userPreference.isPresent()) {
                if (userPreference.get().isSystemNotificationOrderRequest()) {
                    Notification newNotification = new Notification(
                            user.getId(), "Order request: " + id + " is " + newStatus ,
                            "Status changed to: " + newStatus,
                            Timestamp.valueOf(LocalDateTime.now()).getTime(), false
                    );
                    notificationService.createNotification(newNotification);
                }
                if (userPreference.get().isEmailNotificationOrderRequest()) {
                    try {
                        emailService.sendOrderRequestStatusUpdate(user, id.toString(), newStatus.toString());
                    } catch (MessagingException e) {
                        e.printStackTrace();
                    }
                }
            }
        }
    }

    private Long getCompanyIdByOrderRequestId(Long  orderRequestId) {
        OrderRequest orderRequest = orderRequestRepository.findById(orderRequestId).orElseThrow();
        return orderRequest.getCompanyId();
    }

    private List<User> getUsersByCompanyId(Long companyId) {
        List<UserCompany> userCompanies = userCompanyRepository.findAllByCompanyId(companyId);
        return userCompanies.stream()
                .map(userCompany -> userRepository.findById(userCompany.getUserId()).orElse(null))
                .collect(Collectors.toList());
    }

    public Long addOrderRequest(NewOrderRequestDto newOrderRequestDto) {
        var user = AuthService.getCurrentUser();
        if (user == null)
            return null;
        var company = companyRepository.findByUserId(user.getId());
        if (company.isEmpty())
            return null;

        var companyId = company.get().getId();

        OrderTypeEnum orderType = newOrderRequestDto.isContainerOrder() ? OrderTypeEnum.CONTAINER
                : OrderTypeEnum.BULK;

        OrderRequest orderRequest = new OrderRequest(
                companyId,
                newOrderRequestDto.transportType(),
                newOrderRequestDto.portOfOriginCode(),
                newOrderRequestDto.portOfDestinationCode(),
                StatusEnum.PENDING,
                orderType);

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

    public OrderRequestListDto convertOrderRequestListToDTO(OrderRequest orderRequest) {
        List<OrderRequestProductDto> orderRequestProductDtos = orderRequestProductRepository
                .findAllByOrderRequestId(orderRequest.getId()).stream()
                .map(OrderRequestProduct::toDto)
                .collect(Collectors.toList());

        var company = companyRepository.findById(orderRequest.getCompanyId()).orElseThrow();

        return new OrderRequestListDto(
                orderRequest.getId(),
                company.getName(),
                orderRequest.getStatus(),
                orderRequest.getOrderType(),
                orderRequest.getTransportType(),
                orderRequest.getPortOfOriginCode(),
                orderRequest.getPortOfDestinationCode(),
                orderRequestProductDtos);
    }

    public OrderRequestDto convertOrderRequestToDTO(OrderRequest orderRequest) {
        List<OrderRequestProductDto> orderRequestProductDtos = orderRequestProductRepository
                .findAllByOrderRequestId(orderRequest.getId()).stream()
                .map(OrderRequestProduct::toDto)
                .toList();

        var company = companyRepository.findById(orderRequest.getCompanyId()).orElseThrow();

        return new OrderRequestDto(
                company.getName(),
                orderRequest.getTransportType().toString(),
                orderRequest.getPortOfOriginCode(),
                orderRequest.getPortOfDestinationCode(),
                orderRequest.getOrderType().toString(),
                orderRequestProductDtos);
    }

    public List<OrderRequestListDto> getAll() {
        List<OrderRequest> orderRequests = orderRequestRepository.findAll();
        return orderRequests.stream()
                .map(this::convertOrderRequestListToDTO)
                .toList();
    }

    public OrderRequestListDto getOrderRequest(Long id) {
        OrderRequest orderRequest = orderRequestRepository.findById(id).orElseThrow();
        return convertOrderRequestListToDTO(orderRequest);
    }

    public OrderRequestDto getOrderRequestDto(Long id) {
        OrderRequest orderRequest = orderRequestRepository.findById(id).orElseThrow();
        return convertOrderRequestToDTO(orderRequest);
    }

    public void saveOrderRequestDocument(OrderRequestUploadDto orderRequestUploadDto) {
        var fileName = fileSystemStorageService.store(orderRequestUploadDto.file());
        if (fileName == null)
            return;

        var orderRequestDocument = new OrderRequestDocument(orderRequestUploadDto.orderRequestId(),
                orderRequestUploadDto.type(), fileName);
        orderRequestDocumentRepository.save(orderRequestDocument);
    }

    public void updateOrderRequestStatus(Long orderId, StatusEnum status) {
        Optional<OrderRequest> optionalOrderRequest = orderRequestRepository.findById(orderId);
        if (optionalOrderRequest.isPresent()) {
            OrderRequest orderRequest = optionalOrderRequest.get();
            orderRequest.setStatus(status);
            orderRequestRepository.save(orderRequest);
        }
    }

    public void editOrderRequest(Long id, OrderRequestDto orderRequestDto) {
        orderRequestRepository.findById(id).map(orderRequest -> {
            orderRequest.setTransportType(TransportTypeEnum.valueOf(orderRequestDto.transportType()));
            orderRequest.setPortOfOriginCode(orderRequestDto.portOfOriginCode());
            orderRequest.setPortOfDestinationCode(orderRequestDto.portOfDestinationCode());

            return orderRequestRepository.save(orderRequest);
        })
        .orElseThrow();
    }

    public void editOrderRequestProduct(Long productId, OrderRequestProductDto orderRequestProductDto) {
        orderRequestProductRepository.findById(productId)
                .map(orderRequestProduct -> {
                    orderRequestProduct.setQuantity(orderRequestProductDto.quantity());
                    orderRequestProduct.setWeight(orderRequestProductDto.weight());
                    orderRequestProduct.setContainerNumber(orderRequestProductDto.containerNumber());
                    orderRequestProduct.setContainerSize(orderRequestProductDto.containerSize());
                    orderRequestProduct.setContainerType(orderRequestProductDto.containerType());

                    return orderRequestProductRepository.save(orderRequestProduct);
                })
                .orElseThrow();
    }
}
