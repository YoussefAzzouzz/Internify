import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common'; // Import Location
import { ReclamationService } from '../../front-office/_services/reclamation.service';
import { AuthService } from '../../front-office/_services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';


interface ReclamationState {
  reclamation: any; // Replace `any` with the actual type of your reclamation object if available
}

@Component({
  standalone: true,
    imports: [CommonModule, FormsModule],
  selector: 'app-reclamation2',
  templateUrl: './reclamation2.component.html',
  styleUrls: ['./reclamation2.component.css']
})
export class Reclamation2Component implements OnInit {



  reclamation: any;
  newReclamation: any = {
    user: {
      username: '',
    },
    subject: '',
    message: '',
    status: '',
    createdAt: '',
  };

  errorMessage: string = '';
  subject: string = '';
  message: string = '';
  responses: any[] = []; // Array to hold the responses


  isResponseSubmitted: boolean = false;  // Track if the response has been submitted
  resolvedReclamations: any[] = []; // Store resolved/answered reclamations


  constructor(
    private location: Location,
    private ReclamationService: ReclamationService,
    private AuthService: AuthService,
    public router: Router // Make router public
  ) {}

  ngOnInit() {


    // Retrieve the passed reclamation object from router state
    const navigation = this.location.getState() as ReclamationState; // Typecast to ReclamationState
    if (navigation && navigation.reclamation) {
      this.reclamation = navigation.reclamation;
    }

    this.ReclamationService.predict(this.reclamation.message).subscribe({
      next: (data) => {
        this.responses = data; // Store the response data
       
    
    
      },
      error: (saveError) => {
    
        console.error('Error occurred:', saveError); // Handle the error here

      }
    });
  }

 



  onResponseClick(response:string) {
    this.message=response
    console.log(this.message)


  
    }


  onResponse() {


    // Send the email
    this.ReclamationService.sendEmail(this.reclamation.user.email, this.subject, this.message).subscribe({
      next: (data) => {
        // After sending the email, update the reclamation
        this.ReclamationService.updateReclamation1(this.reclamation).subscribe({
          next: () => {
            // Mark the response as submitted
            this.resolvedReclamations.push(this.reclamation);
            this.ReclamationService.saveResolvedReclamations(this.resolvedReclamations).subscribe({
              next: (saveData) => {
  
              
              },
              error: (saveError) => {
                // Mark the response as submitted
                this.isResponseSubmitted = true;
                
                // Optionally, reset the form or redirect
                setTimeout(() => {
                  this.router.navigate(['/back-office/Reclamation']);
                }, 2000); // After 2 seconds, navigate back to the reclamations page
              }
            });
// Mark the response as submitted
this.isResponseSubmitted = true;
                
// Optionally, reset the form or redirect
setTimeout(() => {
  this.router.navigate(['/back-office/Reclamation']);
}, 2000); // After 2 seconds, navigate back to the reclamations page            // Optionally, reset the form or redirect
           // After 2 seconds, navigate back to the reclamations page
          },
          error: (err) => {
            this.errorMessage = 'Error updating reclamation.';
            console.error(err);
          },  
        });



















        
      },
      error: (err) => {

        
        this.ReclamationService.updateReclamation1(this.reclamation).subscribe({
          next: () => {
            // Mark the response as submitted
            this.resolvedReclamations.push(this.reclamation);
            this.ReclamationService.saveResolvedReclamations(this.resolvedReclamations).subscribe({
              next: (saveData) => {
  
              
              },
              error: (saveError) => {
                // Mark the response as submitted
                this.isResponseSubmitted = true;
                
                // Optionally, reset the form or redirect
                setTimeout(() => {
                  this.router.navigate(['/back-office/Reclamation']);
                }, 2000); // After 2 seconds, navigate back to the reclamations page
              }
            });
// Mark the response as submitted
this.isResponseSubmitted = true;
                
// Optionally, reset the form or redirect
setTimeout(() => {
  this.router.navigate(['/back-office/Reclamation']);
}, 2000); // After 2 seconds, navigate back to the reclamations page            // Optionally, reset the form or redirect
           // After 2 seconds, navigate back to the reclamations page
          },
          error: (err) => {
            this.errorMessage = 'Error updating reclamation.';
            console.error(err);
          },  
        });
      },
    });
  }
}
