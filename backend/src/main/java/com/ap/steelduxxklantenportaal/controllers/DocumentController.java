package com.ap.steelduxxklantenportaal.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ap.steelduxxklantenportaal.services.ExternalApiService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/documents")
public class DocumentController {

    private final ExternalApiService externalApiService;

    public DocumentController(ExternalApiService externalApiService) {
        this.externalApiService = externalApiService;
    }

    @GetMapping("/existence/{referenceNumber}/{documentType}")
    @PreAuthorize("hasAuthority('ACCESS')")
    public ResponseEntity<Boolean> checkDocumentExistence(@PathVariable String referenceNumber,
            @PathVariable String documentType) {
        boolean exists = externalApiService.checkDocumentExistence(referenceNumber, documentType);
        return ResponseEntity.ok(exists);
    }
}
