package com.ap.steelduxxklantenportaal.services;

import com.ap.steelduxxklantenportaal.dtos.externalapi.OrderDetailsDto;
import com.ap.steelduxxklantenportaal.dtos.externalapi.OrderDocumentUploadDto;
import com.ap.steelduxxklantenportaal.dtos.externalapi.OrderDto;
import com.ap.steelduxxklantenportaal.enums.OrderDocumentType;
import com.ap.steelduxxklantenportaal.enums.OrderStateEnum;
import com.ap.steelduxxklantenportaal.enums.PermissionEnum;
import com.ap.steelduxxklantenportaal.models.Notification;
import com.ap.steelduxxklantenportaal.models.User;
import com.ap.steelduxxklantenportaal.repositories.CompanyRepository;
import com.ap.steelduxxklantenportaal.repositories.UserRepository;
import jakarta.mail.MessagingException;
import lombok.Setter;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.HashMap;

@Service
public class OrdersService {
    private final ExternalApiService externalApiService;
    private final NotificationService notificationService;
    private final EmailService emailService;
    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final UserPreferenceService userPreferenceService;

    @Setter
    private HashMap<String, OrderStateEnum> previousOrderStates;

    public OrdersService(ExternalApiService externalApiService, NotificationService notificationService, UserRepository userRepository, CompanyRepository companyRepository, EmailService emailService, UserPreferenceService userPreferenceService) {
        this.externalApiService = externalApiService;
        this.notificationService = notificationService;
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
        this.emailService = emailService;
        this.userPreferenceService = userPreferenceService;
        this.previousOrderStates = new HashMap<>();
    }

    public OrderDto[] getAllOrders() {
        var user = AuthService.getCurrentUser();
        if (user == null)
            return new OrderDto[0];

        boolean isAdmin = user.hasPermission(PermissionEnum.ADMIN);
        String endpoint = isAdmin ? "/admin/order/all" : "/order/all";

        return externalApiService.doRequest(endpoint, HttpMethod.GET, OrderDto[].class);
    }

    public OrderDto[] getAllOrdersForCheck() {
        String endpoint = "/admin/order/all";
        return externalApiService.doRequest("ADMIN", endpoint, HttpMethod.GET, OrderDto[].class);
    }

    public void checkForOrderStatusChanges(OrderDto[] orders) {
        for (var order : orders) {
            var previousOrderState = previousOrderStates.get(order.referenceNumber());
            previousOrderStates.put(order.referenceNumber(), order.state());
            if (previousOrderState == null || order.state() == previousOrderState) continue;

            var company = companyRepository.findByReferenceCode(order.customerCode()).orElse(null);
            if (company == null) continue;

            var users = userRepository.findAllByCompanyId(company.getId());

            for (var user : users) {
                var userPreferences = userPreferenceService.getPreferences(user.getId());

                String previousStateLabel = previousOrderState.toString().toLowerCase();
                String currentStateLabel = order.state().toString().toLowerCase();

                if (userPreferences.systemNotificationOrderStatus()) {
                    Notification newNotification = new Notification(
                            user.getId(),
                            "Order Status Changed",
                            String.format(
                                    "State of order with customer reference code '%s' has been changed from %s to %s",
                                    order.customerReferenceNumber(),
                                    previousStateLabel,
                                    currentStateLabel
                            ),
                            Timestamp.valueOf(LocalDateTime.now()).getTime(),
                            false
                    );
                    notificationService.createNotification(newNotification);
                }

                if (userPreferences.emailNotificationOrderStatus()) {
                    try {
                        emailService.sendOrderStatusUpdate(user, order.customerReferenceNumber(), previousStateLabel, currentStateLabel);
                    } catch (MessagingException ignored) {
                    }
                }
            }
        }
    }

    public OrderDetailsDto getOrderDetails(String orderId, String customerCode) {
        var user = AuthService.getCurrentUser();
        if (user == null)
            return null;

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

        var byteArray = FileSystemStorageService.convertFileToByteArray(file);
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
}
