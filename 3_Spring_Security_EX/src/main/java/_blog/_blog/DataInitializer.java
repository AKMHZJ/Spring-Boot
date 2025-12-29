package _blog._blog;

import _blog._blog.entity.User;
import _blog._blog.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {
    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository, 
                                   PasswordEncoder passwordEncoder) {
        return args -> {
            // Create admin if doesn't exist
            if (!userRepository.existsByUsername("admin")) {
                User admin = new User("admin", 
                    passwordEncoder.encode("admin123"), 
                    "admin@example.com");
                admin.setRole("ADMIN");
                userRepository.save(admin);
                System.out.println("Admin user created!");
            }
        };
    }
}
