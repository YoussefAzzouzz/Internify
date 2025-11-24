import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { environment } from "../../../environments/environment";
import { map } from "rxjs/operators";
import { User } from "../model/user";


const AUTH_API = environment.auth_url + 'api/auth/';
const AUTH_API1 = environment.auth_url + 'api/anomaly/';



const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'signin', {
      username,
      password
    }, httpOptions);
  }


  
  searchAdvanced(searchTerm: string): Observable<any> {
    const params: any = {};
    if (searchTerm) params.searchTerm = searchTerm;
  
    return this.http.get(`${AUTH_API}search`, { params });
  }
  login1(username: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'signin1', {
      username,
      password
    }, httpOptions);
  }

  predictAnomaly(): Observable<any> {
    return this.http.post(AUTH_API + 'predict', {});  // Empty body if no data is required
  }
  
  

  register(username: string, email: string, password: string,role:any,phone:number): Observable<any> {
    return this.http.post(AUTH_API + 'signup', {
      username,
      email,
      password,
      role,
      phone
    }, httpOptions);
  }

  verifyEmail(token: string): Observable<any> {
    return this.http.get<any>(`${AUTH_API}verify?token=${token}`);
  }

  getStatistics(): Observable<any> {
    return this.http.get<any>(`${AUTH_API}statistics`);

  }
  
  
  
  updateUser(user: User): Observable<any> {
    return this.http.put<any>(AUTH_API + 'updateUser', user);
  }

  updateUserPassword(id: number, password: string): Observable<any> {
    return this.http.put<any>(AUTH_API + `updateUserPassword/${id}`, password);
  }

 

  sendSms(phone: string, message: string): Observable<any> {
    const smsRequest = { phone, message };
    return this.http.post<any>(AUTH_API + 'send', smsRequest);
  }

  getUsersByRoleUser(): Observable<any> {
    return this.http.get<any>(AUTH_API +`job-seekers`);
  }

  getUsersByRoleEntreprise(): Observable<any> {
    return this.http.get<any>(AUTH_API +`entreprises`);
  }


  findByUsername(username: string): Observable<any> {
    return this.http.get<any>(AUTH_API +`findByUsername/${username}`);
  }

  findByUsernameAndPassword(username: string,password: string): Observable<any> {
    return this.http.get<any>(AUTH_API +`findByUsernameAndPassword/${username}/${password}`);
  }
  
  verifyCaptcha(captchaResponse: string): Observable<any> {
    return this.http.post<any>(AUTH_API + 'verify-captcha', null, {
      params: { response: captchaResponse }
    });
  }

  getCurrentUser(): Observable<any> {
    const token = localStorage.getItem('token'); // Assuming token is stored in local storage

    if (token) {
      // Backend endpoint to fetch current user details
      return this.http.get<any>(AUTH_API + 'user', {
        headers: new HttpHeaders({
          'Authorization': 'Bearer ' + token
        })
      }).pipe(
        map(response => {
          return response; // Adjust based on your backend response structure
        }),
        catchError(error => {
          console.error('Error fetching current user:', error);
          return of(null); // Return Observable of null in case of error
        })
      );
    } else {
      return of(null); // Return Observable of null if token is not present
    }
  }


 getUsers(): Observable<any> {
    return this.http.get<any>(AUTH_API +`ListUser`);
  }








 
}
