package com.example.gestiondocuments.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Offer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String title;
    private String description;
    private String image;
    private Date datePub;
    private Date dateExp;
    private String category;
    /*@JsonIgnore
    @OneToMany(mappedBy = "offer", cascade = CascadeType.ALL)
    private Set<Comment> comments = new HashSet<>();
    @JsonIgnore
    @OneToMany(mappedBy = "offer", cascade = CascadeType.ALL)
    private Set<Application> applications = new HashSet<>();
    @JsonIgnore
    @ManyToOne
    User user;*/

    @OneToOne(cascade = CascadeType.ALL, mappedBy = "offer")
    private Contract contract;

    @OneToOne(mappedBy = "offer", cascade = CascadeType.ALL)
    private Report report;


}
