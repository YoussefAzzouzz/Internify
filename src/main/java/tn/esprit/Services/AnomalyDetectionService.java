package tn.esprit.Services;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.checkerframework.checker.units.qual.m;
import org.springframework.http.*;
import org.springframework.http.client.SimpleClientHttpRequestFactory;

import java.util.*;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class AnomalyDetectionService {
    private final RestTemplate restTemplate;
    private final String LLM_API_URL = "http://localhost:8001/detect_anomaly";
    private static final String LOG_FILE = "signin_debug.log";
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    
    public AnomalyDetectionService() {//how HTTP requests are sent (timeouts, connection setup, etc.).
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(60000);//if the server takes more than 60 seconds to connect, abort.
        factory.setReadTimeout(60000);//if no data is received for 60 seconds, abort.
        this.restTemplate = new RestTemplate(factory);
    }
    
    /**
     * Call the Python LLM API to detect if a login is anomalous
     * @param loginText The current login as a string
     * @param similarLogins List of top similar login strings
     * @param log The SignInLogger instance (pass from controller)
     * @return true if anomaly, false otherwise
     */
    public boolean isAnomalous(String loginText, List<String> similarLogins, SignInLogger log) {
        try {
            // Check for null loginText BEFORE sending
            if (loginText == null || loginText.trim().isEmpty()) {
                log.logStep("LLM ERROR", "❌ loginText is NULL or EMPTY! Cannot call API.");
                log.logStep("LLM ERROR", "Make sure LoginAttempt.getLoginText() returns a valid string!");
                return false; // Default to normal if we can't check
            }
            
            // Check similar logins
            if (similarLogins == null || similarLogins.isEmpty()) {
                log.logStep("LLM WARNING", "⚠️ No similar logins found, sending empty list");
                similarLogins = new ArrayList<>();
            }
            
            log.logStep("LLM REQUEST", "✓ LoginText is valid: " + loginText);
            log.logStep("LLM REQUEST", "✓ Similar logins count: " + similarLogins.size());
            
            // Build the  body of http 
            Map<String, Object> body = new HashMap<>();
            body.put("original_login", loginText);
            body.put("similar_logins", similarLogins);
            //This header tells the server (your FastAPI app): “Hey, I’m sending you JSON data — parse it as JSson.”
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            
            log.logStep("LLM CALL", "Calling FastAPI at: " + LLM_API_URL);
            
            // Call FastAPI
            //sends a POST request
            ResponseEntity<Map> response = restTemplate.postForEntity(LLM_API_URL, request, Map.class);
            
            log.logStep("LLM RESPONSE", "Status: " + response.getStatusCode());
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> respBody = response.getBody();
                log.logStep("LLM RESPONSE", "Body: " + respBody.toString());
                
                Integer anomaly = (Integer) respBody.get("anomaly");
                String reasoning = (String) respBody.get("reasoning");
                
                log.logStep("LLM RESULT", "Anomaly value: " + anomaly);
                if (reasoning != null) {
                    log.logStep("LLM REASONING", reasoning);
                }
                
                return anomaly != null && anomaly == 1;
            }
        } catch (Exception e) {
            log.logError("LLM CALL", e);
        }
        log.logStep("LLM FALLBACK", "Defaulting to normal (false)");
        return false;
    }
    
    // Inner class for logging
    public static class SignInLogger {
        private PrintWriter writer;
        private String username;
        
        public SignInLogger(String username) {
            this.username = username;
            try {
                this.writer = new PrintWriter(new FileWriter(LOG_FILE, false));
                logHeader();
            } catch (IOException e) {
                System.err.println("Failed to create log file: " + e.getMessage());
            }
        }
        
        private void logHeader() {
            writer.println("═══════════════════════════════════════════════════════════");
            writer.println("         SIGN-IN DEBUG LOG - " + LocalDateTime.now().format(formatter));
            writer.println("═══════════════════════════════════════════════════════════");
            writer.println("Username: " + username);
            writer.println("═══════════════════════════════════════════════════════════\n");
            writer.flush();
        }
        
        public void logStep(String step, String message) {
            writer.println("🔹 [" + step + "] " + message);
            writer.flush();
        }
        
        public void logJwt(String jwt) {
            writer.println("\n🔐 JWT TOKEN GENERATED:");
            writer.println("   " + jwt.substring(0, Math.min(50, jwt.length())) + "...");
            writer.flush();
        }
        
        public void logLocation(String clientIp, Object locationInfo) {
            writer.println("\n📍 LOCATION INFO:");
            writer.println("   IP: " + clientIp);
            writer.println("   Details: " + locationInfo);
            writer.flush();
        }
        
        public void logAttempt(Object attempt) {
            writer.println("\n📝 LOGIN ATTEMPT OBJECT:");
            try {
                // Use reflection to safely print without circular references
                writer.println("   Type: " + attempt.getClass().getSimpleName());
                writer.println("   toString: " + attempt.toString());
            } catch (Exception e) {
                writer.println("   Could not serialize: " + e.getMessage());
            }
            writer.flush();
        }
        
        public void logSimilarLogins(List<Map<String, Object>> similar) {
            writer.println("\n🔍 TOP " + similar.size() + " SIMILAR LOGINS:");
            for (int i = 0; i < similar.size(); i++) {
                writer.println("   [" + (i+1) + "] " + similar.get(i));
            }
            writer.flush();
        }
        
        public void logAnomalyCheck(boolean isAnomaly) {
            writer.println("\n🤖 FINAL ANOMALY DETECTION RESULT:");
            if (isAnomaly) {
                writer.println("   ⚠️  ANOMALOUS - Login will be saved for analysis");
            } else {
                writer.println("   ✅ NORMAL - Login will not be saved");
            }
            writer.flush();
        }
        
        public void logError(String step, Exception e) {
            writer.println("\n❌ ERROR in [" + step + "]:");
            writer.println("   " + e.getClass().getName() + ": " + e.getMessage());
            e.printStackTrace(writer);
            writer.flush();
        }
        
        public void close() {
            writer.println("\n═══════════════════════════════════════════════════════════");
            writer.println("         LOG END - " + LocalDateTime.now().format(formatter));
            writer.println("═══════════════════════════════════════════════════════════");
            if (writer != null) {
                writer.close();
            }
        }
    }
}