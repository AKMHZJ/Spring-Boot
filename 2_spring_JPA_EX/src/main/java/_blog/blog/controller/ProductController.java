package _blog.blog.controller;

import _blog.blog.entity.Product;
import java.util.List;
import _blog.blog.repository.*;
import _blog.blog.repository.ProductRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    // Implement CRUD operations
    @Autowired
    private ProductRepository repository;

    @GetMapping
    public List<Product> getAllProducts(){
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProduct(@PathVariable Long id){
        return repository.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Product createProduct(@RequestBody Product product){
        return repository.save(product);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product details){
        return repository.findById(id).map(product -> {
            product.setName(details.getName());
            product.setPrice(details.getPrice());
            product.setCategory(details.getCategory());
            product.setStock(details.getStock());
            return ResponseEntity.ok(repository.save(product));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletProduct(@PathVariable Long id){
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.notFound().build();
    }
}