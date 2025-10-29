package tn.esprit.Entities;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

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
	@OneToOne(cascade = CascadeType.ALL)
	private User user;




	public JobSeeker() {
	}




}