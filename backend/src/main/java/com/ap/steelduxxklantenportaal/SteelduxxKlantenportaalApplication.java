package com.ap.steelduxxklantenportaal;

import com.ap.steelduxxklantenportaal.enums.RoleEnum;
import com.ap.steelduxxklantenportaal.services.AuthService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class SteelduxxKlantenportaalApplication {

	@Value("${admin_account.email}")
	private String adminAccountEmail;
	@Value("${admin_account.password}")
	private String adminAccountPassword;
	@Value("${admin_account.first_name}")
	private String adminAccountFirstName;
	@Value("${admin_account.last_name}")
	private String adminAccountLastName;

	public static void main(String[] args) {
		SpringApplication.run(SteelduxxKlantenportaalApplication.class, args);
	}

	@Bean
	public CommandLineRunner run(AuthService authService) {
		return args -> {
			if (authService.doesUserExist(adminAccountEmail)) return;

			authService.addNewUser(adminAccountEmail, adminAccountPassword, adminAccountFirstName, adminAccountLastName, RoleEnum.ROLE_HEAD_ADMIN);

		};
	}
}

