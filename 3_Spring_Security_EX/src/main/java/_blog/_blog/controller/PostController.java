package _blog._blog.controller;

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
}
