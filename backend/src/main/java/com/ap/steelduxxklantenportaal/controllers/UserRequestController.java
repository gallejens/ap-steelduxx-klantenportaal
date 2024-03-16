package com.ap.steelduxxklantenportaal.controllers;

import com.ap.steelduxxklantenportaal.dtos.CompanyDto;
import com.ap.steelduxxklantenportaal.dtos.UserInfoDto;
import com.ap.steelduxxklantenportaal.dtos.UserRequestDto;
import com.ap.steelduxxklantenportaal.exceptions.UserAlreadyExistsException;
import com.ap.steelduxxklantenportaal.services.UserRequestService;
import jakarta.mail.MessagingException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class UserRequestController {
    private final UserRequestService userRequestValueService;

    public UserRequestController(UserRequestService userRequestValueService) {
        this.userRequestValueService = userRequestValueService;
    }

    @PostMapping("/user_request")
    @PreAuthorize("permitAll")
    public ResponseEntity<Object> saveRequest(@RequestBody UserRequestDto userRequestValuesDTO)
            throws MessagingException {
        return userRequestValueService.processUserRequest(userRequestValuesDTO);
    }

    @GetMapping("/user_requests")
    public List<UserRequestDto> getAllUserRequests() {
        return userRequestValueService.getAll();
    }

    @GetMapping("/user_requests/{id}")
    public UserRequestDto getMethodName(@PathVariable String id) {
        return userRequestValueService.getUserRequest(Integer.parseInt(id));
    }

    @PostMapping("/user_requests/{id}/approve")
    public ResponseEntity<Object> approveRequest(@PathVariable Number id, @RequestBody CompanyDto companyDto)
            throws MessagingException, UserAlreadyExistsException {
        return userRequestValueService.approveUserRequest(id, companyDto);
    }

}
