package com.ap.steelduxxklantenportaal.services;

import org.springframework.stereotype.Service;

import com.ap.steelduxxklantenportaal.repositories.DocumentRepository;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;

    public DocumentService(DocumentRepository documentRepository) {
        this.documentRepository = documentRepository;
    }

    public boolean checkDocumentExistence(String referenceNumber, String documentType) {
        return documentRepository.findByReferenceNumberAndDocumentType(referenceNumber, documentType).isPresent();
    }
}
