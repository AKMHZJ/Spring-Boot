import React, { useState } from 'react';
import { Shield, Code, CheckCircle, Lock } from 'lucide-react';

export default function SpringSecurityTutorial() {
  const [activeSection, setActiveSection] = useState(0);
  // const [completedSections, setCompletedSections] = useState(new Set());
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());

  const sections = [
    {
      title: "1. What is Spring Security?",
      description: "Protect your APIs",
      content: `Spring Security protects your application from unauthorized access.

Key Concepts:
• Authentication - WHO you are (login)
• Authorization - WHAT you can do (permissions/roles)
• Password Encryption - Store passwords safely
• JWT Tokens - Stay logged in across requests

Without Security:
❌ Anyone can access your APIs
❌ No user login
❌ No admin vs regular user

With Security:
✅ Login required
✅ Passwords encrypted
✅ Role-based access (USER, ADMIN)`,
      code: `// Before Security:
@GetMapping("/api/posts")
public List<Post> getPosts() {
    return posts; // Anyone can access!
}

// After Security:
@GetMapping("/api/posts")
public List<Post> getPosts() {
    return posts; // Only logged-in users can access!
}

@GetMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public List<User> getUsers() {
    return users; // Only admins can access!
}`
    },
    {
      title: "2. Add Security Dependency",
      description: "Update pom.xml",
      content: `Add Spring Security to your existing project.
This single dependency gives you authentication, encryption, and more!`,
      code: `<!-- Add to pom.xml -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>

<!-- After adding, reload Maven -->

⚠️ IMPORTANT: As soon as you add this dependency and restart:
- ALL your endpoints become protected!
- Default username: user
- Default password: Check console logs (randomly generated)
- You'll see: "Using generated security password: xxxxxxxx"`
    },
    {
      title: "3. Create User Entity",
      description: "Store users in database",
      content: `Create a User entity to store usernames, passwords, and roles.
Passwords will be encrypted (not plain text)!`,
      code: `package com.blog.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String username;
    
    @Column(nullable = false)
    private String password; // Will be encrypted!
    
    @Column(nullable = false)
    private String email;
    
    private String role = "USER"; // USER or ADMIN
    
    private boolean enabled = true;
    
    // Constructors
    public User() {}
    
    public User(String username, String password, String email) {
        this.username = username;
        this.password = password;
        this.email = email;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    
    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }
}`
    },
    {
      title: "4. Create User Repository",
      description: "Find users by username",
      content: `Simple repository to find users for login.`,
      code: `package com.blog.repository;

import com.blog.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByUsername(String username);
    
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
}`
    },
    {
      title: "5. Create UserDetailsService",
      description: "Tell Spring how to load users",
      content: `This service tells Spring Security how to find and authenticate users.`,
      code: `package com.blog.service;

import com.blog.entity.User;
import com.blog.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Override
    public UserDetails loadUserByUsername(String username) 
            throws UsernameNotFoundException {
        
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> 
                new UsernameNotFoundException("User not found: " + username));
        
        return new org.springframework.security.core.userdetails.User(
            user.getUsername(),
            user.getPassword(),
            user.isEnabled(),
            true, true, true,
            Collections.singletonList(
                new SimpleGrantedAuthority("ROLE_" + user.getRole())
            )
        );
    }
}`
    },
    {
      title: "6. Configure Security",
      description: "Set up authentication rules",
      content: `This is the heart of Spring Security configuration.
Define which endpoints are public, which need login, and which need admin.`,
      code: `package com.blog.config;

import com.blog.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    
    @Autowired
    private CustomUserDetailsService userDetailsService;
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Disable CSRF for API testing
            .authorizeHttpRequests(auth -> auth
                // Public endpoints - no login needed
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/h2-console/**").permitAll()
                
                // Admin only endpoints
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                
                // All other endpoints need authentication
                .anyRequest().authenticated()
            )
            .httpBasic(basic -> {}); // Enable basic auth for testing
        
        // Allow H2 console to work
        http.headers(headers -> headers.frameOptions(frame -> frame.disable()));
        
        return http.build();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}`
    },
    {
      title: "7. Create Auth Controller",
      description: "Registration and login endpoints",
      content: `Public endpoints for user registration.
Passwords are automatically encrypted before saving!`,
      code: `package com.blog.controller;

import com.blog.entity.User;
import com.blog.repository.UserRepository;
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
}`
    },
    {
      title: "8. Create Protected Endpoints",
      description: "APIs that require authentication",
      content: `Create some protected endpoints to test authentication.`,
      code: `package com.blog.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class PostController {
    
    // Requires login
    @GetMapping("/posts")
    public String getPosts(Authentication auth) {
        return "Hello " + auth.getName() + "! Here are your posts.";
    }
    
    // Requires login
    @PostMapping("/posts")
    public String createPost(Authentication auth) {
        return "Post created by: " + auth.getName();
    }
    
    // Admin only
    @GetMapping("/admin/users")
    @PreAuthorize("hasRole('ADMIN')")
    public String getAllUsers() {
        return "Admin access: Here are all users";
    }
    
    // Admin only
    @DeleteMapping("/admin/posts/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public String deletePost(@PathVariable Long id) {
        return "Admin deleted post: " + id;
    }
}`
    },
    {
      title: "9. Test Your Secured API",
      description: "Try authentication",
      content: `Now test your secured endpoints!`,
      code: `# 1. Try public endpoint (no auth needed)
curl http://localhost:8080/api/auth/public

# 2. Register a new user
curl -X POST http://localhost:8080/api/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "username": "ahmed",
    "password": "password123",
    "email": "ahmed@example.com"
  }'

# 3. Try protected endpoint WITHOUT auth (will fail - 401)
curl http://localhost:8080/api/posts

# 4. Access WITH authentication (success!)
curl -u ahmed:password123 http://localhost:8080/api/posts

# 5. Create post (authenticated)
curl -u ahmed:password123 -X POST http://localhost:8080/api/posts

# 6. Try admin endpoint (will fail - ahmed is not admin)
curl -u ahmed:password123 http://localhost:8080/api/admin/users

# 7. Register an admin (in real app, admins created differently)
# For testing, manually set role to ADMIN in H2 console

# 8. Test with admin user
curl -u adminuser:password http://localhost:8080/api/admin/users`
    },
    {
      title: "10. Create Admin User",
      description: "Set up an admin for testing",
      content: `Create an admin user to test role-based access.`,
      code: `// Option 1: Add CommandLineRunner to create admin on startup
package com.blog;

import com.blog.entity.User;
import com.blog.repository.UserRepository;
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

// Now you have:
// Username: admin
// Password: admin123
// Role: ADMIN

// Test admin access:
// curl -u admin:admin123 http://localhost:8080/api/admin/users`
    },
    {
      title: "11. View Users in Database",
      description: "Check encrypted passwords",
      content: `See your users in the H2 console.
Notice passwords are encrypted!`,
      code: `# 1. Go to H2 Console
http://localhost:8080/h2-console

# 2. Login:
JDBC URL: jdbc:h2:mem:testdb
Username: sa
Password: (empty)

# 3. Run query:
SELECT * FROM USERS;

# You'll see:
# - Usernames in plain text
# - Passwords ENCRYPTED (bcrypt hash)
# - Roles (USER or ADMIN)

# Example encrypted password looks like:
# $2a$10$xabcdef123456789...
# (60+ characters long)

# This means even if database is stolen,
# hackers can't see actual passwords!`
    }
  ];

  const handleComplete = (index: number) => {
    setCompletedSections((prev: Set<number>) => new Set([...prev, index]));
    if (index < sections.length - 1) {
      setActiveSection(index + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-red-600" />
            <h1 className="text-3xl font-bold text-gray-800">Spring Security Tutorial</h1>
          </div>
          <p className="text-gray-600 mb-2">Secure your APIs with authentication and authorization</p>
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-sm text-red-800">
              <strong>You completed:</strong> ✅ Spring MVC, ✅ Spring Data JPA<br/>
              <strong>Now learning:</strong> 🔴 Spring Security<br/>
              <strong>Next up:</strong> Jakarta API (advanced concepts)
            </p>
          </div>
          <div className="mt-4 flex gap-2">
            {sections.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 flex-1 rounded ${
                  completedSections.has(idx)
                    ? 'bg-green-500'
                    : idx === activeSection
                    ? 'bg-red-500'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4 sticky top-6">
              <h2 className="font-semibold text-gray-700 mb-3">Sections</h2>
              <div className="space-y-2">
                {sections.map((section, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSection(idx)}
                    className={`w-full text-left p-3 rounded transition ${
                      activeSection === idx
                        ? 'bg-red-100 text-red-700'
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {completedSections.has(idx) && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                      <span className="text-sm font-medium">{section.title}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {sections[activeSection].title}
                </h2>
                <p className="text-gray-600">{sections[activeSection].description}</p>
              </div>

              <div className="mb-6">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <p className="text-gray-700 whitespace-pre-line">
                    {sections[activeSection].content}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Code className="w-5 h-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-700">Code Example</h3>
                </div>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{sections[activeSection].code}</code>
                </pre>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <button
                  onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
                  disabled={activeSection === 0}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <button
                  onClick={() => handleComplete(activeSection)}
                  className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  {activeSection === sections.length - 1 ? 'Complete!' : 'Mark Complete & Next'}
                </button>
              </div>
            </div>

            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Security Key Points
              </h3>
              <ul className="text-yellow-700 space-y-1 text-sm">
                <li>• <strong>Passwords encrypted</strong> with BCrypt (one-way hash)</li>
                <li>• <strong>Authentication:</strong> WHO you are (username/password)</li>
                <li>• <strong>Authorization:</strong> WHAT you can do (USER vs ADMIN)</li>
                <li>• <strong>@PreAuthorize:</strong> Restrict endpoints by role</li>
                <li>• <strong>Never store plain text passwords!</strong></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}