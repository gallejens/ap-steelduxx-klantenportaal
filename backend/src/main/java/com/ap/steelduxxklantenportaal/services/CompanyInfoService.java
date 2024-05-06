package com.ap.steelduxxklantenportaal.services;

import com.ap.steelduxxklantenportaal.dtos.Accounts.CreateSubaccountDto;
import com.ap.steelduxxklantenportaal.dtos.CompanyInfo.CompanyInfoDto;
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

        return companyInfoList;
    }

    private List<CompanyInfoDto> getCompanyInfoByUserId(long userId) {
        var company = companyRepository.findByUserId(userId).orElse(null);
        if (company == null) return null;

        var accounts = companyInfoAccountRepository.findAllByCompanyId(company.getId());

        return List.of(new CompanyInfoDto(company, accounts));
    }

    public ResponseEntity<Object> createSubaccount(CreateSubaccountDto createSubaccountDto) {
        var user = AuthService.getCurrentUser();
        if (user == null) {
            return ResponseHandler.generate("failed", HttpStatus.NO_CONTENT);
        }

        boolean userExists = authService.doesUserExist(createSubaccountDto.email());
        if (userExists) {
            return ResponseHandler.generate("duplicate", HttpStatus.NO_CONTENT);
        }

        var isAdmin = user.hasPermission(PermissionEnum.ADMIN);

        try {
            var newUser = authService.addNewUser(
                    createSubaccountDto.email(),
                    UUID.randomUUID().toString(),
                    createSubaccountDto.firstName(),
                    createSubaccountDto.lastName(),
                    isAdmin ? RoleEnum.ROLE_ADMIN : RoleEnum.ROLE_USER);

            if (!isAdmin) {
                var company = companyRepository.findByUserId(user.getId());
                if (company.isPresent()) {
                    userCompanyRepository.save(new UserCompany(
                            newUser.getId(),
                            company.get().getId()));
                }
            }

            authService.sendChoosePasswordEmail(newUser.getEmail(), 30 * 24 * 60 * 60); // one month
        } catch (UserAlreadyExistsException e) {
            return ResponseHandler.generate("duplicate", HttpStatus.NO_CONTENT);
        } catch (MessagingException e) {
            return ResponseHandler.generate("failed", HttpStatus.NO_CONTENT);
        }

        return ResponseHandler.generate("success", HttpStatus.CREATED);
    }
}
