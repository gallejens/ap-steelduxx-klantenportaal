package com.ap.steelduxxklantenportaal;

import com.ap.steelduxxklantenportaal.enums.RoleEnum;
import com.ap.steelduxxklantenportaal.models.User;
import com.ap.steelduxxklantenportaal.repositories.UserRepository;
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
	public CommandLineRunner run(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			if (adminEmail == null || adminPassword == null) {
				throw new IllegalStateException("Admin credentials could not be found in properties file");
			}

			if (userRepository.findByEmail(adminEmail).isPresent()) return;

			String encodedPassword = passwordEncoder.encode(adminPassword);

			User adminUser = new User(adminEmail, encodedPassword, "Admin", "Admin", RoleEnum.ROLE_HEAD_ADMIN);
			userRepository.save(adminUser);
		};
	}
}

