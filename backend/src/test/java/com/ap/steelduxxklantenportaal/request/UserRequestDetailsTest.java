package com.ap.steelduxxklantenportaal.request;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Map;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.boot.test.context.SpringBootTest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.ap.steelduxxklantenportaal.dtos.UserRequestDto;
import com.ap.steelduxxklantenportaal.exceptions.UserAlreadyExistsException;
import com.ap.steelduxxklantenportaal.services.UserRequestService;

import jakarta.mail.MessagingException;

import com.ap.steelduxxklantenportaal.controllers.UserRequestController;

@SpringBootTest
class UserRequestDetailsTest {

    @Mock
    private UserRequestService userRequestService;

    @InjectMocks
    private UserRequestController userRequestController;

    @Test
    void contextLoads() {
        assertThat(userRequestController).isNotNull();
    }

    @Test
    void givenUserRequestId_whenGettingUserRequestById_thenCorrectUserRequestIsReturned() {
        // Given
        Mockito.when(userRequestService.getUserRequest(1L)).thenReturn(UserRequestMotherObject.request1);

        // When
        UserRequestDto savedUserRequest = userRequestController.getUserRequestById(1L);

        // Then
        Assertions.assertEquals(1, savedUserRequest.followId());
    }

    @Test
    void givenUserRequestToApprove_whenApprovingUserRequest_thenUserRequestIsApproved()
            throws MessagingException, UserAlreadyExistsException {
        // Given
        Long id = 1L;
        Map<String, String> expectedResponse = Map.of("message", "userRequestReviewPage:response:success", "status",
                HttpStatus.CREATED.toString());
        Mockito.when(userRequestService.approveUserRequest(id,
                UserRequestMotherObject.companyApprove))
                .thenReturn(new ResponseEntity<>(expectedResponse, HttpStatus.CREATED));

        // When
        ResponseEntity<Object> response = userRequestController.approveRequest(id,
                UserRequestMotherObject.companyApprove);

        // Then
        Assertions.assertEquals(HttpStatus.CREATED, response.getStatusCode());
        Assertions.assertEquals(expectedResponse, response.getBody());
    }

    @Test
    void givenUserRequestToDeny_whenDenyingUserRequest_thenUserRequestIsDenied() {
        // Given
        Long id = 2L;
        Map<String, String> expectedResponse = Map.of("message", "userRequestReviewPage:response:denied", "status",
                HttpStatus.OK.toString());
        Mockito.when(
                userRequestService.denyUserRequest(id, UserRequestMotherObject.companyDeny))
                .thenReturn(new ResponseEntity<>(expectedResponse, HttpStatus.OK));

        // When
        ResponseEntity<Object> response = userRequestController.denyRequest(id, UserRequestMotherObject.companyDeny);

        // Then
        Assertions.assertEquals(HttpStatus.OK, response.getStatusCode());
        Assertions.assertEquals(expectedResponse, response.getBody());
    }

    @Test
    void givenUserRequestToDeactivate_whenDeactivatingUserRequest_thenUserRequestIsDeactivated() {
        // Given
        Long id = 3L;
        Map<String, String> expectedResponse = Map.of("message", "userRequestReviewPage:response:deleted");
        Mockito.when(userRequestService.deleteUserRequest(id))
                .thenReturn(new ResponseEntity<>(expectedResponse, HttpStatus.OK));

        // When
        ResponseEntity<Object> response = userRequestController.deleteRequest(id);

        // Then
        Assertions.assertEquals(HttpStatus.OK, response.getStatusCode());
        Assertions.assertEquals(expectedResponse, response.getBody());
    }

}
