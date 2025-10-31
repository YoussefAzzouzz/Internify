package com.example.gestiondocuments.Services;

import com.example.gestiondocuments.Entities.JobSeeker;
import com.example.gestiondocuments.Entities.Report;
import com.example.gestiondocuments.Repositories.ReportRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDFont;
import org.apache.pdfbox.pdmodel.font.PDType0Font;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.graphics.image.LosslessFactory;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.*;
import java.net.HttpURLConnection;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.nio.charset.StandardCharsets;


import org.apache.pdfbox.pdmodel.font.PDFont;
import org.apache.pdfbox.pdmodel.font.PDType0Font;


@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements IReportService {

    private final ReportRepository reportRepository;

    @Value("${azure.openai.api.key}")
private String openAiApiKey;

@Value("${azure.openai.endpoint}")
private String openAiEndpoint;


    // ------------------- CRUD -------------------

    @Override
    public Report addReport(MultipartFile file) throws IOException {
        JobSeeker jobSeeker = new JobSeeker();
        jobSeeker.setId(1L); // manually set JobSeeker ID

        String base64File = Base64.getEncoder().encodeToString(file.getBytes());

        Report report = new Report();
        report.setFilePath(base64File);
        report.setSubmissionDate(new Date());
        report.setValidatedByCompany(false);
        report.setJobSeeker(jobSeeker);

        return reportRepository.save(report);
    }

    @Override
    public List<Report> getAllReports() {
        return reportRepository.findAll();
    }

    @Override
    public Report getReportById(Long id) {
        return reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));
    }

    @Override
    public Report updateReport(Long id, MultipartFile file) throws IOException {
        Report report = getReportById(id);

        if (file != null && !file.isEmpty()) {
            String base64File = Base64.getEncoder().encodeToString(file.getBytes());
            report.setFilePath(base64File);
        }

        return reportRepository.save(report);
    }

    @Override
    public void deleteReport(Long id) {
        reportRepository.deleteById(id);
    }

    // ------------------- Signatures -------------------

    @Override
    @Transactional
    public boolean addSignatureToReport(Long reportId, String base64Signature) {
        Optional<Report> reportOptional = reportRepository.findById(reportId);
        if (reportOptional.isPresent()) {
            Report report = reportOptional.get();
            report.setSignature(base64Signature);
            report.setValidatedByCompany(true);
            reportRepository.save(report);
            return true;
        }
        return false;
    }

    @Override
    public Optional<byte[]> getSignedPdf(Long reportId) {
        Optional<Report> reportOptional = reportRepository.findById(reportId);
        if (reportOptional.isPresent()) {
            Report report = reportOptional.get();
            String filePath = report.getFilePath();

            if (filePath == null || filePath.isEmpty()) return Optional.empty();

            try {
                File pdfFile = new File(filePath);
                if (!pdfFile.exists()) return Optional.empty();

                PDDocument document = PDDocument.load(pdfFile);
                PDPage page = document.getPage(document.getNumberOfPages() - 1);
                PDImageXObject signatureImage = createSignatureImage(report.getSignature(), document);

                if (signatureImage != null) {
                    PDPageContentStream contentStream = new PDPageContentStream(document, page, PDPageContentStream.AppendMode.APPEND, true);
                    contentStream.drawImage(signatureImage, 450, 50, 100, 50);
                    contentStream.close();
                }

                ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
                document.save(outputStream);
                document.close();

                return Optional.of(outputStream.toByteArray());
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return Optional.empty();
    }

    @Override
    public PDImageXObject createSignatureImage(String base64Signature, PDDocument document) {
        try {
            byte[] decodedBytes = Base64.getDecoder().decode(base64Signature);
            BufferedImage bufferedImage = ImageIO.read(new ByteArrayInputStream(decodedBytes));

            if (bufferedImage != null) {
                return LosslessFactory.createFromImage(document, bufferedImage);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public byte[] getSignedPdfWithSignature(Long reportId) {
        try {
            Report report = reportRepository.findById(reportId)
                    .orElseThrow(() -> new RuntimeException("Report not found"));

            byte[] pdfBytes = Base64.getDecoder().decode(report.getFilePath());
            byte[] signatureBytes = Base64.getDecoder().decode(report.getSignature());

            PDDocument document = PDDocument.load(pdfBytes);
            PDPage page = document.getPage(document.getNumberOfPages() - 1);
            PDImageXObject pdImage = LosslessFactory.createFromImage(document, ImageIO.read(new ByteArrayInputStream(signatureBytes)));

            PDPageContentStream contentStream = new PDPageContentStream(document, page, PDPageContentStream.AppendMode.APPEND, true);
            contentStream.drawImage(pdImage, 400, 50, 100, 50);
            contentStream.close();

            ByteArrayOutputStream output = new ByteArrayOutputStream();
            document.save(output);
            document.close();

            return output.toByteArray();
        } catch (IOException e) {
            throw new RuntimeException("Error while adding signature to PDF", e);
        }
    }

    // ------------------- Stats -------------------

    @Override
    public long getValidatedReportsCount() {
        return reportRepository.countValidatedReports();
    }

    @Override
    public long getNotValidatedReportsCount() {
        return reportRepository.countNotValidatedReports();
    }

    // ------------------- Summary (LLM) -------------------

   @Override
public String generateResumeForReport(Long reportId) {
    try {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        byte[] pdfBytes = Base64.getDecoder().decode(report.getFilePath());
        PDDocument document = PDDocument.load(pdfBytes);

        PDFTextStripper stripper = new PDFTextStripper();
        stripper.setLineSeparator("\n");
        String extractedText = stripper.getText(document);
        document.close();

        if (extractedText.isBlank()) {
            return "Le rapport ne contient aucun texte à résumer.";
        }

        String limitedText = extractedText.length() > 8000 ? extractedText.substring(0, 8000) : extractedText;

        String prompt = """
Tu es un assistant intelligent spécialisé dans le résumé de rapports techniques et académiques.
Analyse attentivement le texte suivant et produis un résumé clair, structuré et concis en français.

⚙️ Contraintes :
- Le résumé doit comporter au maximum 3 paragraphes.
- Chaque paragraphe doit être fluide et cohérent, sans répétitions inutiles.
- Mets en avant les points essentiels : objectif du rapport, méthodologie, résultats principaux et conclusion.
- Utilise un ton formel et professionnel.
- Ne copie pas directement des phrases du texte, reformule de manière naturelle.

Voici le rapport à résumer :
""" + limitedText;

        String requestBody = """
        {
          "messages": [
            {"role": "system", "content": "Tu es un assistant IA qui résume les rapports de manière claire et concise."},
            {"role": "user", "content": "%s"}
          ]
        }
        """.formatted(prompt.replace("\"", "\\\"").replace("\n", "\\n"));

        HttpURLConnection connection = (HttpURLConnection) new URL(
                "https://elboniai.services.ai.azure.com/openai/deployments/Llama-3.3-70B-Instruct/chat/completions?api-version=2023-07-01-preview"
        ).openConnection();
        connection.setRequestMethod("POST");
        connection.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
        connection.setRequestProperty("api-key", openAiApiKey);
        connection.setDoOutput(true);

        // ✅ Fixed: Write request with UTF-8 encoding
        try (OutputStream os = connection.getOutputStream()) {
            os.write(requestBody.getBytes(StandardCharsets.UTF_8));
            os.flush();
        }

        // ✅ Fixed: Read response with UTF-8 encoding
        StringBuilder response = new StringBuilder();
        try (BufferedReader br = new BufferedReader(
                new InputStreamReader(connection.getInputStream(), StandardCharsets.UTF_8))) {
            String line;
            while ((line = br.readLine()) != null) {
                response.append(line);
            }
        }

        JSONObject jsonResponse = new JSONObject(response.toString());
        return jsonResponse
                .getJSONArray("choices")
                .getJSONObject(0)
                .getJSONObject("message")
                .getString("content");

    } catch (Exception e) {
        e.printStackTrace();
        return "Erreur lors de la génération du résumé (vérifiez votre clé Azure OpenAI).";
    }
}

@Override
public byte[] generateResumePdfForReport(Long reportId) {
    try {
        // 1️⃣ Get the AI-generated résumé text
        String summary = generateResumeForReport(reportId);

        // 2️⃣ Create new PDF document
        PDDocument document = new PDDocument();
        PDPage page = new PDPage();
        document.addPage(page);

        // 3️⃣ ✅ Fixed: Load TrueType font that supports UTF-8 characters
        // Option 1: Load DejaVuSans font from resources (recommended)
        PDFont font = PDType0Font.load(document, 
            getClass().getResourceAsStream("/fonts/DejaVuSans.ttf"));
        
        // Option 2: If you don't have the font file, use this fallback:
        // PDFont font = PDType1Font.HELVETICA;
        // But you'll need to clean the text first - see note below

        PDPageContentStream contentStream = new PDPageContentStream(document, page);
        contentStream.setFont(font, 12);
        contentStream.beginText();
        contentStream.setLeading(14f);
        contentStream.newLineAtOffset(50, 750);

        // 4️⃣ Wrap text to fit page width
        float maxWidth = page.getMediaBox().getWidth() - 100;
        for (String paragraph : summary.split("\n")) {
            for (String line : wrapText(paragraph, font, 12, maxWidth)) {
                contentStream.showText(line);
                contentStream.newLine();
            }
            contentStream.newLine();
        }

        contentStream.endText();
        contentStream.close();

        // 5️⃣ Save PDF to byte array
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        document.save(output);
        document.close();

        return output.toByteArray();

    } catch (Exception e) {
        e.printStackTrace();
        throw new RuntimeException("Impossible de générer le PDF du résumé", e);
    }
}

// ✅ Fixed: Utility method to wrap text with proper encoding handling
private List<String> wrapText(String text, PDFont font, float fontSize, float maxWidth) throws IOException {
    List<String> lines = new ArrayList<>();
    StringBuilder line = new StringBuilder();
    
    for (String word : text.split(" ")) {
        String tmp = line.length() == 0 ? word : line + " " + word;
        float width = font.getStringWidth(tmp) / 1000 * fontSize;
        
        if (width > maxWidth) {
            lines.add(line.toString());
            line = new StringBuilder(word);
        } else {
            line = new StringBuilder(tmp);
        }
    }
    
    if (line.length() > 0) {
        lines.add(line.toString());
    }
    
    return lines;
}

/*
 * NOTE: To use TrueType fonts, you need to add a font file to your resources:
 * 
 * 1. Download DejaVuSans.ttf from https://dejavu-fonts.github.io/
 * 2. Place it in: src/main/resources/fonts/DejaVuSans.ttf
 * 
 * If you can't add a font file, use this fallback in generateResumePdfForReport():
 * 
 * PDFont font = PDType1Font.HELVETICA;
 * // Clean the text before writing:
 * summary = cleanTextForHelvetica(summary);
 * 
 * private String cleanTextForHelvetica(String text) {
 *     return text.replace("Ã©", "é")
 *                .replace("Ã¨", "è")
 *                .replace("Ã ", "à")
 *                .replace("Ã§", "ç")
 *                .replace("Ã´", "ô")
 *                .replace("Ã¢", "â")
 *                .replace("Ãª", "ê")
 *                .replace("Ã®", "î")
 *                .replace("Ã¹", "ù")
 *                .replace("Ã»", "û");
 * }
 */

}