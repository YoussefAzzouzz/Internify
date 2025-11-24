package tn.esprit.services;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import tn.esprit.repositories.DemandRepository;
import tn.esprit.entities.Demand;

import java.io.IOException;
import java.time.LocalDate;
import java.util.Base64;
import java.util.List;

@Service
@AllArgsConstructor
public class DemandServiceImpl implements IDemandService {

    DemandRepository demandRepository;

    @Override
    public List<Demand> getAllDemands() {
        return demandRepository.findAll();
    }
    @Override
    public long countTotalDemands() {
        return demandRepository.count();  // Get the total number of demands
    }

    @Override
    public long countDemandsByField(String field) {
        return demandRepository.countByField(field);  // Get the number of demands for a specific field
    }

    @Override
    public long countDemandsByStatus(String status) {
        return demandRepository.countByStatus(status);  // Get the number of demands with a specific status
    }


    @Override
    public Demand getDemandById(Long id) {
        return demandRepository.findById(id).orElse(null);
    }
    @Override
    public List<Demand> searchDemandsByField(String field) {
        return demandRepository.findByFieldContainingIgnoreCase(field);
    }

    @Override
    public Demand addDemand(Demand demand, MultipartFile cvFile) throws IOException {
        // Encode CV to Base64 if file is provided
        if (cvFile != null && !cvFile.isEmpty()) {
            demand.setCv(Base64.getEncoder().encodeToString(cvFile.getBytes())); // Convert to Base64
        }

        // Set the current date for the demand
        demand.setDate(java.sql.Date.valueOf(LocalDate.now()));

        // Save and return the demand
        return demandRepository.save(demand);
    }

    @Override
    public void deleteDemand(Long id) {
        demandRepository.deleteById(id);
    }

    @Override
    public Demand updateDemand(Long id, Demand demand) {
        Demand existingDemand = demandRepository.findById(id).orElse(null);
        if (existingDemand != null) {
            existingDemand.setTitle(demand.getTitle());
            existingDemand.setDescription(demand.getDescription());
            existingDemand.setField(demand.getField());
            existingDemand.setDate(java.sql.Date.valueOf(LocalDate.now()));
            existingDemand.setStatus(demand.getStatus());
            if (demand.getCluster() != null) {
                existingDemand.setCluster(demand.getCluster());
            }

            // Update the CV if it's changed
            if (demand.getCv() != null && !demand.getCv().isEmpty()) {
                existingDemand.setCv(demand.getCv());
            }

            return demandRepository.save(existingDemand);
        }
        return null;
    }



    public List<Demand> findNearbyDemands(double latitude, double longitude, double radius) {

        return demandRepository.findNearbyDemands(latitude, longitude, radius);

    }
}
