package com.example.gestiondocuments.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;

import com.example.gestiondocuments.Services.AITestGenerationService;

@RestController
@RequestMapping("/api/ai-testing")
@CrossOrigin(origins = "*")
public class AITestingController {

    @Autowired
    private AITestGenerationService aiTestService;

    /**
     * Génère des tests unitaires à partir d'un fichier source
     */
    @PostMapping("/generate/unit-tests")
    public ResponseEntity<TestGenerationResponse> generateUnitTests(
            @RequestParam("sourceFile") MultipartFile file,
            @RequestParam(defaultValue = "JUnit 5") String framework) {
        try {
            String sourceCode = new String(file.getBytes(), StandardCharsets.UTF_8);
            String className = file.getOriginalFilename().replace(".java", "");
            
            String generatedTests = aiTestService.generateUnitTests(sourceCode, className, framework);
            
            return ResponseEntity.ok(new TestGenerationResponse(
                "success",
                "Tests unitaires générés avec succès",
                generatedTests,
                className + "Test.java"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new TestGenerationResponse(
                "error",
                "Erreur lors de la génération : " + e.getMessage(),
                null,
                null
            ));
        }
    }

    /**
     * Génère des tests d'intégration pour un contrôleur REST
     */
    @PostMapping("/generate/integration-tests")
    public ResponseEntity<TestGenerationResponse> generateIntegrationTests(
            @RequestParam("controllerFile") MultipartFile file,
            @RequestParam String endpointPath) {
        try {
            String controllerCode = new String(file.getBytes(), StandardCharsets.UTF_8);
            
            String generatedTests = aiTestService.generateIntegrationTests(controllerCode, endpointPath);
            
            return ResponseEntity.ok(new TestGenerationResponse(
                "success",
                "Tests d'intégration générés avec succès",
                generatedTests,
                file.getOriginalFilename().replace(".java", "IntegrationTest.java")
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new TestGenerationResponse(
                "error",
                "Erreur lors de la génération : " + e.getMessage(),
                null,
                null
            ));
        }
    }

    /**
     * Génère des tests E2E basés sur des user stories
     */
    @PostMapping("/generate/e2e-tests")
    public ResponseEntity<TestGenerationResponse> generateE2ETests(
            @RequestBody E2ETestRequest request) {
        try {
            String generatedTests = aiTestService.generateE2ETests(
                request.featureDescription(),
                request.userStories()
            );
            
            return ResponseEntity.ok(new TestGenerationResponse(
                "success",
                "Tests E2E générés avec succès",
                generatedTests,
                "E2ETests.feature"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new TestGenerationResponse(
                "error",
                "Erreur lors de la génération : " + e.getMessage(),
                null,
                null
            ));
        }
    }

    /**
     * Analyse le code pour détecter des bugs
     */
    @PostMapping("/analyze/bugs")
    public ResponseEntity<AnalysisResponse> analyzeCode(
            @RequestParam("sourceFile") MultipartFile file,
            @RequestParam(defaultValue = "java") String language) {
        try {
            String sourceCode = new String(file.getBytes(), StandardCharsets.UTF_8);
            
            String analysis = aiTestService.analyzeCodeForBugs(sourceCode, language);
            
            return ResponseEntity.ok(new AnalysisResponse(
                "success",
                "Analyse terminée",
                analysis
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new AnalysisResponse(
                "error",
                "Erreur lors de l'analyse : " + e.getMessage(),
                null
            ));
        }
    }

    /**
     * Génère des données de test réalistes
     */
    @PostMapping("/generate/test-data")
    public ResponseEntity<TestGenerationResponse> generateTestData(
            @RequestParam("entityFile") MultipartFile file,
            @RequestParam(defaultValue = "10") int numberOfRecords,
            @RequestParam(defaultValue = "valides") String dataType) {
        try {
            String entityClass = new String(file.getBytes(), StandardCharsets.UTF_8);
            
            String testData = aiTestService.generateTestData(entityClass, numberOfRecords, dataType);
            
            return ResponseEntity.ok(new TestGenerationResponse(
                "success",
                "Données de test générées avec succès",
                testData,
                "test-data.json"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new TestGenerationResponse(
                "error",
                "Erreur lors de la génération : " + e.getMessage(),
                null,
                null
            ));
        }
    }

    /**
     * Analyse la couverture de code et suggère des tests manquants
     */
    @PostMapping("/analyze/coverage")
    public ResponseEntity<AnalysisResponse> analyzeCoverage(
            @RequestBody CoverageAnalysisRequest request) {
        try {
            String analysis = aiTestService.analyzeCoverageAndSuggestTests(
                request.sourceCode(),
                request.existingTests(),
                request.currentCoverage()
            );
            
            return ResponseEntity.ok(new AnalysisResponse(
                "success",
                "Analyse de couverture terminée",
                analysis
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new AnalysisResponse(
                "error",
                "Erreur lors de l'analyse : " + e.getMessage(),
                null
            ));
        }
    }

    /**
     * Génère un rapport de validation logicielle complet
     */
    @PostMapping("/generate/validation-report")
    public ResponseEntity<byte[]> generateValidationReport(
            @RequestBody ValidationReportRequest request) {
        try {
            String report = aiTestService.generateValidationReport(
                request.projectName(),
                request.testResults(),
                request.codeAnalysis()
            );
            
            byte[] reportBytes = report.getBytes(StandardCharsets.UTF_8);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", 
                "validation-report-" + request.projectName() + ".md");
            
            return ResponseEntity.ok()
                .headers(headers)
                .body(reportBytes);
                
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Génère des tests de performance
     */
    @PostMapping("/generate/performance-tests")
    public ResponseEntity<TestGenerationResponse> generatePerformanceTests(
            @RequestBody PerformanceTestRequest request) {
        try {
            String performanceTests = aiTestService.generatePerformanceTests(
                request.apiEndpoints(),
                request.expectedLoad()
            );
            
            return ResponseEntity.ok(new TestGenerationResponse(
                "success",
                "Tests de performance générés avec succès",
                performanceTests,
                "PerformanceTest.scala"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new TestGenerationResponse(
                "error",
                "Erreur lors de la génération : " + e.getMessage(),
                null,
                null
            ));
        }
    }

    /**
     * Télécharge les tests générés
     */
    @GetMapping("/download/{type}")
    public ResponseEntity<byte[]> downloadGeneratedTests(
            @PathVariable String type,
            @RequestParam String content,
            @RequestParam String filename) {
        try {
            byte[] fileContent = content.getBytes(StandardCharsets.UTF_8);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", filename);
            
            return ResponseEntity.ok()
                .headers(headers)
                .body(fileContent);
                
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}

// DTOs (Data Transfer Objects)

record TestGenerationResponse(
    String status,
    String message,
    String generatedCode,
    String suggestedFilename
) {}

record AnalysisResponse(
    String status,
    String message,
    String analysis
) {}

record E2ETestRequest(
    String featureDescription,
    String userStories
) {}

record CoverageAnalysisRequest(
    String sourceCode,
    String existingTests,
    double currentCoverage
) {}

record ValidationReportRequest(
    String projectName,
    String testResults,
    String codeAnalysis
) {}

record PerformanceTestRequest(
    String apiEndpoints,
    int expectedLoad
) {}