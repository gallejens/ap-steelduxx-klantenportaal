package com.ap.steelduxxklantenportaal.orderrequest;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import java.util.Map;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.ap.steelduxxklantenportaal.controllers.OrderController;
import com.ap.steelduxxklantenportaal.dtos.OrderRequestDto;

import com.ap.steelduxxklantenportaal.services.OrderService;

@ExtendWith(MockitoExtension.class)
public class OrderRequestServiceTest {

    @Mock
    private OrderService orderService;

    @InjectMocks
    private OrderController orderController;

    @Test
    void givenOrderRequestToAdd_whenAddingOrderRequest_thenOrderRequestIsAdded() {
        // Given
        OrderRequestDto orderRequestDto = OrderRequestMotherObject.orderRequest1;
        Map<String, String> expectedResponse = Map.of(
                "message", "newOrderPage:success",
                "status", HttpStatus.CREATED.toString());

        when(orderService.createNewOrderRequest(orderRequestDto))
                .thenReturn(new ResponseEntity<>(expectedResponse, HttpStatus.CREATED));

        // When
        ResponseEntity<Object> response = orderController.createOrderRequest(orderRequestDto);

        // Then
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(expectedResponse, response.getBody());
    }

    @Test
    void givenOrderRequestToAdd_whenAddingOrderRequestWithEmptyProductList_thenOrderRequestIsNotAdded() {
        // Given
        OrderRequestDto orderRequestDto = OrderRequestMotherObject.orderRequest2;
        Map<String, String> expectedResponse = Map.of(
                "message", "newOrderPage:success",
                "status", HttpStatus.CREATED.toString());

        when(orderService.createNewOrderRequest(orderRequestDto))
                .thenReturn(new ResponseEntity<>(expectedResponse, HttpStatus.BAD_REQUEST));

        // When
        ResponseEntity<Object> response = orderController.createOrderRequest(orderRequestDto);

        // Then
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals(expectedResponse, response.getBody());
    }
}
