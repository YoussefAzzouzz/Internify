package tn.esprit.Controller;

import com.opencsv.exceptions.CsvException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import tn.esprit.Entities.Entreprise;
import tn.esprit.Repository.EntrepriseRepository;
import tn.esprit.Services.EntrepriseService;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/entreprise")
public class EntrepriseController {

    @Autowired
    EntrepriseRepository entrepriseRepository;
    @Autowired

    EntrepriseService service;

  

    @Autowired
    private PasswordEncoder passwordEncoder;  // Injecting PasswordEncoder



    @PutMapping("updateEntreprise/{id}")
    public Entreprise updateEntreprise(@RequestBody Entreprise entreprise,@PathVariable  Long id) {
        return service.updateEntreprise(entreprise,id);
    }

    @GetMapping("/getEntrepriseByUserId/{userId}")
    public ResponseEntity<Entreprise> getEntrepriseByUserId(@PathVariable Long userId) throws IOException, CsvException {
        Optional<Entreprise> optionalEntreprise = entrepriseRepository.findByUserId(userId);


        return service.getEntrepriseByUserId(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());


    }


    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteEntreprise(@PathVariable Long id) {
        service.deleteEntreprise(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("updateEntreprise1")
    public ResponseEntity<?> updateEntreprise1(@RequestBody Entreprise jobseeker) {
        return service.updateEntreprise1(jobseeker);
    }
    @PostMapping("AddEntreprise")
    public ResponseEntity<?> addJobSeeker(@RequestBody Entreprise jobSeeker) {
        // Hash the password if it's not null
        if (jobSeeker.getUser() != null && jobSeeker.getUser().getPassword() != null) {
            String hashedPassword = passwordEncoder.encode(jobSeeker.getUser().getPassword());
            jobSeeker.getUser().setPassword(hashedPassword); // Set the hashed password back to User
        }

        // Save the JobSeeker with the hashed password
        return service.addEntrepriseSeeker(jobSeeker);
    }

    @GetMapping("/getEntreprises")
    public List<Entreprise> getEntreprises() {
        return service.getEntreprise();
    }


    @PostMapping("/add-to-user/{userId}")
    public ResponseEntity<?> addEntrepriseToUser(@PathVariable Long userId,
                                                 @RequestBody Entreprise entrepriseDetails) {
        try {
            Entreprise savedEntreprise = service.addEntrepriseToUser(userId, entrepriseDetails);
            return ResponseEntity.ok(savedEntreprise);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


}
