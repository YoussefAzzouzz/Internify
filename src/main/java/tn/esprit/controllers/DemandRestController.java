package tn.esprit.controllers;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import tn.esprit.entities.Demand;
import tn.esprit.entities.StatisticsResponse;
import tn.esprit.services.IDemandService;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.time.LocalDate;
import java.util.*;

@Tag(name = "Demands Management")
@RestController
@AllArgsConstructor
@RequestMapping("/api/demands")
@CrossOrigin(origins = "http://localhost:4200")
public class DemandRestController {

    private static final String UPLOAD_DIR = "C:/Users/Dell/Desktop/Internify-Demands_Management/src/main/resources";

    private final ObjectMapper objectMapper;
    private final IDemandService demandService;

    // -------------------- GET Methods --------------------

    @GetMapping("/nearby")
    public List<Demand> getNearbyDemands(@RequestParam double lat,
                                         @RequestParam double lng,
                                         @RequestParam double radius) {
        return demandService.findNearbyDemands(lat, lng, radius);
    }

    @GetMapping("/getAllDemands")
    public List<Demand> getAllDemands() {
        return demandService.getAllDemands();
    }

    @GetMapping("/getDemandById/{id}")
    public Demand getDemandById(@PathVariable Long id) {
        return demandService.getDemandById(id);
    }

    @GetMapping("/statistics")
    public ResponseEntity<Object> getDemandStatistics(@RequestParam(required = false) String field,
                                                      @RequestParam(required = false) String status) {
        long totalDemands = demandService.countTotalDemands();
        long demandsByField = (field != null) ? demandService.countDemandsByField(field) : 0;
        long demandsByStatus = (status != null) ? demandService.countDemandsByStatus(status) : 0;

        return ResponseEntity.ok(new StatisticsResponse(totalDemands, demandsByField, demandsByStatus));
    }

    @GetMapping("/search")
    public List<Demand> searchDemands(@RequestParam String field) {
        return demandService.searchDemandsByField(field);
    }

    @GetMapping("/downloadCv/{id}")
    public ResponseEntity<byte[]> downloadCv(@PathVariable Long id) {
        Demand demand = demandService.getDemandById(id);

        if (demand == null || demand.getCv() == null) {
            return ResponseEntity.notFound().build();
        }

        byte[] cvFileBytes = Base64.getDecoder().decode(demand.getCv());

        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=cv.pdf")
                .body(cvFileBytes);
    }

    @GetMapping("/parseCv/{id}")
    public ResponseEntity<?> parseCvFromDemand(@PathVariable Long id) {
        // Fetch the demand
        Demand demand = demandService.getDemandById(id);
        if (demand == null || demand.getCv() == null) {
            System.out.println("Demand or CV not found for id: " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Demand or CV not found."));
        }

        File tempFile = null;
        try {
            // Decode Base64 CV and write to a temporary file
            byte[] decodedBytes = Base64.getDecoder().decode(demand.getCv());
            tempFile = File.createTempFile("cv_temp_", ".pdf");
            Files.write(tempFile.toPath(), decodedBytes);
            System.out.println("Temporary CV file created at: " + tempFile.getAbsolutePath());

            // Parse CV
            Map<String, Object> parsedData = parseCV(tempFile);
            System.out.println("Parsed CV data: " + parsedData);

            // Extract features
            Map<String, Object> featuresMap = (Map<String, Object>) parsedData.get("features");
            List<Double> features = Arrays.asList(
                    ((Number) featuresMap.getOrDefault("niveau_competences_techniques", 0)).doubleValue(),
                    ((Number) featuresMap.getOrDefault("niveau_competences_non_techniques", 0)).doubleValue()
            );
            System.out.println("Features to send to ML service: " + features);

            // Prepare request to ML service
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            Map<String, Object> requestBody = Map.of("features", features);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

            // Call ML service
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<Map> response;
            try {
                System.out.println("Sending request to ML service at http://localhost:5009/predict-cluster ...");
                response = restTemplate.postForEntity(
                        "http://localhost:5009/predict-cluster", request, Map.class
                );
            } catch (Exception e) {
                System.err.println("Failed to call ML service: " + e.getMessage());
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "Failed to call ML service: " + e.getMessage()));
            }

            // Read response
            if (response.getBody() == null || !response.getBody().containsKey("cluster")) {
                System.err.println("ML service returned invalid response: " + response.getBody());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "Invalid response from ML service"));
            }




            // Update demand
            Integer cluster = (Integer) response.getBody().get("cluster");
            System.out.println("Received cluster from ML service: " + cluster);
            demand.setCluster(cluster);  // cluster can now be null safely
            System.out.println("cluster: " + demand.getCluster());

            demandService.updateDemand(id, demand);

            parsedData.put("cluster", cluster);
            return ResponseEntity.ok(parsedData);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error processing CV: " + e.getMessage()));
        } finally {
            if (tempFile != null && tempFile.exists()) {
                tempFile.delete();
                System.out.println("Temporary CV file deleted.");
            }
        }
    }






    // -------------------- POST Methods --------------------

    @PostMapping("/upload-cv")
    public ResponseEntity<?> uploadCV(@RequestParam("file") MultipartFile file) {
        try {
            File convFile = new File(System.getProperty("java.io.tmpdir") + "/" + file.getOriginalFilename());
            file.transferTo(convFile);

            Map<String, Object> parsedData = parseCV(convFile);
            return ResponseEntity.ok(parsedData);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

    @PostMapping(value = "/addDemand", consumes = "multipart/form-data")
    public ResponseEntity<Demand> addDemand(@RequestPart("demand") String demandJson,
                                            @RequestPart(value = "cv", required = false) MultipartFile cvFile) {
        try {
            Demand demand = objectMapper.readValue(demandJson, Demand.class);

            if (cvFile != null && !cvFile.isEmpty()) {
                String base64File = Base64.getEncoder().encodeToString(cvFile.getBytes());
                demand.setCv(base64File);
            }

            Demand savedDemand = demandService.addDemand(demand, cvFile);
            return ResponseEntity.ok(savedDemand);

        } catch (IOException e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @PostMapping("/predictCluster/{id}")
    public ResponseEntity<?> predictClusterForDemand(@PathVariable Long id) {
        Demand demand = demandService.getDemandById(id);

        if (demand == null || demand.getCv() == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Demand or CV not found.");
        }

        try {
            byte[] decodedBytes = Base64.getDecoder().decode(demand.getCv());
            File tempFile = File.createTempFile("cv_temp", ".pdf");
            Files.write(tempFile.toPath(), decodedBytes);

            Map<String, Object> parsedData = parseCV(tempFile);
            tempFile.delete();

            List<Double> features = Arrays.asList(
                    ((Number) parsedData.getOrDefault("experience_years", 0)).doubleValue(),
                    ((Number) parsedData.getOrDefault("skills_score", 0)).doubleValue()
                    // Add more features as needed
            );

            RestTemplate restTemplate = new RestTemplate();
            String flaskApiUrl = "http://localhost:5009/predict-cluster";
            Map<String, Object> request = Map.of("features", features);

            Map response = restTemplate.postForObject(flaskApiUrl, request, Map.class);
            int cluster = (int) response.get("cluster");

            demand.setCluster(cluster);
            demandService.updateDemand(id, demand);

            return ResponseEntity.ok(Map.of("cluster", cluster));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

    // -------------------- PUT & DELETE Methods --------------------

    @PutMapping(value = "/updateDemand/{id}", consumes = "multipart/form-data")
    public ResponseEntity<Demand> updateDemand(@PathVariable Long id,
                                               @RequestPart("demand") String demandJson,
                                               @RequestPart(value = "cv", required = false) MultipartFile cvFile) {
        try {
            Demand demandToUpdate = objectMapper.readValue(demandJson, Demand.class);
            Demand existingDemand = demandService.getDemandById(id);

            if (existingDemand == null) {
                return ResponseEntity.notFound().build();
            }

            existingDemand.setTitle(demandToUpdate.getTitle());
            existingDemand.setDescription(demandToUpdate.getDescription());
            existingDemand.setField(demandToUpdate.getField());
            existingDemand.setStatus(demandToUpdate.getStatus());
            existingDemand.setDate(java.sql.Date.valueOf(LocalDate.now()));

            if (cvFile != null && !cvFile.isEmpty()) {
                String base64File = Base64.getEncoder().encodeToString(cvFile.getBytes());
                existingDemand.setCv(base64File);
            }

            Demand updatedDemand = demandService.updateDemand(id, existingDemand);
            return ResponseEntity.ok(updatedDemand);

        } catch (IOException e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @DeleteMapping("/deleteDemand/{id}")
    public void deleteDemand(@PathVariable Long id) {
        demandService.deleteDemand(id);
    }

    // -------------------- Helper Method --------------------

    public Map<String, Object> parseCV(File cvFile) throws IOException {
        String scriptPath = "C:\\Users\\Dell\\Desktop\\Internify-Demands_Management\\cv_parser.py";

        System.out.println("Starting CV parsing for file: " + cvFile.getAbsolutePath());
        System.out.println("Python script path: " + scriptPath);

        // Check if files exist
        if (!cvFile.exists()) {
            throw new IOException("CV file not found: " + cvFile.getAbsolutePath());
        }

        if (!new File(scriptPath).exists()) {
            throw new IOException("Python script not found: " + scriptPath);
        }

        ProcessBuilder processBuilder = new ProcessBuilder("python", scriptPath, cvFile.getAbsolutePath());

        // Set environment variables including OpenAI API key
        Map<String, String> env = processBuilder.environment();
        env.put("PYTHONPATH", "C:\\Users\\Dell\\Desktop\\Internify-Demands_Management");
        env.put("OPENAI_API_KEY", "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"); // Set your API key here

        processBuilder.redirectErrorStream(true);

        Process process = null;
        StringBuilder output = new StringBuilder();

        try {
            process = processBuilder.start();

            // Read stdout
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append(line);
                    System.out.println("Python output: " + line); // Debug logging
                }
            }

            // Wait for process to complete with timeout
            boolean finished = process.waitFor(60, java.util.concurrent.TimeUnit.SECONDS); // Increased timeout for OpenAI
            if (!finished) {
                process.destroy();
                throw new IOException("Python script timed out after 60 seconds");
            }

            int exitCode = process.exitValue();
            System.out.println("Python script exit code: " + exitCode);

            if (exitCode != 0) {
                throw new IOException("Python script exited with code " + exitCode + ". Output: " + output.toString());
            }

            // Parse JSON response
            if (output.length() == 0) {
                throw new IOException("Python script returned empty response");
            }

            String jsonResponse = output.toString();
            System.out.println("Raw JSON response: " + jsonResponse);

            // Handle case where Python script returns error JSON
            if (jsonResponse.contains("\"error\"")) {
                Map<String, Object> errorResponse = objectMapper.readValue(jsonResponse,
                        new TypeReference<Map<String, Object>>() {});
                if (errorResponse.containsKey("error")) {
                    throw new IOException("Python script error: " + errorResponse.get("error"));
                }
            }

            return objectMapper.readValue(jsonResponse, new TypeReference<Map<String, Object>>() {});

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("CV parsing interrupted", e);
        } catch (Exception e) {
            throw new IOException("Failed to parse CV: " + e.getMessage() + ". Python output: " + output.toString(), e);
        } finally {
            if (process != null) {
                process.destroy();
            }
        }
    }
}
