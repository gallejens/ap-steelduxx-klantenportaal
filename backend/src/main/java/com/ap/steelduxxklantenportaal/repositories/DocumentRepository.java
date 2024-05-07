package com.ap.steelduxxklantenportaal.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ap.steelduxxklantenportaal.models.Document;


public interface DocumentRepository extends JpaRepository<Document, Long> {
    Optional<Document> findByReferenceNumberAndDocumentType(String referenceNumber, String documentType);
}
