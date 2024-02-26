package com.ap.steelduxxklantenportaal.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ap.steelduxxklantenportaal.DTOs.UserRequestValuesDTO;
import com.ap.steelduxxklantenportaal.enums.StatusEnum;
import com.ap.steelduxxklantenportaal.models.UserRequestValue;

import com.ap.steelduxxklantenportaal.repositories.UserRequestValueRepository;

@Service
public class UserRequestValueService {
    @Autowired
    UserRequestValueRepository userRequestValueRepository;

    public List<UserRequestValue> getAll() {
        return userRequestValueRepository.findAll();
    }

    public UserRequestValue add(UserRequestValuesDTO userRequestValuesDTO) {
        UserRequestValue userRequestValues = new UserRequestValue(
                userRequestValuesDTO.getCompanyName(),
                userRequestValuesDTO.getEmail(),
                userRequestValuesDTO.getPhoneNr(),
                userRequestValuesDTO.getVatNr(),
                userRequestValuesDTO.getPostalCode(),
                userRequestValuesDTO.getDistrict(),
                userRequestValuesDTO.getStreet(),
                userRequestValuesDTO.getStreetNr(),
                userRequestValuesDTO.getBoxNr(),
                userRequestValuesDTO.getFirstName(),
                userRequestValuesDTO.getLastName(),
                userRequestValuesDTO.getCreatedOn(),
                StatusEnum.PENDING,
                "");

        return userRequestValueRepository.save(userRequestValues);
    }

    public void deleteById(Long id) {
        userRequestValueRepository.deleteById(id);
    }
}
