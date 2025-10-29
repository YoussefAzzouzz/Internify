package tn.esprit.Services;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import tn.esprit.Entities.LoginAttempt;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class LoginAttemptService {

    private final RestTemplate restTemplate;

    private static final String PYTHON_ADD_LOGIN_URL = "http://localhost:8000/add_login";
    private static final String PYTHON_QUERY_SIMILAR_URL = "http://localhost:8000/query_similar";

    public LoginAttemptService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * Add login attempt to Python FastAPI (embedding)
     */
    public Map<String, Object> addLogin(LoginAttempt loginAttempt) {
        Map<String, Object> requestBody = mapLoginAttemptToPython(loginAttempt);

        // Set headers for JSON
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        // Call Python FastAPI
        @SuppressWarnings("unchecked")
        Map<String, Object> response = restTemplate.postForObject(
                PYTHON_ADD_LOGIN_URL,
                request,
                Map.class
        );

        return response;
    }

    /**
     * Query top similar logins from Python FastAPI
     */
    public List<Map<String, Object>> querySimilar(LoginAttempt loginAttempt, int topK) {
        Map<String, Object> requestBody = mapLoginAttemptToPython(loginAttempt);
        requestBody.put("top_k", topK);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        @SuppressWarnings("unchecked")
        Map<String, Object> response = restTemplate.postForObject(
                PYTHON_QUERY_SIMILAR_URL,
                request,
                Map.class
        );

        // Extract "top_similar" list
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> topSimilar = (List<Map<String, Object>>) response.get("top_similar");
        return topSimilar;
    }

    /**
     * Map LoginAttempt entity to Python JSON
     */
    private Map<String, Object> mapLoginAttemptToPython(LoginAttempt loginAttempt) {
        Map<String, Object> map = new HashMap<>();
        map.put("user_id", loginAttempt.getUser().getId());
        map.put("client_ip", loginAttempt.getClientIp());
        map.put("lat", loginAttempt.getLat());
        map.put("lon", loginAttempt.getLon());
        map.put("timezone", loginAttempt.getTimezone());
        map.put("country", loginAttempt.getCountry());
        map.put("country_code", loginAttempt.getCountryCode());
        map.put("region", loginAttempt.getRegion());
        map.put("region_name", loginAttempt.getRegionName());
        map.put("city", loginAttempt.getCity());
        return map;
    }
}
