package _blog.blog.controller;

import java.util.List;
import _blog.blog.repository.*;
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

import _blog.blog.entity.Student;

@RestController
@RequestMapping("/api/students")
public class StudentController{
    
    @Autowired
    private StudentRepository repository;

    @GetMapping
    public List<Student> getAllStudents(){
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudent(@PathVariable Long id){
        return repository.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
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
}