package com.ap.steelduxxklantenportaal.orders;

import com.ap.steelduxxklantenportaal.controllers.OrdersController;
import com.ap.steelduxxklantenportaal.enums.OrderDocumentType;
import com.ap.steelduxxklantenportaal.models.User;
import com.ap.steelduxxklantenportaal.services.OrdersService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Collections;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;

class OrdersControllerTest {

    private MockMvc mockMvc;

    @Mock
    private OrdersService ordersService;

    @InjectMocks
    private OrdersController ordersController;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(ordersController).build();
    }

    void setupSecurityContext(User user) {
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                user, null, Collections.singletonList(new SimpleGrantedAuthority("ROLE_HEAD_ADMIN")));
        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        securityContext.setAuthentication(authentication);
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    @WithMockUser(username = "headadmin@example.com", roles = "HEAD_ADMIN")
    void testDownloadDocumentAsHeadAdmin() throws Exception {
        User user = new User();
        user.setEmail("headadmin@example.com");
        setupSecurityContext(user);

        String referenceNumber = "123456";
        OrderDocumentType documentType = OrderDocumentType.bl;
        byte[] mockData = "PDF Data".getBytes();
        when(ordersService.downloadDocument(referenceNumber, documentType))
                .thenReturn(ResponseEntity.ok().body(mockData));

        mockMvc.perform(
                get("/orders/document/download/{referenceNumber}/{documentType}", referenceNumber, documentType))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_OCTET_STREAM));
    }

    @Test
    @WithMockUser(username = "user", authorities = { "ACCESS" })
    void testUploadDocument_FailInvalidInput() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "", MediaType.APPLICATION_PDF_VALUE, new byte[0]);

        mockMvc.perform(multipart("/orders/document/upload")
                .file(file)
                .param("referenceNumber", "")
                .param("documentType", "")
                .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "user", authorities = { "ACCESS" })
    void testUploadDocument_FailException() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "test.pdf", MediaType.APPLICATION_PDF_VALUE,
                "PDF content".getBytes());

        mockMvc.perform(multipart("/orders/document/upload")
                .file(file)
                .param("referenceNumber", "12345")
                .param("documentType", "invoice")
                .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isInternalServerError());
    }
}
