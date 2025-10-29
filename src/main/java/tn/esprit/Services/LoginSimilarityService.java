package tn.esprit.Services;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import tn.esprit.Entities.LoginAttempt;
import java.util.*;

@Service
public class LoginSimilarityService {
    
    private final RestTemplate restTemplate = new RestTemplate();
    private final String PYTHON_API_URL = "http://localhost:8000";
    
    public SimilarLoginResponse getSimilarLoginAttempts(LoginAttempt loginAttempt) {
        try {
            // Build the request payload for Python API
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("user_id", loginAttempt.getUser().getId());
            requestBody.put("client_ip", loginAttempt.getClientIp());
            requestBody.put("city", loginAttempt.getCity());
            requestBody.put("region", loginAttempt.getRegion());
            requestBody.put("region_name", loginAttempt.getRegionName());
            requestBody.put("country", loginAttempt.getCountry());
            requestBody.put("timezone", loginAttempt.getTimezone());
            
            // Prepare HTTP request
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            
            // Call Python API
            String url = PYTHON_API_URL + "/query_similar?n_results=5";
            ResponseEntity<PythonResponse> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                request,
                PythonResponse.class
            );
            
            // Build response with original + similar logins
            SimilarLoginResponse result = new SimilarLoginResponse();
            result.setOriginalLogin(loginAttempt);
            result.setSimilarLogins(response.getBody().getSimilar_logins());
            result.setQueryText(response.getBody().getQuery());
            
            return result;
            
        } catch (Exception e) {
            throw new RuntimeException("Error fetching similar logins: " + e.getMessage());
        }
    }
    
    // ============= Response Classes =============
    
    public static class SimilarLoginResponse {
        private LoginAttempt originalLogin;
        private List<SimilarLoginInfo> similarLogins;
        private String queryText;
        
        // Getters and Setters
        public LoginAttempt getOriginalLogin() { return originalLogin; }
        public void setOriginalLogin(LoginAttempt originalLogin) { this.originalLogin = originalLogin; }
        
        public List<SimilarLoginInfo> getSimilarLogins() { return similarLogins; }
        public void setSimilarLogins(List<SimilarLoginInfo> similarLogins) { this.similarLogins = similarLogins; }
        
        public String getQueryText() { return queryText; }
        public void setQueryText(String queryText) { this.queryText = queryText; }
    }
    
    public static class SimilarLoginInfo {
        private String id;
        private String document;
        private Map<String, Object> metadata;
        private Double distance;
        
        // Getters and Setters
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        
        public String getDocument() { return document; }
        public void setDocument(String document) { this.document = document; }
        
        public Map<String, Object> metadata() { return metadata; }
        public void setMetadata(Map<String, Object> metadata) { this.metadata = metadata; }
        
        public Double getDistance() { return distance; }
        public void setDistance(Double distance) { this.distance = distance; }
    }
    
    private static class PythonResponse {
        private String query;
        private int user_id;
        private List<SimilarLoginInfo> similar_logins;
        
        public String getQuery() { return query; }
        public int getUser_id() { return user_id; }
        public List<SimilarLoginInfo> getSimilar_logins() { return similar_logins; }
    }
}