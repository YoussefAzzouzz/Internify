package tn.esprit.utility;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.web.client.RestTemplate;
import tn.esprit.payload.response.LocationResponse;

import javax.servlet.http.HttpServletRequest;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

public class GeolocationUtil {

    // URL de base pour obtenir la géolocalisation via une adresse IP
    private static final String GEOLOCATION_API_URL = "http://ip-api.com/json/";



    /**
     * Méthode pour récupérer la localisation à partir d'une adresse IP
     */
    public static LocationResponse getLocationFromIP(String ip) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = GEOLOCATION_API_URL + ip;

            // Afficher la réponse brute JSON
            String jsonResponse = restTemplate.getForObject(url, String.class);
            System.out.println("Réponse JSON brute : " + jsonResponse);

            // Mapper la réponse JSON dans un objet LocationResponse
            return restTemplate.getForObject(url, LocationResponse.class);

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * Méthode pour obtenir les informations sur le client :
     * IP publique, informations du navigateur, OS, appareil, etc.
     */
    public static ObjectNode getComputeInfo(HttpServletRequest request, String username) {
        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode extractedInfo = objectMapper.createObjectNode();

        try {
            // Étape 1 : Obtenir l’adresse IP publique du client
            RestTemplate restTemplate = new RestTemplate();
            String response = restTemplate.getForObject("https://api64.ipify.org?format=json", String.class);

            JsonNode jsonNode = objectMapper.readTree(response);
            String clientIp = jsonNode.get("ip").asText();
            System.out.println("Adresse IP publique : " + clientIp);
        
            extractedInfo.put("clientIp", clientIp);

        } catch (Exception e) {
            System.err.println("Erreur lors de l’extraction des informations : " + e.getMessage());
        }

        return extractedInfo;
    }
}
