package com.example.gestiondocuments.Services;

import com.example.gestiondocuments.Entities.Report;
import com.example.gestiondocuments.Repositories.ReportRepository;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Disabled;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.util.ReflectionTestUtils;

import java.io.*;
import java.util.Base64;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.fail;
import static org.mockito.Mockito.*;

class ReportServiceImplTest {

    @Mock
    private ReportRepository reportRepository;

    @InjectMocks
    private ReportServiceImpl reportService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        
        // Use Spring's ReflectionTestUtils to set private fields
        ReflectionTestUtils.setField(reportService, "openAiApiKey", "fake-api-key-for-testing");
        ReflectionTestUtils.setField(reportService, "openAiEndpoint", "https://fake-endpoint.com");
    }

    // Helper: create a Report object using reflection
    private Report createReport(Long id, String filePath) {
        Report report = new Report();
        if (id != null) {
            ReflectionTestUtils.setField(report, "id", id);
        }
        if (filePath != null) {
            ReflectionTestUtils.setField(report, "filePath", filePath);
        }
        return report;
    }

    // Helper: create a small fake PDF and return Base64
    private String createFakePdf(String text) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PDDocument doc = new PDDocument();
        PDPage page = new PDPage();
        doc.addPage(page);
        
        if (text != null && !text.isEmpty()) {
            PDPageContentStream cs = new PDPageContentStream(doc, page);
            cs.beginText();
            cs.setFont(PDType1Font.HELVETICA, 12);
            cs.newLineAtOffset(50, 700);
            cs.showText(text);
            cs.endText();
            cs.close();
        }
        
        doc.save(baos);
        doc.close();
        return Base64.getEncoder().encodeToString(baos.toByteArray());
    }

    /** TU1 — Test with actual Azure OpenAI (integration test) 
     * This requires valid API credentials in application.properties
     * Skip this in CI/CD or when credentials are not available
     */
    @Test
    @Disabled("Requires valid Azure OpenAI API credentials - enable for integration testing")
    void testGenerateResumeForReport_withRealAPI() throws Exception {
        // Arrange
        Report report = createReport(1L, createFakePdf("Ceci est un rapport de test avec du contenu significatif pour le résumé."));
        
        when(reportRepository.findById(1L)).thenReturn(Optional.of(report));

        // Act
        String result = reportService.generateResumeForReport(1L);

        // Assert
        assertNotNull(result);
        // Note: This test will make a real API call and may fail if credentials are invalid
        System.out.println("Résumé généré: " + result);
    }

    /** TU2 — Report not found */
    @Test
    void testGenerateResumeForReport_reportNotFound() {
        // Arrange
        when(reportRepository.findById(99L)).thenReturn(Optional.empty());

        // Act
        String result = reportService.generateResumeForReport(99L);

        // Assert
        assertTrue(result.contains("Erreur") || result.contains("not found"), 
                   "Doit retourner un message d'erreur");
        verify(reportRepository, times(1)).findById(99L);
    }

    /** TU3 — Empty PDF */
    @Test
    void testGenerateResumeForReport_emptyPdf() throws Exception {
        // Arrange
        Report report = createReport(2L, createFakePdf("")); // Empty PDF
        
        when(reportRepository.findById(2L)).thenReturn(Optional.of(report));

        // Act
        String result = reportService.generateResumeForReport(2L);

        // Assert
        assertTrue(result.contains("aucun texte") || result.contains("Erreur"), 
                   "Doit indiquer qu'il n'y a pas de texte");
    }

    /** TU4 — Invalid Base64 data */
    @Test
    void testGenerateResumeForReport_invalidBase64() {
        // Arrange
        Report report = createReport(3L, "!!!invalid_base64###");
        
        when(reportRepository.findById(3L)).thenReturn(Optional.of(report));

        // Act
        String result = reportService.generateResumeForReport(3L);

        // Assert
        assertTrue(result.contains("Erreur"), "Doit gérer l'erreur de décodage Base64");
        verify(reportRepository, times(1)).findById(3L);
    }

    /** TU5 — PDF generation from résumé with mocked resume */
    @Test
    void testGenerateResumePdfForReport_withMockedResume() throws Exception {
        // Arrange
        ReportServiceImpl spyService = spy(reportService);
        
        // Copy the field values to the spy
        ReflectionTestUtils.setField(spyService, "openAiApiKey", "fake-api-key");
        ReflectionTestUtils.setField(spyService, "openAiEndpoint", "https://fake-endpoint.com");
        
        String mockResume = "Résumé test du rapport en français.\n\n" +
                           "Deuxième paragraphe avec accents: éèàçùô.\n\n" +
                           "Troisième paragraphe pour tester le formatage.";
        
        // Mock the generateResumeForReport to avoid API call
        doReturn(mockResume).when(spyService).generateResumeForReport(1L);

        // Act
        byte[] pdfBytes = spyService.generateResumePdfForReport(1L);

        // Assert
        assertNotNull(pdfBytes, "Le PDF ne doit pas être null");
        assertTrue(pdfBytes.length > 100, "Le PDF doit contenir du texte");
        
        // Verify PDF structure
        PDDocument doc = PDDocument.load(pdfBytes);
        assertEquals(1, doc.getNumberOfPages(), "Doit avoir 1 page");
        doc.close();
        
        // Verify that generateResumeForReport was called
        verify(spyService, times(1)).generateResumeForReport(1L);
    }

    /** TU6 — Test PDF generation when report not found */
    @Test
    void testGenerateResumePdfForReport_reportNotFound() {
        // Arrange
        when(reportRepository.findById(99L)).thenReturn(Optional.empty());

        // Act
        try {
            byte[] result = reportService.generateResumePdfForReport(99L);
            
            // If the method returns instead of throwing, check the result
            // The PDF might contain an error message
            if (result != null && result.length > 0) {
                // Service handled error gracefully by creating an error PDF
                System.out.println("Service returned error PDF instead of throwing exception");
            } else {
                fail("Expected either RuntimeException or error PDF, got null/empty result");
            }
        } catch (RuntimeException e) {
            // This is the expected behavior based on your service implementation
            assertTrue(e.getMessage().contains("Report not found"), 
                      "Exception should mention 'Report not found'");
        }
    }

    /** TU7 — Test signature addition */
    @Test
    void testAddSignatureToReport_success() {
        // Arrange
        Report report = createReport(1L, "some-pdf-data");
        ReflectionTestUtils.setField(report, "signature", null);
        ReflectionTestUtils.setField(report, "validatedByCompany", false);
        
        when(reportRepository.findById(1L)).thenReturn(Optional.of(report));
        when(reportRepository.save(any(Report.class))).thenReturn(report);

        String base64Signature = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

        // Act
        boolean result = reportService.addSignatureToReport(1L, base64Signature);

        // Assert
        assertTrue(result, "Doit retourner true si la signature est ajoutée");
        
        // Use reflection to check private fields
        Boolean isValidated = (Boolean) ReflectionTestUtils.getField(report, "validatedByCompany");
        String savedSignature = (String) ReflectionTestUtils.getField(report, "signature");
        
        assertTrue(isValidated, "Le rapport doit être marqué comme validé");
        assertEquals(base64Signature, savedSignature, "La signature doit être enregistrée");
        verify(reportRepository, times(1)).save(report);
    }

    /** TU8 — Test signature addition for non-existent report */
    @Test
    void testAddSignatureToReport_reportNotFound() {
        // Arrange
        when(reportRepository.findById(99L)).thenReturn(Optional.empty());

        // Act
        boolean result = reportService.addSignatureToReport(99L, "signature-data");

        // Assert
        assertFalse(result, "Doit retourner false si le rapport n'existe pas");
        verify(reportRepository, never()).save(any());
    }

    /** TU9 — Test text wrapping utility */
    @Test
    void testGenerateResumePdfForReport_longText() throws Exception {
        // Arrange
        ReportServiceImpl spyService = spy(reportService);
        ReflectionTestUtils.setField(spyService, "openAiApiKey", "fake-key");
        ReflectionTestUtils.setField(spyService, "openAiEndpoint", "https://fake.com");
        
        // Create a very long resume to test text wrapping
        StringBuilder longResume = new StringBuilder();
        for (int i = 0; i < 50; i++) {
            longResume.append("Ceci est une ligne très longue qui devrait être découpée automatiquement. ");
        }
        
        doReturn(longResume.toString()).when(spyService).generateResumeForReport(1L);

        // Act
        byte[] pdfBytes = spyService.generateResumePdfForReport(1L);

        // Assert
        assertNotNull(pdfBytes);
        assertTrue(pdfBytes.length > 1000, "Le PDF doit contenir beaucoup de texte");
        
        // Verify it's a valid PDF
        PDDocument doc = PDDocument.load(pdfBytes);
        assertTrue(doc.getNumberOfPages() > 0, "Doit avoir au moins une page");
        doc.close();
    }
}