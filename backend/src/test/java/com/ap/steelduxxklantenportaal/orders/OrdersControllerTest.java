package com.ap.steelduxxklantenportaal.orders;

import com.ap.steelduxxklantenportaal.controllers.OrdersController;
import com.ap.steelduxxklantenportaal.enums.RoleEnum;
import com.ap.steelduxxklantenportaal.models.User;
import com.ap.steelduxxklantenportaal.services.ExternalApiService;
import com.ap.steelduxxklantenportaal.services.OrdersService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class OrdersControllerTest {

    private MockMvc mockMvc;

    @Mock
    private OrdersService ordersService;

    @Mock
    private ExternalApiService externalApiService;

    @InjectMocks
    private OrdersController ordersController;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(ordersController).build();
    }

    private void setupSecurityContext(User user) {
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                user, null, user.getAuthorities());
        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        securityContext.setAuthentication(authentication);
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    @WithMockUser(roles = "HEAD_ADMIN")
    public void testDownloadDocumentAsHeadAdmin() throws Exception {
        User user = new User("headadmin@example.com", "password", "Head", "Admin", RoleEnum.ROLE_HEAD_ADMIN);
        setupSecurityContext(user);

        String endpoint = "http://example.com/document.pdf";
        byte[] mockData = "PDF Data".getBytes();
        when(externalApiService.downloadDocument(anyString())).thenReturn(mockData);

        mockMvc.perform(get("/orders/download-document")
                .param("endpoint", endpoint))
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_OCTET_STREAM))
                .andExpect(MockMvcResultMatchers.header().string("Content-Disposition",
                        "attachment; filename=\"document.pdf\""));
    }

    @Test
    @WithMockUser(roles = "USER")
    public void testDownloadDocumentUnauthorizedForUserRole() throws Exception {
        User user = new User("user@example.com", "password", "John", "Doe", RoleEnum.ROLE_USER);
        setupSecurityContext(user);

        mockMvc.perform(get("/orders/download-document")
                .param("endpoint", "http://example.com/document.pdf"))
                .andExpect(status().isForbidden());
    }
}
