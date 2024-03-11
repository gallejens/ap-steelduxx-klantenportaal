package com.ap.steelduxxklantenportaal.controllers;

import com.ap.steelduxxklantenportaal.DTOs.UserRequestValuesDTO;
import com.ap.steelduxxklantenportaal.services.UserRequestValueService;
import jakarta.mail.MessagingException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class UserRequestController {

    private final UserRequestValueService userRequestValueService;

    public UserRequestController(UserRequestValueService userRequestValueService) {
        this.userRequestValueService = userRequestValueService;
    }

    @PostMapping("/user_request")
    @PreAuthorize("permitAll")
    public ResponseEntity<Object> saveRequest(@RequestBody UserRequestValuesDTO userRequestValuesDTO)
            throws MessagingException {
        return userRequestValueService.processUserRequest(userRequestValuesDTO);
    }

    @GetMapping("/user_requests")
    public List<UserRequestValuesDTO> getAllUserRequests() {
        return userRequestValueService.getAll();
    }
}
