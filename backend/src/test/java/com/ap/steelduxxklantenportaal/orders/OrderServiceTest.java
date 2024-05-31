package com.ap.steelduxxklantenportaal.orders;

import com.ap.steelduxxklantenportaal.dtos.externalapi.OrderDto;
import com.ap.steelduxxklantenportaal.enums.OrderStateEnum;
import com.ap.steelduxxklantenportaal.enums.OrderTransportTypeEnum;
import com.ap.steelduxxklantenportaal.services.*;
import jakarta.mail.MessagingException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpMethod;

import java.util.HashMap;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.mockito.Mockito.*;

public class OrderServiceTest {
    @Mock
    private ExternalApiService externalApiService;

    @Mock
    private NotificationService notificationService;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private OrdersService ordersService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        ordersService.setPreviousOrderStates(new HashMap<>());
    }


    @Test
    void testGetAllOrdersForCheck() {
        OrderDto[] expectedOrders = new OrderDto[0];
        when(externalApiService.doRequest("ADMIN", "/admin/order/all", HttpMethod.GET, OrderDto[].class)).thenReturn(expectedOrders);

        OrderDto[] result = ordersService.getAllOrdersForCheck();

        assertArrayEquals(expectedOrders, result);
        verify(externalApiService).doRequest("ADMIN", "/admin/order/all", HttpMethod.GET, OrderDto[].class);
    }

    @Test
    void testCheckForOrderStatusChanges_NoStatusChange() throws MessagingException {
        OrderDto order = new OrderDto(
                "SOF1", "referenceNumber", "customerReferenceNumber", OrderStateEnum.LOADED, OrderTransportTypeEnum.IMPORT,
                "portOfOriginCode", "portOfOriginName", "portOfDestinationCode", "portOfDestinationName", "shipName",
                "ets", "ats", "eta", "ata", 1000L, 10L, List.of("containerType1", "containerType2")
        );
        OrderDto[] orders = new OrderDto[]{order};

        var previousOrderStates = new HashMap<String, OrderStateEnum>();
        previousOrderStates.put("referenceNumber", OrderStateEnum.LOADED);
        ordersService.setPreviousOrderStates(previousOrderStates);

        ordersService.checkForOrderStatusChanges(orders);

        verify(notificationService, never()).createNotification(any());
        verify(emailService, never()).sendHtmlMail(anyString(), anyString(), anyString());
    }
}
