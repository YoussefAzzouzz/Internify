import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../_services/token-storage.service';
import { FormBuilder, FormGroup,FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../_services/auth.service';
import { User } from '../model/user';
import { Entreprise } from "../model/Entreprise";
import { JobSeeker } from "../model/JobSeeker";

import { EntrepriseService } from '../_services/entreprise.service';
import { JobSeekerService } from '../_services/job-seeker.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';





@Component({
  standalone: true,
  imports: [CommonModule, FormsModule,ReactiveFormsModule],
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  title = 'logoconsomitounsi';
  logocomsomitounsi: string = "assets/img/1.png";
  currentUser: any;
  isEntreprise: boolean = false;

  is1: boolean = false;

  is2: boolean = false;
  is3: boolean = false;

  isUser: boolean = false;
  profileForm!: FormGroup ;
  EntrepriseForm: FormGroup ;
  JobSeekerForm: FormGroup ;

 user!: User;
 entreprise!:Entreprise;
 jobseeker!:JobSeeker;
 showAdminBoard = false;
 errorMessage = '';




  constructor(private fb: FormBuilder, private router: Router, private token: TokenStorageService,private Userservice: AuthService,private entrepriseService: EntrepriseService,private jobSeekerService: JobSeekerService) {

    this.EntrepriseForm = this.fb.group({
      id: [Math.floor(Math.random() * 1000000)],
      companyDescription: ['', Validators.required],
      address: ['', Validators.required],
      contactNumber: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      logo: [''],
      industry: ['', Validators.required],
      companyWebsite: ['', Validators.required],
    });

    this.JobSeekerForm = this.fb.group({
      id: [Math.floor(Math.random() * 1000000)],
      resume: ['', Validators.required],
      skills: ['', Validators.required],
      education: ['', [Validators.required]],

    });

   }

  ngOnInit(): void {
    console.log(this.token.getToken());
    this.currentUser = this.token.getUser();
  

     const roleNames = this.currentUser.roles;
     

    this.showAdminBoard = roleNames.includes('ROLE_ADMIN');

    // Check if the user has 'ROLE_ENTREPRISE' or 'ROLE_USER'
    if (this.currentUser && this.currentUser.roles) {
      if (roleNames.includes('ROLE_ENTREPRISE')) {
        this.isEntreprise = true;
        this.entrepriseService.getEntrepriseByUserId(this.currentUser.id).subscribe(
          (data) => {
            this.entreprise = data;
            this.EntrepriseForm.patchValue({
              id: this.entreprise.id,
              companyDescription: this.entreprise.companyDescription,
              address: this.entreprise.address,
              contactNumber: this.entreprise.contactNumber,
              logo: this.entreprise.logo,
              industry: this.entreprise.industry,
              companyWebsite: this.entreprise.companyWebsite
            });
          },
          (error) => console.error('Error fetching entreprise details', error)
        );


      } else if (roleNames.includes('ROLE_USER')) {


        this.isUser = true;

        this.jobSeekerService.getJobSeekerByUserId(this.currentUser.id).subscribe(
          (data) => {
            this.jobseeker = data;
            this.JobSeekerForm.patchValue({
              id: this.jobseeker.id,
              resume: this.jobseeker.resume,
              skills: this.jobseeker.skills,
              education: this.jobseeker.education,

            });
          },
          (error) => console.error('Error fetching JobSeeker details', error)
        );
      }
    }

    this.profileForm = this.fb.group({
      id: [this.currentUser.id],
      username: [this.currentUser.username, [Validators.required, Validators.maxLength(20)]],
      email: [this.currentUser.email, [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],

    });




  }


  OnSubmit(): void {
    if (this.isEntreprise)
    {this.entreprise = this.EntrepriseForm.value;


      this.entrepriseService.updateEntreprise(this.entreprise,this.currentUser.id).subscribe(
        (response) => {
          // Handle success response
          this.is1=true;
          console.log('Entreprise updated successfully', response);

        },
        (error) => {
          // Handle error response
          console.error('Entreprise updating user', error);
        }
      );


    }

    if (this.isUser)
      {this.jobseeker = this.JobSeekerForm.value;


        this.jobSeekerService.updateJobSeeker(this.jobseeker,this.currentUser.id).subscribe(
          (response) => {

            this.is2=true;

            // Handle success response
            console.log('JobSeeker updated successfully', response);

          },
          (error) => {
            // Handle error response
            console.error('JobSeeker updating user', error);
          }
        );


      }

    if (this.profileForm ) {
      this.user = this.profileForm.value; // Ensure the profile form is correct


      this.Userservice.updateUser(this.user).subscribe(
        (response) => {
          this.is3=true;

          // Handle success response
          console.log('User updated successfully', response);

        },
        (error) => {
          this.errorMessage = error.error.message;


          // Handle error response
          console.error('Error updating user', error);
        }
      );

      if(this.is3&&(this.is2||this.is1))
        {          this.router.navigate(['/']); // Redirect to unauthorized page
        }
    } else {
      console.log('Form is invalid');
    }
  }



}
