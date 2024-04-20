package com.ap.steelduxxklantenportaal.services;

import com.ap.steelduxxklantenportaal.dtos.OrderRequestDto;
import com.ap.steelduxxklantenportaal.dtos.ProductDto;
import com.ap.steelduxxklantenportaal.models.OrderRequest;
import com.ap.steelduxxklantenportaal.models.Product;
import com.ap.steelduxxklantenportaal.repositories.OrderRequestRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderRequestService  {
    private OrderRequestRepository orderRequestRepository;

    public OrderRequestService(OrderRequestRepository orderRequestRepository) {
        this.orderRequestRepository = orderRequestRepository;
    }

    public ProductDto convertProductsToDTO(Product product){
        return new ProductDto(
                product.getHsCode(),
                product.getItem(),
                product.getQuantity(),
                product.getWeight(),
                product.getContainerNr(),
                product.getContainerSize(),
                product.getContainerType()
        );
    }

    public OrderRequestDto convertOrderRequestToDTO(OrderRequest orderRequest){
        List<ProductDto> productDtos = orderRequest.getProducts().stream()
                .map(this::convertProductsToDTO)
                .collect(Collectors.toList());

        return new OrderRequestDto(
                orderRequest.getTransportType(),
                orderRequest.getPortOfOriginCode(),
                orderRequest.getPortOfDestinationCode(),
                productDtos
        );
    }

    public List<OrderRequestDto> getAll() {
        List<OrderRequest> orderRequest = orderRequestRepository.findAll();

        return orderRequest.stream()
                .map(this::convertOrderRequestToDTO)
                .collect(Collectors.toList());
    }

}
