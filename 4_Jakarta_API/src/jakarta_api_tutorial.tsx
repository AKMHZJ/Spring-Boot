import React, { useState } from 'react';
import { Layers, Code, CheckCircle, BookOpen, ArrowLeft, Trophy, Star } from 'lucide-react';

export default function JakartaAPITutorial() {
  const [activeSection, setActiveSection] = useState(0);
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
import jakarta.validation.constraints.Size;    // Validation`
    },
    {
      title: "2. Jakarta Bean Validation",
      description: "Automate data checking",
      content: `Instead of writing 100 'if' statements to check if data is valid, use Jakarta Validation annotations on your Entity or DTO.

Common Annotations:
• @NotNull: Cannot be null
• @NotBlank: Cannot be empty string
• @Size(min=2, max=30): Check length
• @Email: Must be valid email format
• @Min / @Max: Check numeric ranges`,
      code: `package com.example.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
public class User {
    @Id
    @GeneratedValue
    private Long id;

    @NotBlank(message = "Name is required")
    @Size(min = 2, message = "Name must be at least 2 chars")
    private String name;

    @Email(message = "Please provide valid email")
    private String email;

    @Min(value = 18, message = "Must be at least 18 years old")
    private int age;
}`
    },
    {
      title: "3. Triggering Validation",
      description: "The @Valid annotation",
      content: `In your Spring Controller, simply add @Valid before your @RequestBody. 
Spring will automatically check all Jakarta annotations. If validation fails, it returns a 400 Bad Request automatically!`,
      code: `@PostMapping("/users")
public ResponseEntity<String> createUser(@Valid @RequestBody User user) {
    // If we reach here, the data is definitely valid!
    userRepository.save(user);
    return ResponseEntity.ok("User is valid and saved");
}`
    },
    {
      title: "4. JPA Relationships",
      description: "Linking tables together",
      content: `Jakarta Persistence (JPA) defines how to link tables.
• @OneToMany: One User has Many Posts
• @ManyToOne: Many Posts belong to One User
• @OneToOne: One User has One Profile
• @ManyToMany: Many Students have Many Courses`,
      code: `@Entity
public class User {
    @Id @GeneratedValue private Long id;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Post> posts;
}

@Entity
public class Post {
    @Id @GeneratedValue private Long id;
    private String title;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}`
    },
    {
      title: "5. Jakarta Persistence Life Cycle",
      description: "Entity States",
      content: `JPA manages objects in different states:
1. New/Transient: Just created with 'new', not in DB.
2. Managed/Persistent: Connected to DB, JPA tracks changes.
3. Detached: Was in DB but no longer tracked.
4. Removed: Scheduled to be deleted.`,
      code: `User user = new User(); // New

repository.save(user); // Managed

// If you change a managed object, 
// JPA saves changes automatically 
// at the end of the @Transactional method!
user.setName("New Name");`
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-fuchsia-50 p-6">
      <div className="max-w-6xl mx-auto">
        {!allCompleted ? (
          <>
            {/* Back to Security Button */}
            <a 
              href="https://3-spring-security.netlify.app/"
              className="inline-flex items-center text-purple-700 font-medium mb-4 hover:underline transition-all"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Spring Security
            </a>

            <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Layers className="w-8 h-8 text-purple-600" />
                <h1 className="text-3xl font-bold text-gray-800">Jakarta API Standards</h1>
              </div>
              <p className="text-gray-600 mb-2">Master the core enterprise Java standards used by Spring</p>
              <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
                <p className="text-sm text-purple-800">
                  <strong>Path:</strong> ✅ MVC → ✅ JPA → ✅ Security → 🟣 Jakarta API
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
                      {activeSection === sections.length - 1 ? 'Finish Course' : 'Mark Complete & Next'}
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
                  </ul>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* FULL COURSE CONGRATULATION PAGE */
          <div className="flex items-center justify-center min-h-[80vh]">
            <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-3xl text-center border-t-8 border-purple-600">
              <div className="mb-8">
                <div className="relative inline-block">
                  <Trophy className="w-32 h-32 text-yellow-500 mx-auto mb-4" />
                  <Star className="w-8 h-8 text-yellow-400 absolute top-0 right-0 animate-bounce" />
                </div>
                <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
                  Full Course Completed!
                </h1>
                <p className="text-2xl text-purple-700 font-medium mb-2">
                  You are now a Spring Boot & Jakarta EE Developer!
                </p>
                <p className="text-gray-500 max-w-md mx-auto">
                  You've mastered MVC, Data Persistence, Security, and Enterprise Standards.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 text-left">
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <h4 className="font-bold text-green-800 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Web Mastery
                  </h4>
                  <p className="text-sm text-green-700">REST APIs, Controllers, and HTTP handling.</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h4 className="font-bold text-blue-800 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Database Skills
                  </h4>
                  <p className="text-sm text-blue-700">JPA, Hibernate, and Relationship mapping.</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                  <h4 className="font-bold text-red-800 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Security Expert
                  </h4>
                  <p className="text-sm text-red-700">Authentication, RBAC, and Encryption.</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <h4 className="font-bold text-purple-800 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Jakarta Pro
                  </h4>
                  <p className="text-sm text-purple-700">Validation, Standards, and Portability.</p>
                </div>
              </div>

              {/* <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                  onClick={() => {
                    setCompletedSections(new Set());
                    setActiveSection(0);
                  }}
                  className="w-full sm:w-auto px-8 py-4 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-all"
                >
                  Restart Tutorial
                </button>
                <a 
                  href="https://3-spring-security.netlify.app/"
                  className="w-full sm:w-auto px-8 py-4 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-all shadow-lg hover:shadow-purple-200 flex items-center justify-center"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" /> Back to Security
                </a>
              </div> */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                {/* Updated Restart Button */}
                <a 
                  href="http://1-spring-mvc.netlify.app/"
                  className="w-full sm:w-auto px-8 py-4 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-all text-center"
                >
                  Restart Full Course
                </a>
                
                <a 
                  href="https://3-spring-security.netlify.app/"
                  className="w-full sm:w-auto px-8 py-4 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-all shadow-lg hover:shadow-purple-200 flex items-center justify-center"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" /> Back to Security
                </a>
              </div>
              
              <p className="mt-8 text-gray-400 text-sm">
                Next Step: Start building your own portfolio project! 🚀
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}