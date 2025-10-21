package com.schools24.web;

import com.schools24.domain.*;
import com.schools24.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.*;

@RestController
@RequestMapping("/api/admin/fees")
@CrossOrigin
public class FeesController {
    private final SchoolRepository schoolRepository;
    private final FeeHeadRepository feeHeadRepository;
    private final FeeInvoiceRepository invoiceRepository;
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;

    public FeesController(SchoolRepository schoolRepository,
                          FeeHeadRepository feeHeadRepository,
                          FeeInvoiceRepository invoiceRepository,
                          PaymentRepository paymentRepository,
                          UserRepository userRepository) {
        this.schoolRepository = schoolRepository;
        this.feeHeadRepository = feeHeadRepository;
        this.invoiceRepository = invoiceRepository;
        this.paymentRepository = paymentRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/heads")
    public Map<String, Object> listHeads(@RequestParam Long schoolId) {
        School s = schoolRepository.findById(schoolId).orElseThrow();
        return Map.of("heads", feeHeadRepository.findBySchool(s));
    }

    @PostMapping("/heads")
    public ResponseEntity<?> createHead(@RequestBody Map<String, Object> body) {
        Long schoolId = Long.valueOf(String.valueOf(body.get("schoolId")));
        String name = (String) body.get("name");
        Integer amount = Integer.valueOf(String.valueOf(body.getOrDefault("amount", 0)));
        School s = schoolRepository.findById(schoolId).orElseThrow();
        FeeHead h = new FeeHead();
        h.setSchool(s);
        h.setName(name);
        h.setAmount(amount);
        feeHeadRepository.save(h);
        return ResponseEntity.created(URI.create("/api/admin/fees/heads/" + h.getId())).body(Map.of("head", h));
    }

    @PostMapping("/invoices")
    public ResponseEntity<?> createInvoice(@RequestBody Map<String, Object> body) {
        Long schoolId = Long.valueOf(String.valueOf(body.get("schoolId")));
        Long studentId = Long.valueOf(String.valueOf(body.get("studentId")));
        List<Integer> headIds = (List<Integer>) body.get("headIds");
        School s = schoolRepository.findById(schoolId).orElseThrow();
        User student = userRepository.findById(studentId).orElseThrow();
        FeeInvoice inv = new FeeInvoice();
        inv.setSchool(s);
        inv.setStudent(student);
        invoiceRepository.save(inv);
        int total = 0;
        for (Integer hid : headIds) {
            FeeHead head = feeHeadRepository.findById(hid.longValue()).orElseThrow();
            FeeInvoiceItem item = new FeeInvoiceItem();
            item.setInvoice(inv);
            item.setHead(head);
            item.setAmount(head.getAmount());
            inv.getItems().add(item);
            total += head.getAmount();
        }
        inv.setTotalAmount(total);
        invoiceRepository.save(inv);
        return ResponseEntity.ok(Map.of("invoiceId", inv.getId(), "total", total));
    }

    @PostMapping("/payments")
    public ResponseEntity<?> recordPayment(@RequestBody Map<String, Object> body) {
        Long invoiceId = Long.valueOf(String.valueOf(body.get("invoiceId")));
        Integer amount = Integer.valueOf(String.valueOf(body.get("amount")));
        String method = String.valueOf(body.getOrDefault("method", "CASH"));
        FeeInvoice inv = invoiceRepository.findById(invoiceId).orElseThrow();
        Payment p = new Payment();
        p.setInvoice(inv);
        p.setAmount(amount);
        p.setMethod(method);
        paymentRepository.save(p);
        int paid = Optional.ofNullable(inv.getPaidAmount()).orElse(0) + amount;
        inv.setPaidAmount(paid);
        inv.setStatus(paid >= inv.getTotalAmount() ? "PAID" : (paid > 0 ? "PARTIAL" : "UNPAID"));
        invoiceRepository.save(inv);
        return ResponseEntity.ok(Map.of("status", inv.getStatus(), "paidAmount", paid));
    }

    @GetMapping("/collections")
    public Map<String, Object> collections(@RequestParam Long schoolId) {
        School s = schoolRepository.findById(schoolId).orElseThrow();
        List<FeeInvoice> invs = invoiceRepository.findBySchool(s);
        int billed = invs.stream().mapToInt(FeeInvoice::getTotalAmount).sum();
        int collected = invs.stream().mapToInt(i -> Optional.ofNullable(i.getPaidAmount()).orElse(0)).sum();
        return Map.of("billed", billed, "collected", collected, "due", billed - collected);
    }
}


