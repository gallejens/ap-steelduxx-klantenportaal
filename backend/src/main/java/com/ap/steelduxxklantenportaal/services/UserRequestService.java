package com.ap.steelduxxklantenportaal.services;

import com.ap.steelduxxklantenportaal.dtos.UserRequestDto;
import com.ap.steelduxxklantenportaal.dtos.UserRequestReview.CompanyApproveDto;
import com.ap.steelduxxklantenportaal.dtos.UserRequestReview.UserRequestDenyDto;
import com.ap.steelduxxklantenportaal.enums.RoleEnum;
import com.ap.steelduxxklantenportaal.enums.StatusEnum;
import com.ap.steelduxxklantenportaal.exceptions.UserAlreadyExistsException;
import com.ap.steelduxxklantenportaal.models.Company;
import com.ap.steelduxxklantenportaal.models.UserCompany;
import com.ap.steelduxxklantenportaal.models.UserRequest;
import com.ap.steelduxxklantenportaal.repositories.CompanyRepository;
import com.ap.steelduxxklantenportaal.repositories.UserCompanyRepository;
import com.ap.steelduxxklantenportaal.repositories.UserRepository;
import com.ap.steelduxxklantenportaal.repositories.UserRequestRepository;
import com.ap.steelduxxklantenportaal.utils.ResponseHandler;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserRequestService {
    @Autowired
    private UserRequestRepository userRequestRepository;

    @Autowired
    private UserRepository userRepository;

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
        List<UserRequest> userRequest = userRequestRepository.findAll();

        return userRequest.stream()
                .map(this::convertUserRequestToDTO)
                .collect(Collectors.toList());
    }

    public UserRequestDto getUserRequest(Number id) {
        UserRequest userRequest = userRequestRepository.findById(id);
        return convertUserRequestToDTO(userRequest);
    }

    private void addRequest(UserRequestDto userRequestDTO) throws MessagingException {
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
                .findByVatNrAndEmail(userRequestDto.vatNr(), userRequestDto.email()).isPresent();

        if (requestExists) {
            return ResponseHandler.generate("userRequestForm:userRequestAlreadyExists", HttpStatus.OK);
        }

        addRequest(userRequestDto);
        return ResponseHandler.generate("userRequestForm:userRequestRequested", HttpStatus.CREATED);
    }

    public ResponseEntity<Object> approveUserRequest(Number id, CompanyApproveDto companyApproveDto)
            throws MessagingException, UserAlreadyExistsException {
        boolean requestForCompanyExists = companyRepository
                .findByReferenceCode(companyApproveDto.referenceCode())
                .isPresent();

        if (requestForCompanyExists) {
            return ResponseHandler.generate("userRequestReviewPage:response:exists", HttpStatus.OK);
        }

        UserRequestDto userRequestDto = getUserRequest(id);
        UserRequest userRequest = userRequestRepository.findById(id);

        // Edit status to APPROVED
        userRequest.setStatus(StatusEnum.APPROVED);
        userRequestRepository.save(userRequest);

        // Set user values in DB
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
                companyApproveDto.referenceCode()));

        // Set link values in DB
        userCompanyRepository.save(new UserCompany(
                user.getId(),
                company.getId()));

        authService.sendChoosePasswordEmail(userRequestDto.email(), 30 * 24 * 60 * 60); // one month

        return ResponseHandler.generate("userRequestReviewPage:response:success", HttpStatus.CREATED);
    }

    public ResponseEntity<Object> denyUserRequest(Number id, UserRequestDenyDto userRequestDenyDto)
            throws MessagingException {
        UserRequest userRequest = userRequestRepository.findById(id);

        // Edit denyStatus
        userRequest.setStatus(StatusEnum.DENIED);

        // Edit denyMessage
        userRequest.setDenyMessage(userRequestDenyDto.denyMessage());

        userRequestRepository.save(userRequest);

        return ResponseHandler.generate("userRequestReviewPage:response:denied", HttpStatus.OK);
    }

    public ResponseEntity<Object> deactivateUserRequest(Number id) {
        UserRequest userRequest = userRequestRepository.findById(id);

        // Edit status to DEACTIVATED
        userRequest.setStatus(StatusEnum.DEACTIVATED);
        userRequestRepository.save(userRequest);

        if (userRequest.getStatus() == StatusEnum.DEACTIVATED) {
            userRepository.deleteById(id);
            companyRepository.deleteById(id);
            userCompanyRepository.deleteById(id);
        }

        return ResponseHandler.generate("userRequestReviewPage:response:deactivated", HttpStatus.OK);

    }

    public ResponseEntity<Object> deleteUserRequest(Number id) {
        UserRequest userRequest = userRequestRepository.findById(id);

        // Delete UserRequest when Denied
        userRequestRepository.deleteById(id);

        if (userRequest.getStatus() == StatusEnum.APPROVED) {
            userRepository.deleteById(id);
            companyRepository.deleteById(id);
            userCompanyRepository.deleteById(id);
        }

        return ResponseHandler.generate("userRequestReviewPage:response:deleted", HttpStatus.OK);
    }
}