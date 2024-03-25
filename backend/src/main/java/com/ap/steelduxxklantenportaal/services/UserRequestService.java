package com.ap.steelduxxklantenportaal.services;

import com.ap.steelduxxklantenportaal.dtos.CompanyApproveDto;
import com.ap.steelduxxklantenportaal.dtos.UserInfoDto;
import com.ap.steelduxxklantenportaal.dtos.UserRequestDto;
import com.ap.steelduxxklantenportaal.enums.RoleEnum;
import com.ap.steelduxxklantenportaal.enums.StatusEnum;
import com.ap.steelduxxklantenportaal.exceptions.UserAlreadyExistsException;
import com.ap.steelduxxklantenportaal.models.UserRequest;
import com.ap.steelduxxklantenportaal.models.Company;
import com.ap.steelduxxklantenportaal.models.User;
import com.ap.steelduxxklantenportaal.models.UserCompany;
import com.ap.steelduxxklantenportaal.repositories.CompanyRepository;
import com.ap.steelduxxklantenportaal.repositories.UserCompanyRepository;
import com.ap.steelduxxklantenportaal.repositories.UserRepository;
import com.ap.steelduxxklantenportaal.repositories.UserRequestRepository;

import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserRequestService {

        @Autowired
        private UserRequestRepository userRequestRepository;

        @Autowired
        private AuthService authService;

        @Autowired
        private CompanyRepository companyRepository;

        @Autowired
        private UserCompanyRepository userCompanyRepository;

        // Assuming you have an EmailService bean defined elsewhere
        @Autowired
        private EmailService emailService;

        public UserRequestDto convertUserRequestToDTO(UserRequest userRequest) {
                return new UserRequestDto(
                                userRequest.getId(),
                                userRequest.getCompanyName(),
                                userRequest.getCountry(),
                                userRequest.getPhoneNr(),
                                userRequest.getVatNr(),
                                userRequest.getPostalCode(),
                                userRequest.getDistrict(),
                                userRequest.getStreet(),
                                userRequest.getStreetNr(),
                                userRequest.getBoxNr(),
                                userRequest.getExtraInfo(),
                                userRequest.getFirstName(),
                                userRequest.getLastName(),
                                userRequest.getEmail(),
                                userRequest.getCreatedOn(),
                                userRequest.getStatus(),
                                userRequest.getDenyMessage());
        }

        public List<UserRequestDto> getAll() {
                List<UserRequest> userRequestValues = userRequestRepository.findAll();

                return userRequestValues.stream()
                                .map(this::convertUserRequestToDTO)
                                .collect(Collectors.toList());
        }

        public UserRequestDto getUserRequest(Number id) {
                UserRequest userRequestValue = userRequestRepository.findById(id);
                return convertUserRequestToDTO(userRequestValue);
        }

        public void addRequest(UserRequestDto userRequestDTO) throws MessagingException {
                // Uncomment the following line if you have an EmailService bean defined
                emailService.sendRegistrationConfirmation(userRequestDTO);

                userRequestRepository.save(new UserRequest(
                                userRequestDTO.companyName(),
                                userRequestDTO.country(),
                                userRequestDTO.phoneNr(),
                                userRequestDTO.vatNr(),
                                userRequestDTO.postalCode(),
                                userRequestDTO.district(),
                                userRequestDTO.street(),
                                userRequestDTO.streetNr(),
                                userRequestDTO.boxNr(),
                                userRequestDTO.extraInfo(),
                                userRequestDTO.firstName(),
                                userRequestDTO.lastName(),
                                userRequestDTO.email(),
                                userRequestDTO.createdOn(),
                                StatusEnum.PENDING,
                                ""));
        }

        public ResponseEntity<Object> processUserRequest(UserRequestDto userRequestDto)
                        throws MessagingException {
                boolean requestExists = userRequestRepository
                                .findByVatNrOrEmail(userRequestDto.vatNr(), userRequestDto.email()).isPresent();

                if (requestExists) {
                        Map<String, String> responseBody = Collections.singletonMap("message",
                                        "userRequestForm:userRequestAlreadyExists");
                        return new ResponseEntity<>(responseBody, HttpStatus.OK);
                } else {
                        addRequest(userRequestDto);

                        Map<String, String> responseBody = Collections.singletonMap("message",
                                        "userRequestForm:userRequestRequested");
                        return new ResponseEntity<>(responseBody, HttpStatus.CREATED);
                }
        }

        public ResponseEntity<Object> approveUserRequest(Number id, CompanyApproveDto companyDto)
                        throws MessagingException, UserAlreadyExistsException {
                boolean requestForCompanyExists = companyRepository.findByReferenceCode(companyDto.referenceCode())
                                .isPresent();
                if (requestForCompanyExists) {
                        Map<String, String> responseBody = Collections.singletonMap("message",
                                        "userRequestReviewPage:response:exists");
                        return new ResponseEntity<>(responseBody, HttpStatus.OK);
                } else {
                        // Send email to set password

                        // Edit status to APPROVED

                        // Set user values in DB
                        UserRequestDto userRequestDto = getUserRequest(id);

                        var user = authService.addNewUser(
                                        userRequestDto.email(),
                                        UUID.randomUUID().toString(),
                                        userRequestDto.firstName(),
                                        userRequestDto.lastName(),
                                        RoleEnum.ROLE_HEAD_USER);

                        // Set company values in DB
                        var company = companyRepository.save(new Company(
                                        userRequestDto.companyName(),
                                        userRequestDto.country(),
                                        userRequestDto.phoneNr(),
                                        userRequestDto.vatNr(),
                                        userRequestDto.postalCode(),
                                        userRequestDto.district(),
                                        userRequestDto.street(),
                                        userRequestDto.streetNr(),
                                        userRequestDto.boxNr(),
                                        userRequestDto.extraInfo(),
                                        companyDto.referenceCode()));

                        // Set link values in DB
                        userCompanyRepository.save(new UserCompany(
                                        user.getId(),
                                        company.getId()));

                        Map<String, String> responseBody = Collections.singletonMap("message",
                                        "userRequestReviewPage:response:succes");

                        return new ResponseEntity<>(responseBody, HttpStatus.CREATED);
                }

        }
}
