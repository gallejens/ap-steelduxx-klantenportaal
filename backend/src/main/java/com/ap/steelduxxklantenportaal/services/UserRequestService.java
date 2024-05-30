package com.ap.steelduxxklantenportaal.services;

import com.ap.steelduxxklantenportaal.dtos.UserRequestDto;
import com.ap.steelduxxklantenportaal.dtos.userrequestreview.UserRequestApproveDto;
import com.ap.steelduxxklantenportaal.dtos.userrequestreview.UserRequestDenyDto;
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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserRequestService {
    private final UserRequestRepository userRequestRepository;

    private final UserRepository userRepository;

    private final AuthService authService;

    private final CompanyRepository companyRepository;

    private final UserCompanyRepository userCompanyRepository;

    private final EmailService emailService;

    public UserRequestService(UserRequestRepository userRequestRepository,
                              UserRepository userRepository,
                              AuthService authService,
                              CompanyRepository companyRepository,
                              UserCompanyRepository userCompanyRepository,
                              EmailService emailService) {
        this.userRequestRepository = userRequestRepository;
        this.userRepository = userRepository;
        this.authService = authService;
        this.companyRepository = companyRepository;
        this.userCompanyRepository = userCompanyRepository;
        this.emailService = emailService;
    }

    public List<UserRequestDto> getAll() {
        List<UserRequest> userRequests = userRequestRepository.findAll();

        return userRequests.stream()
                .map(UserRequest::toDto)
                .toList();
    }

    public UserRequestDto getUserRequest(Long id) {
        UserRequest userRequest = userRequestRepository.findById(id).orElseThrow();
        return userRequest.toDto();
    }

    private void addRequest(UserRequestDto userRequestDTO) throws MessagingException {
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

        Optional<UserRequest> pendingOrApprovedRequests = userRequestRepository.findByStatusInAndVatNrAndEmail(
                List.of(StatusEnum.PENDING, StatusEnum.APPROVED),
                userRequestDto.vatNr(),
                userRequestDto.email());

        if (pendingOrApprovedRequests.isPresent()) {
            return ResponseHandler.generate("userRequestForm:userRequestAlreadyExists", HttpStatus.OK);
        }

        addRequest(userRequestDto);
        return ResponseHandler.generate("userRequestForm:userRequestRequested", HttpStatus.CREATED);
    }

    public ResponseEntity<Object> approveUserRequest(Long id, UserRequestApproveDto userRequestApproveDto)
            throws MessagingException, UserAlreadyExistsException {
        boolean requestForCompanyExists = companyRepository
                .findByReferenceCode(userRequestApproveDto.referenceCode())
                .isPresent();

        if (requestForCompanyExists) {
            return ResponseHandler.generate("userRequestReviewPage:response:exists", HttpStatus.OK);
        }

        UserRequest userRequest = userRequestRepository.findById(id).orElseThrow();

        // Edit status to APPROVED
        userRequest.setStatus(StatusEnum.APPROVED);
        userRequestRepository.save(userRequest);

        // Set user values in DB
        var user = authService.addNewUser(
                userRequest.getEmail(),
                UUID.randomUUID().toString(),
                userRequest.getFirstName(),
                userRequest.getLastName(),
                RoleEnum.ROLE_HEAD_USER
        );

        // Set company values in DB
        var company = companyRepository.save(new Company(
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
                        userRequestApproveDto.referenceCode()
                )
        );

        // Set link values in DB
        userCompanyRepository.save(new UserCompany(
                        user.getId(),
                        company.getId()
                )
        );

        authService.sendChoosePasswordEmail(userRequest.getEmail(), 30L * 24 * 60 * 60); // one month

        return ResponseHandler.generate("userRequestReviewPage:response:success", HttpStatus.CREATED);
    }

    public ResponseEntity<Object> denyUserRequest(Long id, UserRequestDenyDto userRequestDenyDto) {
        UserRequest userRequest = userRequestRepository.findById(id).orElseThrow();

        userRequest.setStatus(StatusEnum.DENIED);
        userRequest.setDenyMessage(userRequestDenyDto.denyMessage());

        userRequestRepository.save(userRequest);

        return ResponseHandler.generate("userRequestReviewPage:response:denied", HttpStatus.OK);
    }

    public ResponseEntity<Object> deleteUserRequest(Long id) {
        var userRequest = userRequestRepository.findById(id).orElse(null);
        if (userRequest == null) {
            return ResponseHandler.generate("userRequestReviewPage:response:deleted", HttpStatus.NO_CONTENT);
        }

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