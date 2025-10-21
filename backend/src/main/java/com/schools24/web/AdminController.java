package com.schools24.web;

import com.schools24.domain.*;
import com.schools24.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin
public class AdminController {
    private final UserRepository userRepository;
    private final SchoolClassRepository classRepository;
    private final SubjectRepository subjectRepository;
    private final ClassSubjectTeacherRepository cstRepository;

    public AdminController(UserRepository userRepository,
                           SchoolClassRepository classRepository,
                           SubjectRepository subjectRepository,
                           ClassSubjectTeacherRepository cstRepository) {
        this.userRepository = userRepository;
        this.classRepository = classRepository;
        this.subjectRepository = subjectRepository;
        this.cstRepository = cstRepository;
    }

    @GetMapping("/dashboard")
    public Map<String, Object> dashboard() {
        Map<String, Object> body = new HashMap<>();
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalStudents", userRepository.countByRoleAndIsActiveTrue("student"));
        stats.put("totalTeachers", userRepository.countByRoleAndIsActiveTrue("teacher"));
        stats.put("totalClasses", classRepository.countByIsActiveTrue());
        stats.put("totalSubjects", subjectRepository.countByIsActiveTrue());
        body.put("stats", stats);
        body.put("recentUsers", userRepository.findTop5ByIsActiveTrueOrderByCreatedAtDesc());
        return body;
    }

    @GetMapping("/teachers")
    public Map<String, Object> teachers() {
        Map<String, Object> res = new HashMap<>();
        res.put("teachers", userRepository.findByRoleAndIsActiveTrue("teacher"));
        return res;
    }

    @PostMapping("/users")
    public ResponseEntity<?> createUser(@RequestBody Map<String, Object> body) {
        String name = (String) body.get("name");
        String email = (String) body.get("email");
        String password = (String) body.get("password");
        String role = (String) body.get("role");
        String userId = (String) body.get("userId");
        if (name == null || email == null || password == null || role == null || userId == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Missing fields"));
        }
        if (userRepository.existsByEmailOrUserId(email, userId)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email or User ID already exists"));
        }
        User u = new User();
        u.setName(name);
        u.setEmail(email);
        u.setPassword(password); // For demo; replace with hashing in production
        u.setRole(role);
        u.setUserId(userId);
        userRepository.save(u);
        return ResponseEntity.created(URI.create("/api/admin/users/" + u.getId())).body(Map.of(
                "message", role + " created successfully",
                "user", Map.of(
                        "id", u.getId(),
                        "name", u.getName(),
                        "email", u.getEmail(),
                        "role", u.getRole(),
                        "userId", u.getUserId()
                )
        ));
    }

    @GetMapping("/classes")
    public Map<String, Object> classesAll() {
        Map<String, Object> res = new HashMap<>();
        res.put("classes", classRepository.findAll());
        return res;
    }

    @PostMapping("/classes")
    public ResponseEntity<?> createClass(@RequestBody Map<String, Object> body) {
        String name = (String) body.get("name");
        String grade = (String) body.get("grade");
        String section = (String) body.get("section");
        if (name == null || grade == null || section == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Missing fields"));
        }
        if (classRepository.findByNameAndGradeAndSectionAndIsActiveTrue(name, grade, section).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Class with this name, grade, and section already exists"));
        }
        SchoolClass c = new SchoolClass();
        c.setName(name);
        c.setGrade(grade);
        c.setSection(section);
        classRepository.save(c);
        return ResponseEntity.status(201).body(Map.of("message", "Class created successfully", "class", c));
    }

    @GetMapping("/subjects")
    public Map<String, Object> subjectsAll() {
        return Map.of("subjects", subjectRepository.findAll());
    }

    @PostMapping("/subjects")
    public ResponseEntity<?> createSubject(@RequestBody Map<String, Object> body) {
        String name = (String) body.get("name");
        String code = (String) body.get("code");
        if (name == null || code == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Missing fields"));
        }
        if (subjectRepository.existsByCode(code.toUpperCase())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Subject with this code already exists"));
        }
        Subject s = new Subject();
        s.setName(name);
        s.setCode(code.toUpperCase());
        subjectRepository.save(s);
        return ResponseEntity.status(201).body(Map.of("message", "Subject created successfully", "subject", s));
    }
}


