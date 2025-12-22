package _blog.blog.repository;

import _blog.blog.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategory(String category);
    List<Product> findByPriceLessThan(Double price);
    // Add more custom queries!
    List<Product> findByNameContainingIgnoreCase(String name);
}
