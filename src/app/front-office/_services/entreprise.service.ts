import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../../environments/environment";
import { Entreprise } from "../model/Entreprise";
import { User } from "../model/user";
const API_URL = environment.auth_url + 'entreprise';

@Injectable({
  providedIn: 'root'
})
export class EntrepriseService {

  constructor(private http: HttpClient) { }



  updateEntreprise(entreprise: Entreprise, id: number): Observable<any> {
    return this.http.put<any>(`${API_URL}/updateEntreprise/${id}`, entreprise);
  }
  
  
  getEntrepriseByUserId( id: number): Observable<any> {
    return this.http.get<any>(`${API_URL}/getEntrepriseByUserId/${id}`);
  }
  

  updateEntreprise1(Entreprise: Entreprise): Observable<any> {
      return this.http.put<any>(`${API_URL}/updateEntreprise1`, Entreprise);
    }

    
  deleteEntreprise(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/delete/${id}`);
  }

  addEntrepriseToUser(jobSeeker: any, id: number): Observable<any> {
    return this.http.post<any>(`${API_URL}/add-to-user/${id}`, jobSeeker);
  }

  addEntreprise(jobSeeker: any): Observable<any> {
    return this.http.post<any>(`${API_URL}/AddEntreprise`, jobSeeker);
  }

   getEntreprises(): Observable<any> {
      return this.http.get<any>(`${API_URL}/getEntreprises`);
    }
    

}
