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
@Table(name = "contracts")
public class Contract {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;



    @Lob
    private String fileData;

    @Temporal(TemporalType.DATE)
    private Date startDate;

    @Temporal(TemporalType.DATE)
    private Date endDate;

    @Enumerated(EnumType.STRING)
    private ContractStatus status;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false, updatable = false)
    private Date createdAt;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false)
    private Date updatedAt;

    // Relationships
    /*@JsonIgnore
    @OneToOne
    private Demand demand;*/

    @JsonIgnore
    @OneToOne
    private Offer offer;

    @ManyToOne
    private Entreprise entreprise;

    @ManyToOne
    private JobSeeker jobSeeker;

    @PrePersist
    protected void onCreate() {
        createdAt = new Date();
        updatedAt = new Date();

        if (entreprise == null) {
            entreprise = new Entreprise();
            entreprise.setId(1L);  // Always set Entreprise ID to 1
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = new Date();
    }


}
