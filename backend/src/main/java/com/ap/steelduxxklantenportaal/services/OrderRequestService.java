package com.ap.steelduxxklantenportaal.services;

import com.ap.steelduxxklantenportaal.dtos.OrderRequests.NewOrderRequestDto;
import com.ap.steelduxxklantenportaal.dtos.OrderRequests.OrderRequestListDto;
import com.ap.steelduxxklantenportaal.dtos.OrderRequests.OrderRequestProductDto;
import com.ap.steelduxxklantenportaal.dtos.OrderRequests.OrderRequestUploadDto;
import com.ap.steelduxxklantenportaal.enums.DocumentType;
import com.ap.steelduxxklantenportaal.enums.OrderTypeEnum;
import com.ap.steelduxxklantenportaal.enums.StatusEnum;
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
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrderRequestService {
    private final OrderRequestRepository orderRequestRepository;
    private final OrderRequestProductRepository orderRequestProductRepository;
    private final OrderRequestDocumentRepository orderRequestDocumentRepository;
    private final CompanyRepository companyRepository;
    private final FileSystemStorageService fileSystemStorageService;

    public OrderRequestService(
            OrderRequestRepository orderRequestRepository,
            OrderRequestProductRepository orderRequestProductRepository,
            OrderRequestDocumentRepository orderRequestDocumentRepository,
            CompanyRepository companyRepository,
            FileSystemStorageService fileSystemStorageService) {
        this.orderRequestRepository = orderRequestRepository;
        this.orderRequestProductRepository = orderRequestProductRepository;
        this.orderRequestDocumentRepository = orderRequestDocumentRepository;
        this.companyRepository = companyRepository;
        this.fileSystemStorageService = fileSystemStorageService;
    }

    public Long addOrderRequest(NewOrderRequestDto newOrderRequestDto) {
        var user = AuthService.getCurrentUser();
        if (user == null)
            return null;
        var company = companyRepository.findByUserId(user.getId());
        if (company.isEmpty())
            return null;

        var companyCode = company.get().getReferenceCode();

        OrderTypeEnum orderType = newOrderRequestDto.isContainerOrder() ? OrderTypeEnum.CONTAINER
                : OrderTypeEnum.BULK;

        OrderRequest orderRequest = new OrderRequest(
                companyCode,
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

        return new OrderRequestListDto(
                orderRequest.getId(),
                orderRequest.getCustomerCode(),
                orderRequest.getStatus(),
                orderRequest.getOrderType(),
                orderRequest.getTransportType(),
                orderRequest.getPortOfOriginCode(),
                orderRequest.getPortOfDestinationCode(),
                orderRequestProductDtos);
    }

    public List<OrderRequestListDto> getAll() {
        List<OrderRequest> orderRequest = orderRequestRepository.findAll();
        return orderRequest.stream()
                .map(this::convertOrderRequestListToDTO)
                .collect(Collectors.toList());
    }

    public OrderRequestListDto getOrderRequest(Long id) {
        OrderRequest orderRequest = orderRequestRepository.findById(id).get();
        return convertOrderRequestListToDTO(orderRequest);
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
