package tn.esprit;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class InternshipDemandsApplication {

    public static void main(String[] args) {
        SpringApplication.run(InternshipDemandsApplication.class, args);
    }

}
