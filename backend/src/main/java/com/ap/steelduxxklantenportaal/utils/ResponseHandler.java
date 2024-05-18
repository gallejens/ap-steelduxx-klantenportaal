package com.ap.steelduxxklantenportaal.utils;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;

public class ResponseHandler {
    private ResponseHandler() {}

    public static ResponseEntity<Object> generate(String message, HttpStatus status, Object responseObject) {
        var body = new HashMap<String, Object>();
        body.put("message", message);
        body.put("status", status.value());
        body.put("data", responseObject);

        return new ResponseEntity<>(body, status);
    }

    public static ResponseEntity<Object> generate(String message, HttpStatus status) {
        return generate(message, status, null);
    }
}
