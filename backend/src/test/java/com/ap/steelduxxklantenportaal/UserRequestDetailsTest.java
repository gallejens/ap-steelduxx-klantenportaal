package com.ap.steelduxxklantenportaal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.ap.steelduxxklantenportaal.dtos.UserRequestDto;
import com.ap.steelduxxklantenportaal.dtos.UserRequestReview.CompanyApproveDto;
import com.ap.steelduxxklantenportaal.dtos.UserRequestReview.UserRequestDenyDto;
import com.ap.steelduxxklantenportaal.enums.StatusEnum;
import com.ap.steelduxxklantenportaal.exceptions.UserAlreadyExistsException;
import com.ap.steelduxxklantenportaal.models.UserRequest;
import com.ap.steelduxxklantenportaal.repositories.CompanyRepository;
import com.ap.steelduxxklantenportaal.repositories.UserCompanyRepository;
import com.ap.steelduxxklantenportaal.repositories.UserRepository;
import com.ap.steelduxxklantenportaal.repositories.UserRequestRepository;
import com.ap.steelduxxklantenportaal.services.UserRequestService;

import jakarta.mail.MessagingException;

import com.ap.steelduxxklantenportaal.controllers.UserRequestController;

@SpringBootTest
public class UserRequestDetailsTest {

    @Autowired
    private UserRequestController userRequestController;

    @MockBean
    private UserRequestService userRequestService;

    @Test
    void contextLoads() {
        assertThat(userRequestController).isNotNull();
    }

    @Test
    void return_getById_userRequest() {
        UserRequestDto mockUserRequestDto = new UserRequestDto(1, "Steelduxx", "Belgium", "+32471017865",
                "BE 0425.069.935", "2000", "Antwerp", "Duboisstraat", "50", null, null, "Raf", "Vanhoegearden",
                "info@steelduxx.eu", 1709034820358L,
                StatusEnum.PENDING, null);

        when(userRequestService.getUserRequest(1)).thenReturn(mockUserRequestDto);

        UserRequestDto savedUserRequest = userRequestController.getUserRequestById("1");

        assertEquals(1, savedUserRequest.followId());
    }

    @Test
    void check_userRequest_is_approved() throws MessagingException, UserAlreadyExistsException {
        CompanyApproveDto companyApproveDto = mock(CompanyApproveDto.class);

        when(companyApproveDto.referenceCode()).thenReturn("SOF1");

        UserRequestDto mockUserRequestDto = new UserRequestDto(1, "Steelduxx", "Belgium", "+32471017865",
                "BE 0425.069.935", "2000", "Antwerp", "Duboisstraat", "50", null, null, "Raf", "Vanhoegearden",
                "info@steelduxx.eu", 1709034820358L,
                StatusEnum.PENDING, null);

        when(userRequestService.getUserRequest(1)).thenReturn(mockUserRequestDto);

        userRequestController.approveRequest(mockUserRequestDto.followId(), companyApproveDto);

        assertEquals(StatusEnum.APPROVED, mockUserRequestDto.status());
    }

    @Test
    void check_userRequest_is_denied() throws MessagingException, UserAlreadyExistsException {
        UserRequestDenyDto userRequestDenyDto = mock(UserRequestDenyDto.class);

        UserRequestDto mockUserRequestDto = new UserRequestDto(1, "Steelduxx", "Belgium", "+32471017865",
                "BE 0425.069.935", "2000", "Antwerp", "Duboisstraat", "50", null, null, "Raf", "Vanhoegearden",
                "info@steelduxx.eu", 1709034820358L,
                StatusEnum.PENDING, null);

        when(userRequestService.getUserRequest(1)).thenReturn(mockUserRequestDto);

        userRequestController.denyRequest(mockUserRequestDto.followId(), userRequestDenyDto);

        assertEquals(StatusEnum.DENIED, mockUserRequestDto.status());
    }

    @Test
    void testDeleteUserRequest() throws MessagingException {
        // Mocking dependencies
        UserRequestRepository userRequestRepository = mock(UserRequestRepository.class);
        UserRepository userRepository = mock(UserRepository.class);
        CompanyRepository companyRepository = mock(CompanyRepository.class);
        UserCompanyRepository userCompanyRepository = mock(UserCompanyRepository.class);

        // Create a user request with status APPROVED
        UserRequest userRequest = new UserRequest();
        userRequest.setId((long) 1);
        userRequest.setStatus(StatusEnum.APPROVED);

        // Stubbing repository methods
        when(userRequestRepository.findById(1)).thenReturn(userRequest);

        // Create an instance of the service
        UserRequestService userRequestService = new UserRequestService();

        // Call the method under test
        ResponseEntity<Object> responseEntity = userRequestService.deleteUserRequest(1);

        // Verify that repository methods were called appropriately
        verify(userRequestRepository).deleteById(1);
        verify(userRepository).deleteById(1);
        verify(companyRepository).deleteById(1);
        verify(userCompanyRepository).deleteById(1);

        // Verify the response entity
        assertEquals(HttpStatus.CREATED, responseEntity.getStatusCode());
    }

}
