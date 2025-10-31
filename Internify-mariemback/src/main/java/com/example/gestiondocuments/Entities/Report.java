package com.example.gestiondocuments.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "reports")
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    private String filePath;

    @Temporal(TemporalType.DATE)
    private Date submissionDate;

    private boolean validatedByCompany = false; // Default: false
    @Lob
    private String signature;

    // Relationships
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "jobseeker_id", nullable = false)
    private JobSeeker jobSeeker;

    @JsonIgnore
    @OneToOne
    @JoinColumn(name = "offer_id", unique = true) // One report per offer
    private Offer offer;

    public String getSignatureBase64() {
        return signature;
    }

    public void setSignatureBase64(String signatureBase64) {
        this.signature = signatureBase64;
    }


}
