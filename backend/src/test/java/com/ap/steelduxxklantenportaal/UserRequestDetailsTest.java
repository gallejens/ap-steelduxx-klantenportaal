package com.ap.steelduxxklantenportaal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.ap.steelduxxklantenportaal.dtos.UserRequestDto;
import com.ap.steelduxxklantenportaal.dtos.UserRequestReview.CompanyApproveDto;
import com.ap.steelduxxklantenportaal.dtos.UserRequestReview.UserRequestDeleteDto;
import com.ap.steelduxxklantenportaal.dtos.UserRequestReview.UserRequestDenyDto;
import com.ap.steelduxxklantenportaal.enums.StatusEnum;
import com.ap.steelduxxklantenportaal.exceptions.UserAlreadyExistsException;
import com.ap.steelduxxklantenportaal.services.UserRequestService;

import jakarta.mail.MessagingException;

import com.ap.steelduxxklantenportaal.controllers.UserRequestController;

@SpringBootTest
public class UserRequestDetailsTest {

    @Mock
    private UserRequestService userRequestService;

    @InjectMocks
    private UserRequestController userRequestController;

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
        Number id = 1;
        CompanyApproveDto companyApproveDto = new CompanyApproveDto("referenceCode");

        Map<String, String> expectedResponse = Map.of("message", "userRequestReviewPage:response:success", "status",
                HttpStatus.CREATED.toString());
        when(userRequestService.approveUserRequest(eq(id), eq(companyApproveDto)))
                .thenReturn(new ResponseEntity<>(expectedResponse, HttpStatus.CREATED));

        ResponseEntity<Object> response = userRequestController.approveRequest(id, companyApproveDto);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(expectedResponse, response.getBody());
    }

    @Test
    void check_userRequest_is_denied() throws MessagingException {
        Number id = 2;
        UserRequestDenyDto userRequestDenyDto = new UserRequestDenyDto("Denial reason");

        Map<String, String> expectedResponse = Map.of("message", "userRequestReviewPage:response:denied", "status",
                HttpStatus.OK.toString());
        when(userRequestService.denyUserRequest(eq(id), eq(userRequestDenyDto)))
                .thenReturn(new ResponseEntity<>(expectedResponse, HttpStatus.OK));

        ResponseEntity<Object> response = userRequestController.denyRequest(id, userRequestDenyDto);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedResponse, response.getBody());
    }

    @Test
    void check_userRequest_is_deactivated() throws MessagingException {
        Long id = 3L;
        UserRequestDeleteDto userRequestDeleteDto = new UserRequestDeleteDto(id);

        Map<String, String> expectedResponse = Map.of("message", "userRequestReviewPage:response:deactivated");
        when(userRequestService.deactivateRequest(eq(id)))
                .thenReturn(new ResponseEntity<>(expectedResponse, HttpStatus.OK));

        ResponseEntity<Object> response = userRequestController.deactivateRequest(userRequestDeleteDto);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedResponse, response.getBody());
    }

}
