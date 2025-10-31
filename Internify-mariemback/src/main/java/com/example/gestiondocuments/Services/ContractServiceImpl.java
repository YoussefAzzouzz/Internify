package com.example.gestiondocuments.Services;

import com.example.gestiondocuments.Entities.*;
import com.example.gestiondocuments.Specifications.ContractSpecifications;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.graphics.state.PDExtendedGraphicsState;
import org.apache.pdfbox.util.Matrix;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.example.gestiondocuments.Repositories.ContractRepository;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ContractServiceImpl implements IContractService {

    

    

    @PersistenceContext
    private EntityManager entityManager;

    @PostConstruct
    public void initTwilio() {
        Twilio.init(accountSid, authToken);
        System.out.println("Twilio Initialized with SID: " + accountSid);
    }


    private final ContractRepository contractRepository;
    private final JavaMailSender mailSender;

    @Override
    public void sendEmailNotification(String recipientEmail, String contractId) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(recipientEmail);
        message.setSubject("Contract Status Updated");
        message.setText("The status of contract with ID " + contractId + " has been changed to SIGNED.");

        mailSender.send(message);
    }


    @Override
    public Contract createContract(Contract contract, MultipartFile file) throws IOException {
        // ✅ Create an Entreprise instance with ID 1 (No need for repository)
        Entreprise entreprise = new Entreprise();
        entreprise.setId(1L); // Set ID manually
        contract.setEntreprise(entreprise);
        if (file != null && !file.isEmpty()) {
            // Apply watermark before saving the file
            byte[] watermarkedBytes = applyWatermarkAndConvertToBase64(file, "CONFIDENTIAL");
            contract.setFileData(Base64.getEncoder().encodeToString(watermarkedBytes)); // Convert when setting
        }
        return contractRepository.save(contract);
    }

    @Override
    public Contract createContractWithFile(Contract contract, MultipartFile file) throws IOException {
        if (!file.isEmpty()) {
            // Convert file to Base64
            String base64File = Base64.getEncoder().encodeToString(file.getBytes());

            // Set Base64 string in contract entity
            contract.setFileData(base64File);  // ✅ Use setFileData() instead of setFilePath()
        }

        return contractRepository.save(contract);
    }

    @Override
    public byte[] applyWatermarkAndConvertToBase64(MultipartFile file, String watermarkText) throws IOException {
        try (PDDocument document = PDDocument.load(file.getInputStream());
             ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {

            for (PDPage page : document.getPages()) {
                PDRectangle mediaBox = page.getMediaBox();
                float pageWidth = mediaBox.getWidth();
                float pageHeight = mediaBox.getHeight();

                try (PDPageContentStream contentStream = new PDPageContentStream(document, page, PDPageContentStream.AppendMode.APPEND, true, true)) {
                    contentStream.setFont(PDType1Font.HELVETICA_BOLD, 14); // Smaller font size
                    contentStream.setNonStrokingColor(200, 0, 0); // Red color

                    // Set transparency
                    PDExtendedGraphicsState graphicsState = new PDExtendedGraphicsState();
                    graphicsState.setNonStrokingAlphaConstant(0.3f); // 30% transparency
                    page.getResources().add(graphicsState);
                    contentStream.setGraphicsStateParameters(graphicsState);

                    // Adjusted: Watermarks spread proportionally across the page
                    int cols = 4;  // Number of watermarks per row
                    int rows = (int) Math.ceil(pageHeight / 150); // Dynamically calculate number of rows

                    float xSpacing = pageWidth / (cols + 1);  // Distribute evenly across width
                    float ySpacing = pageHeight / (rows + 1); // Distribute evenly across height

                    for (int i = 1; i <= cols; i++) {
                        for (int j = 1; j <= rows; j++) {
                            float x = i * xSpacing;
                            float y = j * ySpacing;

                            contentStream.beginText();
                            contentStream.setTextMatrix(0.7f, -0.7f, 0.7f, 0.7f, x, y); // Rotation + positioning
                            contentStream.showText(watermarkText);
                            contentStream.endText();
                        }
                    }
                }
            }

            document.save(outputStream);
            return outputStream.toByteArray();
        }
    }






    @Override
    public Contract updateContract(Long id, Contract contractDetails, String base64File) {
        // Fetch existing contract from the database
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contract not found"));

        // Store old status for comparison
        String oldStatus = contract.getStatus().name();  // Fix: Ensure it's a string
        String newStatus = contractDetails.getStatus().name(); // Fix: Convert enum to String

        boolean statusChanged = !oldStatus.equals(newStatus);

        // ✅ Preserve old data if new data is null
        if (contractDetails.getStartDate() != null) {
            contract.setStartDate(contractDetails.getStartDate());
        }
        if (contractDetails.getEndDate() != null) {
            contract.setEndDate(contractDetails.getEndDate());
        }
        if (contractDetails.getStatus() != null) {
            contract.setStatus(contractDetails.getStatus());
        }

        // ✅ If a new file is provided, update it; otherwise, keep old file
        if (base64File != null && !base64File.isEmpty()) {
            contract.setFileData(base64File);
        }

        // Save updated contract
        Contract updatedContract = contractRepository.save(contract);

        // ✅ Always send SMS to a fixed number
        String myPhoneNumber = "+21629004726";
        sendSms(myPhoneNumber, "Your contract status has changed from " + oldStatus + " to " + newStatus);

        // ✅ Send email if the status changed
        if (statusChanged) {
            sendEmailNotification("mariem.jemaiel@esprit.tn", String.valueOf(id));
        }

        return updatedContract; // ✅ Ensure the updated contract is returned correctly
    }


    private void sendSms(String to, String message) {
        try {
            Twilio.init(accountSid, authToken);
            Message msg = Message.creator(
                    new com.twilio.type.PhoneNumber(to),
                    new com.twilio.type.PhoneNumber(twilioPhoneNumber),
                    message
            ).create();

            System.out.println("SMS Sent Successfully! SID: " + msg.getSid());
        } catch (Exception e) {
            System.err.println("Error sending SMS: " + e.getMessage());
        }
    }


    @Override
    public Map<String, Long> getContractsByStatus() {
        return contractRepository.findAll().stream()
                .collect(Collectors.groupingBy(contract -> contract.getStatus().name(), Collectors.counting()));
    }





    @Override
    public List<Contract> getContractsByJobSeekerId(Long jobSeekerId) {
        return contractRepository.findByJobSeekerId(jobSeekerId);
    }

    @Override
    public List<Contract> getFilteredContracts(Long id, ContractStatus status) {
        Specification<Contract> spec = Specification.where(ContractSpecifications.hasId(id))
                .and(ContractSpecifications.hasStatus(status));

        return contractRepository.findAll(spec); // Return all contracts that match the filters
    }






    @Transactional
    @Modifying
    @Override
    public void deleteContract(Long id) {
        contractRepository.deleteById(id);
        entityManager.flush();
    }

    @Override
    public List<Contract> getAllContracts() {
        return contractRepository.findAll();
    }

    @Override
    public Contract getContractById(Long id) {
        return contractRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contract not found"));
    }

    public List<Contract> getContractsByEntreprise(Long entrepriseId) {
        return contractRepository.findByEntreprise_Id(entrepriseId);
    }


    @Override
    public List<Offer> getAllOffers() {
        return contractRepository.findAllOffers();
    }

    /*@Override
    public List<Demand> getAllDemands() {
        return contractRepository.findAllDemands();
    }*/

    @Override
    public List<JobSeeker> getAllJobSeekers() {
        return contractRepository.findAllJobSeekers();
    }
}
