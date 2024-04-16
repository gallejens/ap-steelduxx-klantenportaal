package com.ap.steelduxxklantenportaal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
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
    void check_if_userRequest_isSaved_in_database() throws Exception {
        UserRequest existingUserRequest = new UserRequest();
        existingUserRequest.setCompanyName("Steelduxx");
        existingUserRequest.setCountry("Belgium");
        existingUserRequest.setPhoneNr("+32 471 01 78 65");
        existingUserRequest.setVatNr("BE0473416418");
        existingUserRequest.setPostalCode("2000");
        existingUserRequest.setDistrict("Antwerp");
        existingUserRequest.setStreet("Duboisstraat");
        existingUserRequest.setStreetNr("50");
        existingUserRequest.setBoxNr("");
        existingUserRequest.setExtraInfo("");
        existingUserRequest.setFirstName("Raf");
        existingUserRequest.setLastName("Vanhoegaerde");
        existingUserRequest.setEmail("info@steelduxx.eu");
        existingUserRequest.setCreatedOn(1709034820358L);
        existingUserRequest.setStatus(StatusEnum.PENDING);
        existingUserRequest.setDenyMessage("");

        when(userRequestRepository.findByVatNrAndEmail("BE0473416418", "info@steelduxx.eu"))
                .thenReturn(Optional.of(existingUserRequest));

    }
}
