import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.css']
})
export class EmailVerificationComponent implements OnInit {
  verificationStatus: string = '';
  isVerified: boolean = false;

  constructor(private authService: AuthService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const token = this.route.snapshot.queryParams['token']; 

    if (token) {
      this.authService.verifyEmail(token).subscribe({
        next: (response) => {
          this.verificationStatus = response.message;  // Success message
          this.isVerified = true;
        },
        error: (error) => {
          this.verificationStatus = 'Verification failed: ' + error.error.message;  // Error message
          this.isVerified = false;
        }
      });
    }
  }

  redirectToLogin(): void {
    window.location.href = '/front-office/login';  // Redirecting to the login page
  }
  
}
