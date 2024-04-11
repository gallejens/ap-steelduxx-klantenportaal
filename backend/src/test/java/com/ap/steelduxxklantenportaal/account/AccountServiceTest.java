package com.ap.steelduxxklantenportaal.account;

import com.ap.steelduxxklantenportaal.services.AccountService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class AccountServiceTest {

    @Autowired
    private AccountService accountService;

    @Test
    void givenNothing_whenRequestingAccounts_thenGetList() {
        var accounts = accountService.getAllAccounts();
        assertThat(accounts).isInstanceOf(List.class);
    }
}
