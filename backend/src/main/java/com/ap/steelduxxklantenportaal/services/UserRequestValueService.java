package com.ap.steelduxxklantenportaal.services;

import com.ap.steelduxxklantenportaal.DTOs.UserRequestValuesDTO;
import com.ap.steelduxxklantenportaal.enums.StatusEnum;
import com.ap.steelduxxklantenportaal.models.UserRequestValue;
import com.ap.steelduxxklantenportaal.repositories.UserRequestValueRepository;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class UserRequestValueService {

    @Autowired
    private UserRequestValueRepository userRequestValueRepository;

    // Assuming you have an EmailService bean defined elsewhere
    @Autowired
    private EmailService emailService;

    public UserRequestValuesDTO convertToDTO(UserRequestValue userRequestValue) {
        UserRequestValuesDTO dto = new UserRequestValuesDTO();

        dto.setFollowId(userRequestValue.getId());
        dto.setCompanyName(userRequestValue.getCompanyName());
        dto.setPhoneNr(userRequestValue.getPhoneNr());
        dto.setVatNr(userRequestValue.getVatNr());
        dto.setPostalCode(userRequestValue.getPostalCode());
        dto.setDistrict(userRequestValue.getDistrict());
        dto.setStreet(userRequestValue.getStreet());
        dto.setStreetNr(userRequestValue.getStreetNr());
        dto.setBoxNr(userRequestValue.getBoxNr());
        dto.setFirstName(userRequestValue.getFirstName());
        dto.setLastName(userRequestValue.getLastName());
        dto.setEmail(userRequestValue.getEmail());
        dto.setCreatedOn(userRequestValue.getCreatedOn());
        dto.setStatus(userRequestValue.getStatus());
        dto.setDenyMessage(userRequestValue.getDenyMessage());

        return dto;
    }

    public List<UserRequestValuesDTO> getAll() {
        List<UserRequestValue> userRequestValues = userRequestValueRepository.findAll();
        List<UserRequestValuesDTO> userRequestValuesDTOList = userRequestValues.stream()
                .map(userRequestValue -> convertToDTO(userRequestValue))
                .collect(Collectors.toList());

        return userRequestValuesDTOList;
    }

    public UserRequestValuesDTO getUserRequest(Number id) {
        UserRequestValue userRequestValue = userRequestValueRepository.findById(id);
        return convertToDTO(userRequestValue);
    }

    public UserRequestValue addRequest(UserRequestValuesDTO userRequestValuesDTO) throws MessagingException {
        // Uncomment the following line if you have an EmailService bean defined
        emailService.sendRegistrationConfirmation(userRequestValuesDTO);

        return userRequestValueRepository.save(new UserRequestValue(
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
                ""));
    }

    public ResponseEntity<Object> processUserRequest(UserRequestValuesDTO userRequestValuesDTO)
            throws MessagingException {
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
