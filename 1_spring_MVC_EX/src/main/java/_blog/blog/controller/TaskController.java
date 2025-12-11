package _blog.blog.controller;

import _blog.blog.dto.*;
import java.util.ArrayList;
import java.util.List;
import org.springframework.web.bind.annotation.*;



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
}