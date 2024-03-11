package com.ap.steelduxxklantenportaal.auth;

import com.ap.steelduxxklantenportaal.controllers.AuthController;
import com.ap.steelduxxklantenportaal.enums.RoleEnum;
import com.ap.steelduxxklantenportaal.exceptions.UserAlreadyExistsException;
import com.ap.steelduxxklantenportaal.models.User;
import com.ap.steelduxxklantenportaal.repositories.UserRepository;
import com.ap.steelduxxklantenportaal.services.AuthService;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
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
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class AuthControllerTest {
    @Autowired
    private AuthController authController;
    @Autowired
    private AuthService authService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private MockMvc mockMvc;

    private final String loginJson = "{\"email\":\"testuser\",\"password\":\"testuser\" }";

    private User testUser;

    @BeforeAll
    public void setup() throws UserAlreadyExistsException {
        testUser = authService.addNewUser("testuser", "testuser", "Test", "Test", RoleEnum.ROLE_USER);
    }

    @AfterAll
    public void finish() {
        userRepository.deleteById(testUser.getId());
    }

    @Test
    void contextLoads() {
        assertThat(authController).isNotNull();
    }

    @Test
    void should_getStatusUnauthorized_when_wrongLoginInfo() throws Exception {
        String wrongLoginJson = "{\"email\":\"wrong\",\"password\":\"wrong\" }";
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
    void should_getOkStatus_when_callingPublicEndpoint() throws Exception {
        mockMvc.perform(get("/auth/testpublic")).andExpect(status().is(200));
    }

    @Test
    void should_getUnauthorizedStatus_when_callingPrivateEndpointWhileNotLoggedIn() throws Exception {
        mockMvc.perform(get("/auth/testprivate")).andExpect(status().is(401));
    }

    @Test
    void should_getOkStatus_when_callingPrivateEndpointWhileLoggedIn() throws Exception {
        var result = mockMvc.perform(
                        post("/auth/signin")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(loginJson))
                .andReturn();

        var authCookies = result.getResponse().getCookies();

        assertThat(authCookies).isNotNull().isNotEmpty();

        mockMvc.perform(get("/auth/testprivate").cookie(authCookies)).andExpect(status().is(200));
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
}