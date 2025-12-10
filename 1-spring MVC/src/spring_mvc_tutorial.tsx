import React, { useState } from 'react';
import { Book, Code, Play, CheckCircle } from 'lucide-react';

export default function SpringMVCTutorial() {
  const [activeSection, setActiveSection] = useState(0);
  const [completedSections, setCompletedSections] = useState(new Set());

  const sections = [
    {
      title: "1. What is Spring MVC?",
      description: "Understanding the basics",
      content: `Spring MVC (Model-View-Controller) is a framework for building web applications. It handles:
• HTTP requests from browsers/clients
• Business logic processing
• Returning responses (HTML, JSON, etc.)`,
      code: `// The MVC Pattern:
// Model: Data (your objects)
// View: What user sees (HTML, JSON)
// Controller: Handles requests and responses`
    },
    {
      title: "2. Your First Controller",
      description: "Create a simple REST endpoint",
      content: `Controllers handle HTTP requests. Use @RestController to create REST APIs.`,
      code: `package com.example.demo.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class HelloController {
    
    @GetMapping("/hello")
    public String sayHello() {
        return "Hello from Spring Boot!";
    }
    
    @GetMapping("/hello/{name}")
    public String sayHelloToName(@PathVariable String name) {
        return "Hello, " + name + "!";
    }
}

// Test in browser:
// http://localhost:8080/api/hello
// http://localhost:8080/api/hello/John`
    },
    {
      title: "3. HTTP Methods (CRUD)",
      description: "GET, POST, PUT, DELETE",
      content: `Different HTTP methods for different operations:`,
      code: `@RestController
@RequestMapping("/api/users")
public class UserController {
    
    // READ - Get all users
    @GetMapping
    public List<User> getAllUsers() {
        return userList;
    }
    
    // READ - Get one user
    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return findUserById(id);
    }
    
    // CREATE - Add new user
    @PostMapping
    public User createUser(@RequestBody User user) {
        return saveUser(user);
    }
    
    // UPDATE - Modify existing user
    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, 
                          @RequestBody User user) {
        return updateUserById(id, user);
    }
    
    // DELETE - Remove user
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        removeUserById(id);
    }
}`
    },
    {
      title: "4. Request Parameters",
      description: "Handling query strings and form data",
      content: `Different ways to receive data from requests:`,
      code: `@RestController
@RequestMapping("/api")
public class ParamController {
    
    // Query parameters: /search?name=John&age=25
    @GetMapping("/search")
    public String search(
        @RequestParam String name,
        @RequestParam(required = false) Integer age
    ) {
        return "Searching for " + name + 
               (age != null ? ", age: " + age : "");
    }
    
    // Path variables: /user/123
    @GetMapping("/user/{id}")
    public String getUser(@PathVariable Long id) {
        return "Getting user with ID: " + id;
    }
    
    // Request body (JSON)
    @PostMapping("/register")
    public String register(@RequestBody UserDTO user) {
        return "Registered: " + user.getName();
    }
}`
    },
    {
      title: "5. Complete Example: Task Manager",
      description: "Putting it all together",
      content: `A real-world example with a Task entity:`,
      code: `// Task.java (Model)
public class Task {
    private Long id;
    private String title;
    private String description;
    private boolean completed;
    
    // Constructors, getters, setters
}

// TaskController.java
@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    
    private List<Task> tasks = new ArrayList<>();
    private Long idCounter = 1L;
    
    @GetMapping
    public List<Task> getAllTasks() {
        return tasks;
    }
    
    @GetMapping("/{id}")
    public Task getTask(@PathVariable Long id) {
        return tasks.stream()
            .filter(t -> t.getId().equals(id))
            .findFirst()
            .orElse(null);
    }
    
    @PostMapping
    public Task createTask(@RequestBody Task task) {
        task.setId(idCounter++);
        tasks.add(task);
        return task;
    }
    
    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, 
                          @RequestBody Task taskDetails) {
        Task task = getTask(id);
        if (task != null) {
            task.setTitle(taskDetails.getTitle());
            task.setDescription(taskDetails.getDescription());
            task.setCompleted(taskDetails.isCompleted());
        }
        return task;
    }
    
    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        tasks.removeIf(t -> t.getId().equals(id));
    }
    
    @PatchMapping("/{id}/complete")
    public Task markComplete(@PathVariable Long id) {
        Task task = getTask(id);
        if (task != null) {
            task.setCompleted(true);
        }
        return task;
    }
}`
    },
    {
      title: "6. Practice Exercise",
      description: "Build your own controller",
      content: `Try creating a ProductController with these endpoints:
• GET /api/products - list all products
• GET /api/products/{id} - get one product
• POST /api/products - create product
• PUT /api/products/{id} - update product
• DELETE /api/products/{id} - delete product

Product should have: id, name, price, category`,
      code: `// Your turn! Create this structure:

public class Product {
    private Long id;
    private String name;
    private Double price;
    private String category;
    // ... getters, setters
}

@RestController
@RequestMapping("/api/products")
public class ProductController {
    // Implement the CRUD operations here
    
    private List<Product> products = new ArrayList<>();
    
    // TODO: Implement getAllProducts()
    // TODO: Implement getProductById()
    // TODO: Implement createProduct()
    // TODO: Implement updateProduct()
    // TODO: Implement deleteProduct()
}`
    }
  ];

  const handleComplete = (index) => {
    setCompletedSections(prev => new Set([...prev, index]));
    if (index < sections.length - 1) {
      setActiveSection(index + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Book className="w-8 h-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-800">Spring MVC Tutorial</h1>
          </div>
          <p className="text-gray-600">Learn Spring MVC step by step with practical examples</p>
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
          {/* Sidebar */}
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

          {/* Main Content */}
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
                  className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  {activeSection === sections.length - 1 ? 'Complete!' : 'Mark Complete & Next'}
                </button>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="font-semibold text-yellow-800 mb-2">💡 Quick Tips</h3>
              <ul className="text-yellow-700 space-y-1 text-sm">
                <li>• Test your endpoints using Postman or curl</li>
                <li>• Use @RestController for REST APIs (returns JSON)</li>
                <li>• Use @Controller for traditional web pages (returns HTML)</li>
                <li>• Spring Boot runs on port 8080 by default</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}