package com.ap.steelduxxklantenportaal.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.SecurityProperties.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.ap.steelduxxklantenportaal.DTOs.UserRequestValuesDTO;
import com.ap.steelduxxklantenportaal.enums.StatusEnum;
import com.ap.steelduxxklantenportaal.models.UserRequestValue;

import com.ap.steelduxxklantenportaal.repositories.UserRequestValueRepository;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserRequestValueService {
    @Autowired
    UserRequestValueRepository userRequestValueRepository;

    public UserRequestValuesDTO convertToDTO(UserRequestValue userRequestValue) {
        UserRequestValuesDTO dto = new UserRequestValuesDTO();

        dto.setFollowId(userRequestValue.getId());
        dto.setCompanyName(userRequestValue.getCompanyName());
        dto.setPhoneNr(userRequestValue.getPhoneNr());
        dto.setVatNr(userRequestValue.getVatNr());
        dto.setPostalCode(userRequestValue.getPostalCode());
        dto.setDistrict(userRequestValue.getDistrict());
        dto.setStreet(userRequestValue.getStreet());
        dto.setBoxNr(userRequestValue.getBoxNr());
        dto.setFirstName(userRequestValue.getFirstName());
        dto.setLastName(userRequestValue.getLastName());
        dto.setEmail(userRequestValue.getEmail());
        dto.setCreatedOn(userRequestValue.getCreatedOn());
        dto.setStatus(userRequestValue.getStatus());

        return dto;
    }

    public List<UserRequestValuesDTO> getAll() {
        List<UserRequestValue> userRequestValues = userRequestValueRepository.findAll();
        List<UserRequestValuesDTO> userRequestValuesDTOList = userRequestValues.stream()
                .map(userRequestValue -> {
                    UserRequestValuesDTO dto = convertToDTO(userRequestValue);
                    System.out.println("DTO object: " + dto);
                    return dto;
                })
                .collect(Collectors.toList());

        return userRequestValuesDTOList;
    }

    public UserRequestValue addRequest(UserRequestValuesDTO userRequestValuesDTO) {
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

        return userRequestValueRepository.save(userRequestValues);
    }

    public ResponseEntity<Object> processUserRequest(UserRequestValuesDTO userRequestValuesDTO) {
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
