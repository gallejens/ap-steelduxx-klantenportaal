package com.ap.steelduxxklantenportaal.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ap.steelduxxklantenportaal.services.DocumentService;

import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/documents")
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @GetMapping("/existence/{referenceNumber}/{documentType}")
    public ResponseEntity<Boolean> checkDocumentExistence(@PathVariable String referenceNumber,
            @PathVariable String documentType) {
        boolean exists = documentService.checkDocumentExistence(referenceNumber, documentType);
        return ResponseEntity.ok(exists);
    }
}
