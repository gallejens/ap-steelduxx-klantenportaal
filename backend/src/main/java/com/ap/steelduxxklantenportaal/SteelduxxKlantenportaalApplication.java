package com.ap.steelduxxklantenportaal;

import com.ap.steelduxxklantenportaal.enums.RoleEnum;
import com.ap.steelduxxklantenportaal.models.User;
import com.ap.steelduxxklantenportaal.repositories.UserRepository;
import com.ap.steelduxxklantenportaal.services.AuthService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class SteelduxxKlantenportaalApplication {

	@Value("${admin_email}")
	private String adminEmail;
	@Value("${admin_password}")
	private String adminPassword;


	public static void main(String[] args) {
		SpringApplication.run(SteelduxxKlantenportaalApplication.class, args);
	}

	@Bean
	public CommandLineRunner run(AuthService authService) {
		return args -> {
			if (adminEmail == null || adminPassword == null) {
				throw new IllegalStateException("Admin credentials could not be found in properties file");
			}

			if (authService.doesUserExist(adminEmail)) return;

			authService.addNewUser(adminEmail, adminPassword, "Admin", "Admin", RoleEnum.ROLE_ADMIN);

		};
	}
}

