package com.ap.steelduxxklantenportaal.services;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileSystemStorageService {
    private final Path rootLocation;

    public FileSystemStorageService() {
        rootLocation = Paths.get("order-request-files");
    }

    public String store(MultipartFile file) {
        if (file.isEmpty()) return null;

        String fileName = UUID.randomUUID().toString();
        Path destinationFile = rootLocation.resolve(Paths.get(fileName)).normalize().toAbsolutePath();

        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            return null;
        }

        return fileName;
    }

    public Resource load(String fileName) {
        try {
            Path file = rootLocation.resolve(fileName);
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() || resource.isReadable()) {
                return resource;
            }
        } catch (MalformedURLException e) {
            //
        }
        return null;
    }

    public void init() {
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            System.out.println("Could not initialize storage");
        }
    }

    public static byte[] convertFileToByteArray(MultipartFile file) {
        try {
            return file.getBytes();
        } catch (IOException e) {
            return null;
        }
    }

    public static byte[] convertFileToByteArray(Resource resource) {
        try {
            return resource.getContentAsByteArray();
        } catch (IOException e) {
            return null;
        }
    }
}
