import React, { useState } from 'react';
import { Layers, Code, CheckCircle, BookOpen } from 'lucide-react';

export default function JakartaAPITutorial() {
  const [activeSection, setActiveSection] = useState(0);
  // const [completedSections, setCompletedSections] = useState(new Set());
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());

  const sections = [
    {
      title: "1. What is Jakarta API?",
      description: "Understanding the standards",
      content: `Jakarta EE (formerly Java EE) provides the STANDARD APIs that frameworks like Spring implement.

Think of it like this:
• Jakarta API = The rulebook/standard
• Spring Boot = Implementation of those rules
• Hibernate = Implementation of JPA standard

You've already been using Jakarta APIs!
• jakarta.persistence.* (JPA annotations like @Entity, @Id)
• jakarta.validation.* (Bean Validation like @NotNull, @Email)
• jakarta.servlet.* (Web APIs)

Why learn this?
• Understand what's happening under the hood
• Use validation annotations
• Work with any Java framework
• Industry standard knowledge`,
      code: `// These are Jakarta APIs you've already used:

import jakarta.persistence.Entity;        // JPA
import jakarta.persistence.Id;            // JPA
import jakarta.persistence.GeneratedValue; // JPA

import jakarta.validation.constraints.NotNull; // Validation
import jakarta.validation.constraints.Email;   // Validation
import jakarta.validation.constraints.Size;    // Validation

@Entity  // ← Jakarta JPA API
public class User {
    @Id  // ← Jakarta JPA API
    @GeneratedValue  // ← Jakarta JPA API
    private Long id;
    
    @NotNull  // ← Jakarta Validation API
    @Size(min = 3, max = 50)  // ← Jakarta Validation API
    private String username;
    
    @Email  // ← Jakarta Validation API
    private String email;
}`
    },
    {
      title: "2. Bean Validation (jakarta.validation)",
      description: "Validate data automatically",
      content: `Bean Validation automatically checks your data before saving.
No need to write if/else checks manually!

Common Annotations:
• @NotNull - Field cannot be null
• @NotEmpty - String/Collection cannot be empty
• @NotBlank - String cannot be empty or whitespace
• @Size(min, max) - Length constraints
• @Min, @Max - Number range
• @Email - Valid email format
• @Pattern - Regex validation
• @Past, @Future - Date validation`,
      code: `package com.example.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

@Entity
public class Student {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 50, message = "First name must be 2-50 characters")
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    private String lastName;
    
    @NotNull(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;
    
    @Min(value = 18, message = "Must be at least 18 years old")
    @Max(value = 100, message = "Age must be realistic")
    private Integer age;
    
    @Pattern(regexp = "^\\+?[0-9]{10,15}$", 
             message = "Phone number must be 10-15 digits")
    private String phone;
    
    @Past(message = "Birth date must be in the past")
    private LocalDate birthDate;
    
    // Getters and setters...
}`
    },
    {
      title: "3. Add Validation Dependency",
      description: "Enable validation in your project",
      content: `Add validation support to your Spring Boot project.`,
      code: `<!-- Add to pom.xml -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>

<!-- This includes jakarta.validation-api automatically -->`
    },
    {
      title: "4. Use @Valid in Controller",
      description: "Trigger validation automatically",
      content: `Add @Valid to controller methods to validate request body.
If validation fails, Spring returns 400 Bad Request with error details.`,
      code: `package com.example.controller;

import com.example.entity.Student;
import com.example.repository.StudentRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/students")
public class StudentController {
    
    @Autowired
    private StudentRepository repository;
    
    // @Valid triggers automatic validation
    @PostMapping
    public ResponseEntity<?> createStudent(@Valid @RequestBody Student student) {
        // If validation fails, Spring automatically returns error
        // If validation passes, this code runs
        Student saved = repository.save(student);
        return ResponseEntity.ok(saved);
    }
    
    // With custom error handling
    @PostMapping("/custom")
    public ResponseEntity<?> createWithCustomErrors(
            @Valid @RequestBody Student student,
            BindingResult result) {
        
        if (result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            result.getFieldErrors().forEach(error -> 
                errors.put(error.getField(), error.getDefaultMessage())
            );
            return ResponseEntity.badRequest().body(errors);
        }
        
        return ResponseEntity.ok(repository.save(student));
    }
}`
    },
    {
      title: "5. Test Validation",
      description: "See validation in action",
      content: `Test validation with invalid data.`,
      code: `# Valid student (will succeed)
curl -X POST http://localhost:8080/api/students \\
  -H "Content-Type: application/json" \\
  -d '{
    "firstName": "Ahmed",
    "lastName": "Hassan",
    "email": "ahmed@example.com",
    "age": 20,
    "phone": "+1234567890",
    "birthDate": "2003-05-15"
  }'

# Invalid: First name too short (will fail)
curl -X POST http://localhost:8080/api/students \\
  -H "Content-Type: application/json" \\
  -d '{
    "firstName": "A",
    "lastName": "Hassan",
    "email": "ahmed@example.com",
    "age": 20
  }'

# Response: 400 Bad Request
# {
#   "firstName": "First name must be 2-50 characters"
# }

# Invalid: Bad email format (will fail)
curl -X POST http://localhost:8080/api/students \\
  -H "Content-Type: application/json" \\
  -d '{
    "firstName": "Ahmed",
    "lastName": "Hassan",
    "email": "not-an-email",
    "age": 20
  }'

# Response: 400 Bad Request
# {
#   "email": "Email must be valid"
# }

# Invalid: Multiple errors (will fail)
curl -X POST http://localhost:8080/api/students \\
  -H "Content-Type: application/json" \\
  -d '{
    "firstName": "A",
    "email": "bad",
    "age": 15
  }'

# Response: 400 Bad Request
# {
#   "firstName": "First name must be 2-50 characters",
#   "lastName": "Last name is required",
#   "email": "Email must be valid",
#   "age": "Must be at least 18 years old"
# }`
    },
    {
      title: "6. Custom Validators",
      description: "Create your own validation logic",
      content: `Sometimes you need custom validation (e.g., check if username exists).
Create custom validator annotations!`,
      code: `// Step 1: Create annotation
package com.example.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = UniqueUsernameValidator.class)
public @interface UniqueUsername {
    String message() default "Username already exists";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

// Step 2: Create validator logic
package com.example.validation;

import com.example.repository.UserRepository;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.factory.annotation.Autowired;

public class UniqueUsernameValidator 
        implements ConstraintValidator<UniqueUsername, String> {
    
    @Autowired
    private UserRepository userRepository;
    
    @Override
    public boolean isValid(String username, 
                          ConstraintValidatorContext context) {
        if (username == null) return true; // Let @NotNull handle this
        return !userRepository.existsByUsername(username);
    }
}

// Step 3: Use it in entity
@Entity
public class User {
    
    @UniqueUsername  // ← Your custom validator!
    @NotBlank
    @Size(min = 3, max = 20)
    private String username;
    
    // Other fields...
}`
    },
    {
      title: "7. JPA Relationships",
      description: "Connect entities together",
      content: `Jakarta JPA lets you define relationships between entities.

Types:
• @OneToOne - One user has one profile
• @OneToMany - One author has many books
• @ManyToOne - Many books belong to one author
• @ManyToMany - Many students take many courses`,
      code: `// Example: Author has many Books

@Entity
public class Author {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    
    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL)
    private List<Book> books = new ArrayList<>();
    
    // Getters, setters...
}

@Entity
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String title;
    
    @ManyToOne
    @JoinColumn(name = "author_id")
    private Author author;
    
    // Getters, setters...
}

// Usage:
Author author = new Author();
author.setName("Robert Martin");

Book book1 = new Book();
book1.setTitle("Clean Code");
book1.setAuthor(author);

Book book2 = new Book();
book2.setTitle("Clean Architecture");
book2.setAuthor(author);

authorRepository.save(author); // Saves author and books together!`
    },
    {
      title: "8. Complete Example: Blog System",
      description: "Put it all together",
      content: `Let's build a complete blog with validation and relationships.`,
      code: `// User Entity
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Size(min = 3, max = 20)
    @Column(unique = true)
    private String username;
    
    @NotBlank
    @Email
    private String email;
    
    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL)
    private List<Post> posts = new ArrayList<>();
    
    // Getters, setters...
}

// Post Entity
@Entity
@Table(name = "posts")
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Size(min = 5, max = 100)
    private String title;
    
    @NotBlank
    @Size(min = 10, max = 5000)
    private String content;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User author;
    
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL)
    private List<Comment> comments = new ArrayList<>();
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    // Getters, setters...
}

// Comment Entity
@Entity
@Table(name = "comments")
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Size(min = 1, max = 500)
    private String text;
    
    @ManyToOne
    @JoinColumn(name = "post_id")
    private Post post;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User author;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    // Getters, setters...
}`
    },
    {
      title: "9. Complete Blog Controller",
      description: "CRUD operations with validation",
      content: `Full REST API for the blog system.`,
      code: `@RestController
@RequestMapping("/api/posts")
public class PostController {
    
    @Autowired
    private PostRepository postRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    // Get all posts
    @GetMapping
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }
    
    // Get post by ID with comments
    @GetMapping("/{id}")
    public ResponseEntity<Post> getPost(@PathVariable Long id) {
        return postRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    // Create post with validation
    @PostMapping
    public ResponseEntity<?> createPost(
            @Valid @RequestBody Post post,
            @RequestParam Long userId) {
        
        User author = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        post.setAuthor(author);
        Post saved = postRepository.save(post);
        
        return ResponseEntity.ok(saved);
    }
    
    // Add comment to post
    @PostMapping("/{postId}/comments")
    public ResponseEntity<?> addComment(
            @PathVariable Long postId,
            @Valid @RequestBody Comment comment,
            @RequestParam Long userId) {
        
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Post not found"));
        
        User author = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        comment.setPost(post);
        comment.setAuthor(author);
        
        post.getComments().add(comment);
        postRepository.save(post);
        
        return ResponseEntity.ok(comment);
    }
    
    // Delete post (only by author)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(
            @PathVariable Long id,
            @RequestParam Long userId) {
        
        Post post = postRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Post not found"));
        
        if (!post.getAuthor().getId().equals(userId)) {
            return ResponseEntity.status(403)
                .body("You can only delete your own posts");
        }
        
        postRepository.delete(post);
        return ResponseEntity.noContent().build();
    }
}`
    },
    {
      title: "10. Practice Exercise",
      description: "Build your own system",
      content: `Create an E-Commerce system with:

Entities:
• Product (name, price, stock, category)
• Order (orderDate, totalAmount, status)
• OrderItem (quantity, price)
• Customer (name, email, address)

Relationships:
• Customer has many Orders (OneToMany)
• Order has many OrderItems (OneToMany)
• OrderItem references one Product (ManyToOne)

Validation:
• Product price > 0
• Customer email must be valid
• Order status: PENDING, CONFIRMED, SHIPPED, DELIVERED

Challenge: Create REST APIs for:
• Create order with multiple items
• Calculate total automatically
• Validate stock availability`,
      code: `// Hints for structure:

@Entity
public class Product {
    @Id @GeneratedValue
    private Long id;
    
    @NotBlank
    @Size(min = 3, max = 100)
    private String name;
    
    @NotNull
    @Min(0)
    private Double price;
    
    @Min(0)
    private Integer stock;
    
    private String category;
}

@Entity
public class Order {
    @Id @GeneratedValue
    private Long id;
    
    @ManyToOne
    private Customer customer;
    
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> items = new ArrayList<>();
    
    private Double totalAmount;
    
    @CreationTimestamp
    private LocalDateTime orderDate;
    
    private String status = "PENDING";
}

@Entity
public class OrderItem {
    @Id @GeneratedValue
    private Long id;
    
    @ManyToOne
    private Order order;
    
    @ManyToOne
    private Product product;
    
    @Min(1)
    private Integer quantity;
    
    private Double price; // Price at time of order
}

// TODO: Implement Customer entity
// TODO: Create repositories
// TODO: Create controller with validation
// TODO: Calculate total automatically
// TODO: Check stock before creating order`
    }
  ];

  const handleComplete = (index: number) => {
    setCompletedSections((prev: Set<number>) => new Set([...prev, index]));
    if (index < sections.length - 1) {
      setActiveSection(index + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Layers className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-800">Jakarta API Tutorial</h1>
          </div>
          <p className="text-gray-600 mb-2">Master the standard APIs behind Spring Boot</p>
          <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
            <p className="text-sm text-purple-800">
              <strong>You completed:</strong> ✅ Spring MVC, ✅ Spring Data JPA, ✅ Spring Security<br/>
              <strong>Now learning:</strong> 🟣 Jakarta API (Final Module!)<br/>
              <strong>Status:</strong> 🎓 Almost a Spring Boot expert!
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
                    ? 'bg-purple-500'
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
                        ? 'bg-purple-100 text-purple-700'
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
                <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
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
                  className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  {activeSection === sections.length - 1 ? 'Complete Course! 🎉' : 'Mark Complete & Next'}
                </button>
              </div>
            </div>

            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Jakarta API Summary
              </h3>
              <ul className="text-yellow-700 space-y-1 text-sm">
                <li>• <strong>jakarta.persistence.*</strong> - JPA (database entities)</li>
                <li>• <strong>jakarta.validation.*</strong> - Bean Validation (@NotNull, @Email)</li>
                <li>• <strong>@OneToMany, @ManyToOne</strong> - Entity relationships</li>
                <li>• <strong>@Valid</strong> - Trigger automatic validation in controllers</li>
                <li>• Spring implements these standards - portable knowledge!</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}