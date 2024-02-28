package com.ap.steelduxxklantenportaal;

import com.ap.steelduxxklantenportaal.enums.RoleEnum;
import com.ap.steelduxxklantenportaal.models.User;
import com.ap.steelduxxklantenportaal.repositories.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class SteelduxxKlantenportaalApplication {
	public static void main(String[] args) {
		SpringApplication.run(SteelduxxKlantenportaalApplication.class, args);
	}

	@Bean
	public CommandLineRunner run(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			String adminMail = "admin";
			if (userRepository.findByEmail(adminMail).isPresent()) return;

			// TODO: Replace with env variable
			String adminPassword = passwordEncoder.encode("steelduxx");

			User adminUser = new User(adminMail, adminPassword, "Admin", "Admin", RoleEnum.HEAD_ADMIN);
			userRepository.save(adminUser);
		};
	}
}

