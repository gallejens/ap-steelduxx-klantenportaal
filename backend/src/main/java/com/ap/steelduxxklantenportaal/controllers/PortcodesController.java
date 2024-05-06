package com.ap.steelduxxklantenportaal.controllers;

import com.ap.steelduxxklantenportaal.services.PortcodesService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.IOException;

@Controller
@RequestMapping("/portcodes")
public class PortcodesController {

    private final PortcodesService portcodesService;

    public PortcodesController(PortcodesService portcodesService) {
        this.portcodesService = portcodesService;
    }

    @GetMapping(value = "/")
    public ResponseEntity<String> getAllPortcodes() throws IOException {
        return ResponseEntity.ok(portcodesService.getAllPortcodes());
    }
}
