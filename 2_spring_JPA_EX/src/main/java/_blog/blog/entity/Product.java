package _blog.blog.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = flase)
    private String name;

    @Column(nullable = flase)
    private Double price;

    private String category;
    
    @Column(nullable = flase)
    private Integer stock;

    public Product(){}

    public Product(String name, Double price, String category, Integer stock){
        this.name = name;
        this.price = price;
        this.category = category;
        this.stock = stock;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() {return name;}
    public void setName(String name) {this.name = name;}

    public Double getPrice() {return price;}
    public void setPrice(Double price) {this.price = price;}

    public String getCategory() {return category;}
    public void setCategory(String category) {this.category = category;}

    public Integer getStock() {return stock;}
    public void setStock(Integer stock) {this.stock = stock;}
}
