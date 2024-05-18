package com.ap.steelduxxklantenportaal.services;

import com.ap.steelduxxklantenportaal.dtos.externalapi.OrderDetailsDto;
import com.ap.steelduxxklantenportaal.dtos.externalapi.OrderDto;
import com.ap.steelduxxklantenportaal.dtos.externalapi.OrderDocumentUploadDto;
import com.ap.steelduxxklantenportaal.enums.OrderDocumentType;
import com.ap.steelduxxklantenportaal.enums.PermissionEnum;
import com.ap.steelduxxklantenportaal.models.User;
import com.ap.steelduxxklantenportaal.utils.ResponseHandler;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class OrdersService {

    private final ExternalApiService externalApiService;

    public OrdersService(ExternalApiService externalApiService) {
        this.externalApiService = externalApiService;
    }

    public OrderDto[] getAllOrders() {
        var user = AuthService.getCurrentUser();
        if (user == null)
            return new OrderDto[0];

        boolean isAdmin = user.hasPermission(PermissionEnum.ADMIN);
        String endpoint = isAdmin ? "/admin/order/all" : "/order/all";

        return externalApiService.doRequest(endpoint, HttpMethod.GET, OrderDto[].class);
    }

    public OrderDetailsDto getOrderDetails(String orderId, String customerCode) {
        var user = AuthService.getCurrentUser();
        if (user == null)
            return null;

        // if user is admin and customercode was provided then use admin endpoint
        boolean isAdmin = user.hasPermission(PermissionEnum.ADMIN);
        String endpoint;
        if (isAdmin && customerCode != null) {
            endpoint = String.format("/admin/order/%s/%s", customerCode, orderId);
        } else {
            endpoint = String.format("/order/%s", orderId);
        }

        return externalApiService.doRequest(endpoint, HttpMethod.GET, OrderDetailsDto.class);
    }

    public ResponseEntity<Object> downloadDocument(String orderId, OrderDocumentType type) {
        var user = AuthService.getCurrentUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }

        String endpoint = String.format("/document/download/%s/%s", orderId, type);
        byte[] data = externalApiService.doRequest(endpoint, HttpMethod.GET, byte[].class);
        String fileName = String.format("%s-%s.pdf", orderId, type);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .body(new ByteArrayResource(data));
    }

    public boolean uploadDocument(String orderId, MultipartFile file, OrderDocumentType type, String customerCode) {
        var user = AuthService.getCurrentUser();
        if (user == null) {
            return false;
        }

        var byteArray = convertFileToByteArray(file);
        if (byteArray == null) {
            return false;
        }

        var orderDocumentUploadDto = new OrderDocumentUploadDto(orderId, type, byteArray);
        String endpoint = determineUploadEndpoint(user, customerCode);
        externalApiService.doRequest(endpoint, HttpMethod.POST, orderDocumentUploadDto, Void.class);

        return true;
    }

    private String determineUploadEndpoint(User user, String customerCode) {
        if (!user.hasPermission(PermissionEnum.ADMIN)) {
            return "/document/upload";
        }

        if (customerCode == null || customerCode.isEmpty()) {
            throw new IllegalArgumentException("Customer code is required for admin upload.");
        }

        return String.format("/admin/upload/%s", customerCode);
    }

    private byte[] convertFileToByteArray(MultipartFile file) {
        try {
            return file.getBytes();
        } catch (IOException e) {
            return null;
        }
    }
}
