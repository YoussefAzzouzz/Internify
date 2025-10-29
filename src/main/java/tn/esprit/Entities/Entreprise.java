package tn.esprit.Entities;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

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

	private Double ratings = 0.0;
	private Double x = 0.0;
	private String hq = "Unknown HQ";


	@OneToOne(cascade = CascadeType.ALL) // Cascade the save operation to User


	private User user;



	public Entreprise() {
	}




}