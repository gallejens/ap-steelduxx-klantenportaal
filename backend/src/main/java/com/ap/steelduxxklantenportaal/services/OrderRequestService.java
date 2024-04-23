package com.ap.steelduxxklantenportaal.services;

import com.ap.steelduxxklantenportaal.dtos.OrderRequestListDto;
import com.ap.steelduxxklantenportaal.dtos.ProductDto;
import com.ap.steelduxxklantenportaal.models.OrderRequest;
import com.ap.steelduxxklantenportaal.models.Product;
import com.ap.steelduxxklantenportaal.repositories.OrderRequestRepository;
import com.ap.steelduxxklantenportaal.repositories.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderRequestService {
    private OrderRequestRepository orderRequestRepository;
    private ProductRepository productRepository;

    public OrderRequestService(OrderRequestRepository orderRequestRepository, ProductRepository productRepository) {
        this.orderRequestRepository = orderRequestRepository;
        this.productRepository = productRepository;
    }

    public ProductDto convertProductsToDTO(Product product) {
        return new ProductDto(
                product.getHsCode(),
                product.getName(),
                product.getQuantity(),
                product.getWeight(),
                product.getContainerNumber(),
                product.getContainerSize(),
                product.getContainerType());
    }

    public OrderRequestListDto convertOrderRequestListToDTO(OrderRequest orderRequest) {
        List<ProductDto> productDtos = productRepository.findAllByOrderRequestId(orderRequest.getId()).stream()
        .map(this::convertProductsToDTO)
        .collect(Collectors.toList());

        return new OrderRequestListDto(
                orderRequest.getId(),
                orderRequest.getCustomerCode(),
                orderRequest.getStatus(),
                orderRequest.getTransportType(),
                orderRequest.getPortOfOriginCode(),
                orderRequest.getPortOfDestinationCode(),
                productDtos
                );
    }

    public List<OrderRequestListDto> getAll() {
        List<OrderRequest> orderRequest = orderRequestRepository.findAll();
        return orderRequest.stream()
                .map(this::convertOrderRequestListToDTO)
                .collect(Collectors.toList());
    }

}
