package com.ap.steelduxxklantenportaal.request;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;

import com.ap.steelduxxklantenportaal.enums.StatusEnum;
import com.ap.steelduxxklantenportaal.controllers.UserRequestController;
import com.ap.steelduxxklantenportaal.models.UserRequest;
import com.ap.steelduxxklantenportaal.repositories.UserRequestRepository;

@SpringBootTest
@AutoConfigureMockMvc
public class UserRequestFormTest {

    @Mock
    private UserRequestRepository userRequestRepository;

    @InjectMocks
    private UserRequestController userRequestController;

    @Test
    void contextLoads() {
        assertThat(userRequestController).isNotNull();
    }

    @Test
    void check_if_userRequest_isSaved_in_database_if_isNotInDenied() {
        // Given
        List<StatusEnum> statusList = List.of(StatusEnum.PENDING, StatusEnum.APPROVED);
        UserRequest expectedUserRequest = new UserRequest();

        // When
        Mockito.when(userRequestRepository.findByStatusInAndVatNrAndEmail(
                statusList,
                UserRequestMotherObject.request1.vatNr(),
                UserRequestMotherObject.request1.email()))
                .thenReturn(Optional.of(expectedUserRequest));

        // Then
        Optional<UserRequest> actualUserRequest = userRequestRepository.findByStatusInAndVatNrAndEmail(
                statusList,
                UserRequestMotherObject.request1.vatNr(),
                UserRequestMotherObject.request1.email());
        assertThat(actualUserRequest).isPresent().contains(expectedUserRequest);
    }

}
