package com.example.gestiondocuments;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class GestionDocumentsApplication {

	public static void main(String[] args) {
		SpringApplication.run(GestionDocumentsApplication.class, args);
	}

}
