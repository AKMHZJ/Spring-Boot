package _blog.blog.controller;

import _blog.blog.dto.UserDTO;
import org.springframework.web.bind.annotation.*;

@RestController
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
}