package tn.esprit.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import tn.esprit.Entities.JobSeeker;
import tn.esprit.Repository.JobSeekerRepository;
import tn.esprit.Services.JobSeekerService;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/JobSeeker")
public class JobSeekerController {

    @Autowired
    JobSeekerRepository jobSeekerRepository;
    @Autowired

    JobSeekerService service;

    @Autowired
    private PasswordEncoder passwordEncoder;  // Injecting PasswordEncoder



    @PutMapping("updateJobSeeker/{id}")
    public JobSeeker updateJobseeker(@RequestBody JobSeeker jobseeker,@PathVariable  Long id) {
        return service.updateJobSeeker(jobseeker,id);
    }

    @PutMapping("updateJobSeeker1")
    public ResponseEntity<?> updateJobseeker1(@RequestBody JobSeeker jobseeker) {
        return service.updateJobSeeker1(jobseeker);
    }
    @PostMapping("AddJobSeeker")
    public ResponseEntity<?> addJobSeeker(@RequestBody JobSeeker jobSeeker) {
        // Hash the password if it's not null
        if (jobSeeker.getUser() != null && jobSeeker.getUser().getPassword() != null) {
            String hashedPassword = passwordEncoder.encode(jobSeeker.getUser().getPassword());
            jobSeeker.getUser().setPassword(hashedPassword); // Set the hashed password back to User
        }

        // Save the JobSeeker with the hashed password
        return service.addJobSeeker(jobSeeker);
    }



    @GetMapping("/getJobSeekerByUserId/{userId}")
    public ResponseEntity<JobSeeker> getJobSeekerByUserId(@PathVariable Long userId) {
        return service.getJobSeekerByUserId(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    @GetMapping("/getJobSeekers")
    public List<JobSeeker> getJobSeekers() {
        return service.getJobSeekers();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteJobSeeker(@PathVariable Long id) {
        service.deleteJobSeeker(id);
        return ResponseEntity.ok().build();
    }









}
