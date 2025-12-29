package _blog._blog.controller;

import _blog._blog.entity.User;
import _blog._blog.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        
        // Check if username exists
        if (userRepository.existsByUsername(user.getUsername())) {
            return ResponseEntity.badRequest()
                .body("Username already taken!");
        }
        
        // Check if email exists
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest()
                .body("Email already registered!");
        }
        
        // Encrypt password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("USER"); // Default role
        
        userRepository.save(user);
        
        return ResponseEntity.ok("User registered successfully!");
    }
    
    @GetMapping("/public")
    public String publicEndpoint() {
        return "This is public - no login needed!";
    }
}
