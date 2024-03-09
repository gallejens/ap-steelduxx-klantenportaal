package com.ap.steelduxxklantenportaal.services;

import java.util.List;

import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.ap.steelduxxklantenportaal.DTOs.UserRequestValuesDTO;
import com.ap.steelduxxklantenportaal.enums.StatusEnum;
import com.ap.steelduxxklantenportaal.models.UserRequestValue;

import com.ap.steelduxxklantenportaal.repositories.UserRequestValueRepository;

import java.util.*;

@Service
public class UserRequestValueService {
    @Autowired
    UserRequestValueRepository userRequestValueRepository;

    @Autowired
    EmailService emailService;

    public List<UserRequestValue> getAll() {
        return userRequestValueRepository.findAll();
    }

    public UserRequestValue addRequest(UserRequestValuesDTO userRequestValuesDTO) throws MessagingException {
        UserRequestValue userRequestValues = new UserRequestValue(
                userRequestValuesDTO.getCompanyName(),
                userRequestValuesDTO.getPhoneNr(),
                userRequestValuesDTO.getVatNr(),
                userRequestValuesDTO.getPostalCode(),
                userRequestValuesDTO.getDistrict(),
                userRequestValuesDTO.getStreet(),
                userRequestValuesDTO.getStreetNr(),
                userRequestValuesDTO.getBoxNr(),
                userRequestValuesDTO.getFirstName(),
                userRequestValuesDTO.getLastName(),
                userRequestValuesDTO.getEmail(),
                userRequestValuesDTO.getCreatedOn(),
                StatusEnum.PENDING,
                "");

        emailService.sendRegistrationConfirmation(userRequestValues);
        return userRequestValueRepository.save(userRequestValues);
    }

    public ResponseEntity<Object> processUserRequest(UserRequestValuesDTO userRequestValuesDTO) throws MessagingException {
        boolean requestExists = userRequestValueRepository
                .findByVatNrAndEmail(userRequestValuesDTO.getVatNr(), userRequestValuesDTO.getEmail()).isPresent();
        Map<String, String> responseBody;

        if (requestExists) {
            responseBody = Collections.singletonMap("message", "userrequestpage:userRequestAlreadyExists");
            return new ResponseEntity<>(responseBody, HttpStatus.OK);
        } else {
            UserRequestValue savedValues = addRequest(userRequestValuesDTO);
            System.out.println(savedValues);

            responseBody = Collections.singletonMap("message", "userrequestpage:userRequestRequested");
            return new ResponseEntity<>(responseBody, HttpStatus.CREATED);
        }
    }

    public void deleteById(Long id) {
        userRequestValueRepository.deleteById(id);
    }
}
