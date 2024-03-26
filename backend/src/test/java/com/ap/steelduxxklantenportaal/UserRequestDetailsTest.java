package com.ap.steelduxxklantenportaal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.ap.steelduxxklantenportaal.controllers.UserRequestController;
import com.ap.steelduxxklantenportaal.dtos.UserRequestDto;
import com.ap.steelduxxklantenportaal.enums.StatusEnum;

@SpringBootTest
public class UserRequestDetailsTest {

    @Autowired
    private UserRequestController userRequestController;

    @Autowired
    private MockMvc mockMvc;

    final String jsonRequest = "{"
            + "\"companyName\":\"TestCompanyName\","
            + "\"country\":\"TestCountry\","
            + "\"phoneNr\":\"+32 471 01 78 65\","
            + "\"vatNr\":\"BE0473416418\","
            + "\"postalCode\":2000,"
            + "\"district\":\"TestGemeenten\","
            + "\"street\":\"TestStraat\","
            + "\"streetNr\":\"1\","
            + "\"boxNr\":\"\","
            + "\"extraInfo\":\","
            + "\"firstName\":\"TestFirstName\","
            + "\"lastName\":\"TestLastName\","
            + "\"email\":\"info@test.be\","
            + "\"createdOn\":1709034820358,"
            + "\"status\":\"PENDING\","
            + "\"denyMessage\":\"\""
            + "}";

    @Test
    void contextLoads() {
        assertThat(userRequestController).isNotNull();
    }

    @Test
    public void check_values_of_selected_userRequest() throws Exception {
        mockMvc.perform(
                post("/user_request")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonRequest))
                .andExpect(status().isCreated());

        UserRequestDto userRequest = userRequestController.getUserRequestById("1");

        assertThat(userRequest.followId()).isEqualTo("1");
        assertThat(userRequest.companyName()).isEqualTo("TestCompanyName");
        assertThat(userRequest.country()).isEqualTo("TestCountry");
        assertThat(userRequest.phoneNr()).isEqualTo("+32 471 01 78 65");
        assertThat(userRequest.vatNr()).isEqualTo("BE0473416418");
        assertThat(userRequest.postalCode()).isEqualTo("2000");
        assertThat(userRequest.district()).isEqualTo("TestGemeenten");
        assertThat(userRequest.street()).isEqualTo("TestStraat");
        assertThat(userRequest.streetNr()).isEqualTo("1");
        assertThat(userRequest.boxNr()).isEqualTo("");
        assertThat(userRequest.extraInfo()).isEqualTo("");
        assertThat(userRequest.firstName()).isEqualTo("TestFirstName");
        assertThat(userRequest.lastName()).isEqualTo("TestLastName");
        assertThat(userRequest.email()).isEqualTo("info@test.be");
        assertThat(userRequest.createdOn()).isEqualTo(1709034820358L);
        assertThat(userRequest.status()).isEqualTo(StatusEnum.PENDING);
        assertThat(userRequest.denyMessage()).isEqualTo("");
    }

}
