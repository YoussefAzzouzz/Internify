package com.example.gestiondocuments.Controllers;

import com.example.gestiondocuments.Entities.Report;
import com.example.gestiondocuments.Services.IReportService;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.io.output.ByteArrayOutputStream;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDFont;
import org.apache.pdfbox.pdmodel.font.PDType0Font;

@CrossOrigin(origins="http://localhost:4200")
@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
public class ReportController {

    private final IReportService reportService;

    @PostMapping("/add")
    public ResponseEntity<Report> addReport(@RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(reportService.addReport(file));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Report>> getAllReports() {
        return ResponseEntity.ok(reportService.getAllReports());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Report> getReportById(@PathVariable Long id) {
        return ResponseEntity.ok(reportService.getReportById(id));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Report> updateReport(@PathVariable Long id, @RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(reportService.updateReport(id, file));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteReport(@PathVariable Long id) {
        reportService.deleteReport(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/sign/{reportId}")
    public ResponseEntity<String> addSignature(@PathVariable Long reportId, @RequestBody SignatureRequest request) {
        boolean success = reportService.addSignatureToReport(reportId, request.getSignature());
        if (success) {
            return ResponseEntity.ok("Signature added successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Report not found");
        }
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<byte[]> downloadSignedReport(@PathVariable Long id) {
        try {
            byte[] signedPdfBytes = reportService.getSignedPdfWithSignature(id);

            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=report_" + id + ".pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(signedPdfBytes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(("Error occurred: " + e.getMessage()).getBytes());
        }
    }

    @GetMapping("/stats")
    public Map<String, Long> getReportStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("validated", reportService.getValidatedReportsCount());
        stats.put("notValidated", reportService.getNotValidatedReportsCount());
        return stats;
    }

    static class SignatureRequest {
        private String signature;

        public String getSignature() {
            return signature;
        }

        public void setSignature(String signature) {
            this.signature = signature;
        }
    }

    // ✅ ENDPOINT RÉSUMÉ IA - CORRIGÉ AVEC LOGS
    @GetMapping("/resume/{reportId}")
public ResponseEntity<byte[]> downloadResume(@PathVariable("reportId") Long reportId) {
    try {
        byte[] pdfBytes = reportService.generateResumePdfForReport(reportId);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition.builder("attachment")
                .filename("resume_report_" + reportId + ".pdf").build());

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);

    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}
}