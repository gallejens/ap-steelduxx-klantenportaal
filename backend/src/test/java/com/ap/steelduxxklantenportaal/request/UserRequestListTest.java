package com.ap.steelduxxklantenportaal.request;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.boot.test.context.SpringBootTest;

import com.ap.steelduxxklantenportaal.dtos.UserRequestDto;
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
    void givenMultipleUserRequests_whenGettingAllUserRequests_thenAllUserRequestsAreReturned() {
        // Given
        List<UserRequestDto> mockUserRequests = new ArrayList<>();
        mockUserRequests.add(UserRequestMotherObject.request1);
        mockUserRequests.add(UserRequestMotherObject.request2);
        Mockito.when(userRequestService.getAll()).thenReturn(mockUserRequests);

        // When
        List<UserRequestDto> savedUserRequests = userRequestController.getAllUserRequests();

        // Then
        assertThat(savedUserRequests.size()).isEqualTo(mockUserRequests.size());
    }
}
