package com.ap.steelduxxklantenportaal.services;

import com.ap.steelduxxklantenportaal.dtos.OrderRequestDto;
import com.ap.steelduxxklantenportaal.dtos.ExternalAPI.OrderDetailsDto;
import com.ap.steelduxxklantenportaal.dtos.ExternalAPI.OrderDto;
import com.ap.steelduxxklantenportaal.enums.ContainerSizeEnum;
import com.ap.steelduxxklantenportaal.enums.ContainerTypeEnum;
import com.ap.steelduxxklantenportaal.enums.PermissionEnum;
import com.ap.steelduxxklantenportaal.enums.StatusEnum;
import com.ap.steelduxxklantenportaal.models.OrderRequest;
import com.ap.steelduxxklantenportaal.models.Product;
import com.ap.steelduxxklantenportaal.models.User;
import com.ap.steelduxxklantenportaal.repositories.CompanyRepository;
import com.ap.steelduxxklantenportaal.repositories.OrderRequestRepository;
import com.ap.steelduxxklantenportaal.repositories.ProductRepository;
import com.ap.steelduxxklantenportaal.utils.ResponseHandler;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class OrderService {

    private final ExternalApiService externalApiService;

    private final OrderRequestRepository orderRepository;
    private final ProductRepository productRepository;
    private final CompanyRepository companyRepository;

    public OrderService(ExternalApiService externalApiService, OrderRequestRepository orderRepository,
            ProductRepository productRepository, CompanyRepository companyRepository) {
        this.externalApiService = externalApiService;
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.companyRepository = companyRepository;
    }

    public OrderDto[] getAllOrders() {
        var user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (user == null)
            return new OrderDto[0];

        boolean isAdmin = user.hasPermission(PermissionEnum.EXTERNAL_API_ADMIN);
        String endpoint = isAdmin ? "/admin/order/all" : "/order/all";

        return externalApiService.doRequest(endpoint, HttpMethod.GET, OrderDto[].class);
    }

    public OrderDetailsDto getOrderDetails(long orderId, String customerCode) {
        var user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (user == null)
            return null;

        // if user is admin and customercode was provided then use admin endpoint
        boolean isAdmin = user.hasPermission(PermissionEnum.EXTERNAL_API_ADMIN);
        String endpoint;
        if (isAdmin && customerCode != null) {
            endpoint = String.format("/admin/order/%s/%s", customerCode, orderId);
        } else {
            endpoint = String.format("/order/%s", orderId);
        }

        return externalApiService.doRequest(endpoint, HttpMethod.GET, OrderDetailsDto.class);
    }

    private void addOrderRequest(OrderRequestDto orderRequestDto) {
        var user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        var company = companyRepository.findByUserId(user.getId()).orElseThrow();
        var companyCode = company.getReferenceCode();

        OrderRequest orderRequest = new OrderRequest(
                companyCode,
                orderRequestDto.transportType(),
                orderRequestDto.portOfOriginCode(),
                orderRequestDto.portOfDestinationCode(),
                StatusEnum.PENDING);

        OrderRequest savedOrderRequest = orderRepository.save(orderRequest);

        List<Product> products = orderRequestDto.getProducts().stream()
                .map(productDto -> {
                    Product product = new Product();
                    product.setHsCode(productDto.hsCode());
                    product.setItem(productDto.item());
                    product.setQuantity(productDto.quantity());
                    product.setWeight(productDto.weight());
                    // ContainerNr is saved as NULL in database, IDK why??
                    product.setContainerNr(productDto.containerNr());
                    System.out.println(productDto.containerNr());

                    ContainerSizeEnum containerSize = productDto.containerSize() == null ? null
                            : productDto.containerSize();
                    product.setContainerSize(containerSize);

                    ContainerTypeEnum containerType = productDto.containerType() == null ? null
                            : productDto.containerType();
                    product.setContainerType(containerType);

                    product.setOrderRequest(savedOrderRequest);
                    return product;
                })
                .collect(Collectors.toList());

        productRepository.saveAll(products);
    }

    public ResponseEntity<Object> createNewOrderRequest(OrderRequestDto orderRequestDto) {
        if (orderRequestDto.getProducts().isEmpty()) {
            return ResponseHandler.generate("newOrderPage:failed", HttpStatus.BAD_REQUEST);
        }

        addOrderRequest(orderRequestDto);
        return ResponseHandler.generate("newOrderPage:success", HttpStatus.CREATED);
    }

}
