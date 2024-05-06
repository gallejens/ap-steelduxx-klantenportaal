package com.ap.steelduxxklantenportaal.services;

import com.ap.steelduxxklantenportaal.dtos.Accounts.AccountDto;
import com.ap.steelduxxklantenportaal.dtos.Accounts.CreateSubaccountDto;
import com.ap.steelduxxklantenportaal.dtos.Accounts.DeleteSubaccountDto;
import com.ap.steelduxxklantenportaal.enums.PermissionEnum;
import com.ap.steelduxxklantenportaal.enums.RoleEnum;
import com.ap.steelduxxklantenportaal.exceptions.UserAlreadyExistsException;
import com.ap.steelduxxklantenportaal.models.Account;
import com.ap.steelduxxklantenportaal.models.User;
import com.ap.steelduxxklantenportaal.models.UserCompany;
import com.ap.steelduxxklantenportaal.repositories.AccountRepository;
import com.ap.steelduxxklantenportaal.repositories.CompanyRepository;
import com.ap.steelduxxklantenportaal.repositories.UserCompanyRepository;
import com.ap.steelduxxklantenportaal.repositories.UserRepository;
import com.ap.steelduxxklantenportaal.utils.ResponseHandler;
import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class AccountService {
    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final AuthService authService;
    private final CompanyRepository companyRepository;
    private final UserCompanyRepository userCompanyRepository;

    public AccountService(AccountRepository accountRepository, UserRepository userRepository, AuthService authService,
            CompanyRepository companyRepository, UserCompanyRepository userCompanyRepository) {
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
        this.authService = authService;
        this.companyRepository = companyRepository;
        this.userCompanyRepository = userCompanyRepository;
    }

    public List<AccountDto> getAllAccounts() {
        var user = AuthService.getCurrentUser();
        if (user == null)
            return null;

        if (user.hasPermission(PermissionEnum.ADMIN)) {
            return accountRepository.findAll().stream().map(Account::toDto).toList();
        }

        return accountRepository.findAllFromSameCompanyAsUser(user.getId()).stream().map(Account::toDto).toList();
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

    @Transactional
    public ResponseEntity<Object> deleteSubaccount(DeleteSubaccountDto deleteSubaccountDto) {
        Optional<User> subaccount = userRepository.findByEmail(deleteSubaccountDto.email());
        if (subaccount.isPresent()) {
            userRepository.deleteByEmail(deleteSubaccountDto.email());
            return ResponseHandler.generate("Subaccount successfully deleted", HttpStatus.OK);
        } else {
            return ResponseHandler.generate("Subaccount not found", HttpStatus.NOT_FOUND);
        }
    }
}