package com.ap.steelduxxklantenportaal.controllers;

import com.ap.steelduxxklantenportaal.annotations.IsLoggedIn;
import com.ap.steelduxxklantenportaal.models.TestValue;
import com.ap.steelduxxklantenportaal.services.TestValueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class TestValueController {
    @Autowired
    private TestValueService testValueService;

    @GetMapping("/")
    @PreAuthorize("permitAll")
    public List<TestValue> getAll() {
        return testValueService.getAll();
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/add")
    @IsLoggedIn
    public TestValue add(@RequestBody TestValue testValue) {
        return testValueService.add(testValue);
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/{id}")
    @IsLoggedIn
    public void deleteById(@PathVariable Long id) {
        testValueService.deleteById(id);
    }
}
