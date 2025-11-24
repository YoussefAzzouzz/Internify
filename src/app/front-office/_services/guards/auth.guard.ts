import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenStorageService } from '../token-storage.service'; // Ensure you have an AuthService
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private TokenStorageService: TokenStorageService, private router: Router) {}

  private roles: string[] = [];

  canActivate(): boolean {
    const user = this.TokenStorageService.getUser(); // Fetch user from service
    const roleNames = user.roles;


    if (roleNames.includes('ROLE_ADMIN')) {
      return true; // Allow access if user is admin
    }
      this.router.navigate(['/unauthorized']); // Redirect to unauthorized page
      return false;

  }
}
