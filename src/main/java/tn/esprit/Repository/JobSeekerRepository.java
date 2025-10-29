package tn.esprit.Repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tn.esprit.Entities.Entreprise;
import tn.esprit.Entities.JobSeeker;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobSeekerRepository extends JpaRepository<JobSeeker, Long> {

    long count();


    Optional<JobSeeker> findByUserId(Long userId);


    @Query("SELECT j FROM JobSeeker j WHERE " +
            "(:searchTerm IS NULL OR LOWER(j.user.username) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(j.user.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "CAST(j.user.phone AS string) LIKE CONCAT('%', :searchTerm, '%'))")
    List<JobSeeker> findByUserCriteria(@Param("searchTerm") String searchTerm);


}