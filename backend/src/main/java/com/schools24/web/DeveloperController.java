package com.schools24.web;

import com.schools24.domain.School;
import com.schools24.domain.User;
import com.schools24.repository.SchoolRepository;
import com.schools24.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.*;

@RestController
@RequestMapping("/api/developer")
@CrossOrigin
public class DeveloperController {
    private final SchoolRepository schoolRepository;
    private final UserRepository userRepository;

    public DeveloperController(SchoolRepository schoolRepository, UserRepository userRepository) {
        this.schoolRepository = schoolRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/overview")
    public Map<String, Object> overview() {
        Map<String, Object> res = new HashMap<>();
        res.put("schools", schoolRepository.count());
        res.put("admins", userRepository.countByRoleAndIsActiveTrue("admin"));
        res.put("teachers", userRepository.countByRoleAndIsActiveTrue("teacher"));
        res.put("students", userRepository.countByRoleAndIsActiveTrue("student"));
        return res;
    }

    @GetMapping("/schools")
    public Map<String, Object> listSchools(@RequestParam(value = "q", required = false) String q,
                                           @RequestParam(value = "page", defaultValue = "1") int page,
                                           @RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {
        PageRequest pr = PageRequest.of(Math.max(page - 1, 0), Math.max(pageSize, 1));
        Page<School> result;
        if (q != null && !q.isBlank()) {
            result = schoolRepository.findByNameContainingIgnoreCaseOrCodeContainingIgnoreCase(q, q, pr);
        } else {
            result = schoolRepository.findAll(pr);
        }
        Map<String, Object> body = new HashMap<>();
        body.put("schools", result.getContent());
        body.put("total", result.getTotalElements());
        return body;
    }

    @PostMapping("/schools")
    public ResponseEntity<?> createSchool(@RequestBody Map<String, Object> payload) {
        String name = (String) payload.get("name");
        String code = (String) payload.get("code");
        if (name == null || code == null) return ResponseEntity.badRequest().body(Map.of("message", "Name and code are required"));
        if (schoolRepository.existsByCode(code)) return ResponseEntity.badRequest().body(Map.of("message", "Code already exists"));
        School s = new School();
        s.setName(name);
        s.setCode(code);
        s.setDomain((String) payload.get("domain"));
        s.setEmail((String) payload.get("email"));
        s.setAddress((String) payload.get("address"));
        s.setCity((String) payload.get("city"));
        s.setState((String) payload.get("state"));
        s.setCountry((String) payload.get("country"));
        schoolRepository.save(s);
        return ResponseEntity.created(URI.create("/api/developer/schools/" + s.getId())).body(Map.of("school", s));
    }

    @GetMapping("/schools/{id}/users")
    public Map<String, Object> listUsers(@PathVariable Long id) {
        // naive: list all active users (no school link yet); to be refined after school/user relation
        List<User> users = userRepository.findTop5ByIsActiveTrueOrderByCreatedAtDesc();
        return Map.of("users", users);
    }

    @PostMapping("/schools/{id}/users")
    public ResponseEntity<?> createUserForSchool(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        String role = (String) body.get("role");
        String name = (String) body.get("name");
        String email = (String) body.get("email");
        String userId = (String) body.get("userId");
        String password = (String) body.get("password");
        if (role == null || name == null || email == null || userId == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Missing fields"));
        }
        if (userRepository.existsByEmailOrUserId(email, userId)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email or User ID already exists"));
        }
        User u = new User();
        u.setName(name);
        u.setEmail(email);
        u.setPassword(password);
        u.setRole(role);
        u.setUserId(userId);
        userRepository.save(u);
        return ResponseEntity.ok(Map.of("message", "User created", "user", Map.of("id", u.getId())));
    }

    @PostMapping("/schools/{id}/provision-admin")
    public ResponseEntity<?> provisionAdmin(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        String name = (String) body.get("name");
        String email = (String) body.get("email");
        String userId = (String) body.get("userId");
        String password = (String) body.get("password");
        if (name == null || email == null || userId == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Missing fields"));
        }
        if (userRepository.existsByEmailOrUserId(email, userId)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email or User ID already exists"));
        }
        User u = new User();
        u.setName(name);
        u.setEmail(email);
        u.setPassword(password);
        u.setRole("admin");
        u.setUserId(userId);
        userRepository.save(u);
        return ResponseEntity.ok(Map.of("message", "Admin provisioned", "user", Map.of("id", u.getId())));
    }

    @GetMapping("/schools/{id}/locks")
    public Map<String, Object> getLocks(@PathVariable Long id) {
        School s = schoolRepository.findById(id).orElseThrow();
        return Map.of(
                "lockTeacherCreation", Optional.ofNullable(s.getLockTeacherCreation()).orElse(false),
                "lockStudentCreation", Optional.ofNullable(s.getLockStudentCreation()).orElse(false)
        );
    }

    @PutMapping("/schools/{id}/locks")
    public ResponseEntity<?> updateLocks(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        School s = schoolRepository.findById(id).orElseThrow();
        s.setLockTeacherCreation(Boolean.TRUE.equals(body.get("lockTeacherCreation")) || Boolean.TRUE.equals(Boolean.valueOf(String.valueOf(body.get("lockTeacherCreation")))));
        s.setLockStudentCreation(Boolean.TRUE.equals(body.get("lockStudentCreation")) || Boolean.TRUE.equals(Boolean.valueOf(String.valueOf(body.get("lockStudentCreation")))));
        schoolRepository.save(s);
        return ResponseEntity.ok(Map.of("message", "Locks updated"));
    }

    @GetMapping("/schools/export")
    public ResponseEntity<byte[]> exportCsv(@RequestParam(value = "q", required = false) String q) {
        List<School> schools;
        if (q != null && !q.isBlank()) {
            schools = schoolRepository.findByNameContainingIgnoreCaseOrCodeContainingIgnoreCase(q, q, PageRequest.of(0, Integer.MAX_VALUE)).getContent();
        } else {
            schools = schoolRepository.findAll();
        }
        StringBuilder sb = new StringBuilder("id,code,name,domain,email\n");
        for (School s : schools) {
            sb.append(s.getId()).append(',')
              .append(escape(s.getCode())).append(',')
              .append(escape(s.getName())).append(',')
              .append(escape(s.getDomain())).append(',')
              .append(escape(s.getEmail())).append('\n');
        }
        byte[] bytes = sb.toString().getBytes(StandardCharsets.UTF_8);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=schools.csv")
                .contentType(MediaType.TEXT_PLAIN)
                .body(bytes);
    }

    private String escape(String v) { return v == null ? "" : '"' + v.replace("\"", "\"\"") + '"'; }
}


