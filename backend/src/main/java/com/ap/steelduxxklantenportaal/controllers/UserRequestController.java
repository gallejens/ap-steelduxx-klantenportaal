package com.ap.steelduxxklantenportaal.controllers;

import com.ap.steelduxxklantenportaal.DTOs.UserRequestValuesDTO;
import com.ap.steelduxxklantenportaal.models.UserRequestValue;
import com.ap.steelduxxklantenportaal.services.UserRequestValueService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserRequestController {

    @Autowired
    private UserRequestValueService userRequestValueService;

    @PostMapping("/user_request")
    public ResponseEntity<Object> saveRequest(@RequestBody UserRequestValuesDTO userRequestValuesDTO) {
        return userRequestValueService.processUserRequest(userRequestValuesDTO);
    }

    @GetMapping("/user_requests")
    public List<UserRequestValuesDTO> getAllUserRequests() {
        return userRequestValueService.getAll();
    }
}
