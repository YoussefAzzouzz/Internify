import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { environment } from "../../../environments/environment";
import { map } from "rxjs/operators";
import { User } from "../model/user";
import { QRCodeResponse } from '../model/QRCodeResponse ';  // Adjust the import path accordingly


const AUTH_API = environment.auth_url + 'api/2fa/';


@Injectable({
  providedIn: 'root'
})

export class QrcodeService {

  constructor(private http: HttpClient) { }


  generateqr(user: User): Observable<any> {
    return this.http.post<string>(`${AUTH_API}generate-qr`, user, { 
      responseType: 'text' as 'json'  // This is needed to avoid the overload issue when using `text` responseType
    });
}

verifyOTP(user: User, otpCode: string): Observable<any> {
  const requestBody = {
    username: user.username,  // Ensure username is included
    twoFactorSecret: user.twoFactorSecret // Ensure secret key is sent
  };

  console.log("Sending request:", requestBody); // Debugging log

  return this.http.post(`${AUTH_API}verify/${otpCode}`, requestBody);}




}
