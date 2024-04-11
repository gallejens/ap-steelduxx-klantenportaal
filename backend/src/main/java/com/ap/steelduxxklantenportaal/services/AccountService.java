package com.ap.steelduxxklantenportaal.services;

import com.ap.steelduxxklantenportaal.dtos.Accounts.AccountDto;
import com.ap.steelduxxklantenportaal.repositories.AccountRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AccountService {
    private final AccountRepository accountRepository;

    public AccountService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    public List<AccountDto> getAllAccounts() {
        // TODO: Filter on company but cannot be done because branch not merged yet...
        // var user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        // if (user ...) {
        //      return accountRepository.findAccountsForUserCompany(user.getId());
        //  } else {
        //      return accountRepository.findAllAccounts();
        //  }

        return accountRepository.findAllAccounts();
    }
}
