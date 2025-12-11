package _blog.blog.controller;

import _blog.blog.dto.*;
import java.util.ArrayList;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    // Implement the CRUD operations here
    
    private List<Product> products = new ArrayList<>();
    private Long idCounter = 1L;

    // TODO: Implement getAllProducts()
    @GetMapping
    public List<Product> getAllProducts(){
        return products;
    }

    // TODO: Implement getProductById()
    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id){
        return products.stream().filter(t -> t.getId().equals(id)).findFirst().orElse(null);
    }
    
    // TODO: Implement createProduct()
    @PostMapping
    public Product createProduct(@RequestBody Product product){
        product.setId(idCounter++);
        products.add(product);
        return product;
    }

    // TODO: Implement updateProduct()
    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable Long id, @RequestBody Product productDetails){
        Product product = getProductById(id);
        if (product != null){
            product.setName(productDetails.getName());
            product.setPrice(productDetails.getPrice());
            product.setCategory(productDetails.getCategory());
        }
        return product;
    }

    // TODO: Implement deleteProduct()
    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id){
        products.removeIf(t -> t.getId().equals(id));
    }
}