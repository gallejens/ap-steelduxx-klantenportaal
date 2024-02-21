package com.ap.steelduxxklantenportaal.services;

import com.ap.steelduxxklantenportaal.models.TestValue;
import com.ap.steelduxxklantenportaal.repositories.TestValueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TestValueService {
    @Autowired
    TestValueRepository testValueRepository;

    public List<TestValue> getAll() {
        return testValueRepository.findAll();
    }

    public TestValue add(TestValue testValue) {
        return testValueRepository.save(testValue);
    }

    public void deleteById(Long id) {
        testValueRepository.deleteById(id);
    }
}
