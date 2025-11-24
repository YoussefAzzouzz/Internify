import { Component, OnInit } from '@angular/core';
import { QrcodeService } from '../_services/qrcode.service';  // Import the new service
import { QRCodeResponse } from '../model/QRCodeResponse ';  // Adjust the import path accordingly
import { TokenStorageService } from '../_services/token-storage.service';

import { AuthService } from '../_services/auth.service';
import { LocationServiceService } from '../_services/location-service.service';

import { ActivatedRoute, Router } from '@angular/router';



@Component({
  selector: 'app-two-factor',
  templateUrl: './two-factor.component.html',
  styleUrls: ['./two-factor.component.css']
})

export class TwoFactorComponent implements OnInit {


  qrCodeBase64: string | null = null;
  otpCode: string = '';  // User's OTP code input
  user: any = {};  // To store the user object
  verificationMessage: string | null = null;  // Add the verification message property
  verificationMessage1: string | null = null;  // Add the verification message property

  username: any = {};
  password: any = {};

  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  message:any = {};
  tokenStorage: any;
  IscodeCorrect:Boolean=false;
  roles: string[] = [];


  constructor(
    private qrCodeService: QrcodeService,  // Inject the QRCodeService
    private tokenStorageService: TokenStorageService,
    private authService: AuthService,
    private locationServiceService: LocationServiceService,
     private route: ActivatedRoute,
        private router: Router

  ) {}
  ngOnInit(): void {
    this.username = this.route.snapshot.paramMap.get('username');
    this.message = this.route.snapshot.paramMap.get('message');



    if (this.username) {
      this.authService.findByUsername(this.username).subscribe({
        next: (data) => {
          this.user = data;
          this.generateQRCode();
        },
        error: (err) => {
          console.error("Error:", err);
        }
      });
    } else {
      alert("Username is missing");
    }
  }

  // Load user from session storage
  loadUser(): void {
    this.user = this.tokenStorageService.getUser();
  }

  // Send the user object to generate the QR code
  generateQRCode(): void {

    if (this.user.username) {

      this.qrCodeService.generateqr(this.user).subscribe(
        (response) => {
          console.log('Full response:', response);  // Debugging

          // Ensure it's an object
          if (typeof response === 'string') {
            response = JSON.parse(response);  // Convert string to JSON
          }

          this.qrCodeBase64 = response.qrCodeBase64;
          this.user.twoFactorSecret = response.secretKey;

          console.log('QR Code:', this.qrCodeBase64);

        },
        (error) => {
          console.error('Error generating QR code', error);
        }
      );
    } else {
      console.error('User not found or invalid session');
    }
  }

  // Call backend to verify OTP code
  verifyOTP(): void {
    this.qrCodeService.verifyOTP(this.user, this.otpCode).subscribe(
      (response) => {
        this.verificationMessage="";
                 this.verificationMessage1=response.message;



this.IscodeCorrect=true;




      },
      (error) => {
        console.error("Error verifying OTP", error);
        if (error.error && error.error.error) {
          this.verificationMessage=error.error.error; // Display error message from backend
        } else {
          this.verificationMessage="An unexpected error occurred.";
          this.verificationMessage1="";
        }
      }
    );

  }


  onSubmit(): void {


    this.authService.login1(this.username, this.password).subscribe({

      next:(data) => {
        this.locationServiceService.removeFirstLocation(this.user.username).subscribe({
          next: (response) => {
            console.log('First location removed successfully:', response);
          },
          error: (error) => {
            console.error('Error removing first location:', error);
          }
        });








        this.tokenStorageService.saveToken(data.accessToken);
        this.tokenStorageService.saveUser(data);




        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorageService.getUser().roles.map((role: { name: any }) => role.name);
        console.log("")
        this.errorMessage = "";






      },
      error: err => {

        this.errorMessage = "password incorrect";
        this.isLoginFailed = true;
      }
    });

      }

}
