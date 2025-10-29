package tn.esprit.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import tn.esprit.Entities.Entreprise;
import tn.esprit.Entities.JobSeeker;
import tn.esprit.Entities.User;
import tn.esprit.Repository.EntrepriseRepository;
import tn.esprit.Repository.JobSeekerRepository;
import tn.esprit.Repository.UserRepository;
import org.springframework.http.ResponseEntity;
import tn.esprit.payload.response.MessageResponse;
import java.util.regex.Pattern;
import java.util.regex.Matcher;

import java.util.List;
import java.util.Optional;

@Service
public class JobSeekerService {
    @Autowired
    JobSeekerRepository JobSeekerRepository;
    @Autowired
    UserRepository userRepository;



    public JobSeeker updateJobSeeker(JobSeeker entreprise, Long id) {
        Optional<JobSeeker> existingEntreprise = JobSeekerRepository.findById(entreprise.getId());
        JobSeeker updatedEntreprise=new JobSeeker();




        if (existingEntreprise.isPresent()) {
            updatedEntreprise = existingEntreprise.get();

            updatedEntreprise.setId(entreprise.getId());
            updatedEntreprise.setResume(entreprise.getResume());
            updatedEntreprise.setSkills(entreprise.getSkills());
            updatedEntreprise.setEducation(entreprise.getEducation());

            // Fetch User by ID and set it
            Optional<User> userOptional = userRepository.findById(id);

            if (userOptional.isPresent()) {
                User user = userOptional.get();
                updatedEntreprise.setUser(user);
            }





            // Save and return updated Entreprise

        }






        return JobSeekerRepository.save(updatedEntreprise);
    }


    public ResponseEntity<?> updateJobSeeker1(JobSeeker entreprise) {
        // Check if the JobSeeker exists by ID
        Optional<JobSeeker> existingEntreprise = JobSeekerRepository.findById(entreprise.getId());
        JobSeeker updatedEntreprise = new JobSeeker();

        String phoneNumber = String.valueOf(entreprise.getUser().getPhone());

        // Define a regex pattern for validating phone numbers (e.g., 10 digits)
        String phonePattern = "^[0-9]{8}$";
        Pattern pattern = Pattern.compile(phonePattern);
        Matcher matcher = pattern.matcher(phoneNumber);

        // Check if the phone number matches the pattern
        if (!matcher.matches()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: Invalid phone number format. Must be 8 digits.");
        }

        // Check if the email already exists (excluding the current JobSeeker)
        Optional<User> existingEmailUser = Optional.ofNullable(userRepository.findByEmail(entreprise.getUser().getEmail()));
        if (existingEmailUser.isPresent() && !existingEmailUser.get().getId().equals(entreprise.getUser().getId())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: Email already exists.");
        }

        // Check if the phone number already exists (excluding the current JobSeeker)


// Check if the verification status is valid (either 0 or 1)
        if (entreprise.getUser().getIsVerified() != 0 && entreprise.getUser().getIsVerified() != 1) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: Verification status must be either 0 or 1.");
        }



        // Check if the JobSeeker exists
        if (existingEntreprise.isPresent()) {
            updatedEntreprise = existingEntreprise.get();

            // Check if the username already exists in the database (excluding the current JobSeeker)
            Optional<User> existingUser = userRepository.findByUsername(entreprise.getUser().getUsername());
            if (existingUser.isPresent() && !existingUser.get().getId().equals(entreprise.getUser().getId())) {
                // If the username exists and is not the current user's username, return an error
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: Username already exists.");
            }

            // Proceed with updating the JobSeeker details
            updatedEntreprise.setId(entreprise.getId());
            updatedEntreprise.setResume(entreprise.getResume());
            updatedEntreprise.setSkills(entreprise.getSkills());
            updatedEntreprise.setEducation(entreprise.getEducation());
            updatedEntreprise.getUser().setEmail(entreprise.getUser().getEmail());
            updatedEntreprise.getUser().setPhone(entreprise.getUser().getPhone());
            updatedEntreprise.getUser().setUsername(entreprise.getUser().getUsername());
            updatedEntreprise.getUser().setIsVerified(entreprise.getUser().getIsVerified());

        } else {
            updatedEntreprise = entreprise;

            // Same checks as above if the JobSeeker doesn't exist (for a new JobSeeker)
            Optional<User> existingUser = userRepository.findByUsername(entreprise.getUser().getUsername());
            if (existingUser.isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: Username already exists.");
            }

            updatedEntreprise.setId(entreprise.getId());
            updatedEntreprise.setResume(entreprise.getResume());
            updatedEntreprise.setSkills(entreprise.getSkills());
            updatedEntreprise.setEducation(entreprise.getEducation());
            updatedEntreprise.getUser().setId(entreprise.getUser().getId());
            updatedEntreprise.getUser().setEmail(entreprise.getUser().getEmail());
            updatedEntreprise.getUser().setPhone(entreprise.getUser().getPhone());
            updatedEntreprise.getUser().setUsername(entreprise.getUser().getUsername());
            updatedEntreprise.getUser().setIsVerified(entreprise.getUser().getIsVerified());
        }

        try {
            // Save the updated JobSeeker and return a successful response
            return ResponseEntity.ok(JobSeekerRepository.save(updatedEntreprise));

        }  catch (Exception e) {
            // Handle other exceptions (e.g., general database issues)
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

    public ResponseEntity<?> addJobSeeker(JobSeeker jobSeeker) {
        try {
            // Check if the username or email already exists
            Optional<User> existingUserByUsername = userRepository.findByUsername(jobSeeker.getUser().getUsername());
            if (existingUserByUsername.isPresent()) {
                return ResponseEntity.badRequest().body("Error: Username is already taken.");
            }

            Optional<User> existingUserByEmail = Optional.ofNullable(userRepository.findByEmail(jobSeeker.getUser().getEmail()));
            if (existingUserByEmail.isPresent()) {
                return ResponseEntity.badRequest().body("Error: Email is already in use.");
            }

            // Check phone pattern (convert Long to String and validate)
            String phone = String.valueOf(jobSeeker.getUser().getPhone()); // Convert phone to String
            String phonePattern = "^\\+?[0-9]{8}$"; // Example: valid phone pattern
            if (!phone.matches(phonePattern)) {
                return ResponseEntity.badRequest().body("Error: Invalid phone number.");
            }

            // Check verification status (must be 1 or 0)
            if (jobSeeker.getUser().getIsVerified() != 1 && jobSeeker.getUser().getIsVerified() != 0) {
                return ResponseEntity.badRequest().body("Error: Verification status must be either 0 or 1.");
            }

            // Save the new job seeker
            JobSeeker savedJobSeeker = JobSeekerRepository.save(jobSeeker);
            return ResponseEntity.ok(savedJobSeeker);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

    public void deleteJobSeeker(Long id) {
        JobSeekerRepository.deleteById(id);
    }


    public Optional<JobSeeker> getJobSeekerByUserId(Long userId) {
        return JobSeekerRepository.findByUserId(userId);
    }

    public List<JobSeeker> getJobSeekers(){
        return JobSeekerRepository.findAll();
    }





}