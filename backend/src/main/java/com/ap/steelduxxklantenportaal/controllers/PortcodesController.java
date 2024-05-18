package com.ap.steelduxxklantenportaal.controllers;

import com.ap.steelduxxklantenportaal.services.PortcodesService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/portcodes")
public class PortcodesController {

    private final PortcodesService portcodesService;

    public PortcodesController(PortcodesService portcodesService) {
        this.portcodesService = portcodesService;
    }

    @GetMapping(value = "/")
    @PreAuthorize("hasAuthority('ACCESS')")
    public ResponseEntity<String> getAllPortcodes() {
        var portcodes = portcodesService.getAllPortcodes();
        return ResponseEntity.ok(portcodes);
    }
}
