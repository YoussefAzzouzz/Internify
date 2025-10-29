package tn.esprit.Controller;

import java.io.File;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

import com.opencsv.exceptions.CsvException;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.client.RestTemplate;


import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;


import com.fasterxml.jackson.databind.node.ObjectNode;


import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;


import tn.esprit.Entities.*;
import tn.esprit.Repository.*;
import tn.esprit.Services.AnomalyDetectionService;
import tn.esprit.Services.LoginAttemptService;
import tn.esprit.Services.LoginSimilarityService;
import tn.esprit.Services.UserDetailsImpl;
import tn.esprit.Services.UserDetailsServiceImpl;
import tn.esprit.jwt.JwtUtils;
import tn.esprit.payload.SmsRequest;
import tn.esprit.payload.TokenEmailPair;
import tn.esprit.payload.request.LoginRequest;
import tn.esprit.payload.request.SignupRequest;
import tn.esprit.payload.request.UserLocation;
import tn.esprit.payload.response.JwtResponse;
import tn.esprit.payload.response.LocationResponse;
import tn.esprit.payload.response.MessageResponse;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestTemplate;
import tn.esprit.utility.GeolocationUtil;



@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
  
    private final RestTemplate restTemplate = new RestTemplate();


    @Autowired
    AnomalyDetectionService anomalyDetectionService;
   
@Autowired
    LoginAttemptService loginAttemptService;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    JobSeekerRepository jobSeekerRepository;

    @Autowired
    EntrepriseRepository entrepriseRepository;
    @Autowired
    LoginAttemptRepository loginAttemptRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

  

   @Autowired
    private LoginSimilarityService loginSimilarityService;

    @Autowired
    UserDetailsServiceImpl userDetailsService;




    public static TokenEmailPair tokenEmailPair;

    static {
        tokenEmailPair = new TokenEmailPair();  // Initialize the static field
    }

   

   





    @GetMapping("/job-seekers")
    public List<User> getUsersByRoleUser() {
        return userDetailsService.getUsersByRoleUser();
    }

    @GetMapping("/entreprises")
    public List<User> getUsersByRoleEntreprise() {
        return userDetailsService.getUsersByRoleEntreprise();
    }




   
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));

        Set<String> strRoles = signUpRequest.getRole();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null) {
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        }
        else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "Admin":
                        Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(adminRole);

                        break;
                    case "entreprise":
                        Role modRole = roleRepository.findByName(ERole.ROLE_ENTREPRISE)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(modRole);

                        break;

                    default:
                        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(userRole);
                }
            });
        }

        user.setRoles(roles);
        user.setPhone(signUpRequest.getPhone());
        userRepository.save(user);
       

        // Send the verification email

        if(signUpRequest.getRole().contains("entreprise"))
        {  Entreprise J=new Entreprise();

            J.setUser(userRepository.getById(user.getId()));
            entrepriseRepository.save(J);


        }
        else
        {  JobSeeker J=new JobSeeker();
            J.setUser(userRepository.getById(user.getId()));
            jobSeekerRepository.save(J);

          }




        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }





  





    @DeleteMapping("deleteUser/{id}")
    public void deleteUser(@PathVariable("id") Long id) {
        userDetailsService.deleteUser(id);
    }

    @GetMapping("list/{id}")
    public User listUser(@PathVariable("id") Long id) {
        return userDetailsService.listUser(id);
    }

    @GetMapping("findByUsername/{username}")
    public   Optional<User> findByUsername(@PathVariable("username") String username)
    {
        return userDetailsService.findByUsername(username);
    }

    @PutMapping("updateUser")
    public ResponseEntity<?> updateUser(@RequestBody User user) {
        return userDetailsService.updateUser(user);
    }

    @PutMapping("updateUserPassword/{id}")
    public User updateUser(@PathVariable("id") Long id,@RequestBody String password) {
        return userDetailsService.updateUserPassword(password,id);
    }


    @GetMapping("ListUser")
    public List<User> getList() {
        return userDetailsService.getList();
    }

    @GetMapping("findByUsernameAndPassword/{username}/{password}")
    public   Optional<User> findByUsernameAndPassword(@PathVariable("username") String username,@PathVariable("password") String password)
    {
        return userDetailsService.findByUsernameAndPassword(username,password);
    }



      
    


@PostMapping("/signin")
public ResponseEntity<?> authenticateUser(
        @Valid @RequestBody LoginRequest loginRequest,
        HttpServletRequest request) throws JSONException {
    
    // Initialize logger (overwrites file each time)
   tn.esprit.Services.AnomalyDetectionService.SignInLogger log = new tn.esprit.Services.AnomalyDetectionService.SignInLogger(loginRequest.getUsername());
    
    try {
        log.logStep("START", "🚀 Tentative de connexion pour : " + loginRequest.getUsername());
        
        // ================== 1️⃣ Authenticate User ==================
        log.logStep("STEP 1", "Authenticating user...");
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        String jwt = jwtUtils.generateJwtToken(authentication);
        log.logJwt(jwt);
        
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new RuntimeException("Error: User not found."));
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());
        log.logStep("STEP 1", "✓ Auth successful. Roles: " + roles);
        
        // ================== 2️⃣ Client info + IP ==================
        ObjectNode computeInfo = GeolocationUtil.getComputeInfo(request, loginRequest.getUsername());
        String clientIp = computeInfo.path("clientIp").asText();
        LocationResponse locationInfo = GeolocationUtil.getLocationFromIP(clientIp);
        
        // ================== 3️⃣ Build login attempt object ==================
        log.logStep("STEP 3", "Building LoginAttempt...");
        LoginAttempt attempt = new LoginAttempt(
                user,
                clientIp,
                locationInfo != null ? locationInfo.getLat() : null,
                locationInfo != null ? locationInfo.getLon() : null,
                locationInfo != null ? locationInfo.getTimezone() : null,
                locationInfo != null ? locationInfo.getCountry() : null,
                locationInfo != null ? locationInfo.getCountryCode() : null,
                locationInfo != null ? locationInfo.getRegion() : null,
                locationInfo != null ? locationInfo.getRegionName() : null,
                locationInfo != null ? locationInfo.getCity() : null
        );

        String loginText = String.format(
    "Login from %s %s %s timezone %s IP %s",
    attempt.getCountry() != null ? attempt.getCountry() : "unknown",
    attempt.getRegionName() != null ? attempt.getRegionName() : 
        (attempt.getRegion() != null ? attempt.getRegion() : "unknown"),
    attempt.getCity() != null ? attempt.getCity() : "unknown",
    attempt.getTimezone() != null ? attempt.getTimezone() : "unknown",
    attempt.getClientIp() != null ? attempt.getClientIp() : "unknown"
);
        log.logAttempt(attempt);
        
        // ================== 4️⃣ Query similar logins ==================
        log.logStep("STEP 4", "Querying top 5 similar logins...");
        List<Map<String, Object>> similar = loginAttemptService.querySimilar(attempt, 5);
        log.logSimilarLogins(similar);
        
        List<String> similarTexts = similar.stream()
                                         .map(m -> (String)m.get("login_text"))
                                         .toList();
        
        // ================== 5️⃣ Call LLM to check anomaly ==================
        log.logStep("STEP 5", "Checking anomaly with LLM...");
        boolean isAnomaly = anomalyDetectionService.isAnomalous(loginText, similarTexts, log); 
       log.logAnomalyCheck(isAnomaly);
       System.out.println(isAnomaly);
        
        // ================== 6️⃣ Save login attempt only if not anomaly ==================
        if (isAnomaly) {
           return ResponseEntity
                        .badRequest()
                        .body(new MessageResponse("Login from a new location detected And Another Device! Please verify via 2FA."));

            
        } else {
            loginAttemptService.addLogin(attempt);
            log.logStep("STEP 6", "Login saved");        }
        
        // ================== 7️⃣ Return standard JWT response ==================
        log.logStep("STEP 7", "Returning JWT response");
        log.close();
        
        return ResponseEntity.ok(new JwtResponse(
                jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                roles,
                user.getIsVerified(),
                user.getPhone()
        ));
        
    } catch (Exception e) {
        log.logError("SIGNIN", e);
        log.close();
        throw e;
    }
}



    @PostMapping("/signin1")
public ResponseEntity<?> authenticateUser1(
        @Valid @RequestBody LoginRequest loginRequest,
        HttpServletRequest request) throws JSONException {

    // 🔹 1️⃣ Authentifier l’utilisateur
    Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsername(),
                    loginRequest.getPassword())
    );

    SecurityContextHolder.getContext().setAuthentication(authentication);
    String jwt = jwtUtils.generateJwtToken(authentication);

    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
    User user = userRepository.findByUsername(loginRequest.getUsername())
            .orElseThrow(() -> new RuntimeException("Error: User not found."));
    List<String> roles = userDetails.getAuthorities().stream()
            .map(item -> item.getAuthority())
            .collect(Collectors.toList());
    
        ObjectNode computeInfo = GeolocationUtil.getComputeInfo(request, loginRequest.getUsername());
    String clientIp = computeInfo.path("clientIp").asText();
    LocationResponse locationInfo = GeolocationUtil.getLocationFromIP(clientIp);

    // ================== 3️⃣ Build login attempt object ==================
    LoginAttempt attempt = new LoginAttempt(
            user,
            clientIp,
            locationInfo != null ? locationInfo.getLat() : null,
            locationInfo != null ? locationInfo.getLon() : null,
            locationInfo != null ? locationInfo.getTimezone() : null,
            locationInfo != null ? locationInfo.getCountry() : null,
            locationInfo != null ? locationInfo.getCountryCode() : null,
            locationInfo != null ? locationInfo.getRegion() : null,
            locationInfo != null ? locationInfo.getRegionName() : null,
            locationInfo != null ? locationInfo.getCity() : null
    );
    

            loginAttemptService.addLogin(attempt);


    // 🔹 5️⃣ (Optionnel) — tu peux enregistrer dans la base ou un fichier JSON
    // GeolocationUtil.saveInfoToFile(computeInfo);

    // 🔹 6️⃣ Retourner la réponse JWT standard
    return ResponseEntity.ok(new JwtResponse(
            jwt,
            userDetails.getId(),
            userDetails.getUsername(),
            userDetails.getEmail(),
            roles,
            user.getIsVerified(),
            user.getPhone()
    ));
}




    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchUsers(@RequestParam(required = false) String searchTerm) {
        List<JobSeeker> jobSeekers = jobSeekerRepository.findByUserCriteria(searchTerm);
        List<Entreprise> entreprises = entrepriseRepository.findByUserCriteria(searchTerm);

        Map<String, Object> result = new HashMap<>();
        result.put("jobSeekers", jobSeekers);
        result.put("entreprises", entreprises);

        return ResponseEntity.ok(result);
    }




}