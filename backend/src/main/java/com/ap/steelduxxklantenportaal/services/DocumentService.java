package com.ap.steelduxxklantenportaal.services;

import org.springframework.stereotype.Service;

@Service
public class DocumentService {

    private final ExternalApiService externalApiService;

    public DocumentService(ExternalApiService externalApiService) {
        this.externalApiService = externalApiService;
    }

    public boolean checkDocumentExistence(String referenceNumber, String documentType) {
        return externalApiService.checkDocumentExistence(referenceNumber, documentType);
    }
}
