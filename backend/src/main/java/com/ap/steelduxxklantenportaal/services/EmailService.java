package com.ap.steelduxxklantenportaal.services;
import com.ap.steelduxxklantenportaal.models.UserRequestValue;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    private final TemplateEngine templateEngine;
    @Value("${spring.mail.username}")
    private String mailUsername;

    public EmailService(JavaMailSender mailSender, TemplateEngine templateEngine) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }

    public void sendSimpleEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(mailUsername);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);

        mailSender.send(message);
    }


    public void sendHtmlEmail(String to, String subject, String body) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();

        message.setFrom(new InternetAddress(mailUsername));
        message.setRecipients(MimeMessage.RecipientType.TO, to);
        message.setSubject(subject);

        // Voeg de body toe als een <p> in de HTML-content
        String htmlContent = "<h1>Dit is een test Spring Boot email</h1>" +
                "<p>Nieuwe TestValue: <strong>" + body + "</strong> </p>";

        message.setContent(htmlContent, "text/html; charset=utf-8");

        mailSender.send(message);
    }
    public void sendRegistrationConfirmation(UserRequestValue value) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();

        message.setFrom(new InternetAddress(mailUsername));
        message.setRecipients(MimeMessage.RecipientType.TO, value.getEmail());
        message.setSubject("Registration Confirmation");

        // Create a Thymeleaf context
        Context context = new Context();
        context.setVariable("user", value);

        // Process the Thymeleaf template
        String htmlContent = templateEngine.process("registration-confirmation", context);

        // Set the content of the message as HTML
        message.setContent(htmlContent, "text/html; charset=utf-8");

        // Send the email
        mailSender.send(message);
    }

}
