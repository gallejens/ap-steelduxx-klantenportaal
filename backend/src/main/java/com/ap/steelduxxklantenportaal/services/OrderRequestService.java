package com.ap.steelduxxklantenportaal.services;

import com.ap.steelduxxklantenportaal.dtos.OrderRequestDto;
import com.ap.steelduxxklantenportaal.dtos.ProductDto;
import com.ap.steelduxxklantenportaal.models.OrderRequest;
import com.ap.steelduxxklantenportaal.models.Product;
import com.ap.steelduxxklantenportaal.repositories.OrderRequestRepository;
import com.ap.steelduxxklantenportaal.repositories.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderRequestService  {
    private  OrderRequestRepository orderRequestRepository;
    private ProductRepository productRepository;

    public OrderRequestService(OrderRequestRepository orderRequestRepository, ProductRepository productRepository) {
        this.orderRequestRepository = orderRequestRepository;
        this.productRepository = productRepository;
    }

    public ProductDto convertProductsToDTO(Product product){
        return new ProductDto(
                product.getHsCode(),
                product.getName(),
                product.getQuantity(),
                product.getWeight(),
                product.getContainerNumber(),
                product.getContainerSize(),
                product.getContainerType()
        );
    }

    public OrderRequestDto convertOrderRequestToDTO(OrderRequest orderRequest){
        List<Product> productDtos = productRepository.findAllByOrderRequestId(orderRequest.getId());
        System.out.println(productDtos);
        return new OrderRequestDto(
                orderRequest.getTransportType(),
                orderRequest.getPortOfOriginCode(),
                orderRequest.getPortOfDestinationCode(),
                productDtos.stream()
                .map(this::convertProductsToDTO)
                .collect(Collectors.toList())
        );
    }

    public List<OrderRequestDto> getAll() {
        List<OrderRequest> orderRequest = orderRequestRepository.findAll();
        return orderRequest.stream()
                .map(this::convertOrderRequestToDTO)
                .collect(Collectors.toList());
    }

}
