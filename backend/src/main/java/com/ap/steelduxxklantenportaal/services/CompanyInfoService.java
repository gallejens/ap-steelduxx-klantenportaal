package com.ap.steelduxxklantenportaal.services;

import com.ap.steelduxxklantenportaal.dtos.CompanyInfo.ChangeCompanyHeadAccountDto;
import com.ap.steelduxxklantenportaal.dtos.CompanyInfo.CompanyInfoDto;
import com.ap.steelduxxklantenportaal.dtos.CompanyInfo.CreateSubAccountDto;
import com.ap.steelduxxklantenportaal.enums.PermissionEnum;
import com.ap.steelduxxklantenportaal.enums.RoleEnum;
import com.ap.steelduxxklantenportaal.exceptions.UserAlreadyExistsException;
import com.ap.steelduxxklantenportaal.models.UserCompany;
import com.ap.steelduxxklantenportaal.repositories.CompanyInfoAccountRepository;
import com.ap.steelduxxklantenportaal.repositories.CompanyRepository;
import com.ap.steelduxxklantenportaal.repositories.UserCompanyRepository;
import com.ap.steelduxxklantenportaal.utils.ResponseHandler;
import jakarta.mail.MessagingException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class CompanyInfoService {
    private final CompanyInfoAccountRepository companyInfoAccountRepository;
    private final CompanyRepository companyRepository;
    private final AuthService authService;
    private final UserCompanyRepository userCompanyRepository;

    public CompanyInfoService(
            CompanyInfoAccountRepository companyInfoAccountRepository,
            CompanyRepository companyRepository,
            AuthService authService,
            UserCompanyRepository userCompanyRepository
    ) {
        this.companyInfoAccountRepository = companyInfoAccountRepository;
        this.companyRepository = companyRepository;
        this.authService = authService;
        this.userCompanyRepository = userCompanyRepository;
    }

    public List<CompanyInfoDto> getAll() {
        var user = AuthService.getCurrentUser();
        if (user == null)
            return null;

        if (user.hasPermission(PermissionEnum.ADMIN)) {
            return getCompanyInfoForAdmin();
        }

        return getCompanyInfoByUserId(user.getId());
    }

    private List<CompanyInfoDto> getCompanyInfoForAdmin() {
        var companies = companyRepository.findAll();

        var companyInfoList = new ArrayList<CompanyInfoDto>();
        for (var company : companies) {
            var accounts = companyInfoAccountRepository.findAllByCompanyId(company.getId());
            companyInfoList.add(new CompanyInfoDto(company, accounts));
        }

        var adminAccounts = companyInfoAccountRepository.findAdmin();
        companyInfoList.add(new CompanyInfoDto(null, adminAccounts));

        return companyInfoList;
    }

    private List<CompanyInfoDto> getCompanyInfoByUserId(long userId) {
        var company = companyRepository.findByUserId(userId).orElse(null);
        if (company == null) return null;

        var accounts = companyInfoAccountRepository.findAllByCompanyId(company.getId());

        return List.of(new CompanyInfoDto(company, accounts));
    }

    public ResponseEntity<Object> createSubAccount(CreateSubAccountDto createSubaccountDto) {
        var user = AuthService.getCurrentUser();
        if (user == null) {
            return ResponseHandler.generate("failed", HttpStatus.NO_CONTENT);
        }

        boolean userExists = authService.doesUserExist(createSubaccountDto.email());
        if (userExists) {
            return ResponseHandler.generate("duplicate", HttpStatus.NO_CONTENT);
        }

        PermissionEnum requiredPermission;
        RoleEnum newAccountRole;
        if (createSubaccountDto.companyId() == null) {
            // If no company id is provided, target account is admin and initiating user needs create admin perm
            requiredPermission = PermissionEnum.CREATE_ADMIN_ACCOUNTS;
            newAccountRole = RoleEnum.ROLE_ADMIN;
        } else {
            // If company id is provided, target account is user and initiating user needs create user perm
            requiredPermission = PermissionEnum.CREATE_USER_ACCOUNTS;
            newAccountRole = RoleEnum.ROLE_USER;

            // check if company exists
            if (!companyRepository.existsById(createSubaccountDto.companyId())) {
                return ResponseHandler.generate("failed", HttpStatus.NO_CONTENT);
            }

            // make sure initiating user belongs to company when head_user performs action
            if (user.getRole() == RoleEnum.ROLE_HEAD_USER) {
                var userCompany = userCompanyRepository.findById(user.getId());
                if (userCompany.isEmpty() || !userCompany.get().getCompanyId().equals(createSubaccountDto.companyId())) {
                    return ResponseHandler.generate("failed", HttpStatus.NO_CONTENT);
                }
            }
        }

        boolean hasPermission = user.hasPermission(requiredPermission);
        if (!hasPermission) {
            return ResponseHandler.generate("failed", HttpStatus.NO_CONTENT);
        }

        try {
            var newUser = authService.addNewUser(
                    createSubaccountDto.email(),
                    UUID.randomUUID().toString(),
                    createSubaccountDto.firstName(),
                    createSubaccountDto.lastName(),
                    newAccountRole
            );

            if (createSubaccountDto.companyId() != null) {
                userCompanyRepository.save(
                        new UserCompany(
                                newUser.getId(),
                                createSubaccountDto.companyId()
                        )
                );
            }

            authService.sendChoosePasswordEmail(newUser.getEmail(), 30 * 24 * 60 * 60); // one month
        } catch (UserAlreadyExistsException e) {
            return ResponseHandler.generate("duplicate", HttpStatus.NO_CONTENT);
        } catch (MessagingException e) {
            return ResponseHandler.generate("failed", HttpStatus.NO_CONTENT);
        }

        return ResponseHandler.generate("success", HttpStatus.CREATED);
    }

    public ResponseEntity<Object> deleteSubAccount(String email) {
        var user = AuthService.getCurrentUser();
        if (user == null) {
            return ResponseHandler.generate("failed", HttpStatus.NO_CONTENT);
        }

        var userToDelete = authService.getUser(email);
        if (userToDelete == null) {
            return ResponseHandler.generate("failed", HttpStatus.NO_CONTENT);
        }

        boolean canDeleteUser = false;
        switch (userToDelete.getRole()) {
            case ROLE_ADMIN -> canDeleteUser = user.hasPermission(PermissionEnum.DELETE_ADMIN_ACCOUNTS);
            case ROLE_USER -> {
                if (user.hasPermission(PermissionEnum.DELETE_USER_ACCOUNTS)) {
                    var userCompany = userCompanyRepository.findById(user.getId()).orElse(null);
                    var userToDeleteCompany = userCompanyRepository.findById(userToDelete.getId()).orElseThrow();

                    if (userCompany == null || userCompany.getCompanyId().equals(userToDeleteCompany.getCompanyId())) {
                        canDeleteUser = true;
                    }
                }
            }
        }
        if (!canDeleteUser) {
            return ResponseHandler.generate("failed", HttpStatus.NO_CONTENT);
        }

        authService.deleteAccount(userToDelete.getId());

        return ResponseHandler.generate("success", HttpStatus.OK);
    }

    public ResponseEntity<Object> changeCompanyHeadAccount(ChangeCompanyHeadAccountDto changeCompanyHeadAccountDto) {
        var company = companyRepository.findById(changeCompanyHeadAccountDto.companyId()).orElse(null);
        if (company == null) {
            return ResponseHandler.generate("failed", HttpStatus.NO_CONTENT);
        }

        var currentHeadUserId = companyRepository.findHeadUserIdByCompanyId(company.getId()).orElse(null);
        if (currentHeadUserId == null) {
            return ResponseHandler.generate("failed", HttpStatus.NO_CONTENT);
        }

        var newHeadUser = authService.getUser(changeCompanyHeadAccountDto.email());
        if (newHeadUser == null) {
            return ResponseHandler.generate("failed", HttpStatus.NO_CONTENT);
        }

        authService.changeRole(currentHeadUserId, RoleEnum.ROLE_USER);
        authService.changeRole(newHeadUser.getId(), RoleEnum.ROLE_HEAD_USER);

        return ResponseHandler.generate("success", HttpStatus.OK);
    }
 }
