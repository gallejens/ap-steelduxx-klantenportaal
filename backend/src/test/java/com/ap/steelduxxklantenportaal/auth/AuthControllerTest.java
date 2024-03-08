package com.ap.steelduxxklantenportaal.auth;

import com.ap.steelduxxklantenportaal.controllers.AuthController;
import com.ap.steelduxxklantenportaal.enums.RoleEnum;
import com.ap.steelduxxklantenportaal.exceptions.UserAlreadyExistsException;
import com.ap.steelduxxklantenportaal.models.User;
import com.ap.steelduxxklantenportaal.repositories.ChoosePasswordTokenRepository;
import com.ap.steelduxxklantenportaal.repositories.UserRepository;
import com.ap.steelduxxklantenportaal.services.AuthService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Objects;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.cookie;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthControllerTest {
    @Autowired
    private AuthController authController;
    @Autowired
    private AuthService authService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ChoosePasswordTokenRepository choosePasswordTokenRepository;
    @Autowired
    private MockMvc mockMvc;

    private final String loginJson = "{\"email\":\"test@test.com\",\"password\":\"testuser\" }";

    private User testUser;

    @BeforeEach
    public void setupTest() throws UserAlreadyExistsException {
        testUser = authService.addNewUser("test@test.com", "testuser", "Test", "Test", RoleEnum.ROLE_USER);
    }

    @AfterEach
    public void finishTest() {
        userRepository.deleteById(testUser.getId());
    }

    @Test
    void contextLoads() {
        assertThat(authController).isNotNull();
        assertThat(authService).isNotNull();
        assertThat(userRepository).isNotNull();
        assertThat(choosePasswordTokenRepository).isNotNull();
    }

    @Test
    void should_getStatusUnauthorized_when_wrongLoginInfo() throws Exception {
        String wrongLoginJson = "{\"email\":\"wrong@test.com\",\"password\":\"wrong\" }";
        var resultActions = mockMvc.perform(
                post("/auth/signin")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(wrongLoginJson));
        resultActions.andExpect(status().is(401));
    }

    @Test
    void should_getStatusAcceptedAndCookies_when_correctLoginInfo() throws Exception {
        var resultActions = mockMvc.perform(
                post("/auth/signin")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginJson));
        resultActions.andExpect(status().is(202));
        resultActions.andExpect(cookie().httpOnly(AuthService.ACCESS_TOKEN_COOKIE_NAME, true));
        resultActions.andExpect(cookie().httpOnly(AuthService.REFRESH_TOKEN_COOKIE_NAME, true));
    }

    @Test
    void should_getEmptyCookies_when_signingOut() throws Exception {
        var signinResult = mockMvc.perform(
                        post("/auth/signin")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(loginJson))
                .andReturn();

        var authCookies = signinResult.getResponse().getCookies();

        assertThat(authCookies).isNotNull().isNotEmpty();

        var refreshResult = mockMvc.perform(post("/auth/signout").cookie(authCookies)).andExpect(status().is(200)).andReturn();

        assertThat(
                Objects.requireNonNull(refreshResult.
                                getResponse().
                                getCookie(AuthService.ACCESS_TOKEN_COOKIE_NAME)).
                        getValue())
                .isEqualTo("");
        assertThat(
                Objects.requireNonNull(refreshResult.
                                getResponse().
                                getCookie(AuthService.REFRESH_TOKEN_COOKIE_NAME))
                        .getValue())
                .isEqualTo("");
    }

    @Test
    void should_getNewAccessToken_when_usingRefreshToken() throws Exception {
        var signinResult = mockMvc.perform(
                        post("/auth/signin")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(loginJson))
                .andReturn();

        var authCookies = signinResult.getResponse().getCookies();

        assertThat(authCookies).isNotNull().isNotEmpty();

        var accessToken = signinResult.getResponse().getCookie(AuthService.ACCESS_TOKEN_COOKIE_NAME).getValue();

        var refreshResult = mockMvc.perform(post("/auth/refresh").cookie(authCookies)).andExpect(status().is(200)).andReturn();

        assertThat(accessToken.equals(refreshResult.getResponse().getCookie(AuthService.ACCESS_TOKEN_COOKIE_NAME).getValue())).isFalse();
    }

    @Test
    void givenValidUserEmail_whenRequestingPasswordReset_thenChoosePasswordTokenShouldExist() throws Exception {
        var result = mockMvc.perform(
                post("/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(
                                String.format("{\"email\":\"%s\"}", testUser.getEmail())
                        )
        ).andReturn();

        assertThat(result.getResponse().getStatus()).isEqualTo(200);

        var choosePasswordToken = choosePasswordTokenRepository.findById(testUser.getId());
        assertThat(choosePasswordToken.isPresent()).isTrue();
    }

    @Test
    void givenInvalidUserEmail_whenRequestingPasswordReset_thenChoosePasswordTokenShouldNotBeCreated() throws Exception {
        long amountBefore = choosePasswordTokenRepository.count();

        var result = mockMvc.perform(
                post("/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"invalid@test.com\"}")
        ).andReturn();

        assertThat(result.getResponse().getStatus()).isEqualTo(200);

        long amountAfter = choosePasswordTokenRepository.count();

        assertThat(amountAfter).isEqualTo(amountBefore);
    }

    @Test
    void givenValidChoosePasswordToken_whenGettingChoosePasswordTokenEmail_thenGetCorrectEmail() throws Exception {
        mockMvc.perform(
                post("/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(
                                String.format("{\"email\":\"%s\"}", testUser.getEmail())
                        )
        ).andReturn();

        var choosePasswordToken = choosePasswordTokenRepository.findById(testUser.getId());
        assertThat(choosePasswordToken.isPresent()).isTrue();

        var result = mockMvc.perform(
                get("/auth/choose-password/" + choosePasswordToken.get().getToken())
        ).andReturn();

        assertThat(result.getResponse().getStatus()).isEqualTo(200);
    }

    @Test
    void givenInvalidChoosePasswordToken_whenGettingChoosePasswordTokenEmail_thenGetEmptyResponse() throws Exception {
        var result = mockMvc.perform(
                get("/auth/choose-password/randominvalidtoken")
        ).andReturn();

        assertThat(result.getResponse().getStatus()).isEqualTo(406);
    }

    @Test
    void givenValidChoosePasswordToken_whenChoosingPassword_thenUpdateUserPassword() throws Exception {
        mockMvc.perform(
                post("/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(
                                String.format("{\"email\":\"%s\"}", testUser.getEmail())
                        )
        ).andReturn();

        var choosePasswordToken = choosePasswordTokenRepository.findById(testUser.getId());
        assertThat(choosePasswordToken.isPresent()).isTrue();

        var result = mockMvc.perform(
                post("/auth/choose-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(
                                String.format("{\"password\":\"%s\",\"token\":\"%s\"}",
                                        "newpassword",
                                        choosePasswordToken.get().getToken()
                                )
                        )
        ).andReturn();

        assertThat(result.getResponse().getStatus()).isEqualTo(200);

        var updatedTestUser = userRepository.findById(testUser.getId()).orElseThrow();
        assertThat(updatedTestUser.getPassword().equals(testUser.getPassword())).isFalse();
    }

    @Test
    void givenInvalidChoosePasswordToken_whenChoosingPassword_thenReturnNotAcceptable() throws Exception {
        var result = mockMvc.perform(
                post("/auth/choose-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(
                                String.format("{\"password\":\"%s\",\"token\":\"%s\"}",
                                        "newpassword",
                                        "randominvalidtoken"
                                )
                        )
        ).andReturn();

        assertThat(result.getResponse().getStatus()).isEqualTo(406);
    }
}