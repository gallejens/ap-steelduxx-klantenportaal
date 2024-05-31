package com.ap.steelduxxklantenportaal;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import com.ap.steelduxxklantenportaal.services.EmailService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

@ExtendWith(MockitoExtension.class)
class EmailServiceTest {

    @Mock
    private JavaMailSender mailSender;

    @InjectMocks
    private EmailService emailService;

    @Test
    void testSendSimpleEmail() {
        // Mock data
        String to = "test@example.com";
        String subject = "Test Subject";
        String body = "Test Body";

        // Test the method
        emailService.sendSimpleEmail(to, subject, body);

        // Verify that the mailSender's send method was called with the correct arguments
        verify(mailSender).send(any(SimpleMailMessage.class));
    }
}
