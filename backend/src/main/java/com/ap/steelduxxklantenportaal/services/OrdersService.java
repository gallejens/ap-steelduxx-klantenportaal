package com.ap.steelduxxklantenportaal.services;

import com.ap.steelduxxklantenportaal.dtos.externalapi.OrderDetailsDto;
import com.ap.steelduxxklantenportaal.dtos.externalapi.OrderDto;
import com.ap.steelduxxklantenportaal.dtos.externalapi.OrderDocumentUploadDto;
import com.ap.steelduxxklantenportaal.enums.OrderDocumentType;
import com.ap.steelduxxklantenportaal.dtos.externalapi.OrderStatusDto;
import com.ap.steelduxxklantenportaal.enums.PermissionEnum;
import com.ap.steelduxxklantenportaal.models.CompanyInfoAccount;
import com.ap.steelduxxklantenportaal.models.Notification;
import com.ap.steelduxxklantenportaal.models.User;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;

import com.ap.steelduxxklantenportaal.repositories.CompanyInfoAccountRepository;
import com.ap.steelduxxklantenportaal.repositories.CompanyRepository;
import com.ap.steelduxxklantenportaal.repositories.UserRepository;

import io.jsonwebtoken.io.IOException;

import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class OrdersService {

    private final ExternalApiService externalApiService;
    private final NotificationService notificationService;
    private List<OrderStatusDto> previousOrderStatuses;

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final CompanyInfoAccountRepository companyInfoAccountRepository;
    public OrdersService(ExternalApiService externalApiService, NotificationService notificationService, UserRepository userRepository, CompanyRepository companyRepository, CompanyInfoAccountRepository companyInfoAccountRepository) {
        this.externalApiService = externalApiService;
        this.notificationService = notificationService;
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
        this.companyInfoAccountRepository = companyInfoAccountRepository;
        this.previousOrderStatuses = new ArrayList<>();
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
        return externalApiService.doSystemRequest(endpoint, HttpMethod.GET, OrderDto[].class);
    }

    public List<OrderStatusDto> getAllOrderStatus(OrderDto[] orders){
        List<OrderStatusDto> allOrderStatuses = new ArrayList<>();
        for (OrderDto order : orders) {
            OrderStatusDto orderStatusDto = new OrderStatusDto(order.customerCode(), order.referenceNumber(),order.state());
            allOrderStatuses.add(orderStatusDto);
        }
        return allOrderStatuses;
    }
    public void setPreviousOrderStatuses(List<OrderStatusDto> orders) {
        this.previousOrderStatuses = orders;
    }

    public void checkForOrderStatusChanges(OrderDto[] orders) {
        List<OrderStatusDto> currentOrderStatuses = getAllOrderStatus(orders);
    
        Map<String, OrderStatusDto> previousOrderStatusMap = previousOrderStatuses.stream()
            .collect(Collectors.toMap(OrderStatusDto::referenceNumber, Function.identity()));
    
        for (OrderStatusDto currentOrderStatus : currentOrderStatuses) {
            OrderStatusDto previousOrderStatus = previousOrderStatusMap.get(currentOrderStatus.referenceNumber());
    
            if (previousOrderStatus != null && currentOrderStatus.state() != previousOrderStatus.state()) {
                if (currentOrderStatus.customerCode() != null) {
                    companyRepository.findByReferenceCode(currentOrderStatus.customerCode()).ifPresent(company -> {
                        List<CompanyInfoAccount> accounts = companyInfoAccountRepository.findAllByCompanyId(company.getId());
                        accounts.forEach(account -> {
                            userRepository.findByEmail(account.getEmail()).ifPresent(user -> {
                                Notification newNotification = new Notification(
                                    user.getId(),
                                    null, "Status change for order: " + currentOrderStatus.referenceNumber(),
                                    "Changed from: " + previousOrderStatus.state() + " to " + currentOrderStatus.state(),
                                    Timestamp.valueOf(LocalDateTime.now()).getTime(), false
                                );
                                notificationService.createNotification(newNotification);
                                System.out.println(newNotification + " for: " + user.getEmail());
                            });
                        });
                    });
                }
                System.out.println(currentOrderStatus.referenceNumber() + " status is veranderd van: " + previousOrderStatus.state() + " naar: " + currentOrderStatus.state());
            }
        }
    
        setPreviousOrderStatuses(currentOrderStatuses);
    }
    
    

    public OrderDetailsDto getOrderDetails(long orderId, String customerCode) {
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

    public boolean uploadDocument(String orderId, MultipartFile file, OrderDocumentType type, String customerCode) throws java.io.IOException {
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

    private byte[] convertFileToByteArray(MultipartFile file) throws java.io.IOException {
        try {
            return file.getBytes();
        } catch (IOException e) {
            return null;
        }
    }
}
