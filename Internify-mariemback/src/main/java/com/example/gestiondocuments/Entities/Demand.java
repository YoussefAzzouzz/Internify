package com.example.gestiondocuments.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Demand {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String field;
    private Date date;
    private String status;

    /*@OneToMany(cascade = CascadeType.ALL, mappedBy="demand")
    @JsonIgnore
    private Set<Response> responses;*/

    /*@OneToOne(cascade = CascadeType.ALL, mappedBy = "demand")
    private Contract contract;*/

}