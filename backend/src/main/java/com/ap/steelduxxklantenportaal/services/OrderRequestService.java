package com.ap.steelduxxklantenportaal.services;

import com.ap.steelduxxklantenportaal.dtos.OrderRequests.NewOrderRequestDto;
import com.ap.steelduxxklantenportaal.dtos.OrderRequests.OrderRequestDto;
import com.ap.steelduxxklantenportaal.dtos.OrderRequests.OrderRequestListDto;
import com.ap.steelduxxklantenportaal.dtos.OrderRequests.OrderRequestProductDto;
import com.ap.steelduxxklantenportaal.dtos.OrderRequests.OrderRequestUploadDto;
import com.ap.steelduxxklantenportaal.enums.OrderTypeEnum;
import com.ap.steelduxxklantenportaal.enums.StatusEnum;
import com.ap.steelduxxklantenportaal.models.Company;
import com.ap.steelduxxklantenportaal.models.OrderRequest;
import com.ap.steelduxxklantenportaal.models.OrderRequestDocument;
import com.ap.steelduxxklantenportaal.models.OrderRequestProduct;
import com.ap.steelduxxklantenportaal.repositories.CompanyRepository;
import com.ap.steelduxxklantenportaal.repositories.OrderRequestDocumentRepository;
import com.ap.steelduxxklantenportaal.repositories.OrderRequestProductRepository;
import com.ap.steelduxxklantenportaal.repositories.OrderRequestRepository;
import com.ap.steelduxxklantenportaal.utils.ResponseHandler;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrderRequestService {
    private final OrderRequestRepository orderRequestRepository;
    private final OrderRequestProductRepository orderRequestProductRepository;
    private final OrderRequestDocumentRepository orderRequestDocumentRepository;
    private final CompanyRepository companyRepository;
    private final FileSystemStorageService fileSystemStorageService;
    private final ExternalApiService externalApiService;

    public OrderRequestService(
            OrderRequestRepository orderRequestRepository,
            OrderRequestProductRepository orderRequestProductRepository,
            OrderRequestDocumentRepository orderRequestDocumentRepository,
            CompanyRepository companyRepository,
            ExternalApiService externalApiService,
            FileSystemStorageService fileSystemStorageService) {
        this.orderRequestRepository = orderRequestRepository;
        this.orderRequestProductRepository = orderRequestProductRepository;
        this.orderRequestDocumentRepository = orderRequestDocumentRepository;
        this.companyRepository = companyRepository;
        this.fileSystemStorageService = fileSystemStorageService;
        this.externalApiService = externalApiService;
    }

    public ResponseEntity<Object> approveOrderRequest(Long id) {
        OrderRequestDto orderRequestDto = getOrderRequestDto(id);
        updateOrderRequestStatus(id, StatusEnum.APPROVED);
        externalApiService.createOrder(orderRequestDto);
        return ResponseHandler.generate("orderRequestReviewPage:response:success", HttpStatus.CREATED);
    }

    public ResponseEntity<Object> denyOrderRequest(Long id) {
        updateOrderRequestStatus(id, StatusEnum.DENIED);
        return ResponseHandler.generate("orderRequestReviewPage:response:denied", HttpStatus.OK);
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

    public OrderRequestProductDto convertProductsToDTO(OrderRequestProduct orderRequestProduct) {
        return new OrderRequestProductDto(
                orderRequestProduct.getHsCode(),
                orderRequestProduct.getName(),
                orderRequestProduct.getQuantity(),
                orderRequestProduct.getWeight(),
                orderRequestProduct.getContainerNumber(),
                orderRequestProduct.getContainerSize(),
                orderRequestProduct.getContainerType());
    }

    public OrderRequestListDto convertOrderRequestListToDTO(OrderRequest orderRequest) {
        List<OrderRequestProductDto> orderRequestProductDtos = orderRequestProductRepository
                .findAllByOrderRequestId(orderRequest.getId()).stream()
                .map(this::convertProductsToDTO)
                .collect(Collectors.toList());

        var company = companyRepository.findById(orderRequest.getCompanyId());

        return new OrderRequestListDto(
                orderRequest.getId(),
                company.get().getName(),
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
                .map(this::convertProductsToDTO)
                .collect(Collectors.toList());

        var company = companyRepository.findById(orderRequest.getCompanyId());

        return new OrderRequestDto(
                company.get().getName(),
                orderRequest.getTransportType().toString(),
                orderRequest.getPortOfOriginCode(),
                orderRequest.getOrderType().toString(),
                orderRequestProductDtos);
    }

    public List<OrderRequestListDto> getAll() {
        List<OrderRequest> orderRequest = orderRequestRepository.findAll();
        return orderRequest.stream()
                .map(this::convertOrderRequestListToDTO)
                .collect(Collectors.toList());
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
}
