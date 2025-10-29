package tn.esprit.Controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import tn.esprit.Services.LoginSimilarityService;
import tn.esprit.Services.StatisticsService;
import tn.esprit.Entities.LoginAttempt;
import tn.esprit.Entities.StatisticsDTO;
import tn.esprit.Entities.User;


@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class StatisticsController {

    @Autowired
    private StatisticsService statisticsService;

    @GetMapping("/statistics")
    public StatisticsDTO getStatistics() {
        return statisticsService.getStatistics();
    }


     @Autowired
    private LoginSimilarityService loginSimilarityService;
    
    @GetMapping("/test-similarity")
    public Map<String, Object> testSimilarity() {
        // Create test login attempt
        LoginAttempt attempt = new LoginAttempt();
        attempt.setClientIp("197.29.214.42");
        attempt.setCity("lyon");
        attempt.setCountry("france");
        attempt.setRegionName("lyon");
        attempt.setTimezone("");
        
        User user = new User();
        user.setId(4L);
        attempt.setUser(user);
        
        // Get similar logins
        LoginSimilarityService.SimilarLoginResponse response = loginSimilarityService.getSimilarLoginAttempts(attempt);

Map<String, Object> resultMap = new HashMap<>();
resultMap.put("originalLogin", response.getOriginalLogin());
resultMap.put("similarLogins", response.getSimilarLogins());
resultMap.put("queryText", response.getQueryText());

return resultMap;

    }
}
