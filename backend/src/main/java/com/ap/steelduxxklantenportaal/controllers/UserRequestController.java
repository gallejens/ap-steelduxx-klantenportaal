package com.ap.steelduxxklantenportaal.controllers;

import com.ap.steelduxxklantenportaal.dtos.UserRequestDto;
import com.ap.steelduxxklantenportaal.dtos.UserRequestReview.CompanyApproveDto;
import com.ap.steelduxxklantenportaal.dtos.UserRequestReview.UserRequestDeleteDto;
import com.ap.steelduxxklantenportaal.dtos.UserRequestReview.UserRequestDenyDto;
import com.ap.steelduxxklantenportaal.exceptions.UserAlreadyExistsException;
import com.ap.steelduxxklantenportaal.services.ExternalApiService;
import com.ap.steelduxxklantenportaal.services.UserRequestService;
import com.ap.steelduxxklantenportaal.utils.ResponseHandler;
import jakarta.mail.MessagingException;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("user-requests")
public class UserRequestController {
    private final UserRequestService userRequestValueService;
    private final ExternalApiService externalApiService;

    public UserRequestController(UserRequestService userRequestValueService, ExternalApiService externalApiService) {
        this.userRequestValueService = userRequestValueService;
        this.externalApiService = externalApiService;
    }

    @PostMapping("/new")
    @PreAuthorize("permitAll")
    public ResponseEntity<Object> saveRequest(@RequestBody UserRequestDto userRequestValuesDTO)
            throws MessagingException {
        return userRequestValueService.processUserRequest(userRequestValuesDTO);
    }

    @GetMapping("/all")
    @PreAuthorize("hasAuthority('MANAGE_USER_REQUESTS')")
    public List<UserRequestDto> getAllUserRequests() {
        return userRequestValueService.getAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('MANAGE_USER_REQUESTS')")
    public UserRequestDto getUserRequestById(@PathVariable String id) {
        return userRequestValueService.getUserRequest(Integer.parseInt(id));
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasAuthority('MANAGE_USER_REQUESTS')")
    public ResponseEntity<Object> approveRequest(@PathVariable Number id,
            @RequestBody CompanyApproveDto companyApproveDto)
            throws MessagingException, UserAlreadyExistsException {
        return userRequestValueService.approveUserRequest(id, companyApproveDto);
    }

    @PostMapping("/{id}/deny")
    @PreAuthorize("hasAuthority('MANAGE_USER_REQUESTS')")
    public ResponseEntity<Object> denyRequest(@PathVariable Number id,
            @RequestBody UserRequestDenyDto userRequestDenyDto)
            throws MessagingException {
        return userRequestValueService.denyUserRequest(id, userRequestDenyDto);
    }

    @DeleteMapping("/delete")
    @PreAuthorize("hasAuthority('MANAGE_USER_REQUESTS')")
    public ResponseEntity<Object> deleteRequest(@RequestBody UserRequestDeleteDto userRequestDeleteDto) {
        return userRequestValueService.deleteUserRequest(userRequestDeleteDto.id());
    }

    @GetMapping("/company-codes")
    @PreAuthorize("hasAuthority('MANAGE_USER_REQUESTS')")
    public ResponseEntity<Object> getCompanyCodes() {
        var referenceCodes = externalApiService.doRequest("/admin/company-codes/all", HttpMethod.GET, String[].class);
        return ResponseHandler.generate("", HttpStatus.OK, referenceCodes);
    }
}
