package tn.esprit.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.Date;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
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
    private Double latitude; // Student’s preferred location latitude
    private Double longitude;
    @Lob
    private String cv;
    private Double scoreEmployabilite;
    private Integer cluster;  // Add this in Demand.java

    @OneToMany(cascade = CascadeType.ALL, mappedBy="demand")
@JsonIgnore
    private Set<Response> responses;

@JsonIgnore
    @OneToMany(cascade = CascadeType.ALL, mappedBy="demand")
    private Set<Evaluation> evaluations;

@JsonIgnore
    @ManyToOne
    User user;

    @Override

    public String toString() {

        return "Demand{" +

                "id=" + id +

                ", title='" + title + '\'' +

                ", description='" + description + '\'' +

                ", date=" + date +

                // Do not include responses here to avoid recursion

                '}';

    }



}
