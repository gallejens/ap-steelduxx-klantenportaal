package com.ap.steelduxxklantenportaal.controllers;

import com.ap.steelduxxklantenportaal.DTOs.UserRequestValuesDTO;
import com.ap.steelduxxklantenportaal.models.UserRequestValue;
import com.ap.steelduxxklantenportaal.repositories.UserRequestValueRepository;
import com.ap.steelduxxklantenportaal.services.UserRequestValueService;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserRequestController {

    @Autowired
    UserRequestValueRepository userRequestValueRepository;

    @Autowired
    private UserRequestValueService userRequestValueService;

    @PostMapping("/user_request")
    public ResponseEntity<Object> saveRequest(@RequestBody UserRequestValuesDTO userRequestValuesDTO) {
        if (userRequestValueRepository.findByVatNrAndEmail(userRequestValuesDTO.getVatNr(),
                userRequestValuesDTO.getEmail()).isPresent()) {

            Map<String, String> responseBody = Collections.singletonMap("message",
                    "userrequestpage:userRequestAlreadyExists");
            return new ResponseEntity<>(responseBody, HttpStatus.OK);
        }

        UserRequestValue savedValues = userRequestValueService.add(userRequestValuesDTO);
        System.out.println(savedValues);

        Map<String, String> responseBody = Collections.singletonMap("message", "userrequestpage:userRequestRequested");
        return new ResponseEntity<>(responseBody, HttpStatus.CREATED);
    }
}
