package com.ap.steelduxxklantenportaal.account;

import com.ap.steelduxxklantenportaal.enums.RoleEnum;
import com.ap.steelduxxklantenportaal.repositories.UserRepository;
import com.ap.steelduxxklantenportaal.services.AccountService;
import com.ap.steelduxxklantenportaal.services.AuthService;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.security.test.context.support.WithUserDetails;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class AccountServiceTest {

    @Autowired
    private AccountService accountService;
    @Autowired
    private UserRepository userRepository;

    @BeforeAll
    public void setupAllTests() {
        userRepository.save(AccountObjectMother.headAdminUser);
        userRepository.save(AccountObjectMother.headNormalUser);
    }

    @AfterAll
    public void finishAllTests() {
        userRepository.delete(AccountObjectMother.headAdminUser);
        userRepository.delete(AccountObjectMother.headNormalUser);
    }

    @AfterEach
    public void finishTest() {
        userRepository.deleteByEmail(AccountObjectMother.createSubaccountDto.email());
    }

    @Test
    @WithUserDetails(value=AccountObjectMother.headAdminEmail)
    void givenLoggedInUser_whenRequestingAccounts_thenGetList() {
        var accounts = accountService.getAllAccounts();
        assertThat(accounts).isInstanceOf(List.class);
    }

    @Test
    @WithUserDetails(value=AccountObjectMother.headAdminEmail)
    void givenHeadAdminUser_whenCreatingSubaccount_expectAccountWithAdminRole() {
        var result = accountService.createSubaccount(AccountObjectMother.createSubaccountDto);
        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.CREATED);

        var user = userRepository.findByEmail(AccountObjectMother.createSubaccountDto.email()).orElseThrow();
        assertThat(user.getRole()).isEqualTo(RoleEnum.ROLE_ADMIN);
    }

    @Test
    @WithUserDetails(value=AccountObjectMother.headNormalEmail)
    void givenHeadNormalUser_whenCreatingSubaccount_expectAccountWithUserRole() {
        var result = accountService.createSubaccount(AccountObjectMother.createSubaccountDto);
        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.CREATED);

        var user = userRepository.findByEmail(AccountObjectMother.createSubaccountDto.email()).orElseThrow();
        assertThat(user.getRole()).isEqualTo(RoleEnum.ROLE_USER);
    }
}
