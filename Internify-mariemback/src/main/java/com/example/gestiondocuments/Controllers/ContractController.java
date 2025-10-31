package com.example.gestiondocuments.Controllers;

import com.example.gestiondocuments.Entities.*;
import com.example.gestiondocuments.Services.IContractService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Base64;
import java.util.Date;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins="http://localhost:4200")
@RestController
@RequestMapping("/contracts")
public class ContractController {

    private final IContractService contractService;
    private final ObjectMapper objectMapper; // Needed to parse JSON manually





    @Autowired
    public ContractController(IContractService contractService, ObjectMapper objectMapper) {
        this.contractService = contractService;
        this.objectMapper = objectMapper;

    }

    @PostMapping(value = "/create", consumes = "multipart/form-data")
    public ResponseEntity<Contract> createContract(
            @RequestPart("contract") String contractJson,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        try {
            Contract contract = objectMapper.readValue(contractJson, Contract.class);

            if (file != null && !file.isEmpty()) {
                byte[] watermarkedFile = contractService.applyWatermarkAndConvertToBase64(file, "CONFIDENTIAL");
                String base64File = Base64.getEncoder().encodeToString(watermarkedFile);
                contract.setFileData(base64File);
            }

            Contract savedContract = contractService.createContract(contract, file);
            return ResponseEntity.ok(savedContract);
        } catch (IOException e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<byte[]> downloadContractFile(@PathVariable Long id) {
        Contract contract = contractService.getContractById(id);
        if (contract == null || contract.getFileData() == null) {
            return ResponseEntity.notFound().build();
        }

        byte[] fileBytes = Base64.getDecoder().decode(contract.getFileData()); // Decode from Base64

        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=contract.pdf")
                .body(fileBytes);
    }

    @GetMapping("/statistics/status")
    public ResponseEntity<Map<String, Long>> getContractsByStatus() {
        return ResponseEntity.ok(contractService.getContractsByStatus());
    }

    @GetMapping("/search")
    public List<Contract> getContracts(
            @RequestParam(required = false) Long id,
            @RequestParam(required = false) ContractStatus status) {

        return contractService.getFilteredContracts(id, status); // Return filtered contracts
    }




    @GetMapping("/getAllContracts")
    public ResponseEntity<List<Contract>> getAllContracts() {
        return ResponseEntity.ok(contractService.getAllContracts());
    }

    @GetMapping("/contract/{id}")
    public ResponseEntity<Contract> getContractById(@PathVariable Long id) {
        return ResponseEntity.ok(contractService.getContractById(id));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateContract(
            @PathVariable Long id,
            @RequestBody Contract contractDetails) {

        try {
            Contract existingContract = contractService.getContractById(id);
            if (existingContract == null) {
                return ResponseEntity.status(404).body("Contract not found");
            }

            String base64File = contractDetails.getFileData(); // Get Base64 data from request
            // Update the contract
            contractService.updateContract(id, contractDetails, base64File);

            // ✅ Return a success message instead of the contract object
            return ResponseEntity.ok("Contract updated successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating contract: " + e.getMessage());
        }
    }


    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteContract(@PathVariable Long id) {
        Contract contract = contractService.getContractById(id);
        if (contract == null) {
            return ResponseEntity.status(404).body("Contract not found");
        }

        contractService.deleteContract(id);
        return ResponseEntity.ok("Contract deleted successfully.");
    }

    @GetMapping("/entreprise/{entrepriseId}")
    public ResponseEntity<List<Contract>> getContractsByEntreprise(@PathVariable Long entrepriseId) {
        List<Contract> contracts = contractService.getContractsByEntreprise(entrepriseId);
        return ResponseEntity.ok(contracts);
    }




    // Get contracts by job seeker ID
    @GetMapping("/jobseeker/{id}")
    public ResponseEntity<List<Contract>> getContractsByJobSeeker(@PathVariable Long id) {
        List<Contract> contracts = contractService.getContractsByJobSeekerId(id);
        return ResponseEntity.ok(contracts);
    }




    @GetMapping("/offers")
    public ResponseEntity<List<Offer>> getOffers() {
        return ResponseEntity.ok(contractService.getAllOffers());
    }

    /*@GetMapping("/demands")
    public ResponseEntity<List<Demand>> getDemands() {
        return ResponseEntity.ok(contractService.getAllDemands());
    }*/

    @GetMapping("/job-seekers")
    public ResponseEntity<List<JobSeeker>> getJobSeekers() {
        return ResponseEntity.ok(contractService.getAllJobSeekers());
    }

}
