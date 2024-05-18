package com.ap.steelduxxklantenportaal.orderrequest;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import java.util.Map;

import com.ap.steelduxxklantenportaal.controllers.OrderRequestController;
import com.ap.steelduxxklantenportaal.services.OrderRequestService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.ap.steelduxxklantenportaal.dtos.orderrequests.NewOrderRequestDto;

@ExtendWith(MockitoExtension.class)
public class OrderRequestServiceTest {

        @Mock
        private OrderRequestService orderRequestService;

        @InjectMocks
        private OrderRequestController orderRequestController;

        @Test
        void givenOrderRequestToAdd_whenAddingOrderRequest_thenOrderRequestIsAdded() {
                // Given
                NewOrderRequestDto newOrderRequestDto = OrderRequestObjectMother.orderRequest1;
                Map<String, String> expectedResponse = Map.of(
                                "message", "newOrderPage:success",
                                "status", HttpStatus.CREATED.toString());

                when(orderRequestService.createNewOrderRequest(newOrderRequestDto))
                                .thenReturn(new ResponseEntity<>(expectedResponse, HttpStatus.CREATED));

                // When
                ResponseEntity<Object> response = orderRequestController.createOrderRequest(newOrderRequestDto);

                // Then
                assertEquals(HttpStatus.CREATED, response.getStatusCode());
                assertEquals(expectedResponse, response.getBody());
        }

        @Test
        void givenOrderRequestToAdd_whenAddingOrderRequestWithEmptyProductList_thenOrderRequestIsNotAdded() {
                // Given
                NewOrderRequestDto newOrderRequestDto = OrderRequestObjectMother.orderRequest2;
                Map<String, String> expectedResponse = Map.of(
                                "message", "newOrderPage:success",
                                "status", HttpStatus.CREATED.toString());

                when(orderRequestService.createNewOrderRequest(newOrderRequestDto))
                                .thenReturn(new ResponseEntity<>(expectedResponse, HttpStatus.BAD_REQUEST));

                // When
                ResponseEntity<Object> response = orderRequestController.createOrderRequest(newOrderRequestDto);

                // Then
                assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
                assertEquals(expectedResponse, response.getBody());
        }

        @Test
        void givenOrderRequestToDeny_whenDenyingOrderRequest_thenOrderRequestIsDenied() {
                // Given
                Long orderRequestId = 123L;
                Map<String, String> expectedResponse = Map.of(
                                "message", "orderRequestReviewPage:response:denied",
                                "status", HttpStatus.OK.toString());

                when(orderRequestService.denyOrderRequest(orderRequestId))
                                .thenReturn(ResponseEntity.ok(expectedResponse));

                // When
                ResponseEntity<Object> response = orderRequestController.denyOrderRequest(orderRequestId);

                // Then
                assertEquals(HttpStatus.OK, response.getStatusCode());
                assertEquals(expectedResponse, response.getBody());
        }

        @Test
        void givenOrderRequestToApprove_whenApprovingOrderRequest_thenOrderRequestIsApproved() {
                // Given
                Long orderRequestId = 456L;
                Map<String, String> expectedResponse = Map.of(
                                "message", "orderRequestReviewPage:response:success",
                                "status", HttpStatus.CREATED.toString());

                when(orderRequestService.approveOrderRequest(orderRequestId))
                                .thenReturn(ResponseEntity.status(HttpStatus.CREATED).body(expectedResponse));

                // When
                ResponseEntity<Object> response = orderRequestController.approveOrderRequest(orderRequestId);

                // Then
                assertEquals(HttpStatus.CREATED, response.getStatusCode());
                assertEquals(expectedResponse, response.getBody());
        }

}
