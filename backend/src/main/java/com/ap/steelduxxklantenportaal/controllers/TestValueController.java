package com.ap.steelduxxklantenportaal.controllers;

import com.ap.steelduxxklantenportaal.models.TestValue;
import com.ap.steelduxxklantenportaal.services.EmailService;
import com.ap.steelduxxklantenportaal.services.TestValueService;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class TestValueController {
    @Autowired
    private TestValueService testValueService;

    @Autowired
    private EmailService emailService;

    @GetMapping("/")
    public List<TestValue> getAll() {
        return testValueService.getAll();
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/add")
    public TestValue add(@RequestBody TestValue testValue) throws MessagingException {
        //emailService.sendSimpleEmail("bayramcapa85@gmail.com", "Nieuwe TestValue Toegevoegd", "Nieuwe TestValue:\n " + testValue.getValue());
        emailService.sendHtmlEmail("bayramcapa85@gmail.com", "Nieuwe TestValue Toegevoegd", testValue.getValue());
        return testValueService.add(testValue);
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable Long id) {
        testValueService.deleteById(id);
    }
}
