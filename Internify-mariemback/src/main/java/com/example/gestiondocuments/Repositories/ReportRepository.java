package com.example.gestiondocuments.Repositories;

import com.example.gestiondocuments.Entities.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ReportRepository extends JpaRepository<Report, Long> {
    @Query("SELECT COUNT(r) FROM Report r WHERE r.validatedByCompany = true")
    long countValidatedReports();

    @Query("SELECT COUNT(r) FROM Report r WHERE r.validatedByCompany = false")
    long countNotValidatedReports();
}
