package com.ap.steelduxxklantenportaal.services;

import com.ap.steelduxxklantenportaal.dtos.OrderRequests.NewOrderRequestDto;
import com.ap.steelduxxklantenportaal.dtos.OrderRequests.OrderRequestListDto;
import com.ap.steelduxxklantenportaal.dtos.OrderRequests.OrderRequestProductDto;
import com.ap.steelduxxklantenportaal.enums.DocumentType;
import com.ap.steelduxxklantenportaal.enums.StatusEnum;
import com.ap.steelduxxklantenportaal.models.OrderRequest;
import com.ap.steelduxxklantenportaal.models.OrderRequestProduct;
import com.ap.steelduxxklantenportaal.repositories.CompanyRepository;
import com.ap.steelduxxklantenportaal.repositories.OrderRequestRepository;
import com.ap.steelduxxklantenportaal.repositories.OrderRequestProductRepository;
import com.ap.steelduxxklantenportaal.utils.ResponseHandler;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class OrderRequestService {
    private final OrderRequestRepository orderRequestRepository;
    private final OrderRequestProductRepository orderRequestProductRepository;
    private final CompanyRepository companyRepository;
    private final FileSystemStorageService fileSystemStorageService;

    public OrderRequestService(OrderRequestRepository orderRequestRepository, OrderRequestProductRepository orderRequestProductRepository, CompanyRepository companyRepository, FileSystemStorageService fileSystemStorageService) {
        this.orderRequestRepository = orderRequestRepository;
        this.orderRequestProductRepository = orderRequestProductRepository;
        this.companyRepository = companyRepository;
        this.fileSystemStorageService = fileSystemStorageService;
    }

    public void addOrderRequest(NewOrderRequestDto newOrderRequestDto) {
        var user = AuthService.getCurrentUser();
        if (user == null) return;
        var company = companyRepository.findByUserId(user.getId());
        if (company.isEmpty()) return;

        var companyCode = company.get().getReferenceCode();

        OrderRequest orderRequest = new OrderRequest(
                companyCode,
                newOrderRequestDto.transportType(),
                newOrderRequestDto.portOfOriginCode(),
                newOrderRequestDto.portOfDestinationCode(),
                StatusEnum.PENDING);

        OrderRequest savedOrderRequest = orderRequestRepository.save(orderRequest);

        List<OrderRequestProduct> orderRequestProducts = newOrderRequestDto.products().stream()
                .map(orderRequestProductDto -> {
                    var product = OrderRequestProduct.fromDto(orderRequestProductDto);
                    product.setOrderRequestId(savedOrderRequest.getId());
                    return product;
                })
                .collect(Collectors.toList());

        orderRequestProductRepository.saveAll(orderRequestProducts);
    }

    public ResponseEntity<Object> createNewOrderRequest(NewOrderRequestDto newOrderRequestDto) {
        if (newOrderRequestDto.products().isEmpty()) {
            return ResponseHandler.generate("newOrderPage:failed", HttpStatus.BAD_REQUEST);
        }

        addOrderRequest(newOrderRequestDto);
        return ResponseHandler.generate("newOrderPage:success", HttpStatus.CREATED);
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
        List<OrderRequestProductDto> orderRequestProductDtos = orderRequestProductRepository.findAllByOrderRequestId(orderRequest.getId()).stream()
        .map(this::convertProductsToDTO)
        .collect(Collectors.toList());

        return new OrderRequestListDto(
                orderRequest.getId(),
                orderRequest.getCustomerCode(),
                orderRequest.getStatus(),
                orderRequest.getTransportType(),
                orderRequest.getPortOfOriginCode(),
                orderRequest.getPortOfDestinationCode(),
                orderRequestProductDtos
                );
    }

    public List<OrderRequestListDto> getAll() {
        List<OrderRequest> orderRequest = orderRequestRepository.findAll();
        return orderRequest.stream()
                .map(this::convertOrderRequestListToDTO)
                .collect(Collectors.toList());
    }

    public void saveOrderRequestDocuments(Map<DocumentType, MultipartFile> documents) {
        for (MultipartFile file: documents.values()) {
            fileSystemStorageService.store(file);
        }
    }
}
