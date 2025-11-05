package tn.esprit.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Response {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Date date;
    private String status;
    private String comment;

    @ManyToOne
@JsonIgnore
    Demand demand;

    @Override

    public String toString() {

        return "Response{" +

                "id=" + id +

                ", comment='" + comment + '\'' +

                ", date=" + date +

                // Do not include demand here to avoid recursion

                '}';

    }


    @JsonIgnore
    @ManyToOne(cascade = CascadeType.ALL)
    User user;
}
