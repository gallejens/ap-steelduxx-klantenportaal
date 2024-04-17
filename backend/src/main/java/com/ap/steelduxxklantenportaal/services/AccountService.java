package com.ap.steelduxxklantenportaal.services;

import com.ap.steelduxxklantenportaal.dtos.Accounts.AccountDto;
import com.ap.steelduxxklantenportaal.dtos.Accounts.CreateSubaccountDto;
import com.ap.steelduxxklantenportaal.enums.PermissionEnum;
import com.ap.steelduxxklantenportaal.enums.RoleEnum;
import com.ap.steelduxxklantenportaal.exceptions.UserAlreadyExistsException;
import com.ap.steelduxxklantenportaal.models.Account;
import com.ap.steelduxxklantenportaal.models.User;
import com.ap.steelduxxklantenportaal.models.UserCompany;
import com.ap.steelduxxklantenportaal.repositories.AccountRepository;
import com.ap.steelduxxklantenportaal.repositories.CompanyRepository;
import com.ap.steelduxxklantenportaal.repositories.UserCompanyRepository;
import com.ap.steelduxxklantenportaal.utils.ResponseHandler;
import jakarta.mail.MessagingException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class AccountService {
    private final AccountRepository accountRepository;
    private final AuthService authService;
    private final CompanyRepository companyRepository;
    private final UserCompanyRepository userCompanyRepository;

    public AccountService(AccountRepository accountRepository, AuthService authService, CompanyRepository companyRepository, UserCompanyRepository userCompanyRepository) {
        this.accountRepository = accountRepository;
        this.authService = authService;
        this.companyRepository = companyRepository;
        this.userCompanyRepository = userCompanyRepository;
    }

    public List<AccountDto> getAllAccounts() {
        var user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (user.hasPermission(PermissionEnum.ADMIN)) {

            return accountRepository.findAll().stream().map(Account::toDto).toList();
        }

        return accountRepository.findAllFromSameCompanyAsUser(user.getId()).stream().map(Account::toDto).toList();
    }

    public ResponseEntity<Object> createSubaccount(CreateSubaccountDto createSubaccountDto) {
        boolean userExists = authService.doesUserExist(createSubaccountDto.email());
        if (userExists) {
            return ResponseHandler.generate("duplicate", HttpStatus.NO_CONTENT);
        }

        var user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (user == null) {
            return ResponseHandler.generate("failed", HttpStatus.NO_CONTENT);
        }

        var isAdmin = user.hasPermission(PermissionEnum.ADMIN);

        try {
            var newUser = authService.addNewUser(
                    createSubaccountDto.email(),
                    UUID.randomUUID().toString(),
                    createSubaccountDto.firstName(),
                    createSubaccountDto.lastName(),
                    isAdmin ? RoleEnum.ROLE_ADMIN : RoleEnum.ROLE_USER
            );

            if (!isAdmin) {
                var company = companyRepository.findByUserId(user.getId()).orElseThrow();
                userCompanyRepository.save(new UserCompany(
                                newUser.getId(),
                                company.getId()
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
}
