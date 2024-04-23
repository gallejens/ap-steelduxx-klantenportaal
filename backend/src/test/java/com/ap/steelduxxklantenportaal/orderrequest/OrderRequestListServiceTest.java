package com.ap.steelduxxklantenportaal.orderrequest;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import java.util.List;

import com.ap.steelduxxklantenportaal.enums.ContainerSizeEnum;
import com.ap.steelduxxklantenportaal.enums.ContainerTypeEnum;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import com.ap.steelduxxklantenportaal.dtos.OrderRequests.OrderRequestListDto;
import com.ap.steelduxxklantenportaal.models.OrderRequest;
import com.ap.steelduxxklantenportaal.models.OrderRequestProduct;
import com.ap.steelduxxklantenportaal.repositories.OrderRequestRepository;
import com.ap.steelduxxklantenportaal.repositories.OrderRequestProductRepository;
import com.ap.steelduxxklantenportaal.services.OrderRequestService;

@ExtendWith(MockitoExtension.class)
public class OrderRequestListServiceTest {

    @Mock
    private OrderRequestRepository orderRequestRepository;

    @Mock
    private OrderRequestProductRepository orderRequestProductRepository;

    @InjectMocks
    private OrderRequestService orderRequestService;

    @Test
    void testGetAllOrderRequests() {
        // Given
        List<OrderRequest> orderRequests = List.of(
                createOrderRequest(1, "C123"),
                createOrderRequest(2, "C456")
        );

        when(orderRequestRepository.findAll()).thenReturn(orderRequests);

        when(orderRequestProductRepository.findAllByOrderRequestId(1)).thenReturn(List.of(
                createProduct("12345", "Product1", 5, 10, "CN123", ContainerSizeEnum.SIZE_40, ContainerTypeEnum.DV),
                createProduct("54321", "Product2", 3, 8, "CN456", ContainerSizeEnum.SIZE_20, ContainerTypeEnum.FT)
        ));

        when(orderRequestProductRepository.findAllByOrderRequestId(2)).thenReturn(List.of(
                createProduct("67890", "Product3", 2, 7, "CN789", ContainerSizeEnum.SIZE_20, ContainerTypeEnum.RF)
        ));

        // When
        List<OrderRequestListDto> orderRequestList = orderRequestService.getAll();

        // Then
        assertEquals(2, orderRequestList.size());

        OrderRequestListDto firstOrderRequest = orderRequestList.get(0);
        assertEquals(1, firstOrderRequest.id());
        assertEquals("C123", firstOrderRequest.customerCode());
        assertEquals(2, firstOrderRequest.product().size());

        OrderRequestListDto secondOrderRequest = orderRequestList.get(1);
        assertEquals(2, secondOrderRequest.id());
        assertEquals("C456", secondOrderRequest.customerCode());
        assertEquals(1, secondOrderRequest.product().size());
    }

    private OrderRequest createOrderRequest(int id, String customerCode) {
        OrderRequest orderRequest = new OrderRequest();
        orderRequest.setId((long) id);
        orderRequest.setCustomerCode(customerCode);
        return orderRequest;
    }

    private OrderRequestProduct createProduct(String hsCode, String name, long quantity, long weight,
                                              String containerNumber, ContainerSizeEnum containerSize, ContainerTypeEnum containerType) {
        OrderRequestProduct orderRequestProduct = new OrderRequestProduct();
        orderRequestProduct.setHsCode(hsCode);
        orderRequestProduct.setName(name);
        orderRequestProduct.setQuantity(quantity);
        orderRequestProduct.setWeight(weight);
        orderRequestProduct.setContainerNumber(containerNumber);
        orderRequestProduct.setContainerSize(containerSize);
        orderRequestProduct.setContainerType(containerType);
        return orderRequestProduct;
    }
}