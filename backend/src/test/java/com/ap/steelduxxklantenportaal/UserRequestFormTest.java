package com.ap.steelduxxklantenportaal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.ap.steelduxxklantenportaal.enums.StatusEnum;
import com.ap.steelduxxklantenportaal.controllers.UserRequestController;
import com.ap.steelduxxklantenportaal.models.UserRequestValue;
import com.ap.steelduxxklantenportaal.repositories.UserRequestValueRepository;

@SpringBootTest
@AutoConfigureMockMvc
public class UserRequestFormTest {
    @Autowired
    private UserRequestController userRequestController;

    @Autowired
    private UserRequestValueRepository userRequestValueRepository;

    @Autowired
    private MockMvc mockMvc;

    @Test
    void contextLoads() throws Exception {
        assertThat(userRequestController).isNotNull();
    }

    final String jsonRequest = "{"
            + "\"companyName\":\"TestCompanyName\","
            + "\"phoneNr\":\"+32 471 01 78 65\","
            + "\"vatNr\":\"BE0473416418\","
            + "\"postalCode\":2000,"
            + "\"district\":\"TestGemeenten\","
            + "\"street\":\"TestStraat\","
            + "\"streetNr\":\"1\","
            + "\"boxNr\":\"\","
            + "\"firstName\":\"TestFirstName\","
            + "\"lastName\":\"TestLastName\","
            + "\"email\":\"info@test.be\","
            + "\"createdOn\":1709034820358,"
            + "\"status\":\"PENDING\","
            + "\"denyMessage\":\"\""
            + "}";

    private Optional<UserRequestValue> savedUserRequest;

    @BeforeEach
    void setup() {
        savedUserRequest = userRequestValueRepository.findByVatNrAndEmail("BE0473416418", "info@test.be");

        // savedUserRequest.ifPresent(userRequest ->
        // userRequestValueRepository.delete(userRequest));
    }

    @Test
    void returnCreatedStatus_or_OkStatus_when_requestUser_already_exists() throws Exception {

        if (savedUserRequest.isPresent()) {
            assertThat(status().isOk());
        } else {
            mockMvc.perform(
                    post("/user_request")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(jsonRequest))
                    .andExpect(status().isCreated());
        }
    }

    @Test
    void check_if_userRequest_isSaved_in_database() throws Exception {

        mockMvc.perform(
                post("/user_request")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonRequest));

        assertThat(savedUserRequest).isPresent();

        savedUserRequest.ifPresent(userRequest -> {
            assertThat(userRequest.getCompanyName()).isEqualTo("TestCompanyName");
            assertThat(userRequest.getPhoneNr()).isEqualTo("+32 471 01 78 65");
            assertThat(userRequest.getVatNr()).isEqualTo("BE0473416418");
            assertThat(userRequest.getPostalCode()).isEqualTo("2000");
            assertThat(userRequest.getDistrict()).isEqualTo("TestGemeenten");
            assertThat(userRequest.getStreet()).isEqualTo("TestStraat");
            assertThat(userRequest.getStreetNr()).isEqualTo("1");
            assertThat(userRequest.getBoxNr()).isEqualTo("");
            assertThat(userRequest.getFirstName()).isEqualTo("TestFirstName");
            assertThat(userRequest.getLastName()).isEqualTo("TestLastName");
            assertThat(userRequest.getEmail()).isEqualTo("info@test.be");
            assertThat(userRequest.getCreatedOn()).isEqualTo(1709034820358L);
            assertThat(userRequest.getStatus()).isEqualTo(StatusEnum.PENDING);
            assertThat(userRequest.getDenyMessage()).isEqualTo("");
        });
    }
}
