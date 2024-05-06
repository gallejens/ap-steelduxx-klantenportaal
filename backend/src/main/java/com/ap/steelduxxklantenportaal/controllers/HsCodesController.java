package com.ap.steelduxxklantenportaal.controllers;

import com.ap.steelduxxklantenportaal.services.HsCodesService;
import com.ap.steelduxxklantenportaal.utils.ResponseHandler;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/hs-codes")
public class HsCodesController {
    private final HsCodesService hsCodesService;

    public HsCodesController(HsCodesService hsCodesService) {
        this.hsCodesService = hsCodesService;
    }

    @GetMapping("/{term}")
    @PreAuthorize("hasAuthority('ACCESS')")
    public ResponseEntity<Object> getHsCodeSuggestions(@PathVariable String term) {
        var suggestions = hsCodesService.getSuggestions(term);
        return ResponseHandler.generate("", HttpStatus.OK, suggestions);
    }
}
