package _blog.blog.repository;

import _blog.blog.entity.Student;
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
}

