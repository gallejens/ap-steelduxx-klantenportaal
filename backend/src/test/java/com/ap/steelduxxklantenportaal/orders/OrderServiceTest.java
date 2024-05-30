package com.ap.steelduxxklantenportaal.orders;

import com.ap.steelduxxklantenportaal.dtos.externalapi.OrderDto;
import com.ap.steelduxxklantenportaal.dtos.externalapi.OrderStatusDto;
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
        ordersService.setPreviousOrderStatuses(List.of());
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
        List<OrderStatusDto> previousOrderStatuses = List.of(new OrderStatusDto("customerCode", "referenceNumber", OrderStateEnum.LOADED));
        ordersService.setPreviousOrderStatuses(previousOrderStatuses);

        ordersService.checkForOrderStatusChanges(orders);

        verify(notificationService, never()).createNotification(any());
        verify(emailService, never()).sendHtmlMail(anyString(), anyString(), anyString());
    }
}
