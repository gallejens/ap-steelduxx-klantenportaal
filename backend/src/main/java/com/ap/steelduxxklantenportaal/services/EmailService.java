package com.ap.steelduxxklantenportaal.services;

import com.ap.steelduxxklantenportaal.dtos.UserRequestDto;
import com.ap.steelduxxklantenportaal.models.User;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
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

    private final String MESSAGE_CONTENT_TYPE = "text/html; charset=utf-8";

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

        message.setContent(htmlContent, "");

        mailSender.send(message);
    }

    public void sendRegistrationConfirmation(UserRequestDto value) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();

        message.setFrom(new InternetAddress(mailUsername));
        message.setRecipients(MimeMessage.RecipientType.TO, value.email());
        message.setSubject("Registration Confirmation");

        // Create a Thymeleaf context
        Context context = new Context();
        context.setVariable("user", value);

        // Process the Thymeleaf template
        String htmlContent = templateEngine.process("registration-confirmation", context);

        // Set the content of the message as HTML
        message.setContent(htmlContent, MESSAGE_CONTENT_TYPE);

        // Send the email
        mailSender.send(message);
    }

    void sendChoosePasswordLink(User user, String choosePasswordLink) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();

        message.setFrom(new InternetAddress(mailUsername));
        message.setRecipients(MimeMessage.RecipientType.TO, user.getEmail());
        message.setSubject("Steelduxx - Choose your password");

        Context context = new Context();
        context.setVariable("user", user);
        context.setVariable("link", choosePasswordLink);

        String htmlContent = templateEngine.process("choose-password", context);
        message.setContent(htmlContent, MESSAGE_CONTENT_TYPE);

        mailSender.send(message);
    }
}
