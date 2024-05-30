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

    public void sendRegistrationConfirmation(UserRequestDto value) throws MessagingException {
        Context context = new Context();
        context.setVariable("user", value);

        String htmlContent = templateEngine.process("registration-confirmation", context);
        sendHtmlMail(value.email(), "Registration Confirmation", htmlContent);
    }

    void sendChoosePasswordLink(User user, String choosePasswordLink) throws MessagingException {
        Context context = new Context();
        context.setVariable("user", user);
        context.setVariable("link", choosePasswordLink);

        String htmlContent = templateEngine.process("choose-password", context);
        sendHtmlMail(user.getEmail(), "Choose Your Password", htmlContent);
    }

     void sendOrderStatusUpdate(User user, String id, String newStatus) throws MessagingException {
        Context context = new Context();
        context.setVariable("user", user);
        context.setVariable("orderId", id);
        context.setVariable("status", newStatus);

        String htmlContent = templateEngine.process("order-status-update", context);
        sendHtmlMail(user.getEmail(), "Order Status Change", htmlContent);
    }
    void sendOrderRequestStatusUpdate(User user, String id, String newStatus) throws MessagingException {
        Context context = new Context();
        context.setVariable("user", user);
        context.setVariable("orderId", id);
        context.setVariable("status", newStatus);

        String htmlContent = templateEngine.process("order-request-status-update", context);
        sendHtmlMail(user.getEmail(), "Order Request Status Change", htmlContent);
    }

    public void sendHtmlMail(String receiver, String subject, String htmlContent) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        message.setFrom(new InternetAddress(mailUsername));
        message.setRecipients(MimeMessage.RecipientType.TO, receiver);
        message.setSubject(String.format("Steelduxx - %s", subject));
        message.setContent(htmlContent, "text/html; charset=utf-8");
        mailSender.send(message);
    }
}
