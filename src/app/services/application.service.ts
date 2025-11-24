import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Application } from '../models/application';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private apiUrl = 'http://localhost:8011/piproj/Application';

  constructor(private http: HttpClient) {}

  getApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(`http://localhost:8011/piproj/Application/retrieve-all-application`);
  }

  getApplicationById(id: number): Observable<Application> {
    return this.http.get<Application>(`http://localhost:8011/piproj/Application/GetApplication/${id}`);
  }

  addApplication(application: Application): Observable<Application> {
    return this.http.post<Application>(`${this.apiUrl}/Add-Application`, application);
  }

  getApplicationsByOffer(offerId: number): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/offer/${offerId}/applications`);
  }

  updateApplication(application: Application): Observable<Application> {
    return this.http.put<Application>(`${this.apiUrl}/Update-Application/${application.id}`, application);
  }


  deleteApplication(id: number | undefined): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Delete-Application/${id}`);
  }

applyForOffer(
  offerId: number,
  userId: number,
  cv: string,
  motivationLetter: string,
  skills: string,
  experience: number,
  cvScore: number
): Observable<Application> {
  const url = `${this.apiUrl}/apply` +
    `?offerId=${offerId}` +
    `&userId=${userId}` +
    `&cv=${encodeURIComponent(cv)}` +
    `&motivationLetter=${encodeURIComponent(motivationLetter)}` +
    `&skills=${encodeURIComponent(skills)}` +
    `&experience=${experience}` +
    `&cvScore=${cvScore}`;

  return this.http.post<Application>(url, {});
}

applyForOfferWithPdf(formData: FormData): Observable<Application> {
  return this.http.post<Application>(`${this.apiUrl}/apply-with-cv`, formData);
}



}
