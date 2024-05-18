package com.ap.steelduxxklantenportaal.controllers;

import com.ap.steelduxxklantenportaal.dtos.UserRequestDto;
import com.ap.steelduxxklantenportaal.dtos.userrequestreview.UserRequestApproveDto;
import com.ap.steelduxxklantenportaal.dtos.userrequestreview.UserRequestDenyDto;
import com.ap.steelduxxklantenportaal.exceptions.UserAlreadyExistsException;
import com.ap.steelduxxklantenportaal.services.ExternalApiService;
import com.ap.steelduxxklantenportaal.services.UserRequestService;
import jakarta.mail.MessagingException;
import org.springframework.http.HttpMethod;
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
    public ResponseEntity<Object> approveRequest(@PathVariable Long id,
                                                 @RequestBody UserRequestApproveDto userRequestApproveDto)
            throws MessagingException, UserAlreadyExistsException {
        return userRequestValueService.approveUserRequest(id, userRequestApproveDto);
    }

    @PostMapping("/{id}/deny")
    @PreAuthorize("hasAuthority('MANAGE_USER_REQUESTS')")
    public ResponseEntity<Object> denyRequest(@PathVariable Long id,
                                              @RequestBody UserRequestDenyDto userRequestDenyDto) {
        return userRequestValueService.denyUserRequest(id, userRequestDenyDto);
    }

    @DeleteMapping("/{id}/delete")
    @PreAuthorize("hasAuthority('MANAGE_USER_REQUESTS')")
    public ResponseEntity<Object> deleteRequest(@PathVariable Long id) {
        return userRequestValueService.deleteUserRequest(id);
    }

    @GetMapping("/company-codes")
    @PreAuthorize("hasAuthority('MANAGE_USER_REQUESTS')")
    public ResponseEntity<String[]> getCompanyCodes() {
        var referenceCodes = externalApiService.doRequest("/admin/company-codes/all", HttpMethod.GET, String[].class);
        return ResponseEntity.ok(referenceCodes);
    }
}
