package com.ap.steelduxxklantenportaal;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import com.ap.steelduxxklantenportaal.models.UserRequestValue;
import com.ap.steelduxxklantenportaal.services.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@ExtendWith(MockitoExtension.class)
public class EmailServiceTest {

    @Mock
    private JavaMailSender mailSender;

    @Mock
    private TemplateEngine templateEngine;

    @InjectMocks
    private EmailService emailService;

    @Test
    public void testSendSimpleEmail() {
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
