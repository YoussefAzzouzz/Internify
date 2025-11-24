import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResponseService {

  private apiUrl = 'http://localhost:8088/internshipDemands/api/responses';

  constructor(private http: HttpClient) {}

  addResponse(demandId: number, comment: string, status: string): Observable<any> {
    const payload = { comment, status };  // Create the request body with comment and status
    return this.http.post(`${this.apiUrl}/addResponse/${demandId}`, payload, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }




  getResponse(demandId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/getResponse/${demandId}`);
  }
  getResponsesByDemand(demandId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getResponses/${demandId}`);
  }
  searchResponsesByComment(comment: string): Observable<Response[]> {
    return this.http.get<Response[]>(`${this.apiUrl}/search?comment=${comment}`);
  }


}
