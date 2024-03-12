package com.ap.steelduxxklantenportaal.services;

import com.ap.steelduxxklantenportaal.dtos.UserRequestValuesDto;
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

    public UserRequestValuesDto convertToDTO(UserRequestValue userRequestValue) {
        return new UserRequestValuesDto(
                userRequestValue.getId(),
                userRequestValue.getCompanyName(),
                userRequestValue.getPhoneNr(),
                userRequestValue.getVatNr(),
                userRequestValue.getPostalCode(),
                userRequestValue.getDistrict(),
                userRequestValue.getStreet(),
                userRequestValue.getStreetNr(),
                userRequestValue.getBoxNr(),
                userRequestValue.getFirstName(),
                userRequestValue.getLastName(),
                userRequestValue.getEmail(),
                userRequestValue.getCreatedOn(),
                userRequestValue.getStatus(),
                userRequestValue.getDenyMessage()
        );
    }

    public List<UserRequestValuesDto> getAll() {
        List<UserRequestValue> userRequestValues = userRequestValueRepository.findAll();

        return userRequestValues.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public UserRequestValuesDto getUserRequest(Number id) {
        UserRequestValue userRequestValue = userRequestValueRepository.findById(id);
        return convertToDTO(userRequestValue);
    }

    public void addRequest(UserRequestValuesDto userRequestValuesDTO) throws MessagingException {
        // Uncomment the following line if you have an EmailService bean defined
        emailService.sendRegistrationConfirmation(userRequestValuesDTO);

        userRequestValueRepository.save(new UserRequestValue(
                userRequestValuesDTO.companyName(),
                userRequestValuesDTO.phoneNr(),
                userRequestValuesDTO.vatNr(),
                userRequestValuesDTO.postalCode(),
                userRequestValuesDTO.district(),
                userRequestValuesDTO.street(),
                userRequestValuesDTO.streetNr(),
                userRequestValuesDTO.boxNr(),
                userRequestValuesDTO.firstName(),
                userRequestValuesDTO.lastName(),
                userRequestValuesDTO.email(),
                userRequestValuesDTO.createdOn(),
                StatusEnum.PENDING,
                "")
        );
    }

    public ResponseEntity<Object> processUserRequest(UserRequestValuesDto userRequestValuesDto)
            throws MessagingException {
        boolean requestExists = userRequestValueRepository
                .findByVatNrAndEmail(userRequestValuesDto.vatNr(), userRequestValuesDto.email()).isPresent();

        if (requestExists) {
            Map<String, String> responseBody = Collections.singletonMap("message", "userRequestForm:userRequestAlreadyExists");
            return new ResponseEntity<>(responseBody, HttpStatus.OK);
        } else {
            addRequest(userRequestValuesDto);

            Map<String, String> responseBody = Collections.singletonMap("message", "userRequestForm:userRequestRequested");
            return new ResponseEntity<>(responseBody, HttpStatus.CREATED);
        }
    }
}
