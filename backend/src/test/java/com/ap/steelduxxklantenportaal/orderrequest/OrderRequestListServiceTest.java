package com.ap.steelduxxklantenportaal.orderrequest;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import com.ap.steelduxxklantenportaal.enums.StatusEnum;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import com.ap.steelduxxklantenportaal.dtos.orderrequests.OrderRequestListDto;
import com.ap.steelduxxklantenportaal.dtos.orderrequests.OrderRequestProductDto;
import com.ap.steelduxxklantenportaal.models.OrderRequest;
import com.ap.steelduxxklantenportaal.models.OrderRequestProduct;
import com.ap.steelduxxklantenportaal.repositories.OrderRequestRepository;
import com.ap.steelduxxklantenportaal.repositories.CompanyRepository;
import com.ap.steelduxxklantenportaal.repositories.OrderRequestProductRepository;
import com.ap.steelduxxklantenportaal.services.OrderRequestService;

@ExtendWith(MockitoExtension.class)
public class OrderRequestListServiceTest {

    @Mock
    private CompanyRepository companyRepository;

    @Mock
    private OrderRequestRepository orderRequestRepository;

    @Mock
    private OrderRequestProductRepository orderRequestProductRepository;

    @InjectMocks
    private OrderRequestService orderRequestService;

    @Test
    void testGetAllOrderRequests() {
        // Given
        OrderRequest orderRequest1 = new OrderRequest();
        orderRequest1.setId(1L);
        orderRequest1.setCompanyId(1L);

        OrderRequest orderRequest2 = new OrderRequest();
        orderRequest2.setId(2L);
        orderRequest2.setCompanyId(1L);

        List<OrderRequest> orderRequests = List.of(orderRequest1, orderRequest2);

        when(orderRequestRepository.findAll()).thenReturn(orderRequests);

        when(orderRequestProductRepository.findAllByOrderRequestId(1L)).thenReturn(List.of(
                createProduct(OrderRequestObjectMother.product1),
                createProduct(OrderRequestObjectMother.product2)));

        when(orderRequestProductRepository.findAllByOrderRequestId(2L)).thenReturn(List.of());

        when(companyRepository.findById(1L)).thenReturn(Optional.of(OrderRequestObjectMother.company1));

        // When
        List<OrderRequestListDto> orderRequestList = orderRequestService.getAll();

        // Then
        assertEquals(2, orderRequestList.size());

        OrderRequestListDto firstOrderRequest = orderRequestList.get(0);
        assertEquals(1, firstOrderRequest.id());
        assertEquals("C123", firstOrderRequest.companyName());
        assertEquals(2, firstOrderRequest.product().size());

        OrderRequestListDto secondOrderRequest = orderRequestList.get(1);
        assertEquals(2, secondOrderRequest.id());
        assertEquals("C123", secondOrderRequest.companyName());
        assertEquals(0, secondOrderRequest.product().size());
    }

    private OrderRequestProduct createProduct(OrderRequestProductDto productDto) {
        OrderRequestProduct orderRequestProduct = new OrderRequestProduct();
        orderRequestProduct.setHsCode(productDto.hsCode());
        orderRequestProduct.setName(productDto.name());
        orderRequestProduct.setQuantity(productDto.quantity());
        orderRequestProduct.setWeight(productDto.weight());
        orderRequestProduct.setContainerNumber(productDto.containerNumber());
        orderRequestProduct.setContainerSize(productDto.containerSize());
        orderRequestProduct.setContainerType(productDto.containerType());
        return orderRequestProduct;
    }

    @Test
    void testUpdateOrderRequestStatus() {
        // Given
        Long orderId = 1L;
        StatusEnum newStatus = StatusEnum.APPROVED;

        OrderRequest orderRequest = new OrderRequest();
        orderRequest.setStatus(StatusEnum.PENDING);

        when(orderRequestRepository.findById(orderId)).thenReturn(Optional.of(orderRequest));

        // When
        orderRequestService.updateOrderRequestStatus(orderId, newStatus);

        // Then
        assertEquals(newStatus, orderRequest.getStatus());
    }
}
