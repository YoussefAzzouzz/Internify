package com.example.gestiondocuments.Repositories;

import com.example.gestiondocuments.Entities.Contract;
import com.example.gestiondocuments.Entities.Demand;
import com.example.gestiondocuments.Entities.JobSeeker;
import com.example.gestiondocuments.Entities.Offer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContractRepository extends JpaRepository<Contract, Long>, JpaSpecificationExecutor<Contract> {
    List<Contract> findByJobSeekerId(Long jobSeekerId);
    List<Contract> findByEntreprise_Id(Long enterpriseId);
    @Query("SELECT DISTINCT c.offer FROM Contract c WHERE c.offer IS NOT NULL")
    List<Offer> findAllOffers();

    // Fetch unique demands from contracts
    /*@Query("SELECT DISTINCT c.demand FROM Contract c WHERE c.demand IS NOT NULL")
    List<Demand> findAllDemands();*/

    // Fetch unique job seekers from contracts
    @Query("SELECT DISTINCT c.jobSeeker FROM Contract c")
    List<JobSeeker> findAllJobSeekers();
}
