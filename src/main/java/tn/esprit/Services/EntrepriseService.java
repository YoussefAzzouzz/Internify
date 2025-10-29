package tn.esprit.Services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.esprit.Entities.Entreprise;
import tn.esprit.Entities.JobSeeker;
import tn.esprit.Entities.User;
import tn.esprit.Repository.EntrepriseRepository;
import tn.esprit.Repository.UserRepository;

import java.util.List;
import java.util.Optional;

@Service
public class EntrepriseService  {
    @Autowired
    EntrepriseRepository  EntrepriseRepository;

    @Autowired
    UserRepository userRepository;

    private static final Logger logger = LoggerFactory.getLogger(User.class);



    public Entreprise updateEntreprise(Entreprise entreprise, Long id) {
        Optional<Entreprise> existingEntreprise = EntrepriseRepository.findById(entreprise.getId());
        Entreprise updatedEntreprise=new Entreprise();

        if (existingEntreprise.isPresent()) {
             updatedEntreprise = existingEntreprise.get();

            // Update fields
            updatedEntreprise.setCompanyDescription(entreprise.getCompanyDescription());
            updatedEntreprise.setAddress(entreprise.getAddress());
            updatedEntreprise.setContactNumber(entreprise.getContactNumber());
            updatedEntreprise.setLogo(entreprise.getLogo());
            updatedEntreprise.setIndustry(entreprise.getIndustry());
            updatedEntreprise.setCompanyWebsite(entreprise.getCompanyWebsite());
            updatedEntreprise.setRatings(entreprise.getRatings());

            // Fetch User by ID and set it
            Optional<User> userOptional = userRepository.findById(id);

            if (userOptional.isPresent()) {
                User user = userOptional.get();
                updatedEntreprise.setUser(user);
            } else {
                logger.error("User not found for ID: " + id);
            }





            // Save and return updated Entreprise

        }
        else {

            updatedEntreprise = entreprise;

            // Update fields
            updatedEntreprise.setCompanyDescription(entreprise.getCompanyDescription());
            updatedEntreprise.setAddress(entreprise.getAddress());
            updatedEntreprise.setContactNumber(entreprise.getContactNumber());
            updatedEntreprise.setLogo(entreprise.getLogo());
            updatedEntreprise.setIndustry(entreprise.getIndustry());
            updatedEntreprise.setCompanyWebsite(entreprise.getCompanyWebsite());

            // Fetch User by ID and set it
            Optional<User> userOptional = userRepository.findById(id);

            if (userOptional.isPresent()) {
                User user = userOptional.get();
                updatedEntreprise.setUser(user);


        }}


        return EntrepriseRepository.save(updatedEntreprise);
    }


    public ResponseEntity<?> updateEntreprise1(Entreprise entreprise) {
        try {
            Optional<Entreprise> existingEntreprise = EntrepriseRepository.findById(entreprise.getId());
            Entreprise updatedEntreprise = new Entreprise();

            if (existingEntreprise.isPresent()) {
                updatedEntreprise = existingEntreprise.get();

                // Check if the username or email already exists
                Optional<User> existingUserByUsername = userRepository.findByUsername(entreprise.getUser().getUsername());
                if (existingUserByUsername.isPresent() && !existingUserByUsername.get().getId().equals(entreprise.getUser().getId())) {
                    return ResponseEntity.badRequest().body("Error: Username is already taken.");
                }

                Optional<User> existingUserByEmail = Optional.ofNullable(userRepository.findByEmail(entreprise.getUser().getEmail()));
                if (existingUserByEmail.isPresent() && !existingUserByEmail.get().getId().equals(entreprise.getUser().getId())) {
                    return ResponseEntity.badRequest().body("Error: Email is already in use.");
                }

                // Check phone pattern (convert Long to String and validate)
                String phone = String.valueOf(entreprise.getUser().getPhone()); // Convert phone to String
                String phonePattern = "^\\+?[0-9]{8}$"; // Example: valid phone pattern
                if (!phone.matches(phonePattern)) {
                    return ResponseEntity.badRequest().body("Error: Invalid phone number.");
                }

                // Check verification status (must be 1 or 0)
                if (entreprise.getUser().getIsVerified() != 1 && entreprise.getUser().getIsVerified() != 0) {
                    return ResponseEntity.badRequest().body("Error: Invalid verification status.");
                }

                // Update the entity fields
                updatedEntreprise.setId(entreprise.getId());
                updatedEntreprise.setCompanyDescription(entreprise.getCompanyDescription());
                updatedEntreprise.setAddress(entreprise.getAddress());
                updatedEntreprise.setContactNumber(entreprise.getContactNumber());
                updatedEntreprise.setLogo(entreprise.getLogo());
                updatedEntreprise.setIndustry(entreprise.getIndustry());
                updatedEntreprise.setCompanyWebsite(entreprise.getCompanyWebsite());
                updatedEntreprise.getUser().setEmail(entreprise.getUser().getEmail());
                updatedEntreprise.getUser().setPhone(entreprise.getUser().getPhone());
                updatedEntreprise.getUser().setUsername(entreprise.getUser().getUsername());
                updatedEntreprise.getUser().setIsVerified(entreprise.getUser().getIsVerified());

                // Save and return the updated Entreprise
                return ResponseEntity.ok(EntrepriseRepository.save(updatedEntreprise));
            } else {
                return ResponseEntity.badRequest().body("Error: Entreprise not found.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }


    public ResponseEntity<?> addEntrepriseSeeker(Entreprise entreprise) {
        try {
            // Check if the username already exists
            Optional<User> existingUserByUsername = userRepository.findByUsername(entreprise.getUser().getUsername());
            if (existingUserByUsername.isPresent()) {
                return ResponseEntity.badRequest().body("Error: Username is already taken.");
            }

            // Check if the email already exists
            Optional<User> existingUserByEmail = Optional.ofNullable(userRepository.findByEmail(entreprise.getUser().getEmail()));
            if (existingUserByEmail.isPresent()) {
                return ResponseEntity.badRequest().body("Error: Email is already in use.");
            }

            // Check phone pattern (convert Long to String and validate)
            String phone = String.valueOf(entreprise.getUser().getPhone()); // Convert phone to String
            String phonePattern = "^\\+?[0-9]{8}$"; // Example: valid phone pattern
            if (!phone.matches(phonePattern)) {
                return ResponseEntity.badRequest().body("Error: Invalid phone number.");
            }

            // Check verification status (must be 1 or 0)
            if (entreprise.getUser().getIsVerified() != 1 && entreprise.getUser().getIsVerified() != 0) {
                return ResponseEntity.badRequest().body("Error: Invalid verification status.");
            }

            // Save and return the new Entreprise
            return ResponseEntity.ok(EntrepriseRepository.save(entreprise));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }
    public void deleteEntreprise(Long id) {
        EntrepriseRepository.deleteById(id);
    }


        public Optional<Entreprise> getEntrepriseByUserId(Long userId) {
            return EntrepriseRepository.findByUserId(userId);
        }

    public List<Entreprise> getEntreprise(){
        return EntrepriseRepository.findAll();
    }


    public Entreprise addEntrepriseToUser(Long userId, Entreprise entrepriseDetails) throws Exception {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (!optionalUser.isPresent()) {
            throw new Exception("User not found with id: " + userId);
        }
        User user = optionalUser.get();

        // Link the entreprise to the user
        entrepriseDetails.setUser(user);

        // Save the entreprise (or user, depending on cascade settings)
        return EntrepriseRepository.save(entrepriseDetails);
    }


}