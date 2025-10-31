package com.example.gestiondocuments.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;
import java.util.Set;


@Entity
@Getter
@Setter
@Table(name = "Entreprise")  // Specify a separate table for Entreprise


public class Entreprise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private String companyDescription;


    private String address;


    private Number contactNumber;


    private String logo;


    private String industry;


    private String companyWebsite;


    /*@OneToOne(cascade = CascadeType.ALL) // Cascade the save operation to User


    private User user;*/

    @JsonIgnore
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "entreprise")
    private Set<Contract> contracts;



    public Entreprise() {
    }




}