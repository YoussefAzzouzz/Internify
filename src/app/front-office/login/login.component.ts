import { Component, OnInit,AfterViewInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { Router } from '@angular/router';
import { User } from '../model/user';
import { JwtResponse } from '../model/JwtResponse';

declare var hcaptcha: any;



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit,AfterViewInit {

  title = 'logoconsomitounsi';
  logocomsomitounsi:string = "assets/img/1.png";

  form: any = {
    username: null,
    password: null
  };
  isLoggedIn = false;
  isLoginFailed = false;
  isverified= false;
  errorMessage = '';
  user: any;
  roles: string[] = [];
  isUsernameValid: boolean = false;
  captchaResponse: string | null = null;


  isFA2= true;




  constructor(private authService: AuthService, private tokenStorage: TokenStorageService, private router: Router) { }

  ngAfterViewInit() {
  

  }

  validateUsername(): void {
    const username = this.form.username;

    if (username?.length > 0) {
      // Check if username exists using the auth service
      this.authService.findByUsername(username).subscribe({
        next: (data) => {
          this.user = data;

          // If the user is not found
          if (this.user == null) {
            this.errorMessage = 'Username not found. Please check the username and try again.';
          } else {
            // If the user exists, clear the error and redirect
            this.errorMessage = '';
            this.router.navigate(['/front-office/passwordforget', username]);
          }
        },
        error: (err) => {
          this.errorMessage = 'An error occurred while checking the username. Please try again.';
        }
      });
    } else {
      // If the username is empty, show an error message
      this.errorMessage = 'Username cannot be empty.';
    }
  }

  validateUsername1(message:string): void {
    const username = this.form.username;

    if (username?.length > 0) {
      // Check if username exists using the auth service
      this.authService.findByUsername(username).subscribe({
        next: (data) => {
          this.user = data;

          // If the user is not found
          if (this.user == null) {
            this.errorMessage = 'Invalid username Please check and try again.';
          } else {
            // If the user exists, clear the error and redirect
            this.errorMessage = '';
            this.router.navigate(['/front-office/TwoFactor', this.form.username,message]);
          }
        },
        error: (err) => {
          this.errorMessage = 'An error occurred while checking the username. Please try again.';
        }
      });
    } else {
      // If the username is empty, show an error message
      this.errorMessage = 'Username cannot be empty.';
    }
  }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;

      this.roles = this.tokenStorage.getUser().roles.map((role: { name: any }) => role.name);

      if(this.tokenStorage.getUser().isverified === 1)

        this.isverified= true;
    }
  }

  onSubmit(): void {
if(this.isFA2)
{
 

    this.errorMessage = '';




    const { username, password } = this.form;

    this.authService.login(username, password).subscribe({
      next:(data) => {

        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data);




        this.isLoginFailed = false;
        this.isLoggedIn = true;

        this.roles = this.tokenStorage.getUser().roles.map((role: { name: any }) => role.name);


          if (data.isVerified === 0) {
        this.errorMessage = 'Please verify your email address before logging in.';
        this.isLoginFailed = true;
        this.isLoggedIn = false;


      }



      this.router.navigate(['/']); // Redirect to unauthorized page

      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;


        if (err.error.message === "Login from a new location detected ! Please verify via 2FA.") {
          this.validateUsername1("Login from a new location detected! Please verify via 2FA.");
        }



        if (err.error.message === "Login from Another Device.") {
          this.validateUsername1("Anomaly detected: Login from Another Device.");
        }
        if (err.error.message === "Login from a new location detected And Another Device! Please verify via 2FA."){

          this.validateUsername1("Login from a new location detected And Another Device! Please verify via 2FA.");

        }




      }
    });




  }
  else {

this.validateUsername1("");    }
  }

  reloadPage(): void {
    window.location.reload();
  }






}
