import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../model/user';

@Component({
  selector: 'app-password-forget',
  templateUrl: './password-forget.component.html',
  styleUrls: ['./password-forget.component.css']
})
export class PasswordForgetComponent implements OnInit {

  form: any = {
    Password: null,
    ReTypePassword: null
  };
  formPin: any = {
    PIN: null
  };

  user!: User;
  username: string | null = null;
  message: any;
  phoneNumber:any;
  passwordMismatch = false;

  showPasswordForm = false;
  // Flag to show password fields

  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Use activated route snapshot to access route parameters (username in this case)
    this.username = this.route.snapshot.paramMap.get('username');
  
    if (this.username) {
      // Fetch user by username
      this.authService.findByUsername(this.username).subscribe({
        next: (data) => {
          this.user = data;
  
          
          // If user is found, proceed to generate and send the PIN
          if (this.user && this.user.phone) {
            this.message = this.generateRandomPin();
  

           
              this.phoneNumber = '+216' + this.user.phone.toString();

            
            // Send SMS with the generated PIN
           this.authService.sendSms(this.phoneNumber, this.message.toString()).subscribe({
              next: () => {
                console.log('SMS sent successfully.');
              },
              error: (err) => {
                console.log('Error sending SMS: ', err);
              }
            });



          } else {
            console.log('User found but phone number is missing.');
          }
        },
        error: (err) => {
          console.log('Error fetching user: ', err);
        }
      });
    } else {
      console.log('Username parameter is missing or invalid.');
    }
  
    // Debugging - alert the username
  }
  
  

  // This method generates a random 6-digit PIN
  generateRandomPin(): number {
    return Math.floor(100000 + Math.random() * 900000);
  }

  // This method checks if the PIN entered by the user matches the sent PIN
  validatePin(): void {
    if (this.formPin.PIN == this.message) {
      this.showPasswordForm = true;
    } else {
      this.showPasswordForm = false;
      // Hide the password form if PIN is incorrect
    }
  }

  // Method to handle the password reset
  resetPassword(): void {
    if (this.form.Password === this.form.ReTypePassword) {
      if (this.user && this.user.id !== undefined) {
        // Call the backend service to update the password
        this.authService.updateUserPassword(this.user.id, this.form.Password).subscribe({
          next: data => {
            console.log('Password updated successfully!');
            this.router.navigate(['/front-office/login']); 

          },
          error: err => {
            console.log('Error updating password: ', err);
          }
        });
      } else {
        console.log('User ID is invalid or undefined');
      }
    } else {
      this.passwordMismatch = true;

      console.log('Passwords do not match');
    }
  }
  
}
