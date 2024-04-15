package com.ap.steelduxxklantenportaal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;

import com.ap.steelduxxklantenportaal.dtos.UserRequestDto;
import com.ap.steelduxxklantenportaal.enums.StatusEnum;
import com.ap.steelduxxklantenportaal.services.UserRequestService;
import com.ap.steelduxxklantenportaal.controllers.UserRequestController;

@SpringBootTest
public class UserRequestListTest {

    @Mock
    private UserRequestService userRequestService;

    @InjectMocks
    private UserRequestController userRequestController;

    @Test
    void contextLoads() {
        assertThat(userRequestController).isNotNull();
    }

    @Test
    public void return_getAll_userRequests() {
        List<UserRequestDto> mockUserRequests = new ArrayList<>();

        mockUserRequests.add(new UserRequestDto(1, "Steelduxx", "Belgium", "+32471017865",
                "BE 0425.069.935", "2000", "Antwerp", "Duboisstraat", "50", null, null, "Raf", "Vanhoegearden",
                "info@steelduxx.eu", 1709034820358L,
                StatusEnum.PENDING, null));
        mockUserRequests.add(new UserRequestDto(2, "Vanhoegaerden", "Belgium", "+32471017865",
                "BE 0479.253.937", "2900", "Schoten", "Heideweg", "12", null, null, "Raf", "Vanhoegearden",
                "info@vanhoegaerden.eu", 1709034820358L,
                StatusEnum.PENDING, null));

        when(userRequestService.getAll()).thenReturn(mockUserRequests);

        List<UserRequestDto> savedUserRequests = userRequestController.getAllUserRequests();

        assertThat(savedUserRequests.size()).isEqualTo(mockUserRequests.size());
    }
}
