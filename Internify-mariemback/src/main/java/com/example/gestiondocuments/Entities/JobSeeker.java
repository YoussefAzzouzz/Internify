package com.example.gestiondocuments.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;
import java.util.Set;

@Entity
@Getter
@Setter
@Table(name = "Jobseeker")
public class JobSeeker  {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String resume;

    private String skills;
    private String education;
    /*@OneToOne
    private User user;*/
    @JsonIgnore
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "jobSeeker")
    private Set<Contract> contracts;

    @JsonIgnore
    @OneToMany(mappedBy = "jobSeeker", cascade = CascadeType.ALL)
    private Set<Report> reports;






    public JobSeeker() {
    }




}