import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../../environments/environment";
import { JobSeeker } from "../model/JobSeeker";
import { User } from "../model/user";
const API_URL = environment.auth_url + 'JobSeeker';

@Injectable({
  providedIn: 'root'
})
export class JobSeekerService {

  constructor(private http: HttpClient) { }



  updateJobSeeker(JobSeeker: JobSeeker, id: number): Observable<any> {
    return this.http.put<any>(`${API_URL}/updateJobSeeker/${id}`, JobSeeker);
  }
  

  updateJobSeeker1(JobSeeker: JobSeeker): Observable<any> {
    return this.http.put<any>(`${API_URL}/updateJobSeeker1`, JobSeeker);
  }
  
  
  getJobSeekerByUserId( id: number): Observable<any> {
    return this.http.get<any>(`${API_URL}/getJobSeekerByUserId/${id}`);
  }


  getJobSeekers(): Observable<any> {
    return this.http.get<any>(`${API_URL}/getJobSeekers`);
  }

  deleteJobSeeker(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/delete/${id}`);
  }

  addJobSeeker(jobSeeker: any): Observable<any> {
    return this.http.post<any>(`${API_URL}/AddJobSeeker`, jobSeeker);
  }

}
