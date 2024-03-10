package com.ap.steelduxxklantenportaal;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.ap.steelduxxklantenportaal.DTOs.UserRequestValuesDTO;
import com.ap.steelduxxklantenportaal.controllers.UserRequestController;

@SpringBootTest
public class UserRequestListTest {

    @Autowired
    private UserRequestController userRequestController;

    private List<UserRequestValuesDTO> savedUserRequests;

    @Test
    void contextLoads() throws Exception {
        assertThat(userRequestController).isNotNull();
    }

    @Test
    public void return_GetAll_userRequests() throws Exception {
        savedUserRequests = userRequestController.getAllUserRequests();

        System.out.println("Total user requests found: " + savedUserRequests.size());
        assertThat(savedUserRequests.size()).isEqualTo(6); // Check console to see how many items there are in database
                                                           // or manualy check database to be sure of the total amount
                                                           // of items
    }
}
