package tn.esprit.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tn.esprit.entities.Demand;

import java.util.List;

@Repository
public interface DemandRepository extends JpaRepository<Demand, Long> {
    Demand findDemandById(Long id);
    List<Demand> findByFieldContainingIgnoreCase(String field);
    long count();

    // Custom query to count demands by field
    long countByField(String field);

    // Custom query to count demands by status
    long countByStatus(String status);

    @Query("SELECT d FROM Demand d WHERE (6371 * acos(cos(radians(:lat)) * cos(radians(d.latitude)) * cos(radians(d.longitude) - radians(:lng)) + sin(radians(:lat)) * sin(radians(d.latitude)))) < :radius")
    List<Demand> findNearbyDemands(@Param("lat") double latitude, @Param("lng") double longitude, @Param("radius") double radius);

}
