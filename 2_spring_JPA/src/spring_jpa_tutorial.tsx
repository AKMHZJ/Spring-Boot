import React, { useState } from 'react';
import { Database, Code, CheckCircle, ArrowLeft, Shield } from 'lucide-react';

export default function SpringJPATutorial() {
  const [activeSection, setActiveSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());

  const sections = [
    {
      title: "1. What is Spring Data JPA?",
      description: "Database persistence made easy",
      content: `Spring Data JPA lets you save data to a database without writing SQL!

Key Benefits:
• Your data survives app restarts
• Automatic database table creation
• No SQL needed - just Java code
• Built-in methods: save(), findAll(), findById()

JPA = Java Persistence API (the standard)
Hibernate = The implementation (under the hood)`,
      code: `// Before (in-memory - data lost on restart):
List<Student> students = new ArrayList<>();

// After (database - data persists):
@Autowired
StudentRepository repository;
repository.save(student); // Saved to database!`
    },
    {
      title: "2. Add Dependencies",
      description: "Update your pom.xml",
      content: `Add these two dependencies to enable database support:
• spring-boot-starter-data-jpa (JPA support)
• h2 (in-memory database for learning)`,
      code: `<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>runtime</scope>
</dependency>

`
    },
    {
      title: "3. Configure Database",
      description: "application.properties",
      content: `Tell Spring Boot how to connect to the database.
H2 is perfect for learning - it's a database that runs in memory.`,
      code: `# Create this file: src/main/resources/application.properties

# Database connection
spring.datasource.url=jdbc:h2:mem:studentdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# JPA settings
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# H2 Console (view database in browser!)
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console`
    },
    {
      title: "4. Create Entity (with JPA annotations)",
      description: "Map Java class to database table",
      content: `An Entity is a class that maps to a database table.
Each object = one row in the table.

Key Annotations:
@Entity - Marks this as a database table
@Id - Primary key
@GeneratedValue - Auto-increment ID
@Column - Customize column properties`,
      code: `package com.school.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "students")
public class Student {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String firstName;
    
    @Column(nullable = false)
    private String lastName;
    
    @Column(unique = true)
    private String email;
    
    private String major;
    
    // Constructors
    public Student() {}
    
    public Student(String firstName, String lastName, String email, String major) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.major = major;
    }
    
    // Getters and Setters (required!)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getMajor() { return major; }
    public void setMajor(String major) { this.major = major; }
}`
    },
    {
      title: "5. Create Repository",
      description: "Database operations without SQL!",
      content: `This is MAGIC! Just create an interface and Spring gives you:
• save() - insert/update
• findAll() - get all records
• findById() - get one record
• delete() - remove record

Plus you can define custom queries just by method names!`,
      code: `package com.school.repository;

import com.school.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    
    // Spring creates these methods automatically from the name!
    
    // Find by email
    Optional<Student> findByEmail(String email);
    
    // Find all students in a major
    List<Student> findByMajor(String major);
    
    // Find by last name
    List<Student> findByLastName(String lastName);
    
    // Search by first name (case-insensitive, partial match)
    List<Student> findByFirstNameContainingIgnoreCase(String name);
    
    // That's it! No SQL needed!
}`
    },
    {
      title: "6. Create Controller",
      description: "Use repository in REST API",
      content: `Now use your repository in the controller.
Notice: No ArrayList! Data comes from database.`,
      code: `package com.school.controller;

import com.school.entity.Student;
import com.school.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {
    
    @Autowired
    private StudentRepository repository;
    
    // GET all students (from database!)
    @GetMapping
    public List<Student> getAllStudents() {
        return repository.findAll();
    }
    
    // GET student by ID
    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudent(@PathVariable Long id) {
        return repository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    // CREATE new student (saved to database!)
    @PostMapping
    public Student createStudent(@RequestBody Student student) {
        return repository.save(student);
    }
    
    // UPDATE student
    @PutMapping("/{id}")
    public ResponseEntity<Student> updateStudent(
            @PathVariable Long id,
            @RequestBody Student details) {
        
        return repository.findById(id)
            .map(student -> {
                student.setFirstName(details.getFirstName());
                student.setLastName(details.getLastName());
                student.setEmail(details.getEmail());
                student.setMajor(details.getMajor());
                return ResponseEntity.ok(repository.save(student));
            })
            .orElse(ResponseEntity.notFound().build());
    }
    
    // DELETE student
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    // SEARCH by major
    @GetMapping("/major/{major}")
    public List<Student> getByMajor(@PathVariable String major) {
        return repository.findByMajor(major);
    }
    
    // SEARCH by name
    @GetMapping("/search")
    public List<Student> searchByName(@RequestParam String name) {
        return repository.findByFirstNameContainingIgnoreCase(name);
    }
}`
    },
    {
      title: "7. Test Your Database API",
      description: "Data persists now!",
      content: `Test your endpoints. The big difference:
• Data is saved to database
• Survives app restarts
• You can view data in H2 Console`,
      code: `# Create student (saved to database!)
curl -X POST http://localhost:8080/api/students \\
  -H "Content-Type: application/json" \\
  -d '{
    "firstName": "Ahmed",
    "lastName": "Hassan",
    "email": "ahmed@example.com",
    "major": "Computer Science"
  }'

# Create another
curl -X POST http://localhost:8080/api/students \\
  -H "Content-Type: application/json" \\
  -d '{
    "firstName": "Sara",
    "lastName": "Ali",
    "email": "sara@example.com",
    "major": "Engineering"
  }'

# Get all students
curl http://localhost:8080/api/students

# Search by major
curl http://localhost:8080/api/students/major/Computer%20Science

# Search by name
curl http://localhost:8080/api/students/search?name=Ahmed

# Update student
curl -X PUT http://localhost:8080/api/students/1 \\
  -H "Content-Type: application/json" \\
  -d '{
    "firstName": "Ahmed",
    "lastName": "Hassan",
    "email": "ahmed.new@example.com",
    "major": "Data Science"
  }'

# Delete student
curl -X DELETE http://localhost:8080/api/students/2

# NOW: Stop your app and restart it
# Run: curl http://localhost:8080/api/students
# Your data is still there! 🎉`
    },
    {
      title: "8. View Database (H2 Console)",
      description: "See your data visually",
      content: `You can actually SEE your database tables and data in a web interface!`,
      code: `# With your app running, open browser and go to:
http://localhost:8080/h2-console

# Login with:
JDBC URL: jdbc:h2:mem:studentdb
User Name: sa
Password: (leave empty)

# Click "Connect"

# Now you'll see:
- Your STUDENTS table
- All the data you've added
- You can run SQL queries if you want

# Try running:
SELECT * FROM STUDENTS;

# This shows all your student records!`
    },
    {
      title: "9. Practice Exercise",
      description: "Build your own!",
      content: `Create a Product entity with database support:

Requirements:
• Product table with: id, name, price, category, stock
• Repository with custom query methods
• REST API endpoints for CRUD
• Search by category
• Find products under a certain price

Challenge: Add a method findByPriceLessThan(Double price)`,
      code: `// Hints:

@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private Double price;
    private String category;
    private Integer stock;
    
    // Constructor, getters, setters
}

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategory(String category);
    List<Product> findByPriceLessThan(Double price);
    // Add more custom queries!
}

@RestController
@RequestMapping("/api/products")
public class ProductController {
    // Implement CRUD operations
}`
    }
  ];

  const handleComplete = (index: number) => {
    setCompletedSections((prev: Set<number>) => new Set([...prev, index]));
    if (index < sections.length - 1) {
      setActiveSection(index + 1);
    }
  };

  const allCompleted = completedSections.size === sections.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
        {!allCompleted ? (
          <>
            {/* Back to MVC Button */}
            <a 
              href="https://1-spring-mvc.netlify.app/"
              className="inline-flex items-center text-blue-700 font-medium mb-4 hover:underline transition-all"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Spring MVC
            </a>

            <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Database className="w-8 h-8 text-blue-600" />
                <h1 className="text-3xl font-bold text-gray-800">Spring Data JPA + Hibernate Tutorial</h1>
              </div>
              <p className="text-gray-600 mb-2">Save data to a real database - no SQL required!</p>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-sm text-blue-800">
                  <strong>You completed:</strong> ✅ Spring MVC<br/>
                  <strong>Now learning:</strong> 🔵 Spring Data JPA + Hibernate<br/>
                  <strong>Next up:</strong> Spring Security
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
                        ? 'bg-blue-500'
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
                            ? 'bg-blue-100 text-blue-700'
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
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
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
                      className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      {activeSection === sections.length - 1 ? 'Complete!' : 'Mark Complete & Next'}
                    </button>
                  </div>
                </div>

                <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h3 className="font-semibold text-yellow-800 mb-2">💡 Key Differences from Spring MVC</h3>
                  <ul className="text-yellow-700 space-y-1 text-sm">
                    <li>• <strong>Before:</strong> List&lt;Student&gt; list = new ArrayList&lt;&gt;() - data lost on restart</li>
                    <li>• <strong>Now:</strong> StudentRepository repository - data saved to database</li>
                    <li>• <strong>@Entity</strong> marks a class as a database table</li>
                    <li>• <strong>JpaRepository</strong> gives you save(), findAll(), etc. for free!</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Completion Page */
          <div className="flex items-center justify-center min-h-[80vh]">
            <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-2xl text-center">
              <div className="mb-6">
                <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-4" />
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                  🎉 Congratulations!
                </h1>
                <p className="text-xl text-gray-600 mb-2">
                  You've completed Spring Data JPA!
                </p>
                <p className="text-gray-500">
                  You can now build APIs that save data to a real database.
                </p>
              </div>

              <div className="bg-green-50 border-l-4 border-green-500 p-6 mb-8 text-left">
                <h3 className="font-bold text-green-800 mb-2">✅ What You Learned:</h3>
                <ul className="text-green-700 space-y-1 text-sm">
                  <li>• Creating Entities (@Entity)</li>
                  <li>• Using JpaRepository for CRUD</li>
                  <li>• Custom Query Methods</li>
                  <li>• H2 Database Configuration</li>
                </ul>
              </div>

              <div className="bg-purple-50 border-l-4 border-purple-500 p-6 mb-8 text-left">
                <h3 className="font-bold text-purple-800 mb-2">⏭️ Next Step: Spring Security</h3>
                <p className="text-purple-700 text-sm mb-2">
                  Now that you have data, you need to protect it!
                </p>
                <p className="text-purple-600 text-sm">
                  Learn authentication, JWTs, and how to secure your endpoints.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <a
                  href="https://3-spring-security.netlify.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg px-8 py-4 rounded-lg transition-all transform hover:scale-105 shadow-lg"
                >
                  <Shield className="w-5 h-5 mr-2" />
                  Continue to Spring Security →
                </a>

                <a 
                  href="https://1-spring-mvc.netlify.app/"
                  className="text-gray-500 hover:text-blue-600 hover:underline text-sm mt-2"
                >
                  ← Review Spring MVC
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}