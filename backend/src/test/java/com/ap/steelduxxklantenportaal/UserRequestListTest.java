package com.ap.steelduxxklantenportaal;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.ap.steelduxxklantenportaal.dtos.UserRequestDto;
import com.ap.steelduxxklantenportaal.controllers.UserRequestController;

@SpringBootTest
public class UserRequestListTest {

    @Autowired
    private UserRequestController userRequestController;

    @Test
    void contextLoads() {
        assertThat(userRequestController).isNotNull();
    }

    @Test
    public void return_getAll_userRequests() {
        List<UserRequestDto> savedUserRequests = userRequestController.getAllUserRequests();

        System.out.println("Total user requests found: " + savedUserRequests.size());
        assertThat(savedUserRequests.size()).isEqualTo(6); // Check console to see how many items there are in database
                                                           // or manualy check database to be sure of the total amount
                                                           // of items
    }
}
