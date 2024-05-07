package com.ap.steelduxxklantenportaal.companyinfo;

import com.ap.steelduxxklantenportaal.dtos.CompanyInfo.CreateSubAccountDto;
import com.ap.steelduxxklantenportaal.enums.RoleEnum;
import com.ap.steelduxxklantenportaal.models.Company;
import com.ap.steelduxxklantenportaal.models.User;
import com.ap.steelduxxklantenportaal.models.UserCompany;
import com.ap.steelduxxklantenportaal.repositories.CompanyRepository;
import com.ap.steelduxxklantenportaal.repositories.UserCompanyRepository;
import com.ap.steelduxxklantenportaal.repositories.UserRepository;
import com.ap.steelduxxklantenportaal.services.CompanyInfoService;
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
public class CompanyInfoServiceTest {

    @Autowired
    private CompanyInfoService companyInfoService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserCompanyRepository userCompanyRepository;
    @Autowired
    private CompanyRepository companyRepository;

    private Company createdCompany;
    private User createdNormalUser;

    @BeforeAll
    public void setupAllTests() {
        userRepository.save(CompanyInfoObjectMother.headAdminUser);

        createdCompany = companyRepository.save(CompanyInfoObjectMother.company);
        createdNormalUser = userRepository.save(CompanyInfoObjectMother.headNormalUser);
        userCompanyRepository.save(new UserCompany(createdNormalUser.getId(), createdCompany.getId()));
    }

    @AfterAll
    public void finishAllTests() {
        userRepository.delete(CompanyInfoObjectMother.headAdminUser);

        userRepository.delete(CompanyInfoObjectMother.headNormalUser);
        userCompanyRepository.deleteById(createdNormalUser.getId());
        companyRepository.deleteById(createdCompany.getId());
    }

    @AfterEach
    public void finishTest() {
        userRepository.deleteByEmail(CompanyInfoObjectMother.createAdminSubAccountEmail);
        userRepository.deleteByEmail(CompanyInfoObjectMother.createNormalSubAccountEmail);
    }

    @Test
    @WithUserDetails(value = CompanyInfoObjectMother.headAdminEmail)
    void givenAdminUser_whenRequestingCompanyInfo_thenGetList() {
        var companies = companyInfoService.getAll();
        assertThat(companies).isInstanceOf(List.class);
    }

    @Test
    @WithUserDetails(value = CompanyInfoObjectMother.headNormalEmail)
    void givenNormalUser_whenRequestingCompanyInfo_thenGetList() {
        var companies = companyInfoService.getAll();
        assertThat(companies).isInstanceOf(List.class);
        assertThat(companies.size()).isEqualTo(1);
        assertThat(companies.get(0).company().getId()).isEqualTo(createdCompany.getId());
    }

    @Test
    @WithUserDetails(value = CompanyInfoObjectMother.headAdminEmail)
    void givenHeadAdminUser_whenCreatingAdminSubAccount_expectAccountWithAdminRole() {
        var createSubAccountDto = new CreateSubAccountDto(null, CompanyInfoObjectMother.createAdminSubAccountEmail, "", "");
        var result = companyInfoService.createSubAccount(createSubAccountDto);
        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.CREATED);

        var user = userRepository.findByEmail(CompanyInfoObjectMother.createAdminSubAccountEmail).orElseThrow();
        assertThat(user.getRole()).isEqualTo(RoleEnum.ROLE_ADMIN);
    }

    @Test
    @WithUserDetails(value = CompanyInfoObjectMother.headAdminEmail)
    void givenHeadAdminUser_whenCreatingNormalSubAccount_expectAccountWithUserRoleInCorrectCompany() {
        var createSubAccountDto = new CreateSubAccountDto(createdCompany.getId(), CompanyInfoObjectMother.createNormalSubAccountEmail, "", "");
        var result = companyInfoService.createSubAccount(createSubAccountDto);
        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.CREATED);

        var user = userRepository.findByEmail(CompanyInfoObjectMother.createNormalSubAccountEmail).orElseThrow();
        assertThat(user.getRole()).isEqualTo(RoleEnum.ROLE_USER);

        var userCompany = userCompanyRepository.findById(user.getId()).orElseThrow();
        assertThat(userCompany.getCompanyId()).isEqualTo(createdCompany.getId());
    }

    @Test
    @WithUserDetails(value = CompanyInfoObjectMother.headNormalEmail)
    void givenHeadNormalUser_whenCreatingNormalSubAccount_expectAccountWithUserRoleInCorrectCompany() {
        var createSubAccountDto = new CreateSubAccountDto(createdCompany.getId(), CompanyInfoObjectMother.createNormalSubAccountEmail, "", "");
        var result = companyInfoService.createSubAccount(createSubAccountDto);
        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.CREATED);

        var user = userRepository.findByEmail(CompanyInfoObjectMother.createNormalSubAccountEmail).orElseThrow();
        assertThat(user.getRole()).isEqualTo(RoleEnum.ROLE_USER);

        var userCompany = userCompanyRepository.findById(user.getId()).orElseThrow();
        assertThat(userCompany.getCompanyId()).isEqualTo(createdCompany.getId());
    }

    @Test
    @WithUserDetails(value = CompanyInfoObjectMother.headNormalEmail)
    void givenUser_whenCreatingDuplicateSubAccount_expectError() {
        var createSubAccountDto = new CreateSubAccountDto(createdCompany.getId(), CompanyInfoObjectMother.headNormalEmail, "", "");
        var result = companyInfoService.createSubAccount(createSubAccountDto);
        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
    }

    @Test
    @WithUserDetails(value = CompanyInfoObjectMother.headNormalEmail)
    void givenHeadNormalUser_whenCreatingNormalSubAccountWithIncorrectCompanyId_expectError() {
        var createSubAccountDto = new CreateSubAccountDto(createdCompany.getId() + 1, CompanyInfoObjectMother.createNormalSubAccountEmail, "", "");
        var result = companyInfoService.createSubAccount(createSubAccountDto);
        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
    }

    @Test
    @WithUserDetails(value = CompanyInfoObjectMother.headNormalEmail)
    void givenHeadNormalUser_whenCreatingNormalSubAccountWithoutCompanyId_expectError() {
        var createSubAccountDto = new CreateSubAccountDto(null, CompanyInfoObjectMother.createNormalSubAccountEmail, "", "");
        var result = companyInfoService.createSubAccount(createSubAccountDto);
        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
    }


    @Test
    @WithUserDetails(value = CompanyInfoObjectMother.headNormalEmail)
    void givenSubaccount_whenDeletingSubaccount_expectEmpty() {
        var createSubAccountDto = new CreateSubAccountDto(createdCompany.getId(), CompanyInfoObjectMother.createNormalSubAccountEmail, "", "");
        var result = companyInfoService.createSubAccount(createSubAccountDto);
        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.CREATED);

        var user = userRepository.findByEmail(CompanyInfoObjectMother.createNormalSubAccountEmail).orElseThrow();

        userRepository.deleteByEmail(user.getEmail());

        var response = userRepository.findByEmail(user.getEmail());
        assertThat(response).isEmpty();
    }
}
