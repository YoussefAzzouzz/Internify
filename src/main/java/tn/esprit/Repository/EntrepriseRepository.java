package tn.esprit.Repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tn.esprit.Entities.ERole;
import tn.esprit.Entities.Entreprise;
import tn.esprit.Entities.Role;

import java.util.List;
import java.util.Optional;

@Repository
public interface EntrepriseRepository extends JpaRepository<Entreprise, Long> {

    long count();


    // Custom query method to find an Entreprise by the associated User ID
    Optional<Entreprise> findByUserId(Long userId);
    Optional<Entreprise> findByUser_Username(String Username);


    @Query("SELECT e FROM Entreprise e WHERE " +
            "(:searchTerm IS NULL OR LOWER(e.user.username) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(e.user.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "CAST(e.user.phone AS string) LIKE CONCAT('%', :searchTerm, '%'))")
    List<Entreprise> findByUserCriteria(@Param("searchTerm") String searchTerm);



}
