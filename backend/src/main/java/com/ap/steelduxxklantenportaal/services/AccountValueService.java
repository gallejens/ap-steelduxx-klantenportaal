package com.ap.steelduxxklantenportaal.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ap.steelduxxklantenportaal.DTOs.AccountValuesDTO;
import com.ap.steelduxxklantenportaal.models.AccountValue;

import com.ap.steelduxxklantenportaal.repositories.AccountValueRepository;

@Service
public class AccountValueService {
    @Autowired
    AccountValueRepository accountValueRepository;

    public List<AccountValue> getAll() {
        return accountValueRepository.findAll();
    }

    public AccountValue add(AccountValuesDTO accountValuesDTO) {
        AccountValue accountValues = new AccountValue(
                accountValuesDTO.getCompanyName(),
                accountValuesDTO.getEmail(),
                accountValuesDTO.getPhoneNr(),
                accountValuesDTO.getVatNr(),
                accountValuesDTO.getPostalCode(),
                accountValuesDTO.getDistrict(),
                accountValuesDTO.getStreet(),
                accountValuesDTO.getStreetNr(),
                accountValuesDTO.getBoxNr(),
                accountValuesDTO.getFirstName(),
                accountValuesDTO.getLastName());

        return accountValueRepository.save(accountValues);
    }

    public void deleteById(Long id) {
        accountValueRepository.deleteById(id);
    }
}
