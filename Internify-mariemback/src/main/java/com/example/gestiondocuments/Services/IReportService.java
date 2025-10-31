package com.example.gestiondocuments.Services;

import com.example.gestiondocuments.Entities.Report;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

public interface IReportService {
    Report addReport(MultipartFile file) throws IOException;
    List<Report> getAllReports();
    Report getReportById(Long id);
    Report updateReport(Long id, MultipartFile file) throws IOException;
    void deleteReport(Long id);
    boolean addSignatureToReport(Long reportId, String base64Signature);
    Optional<byte[]> getSignedPdf(Long reportId);
    PDImageXObject createSignatureImage(String base64Signature, PDDocument document);
    byte[] getSignedPdfWithSignature(Long reportId) ;
    long getValidatedReportsCount();
    long getNotValidatedReportsCount();
    String generateResumeForReport(Long reportId);
    byte[] generateResumePdfForReport(Long reportId);


}
