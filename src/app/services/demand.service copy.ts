import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DemandService {
  private apiUrl = 'http://localhost:8088/internshipDemands/api/demands';
  private selectedDemand = new BehaviorSubject<any | null>(null);

  constructor(private http: HttpClient) {}

  getDemandById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getDemandById/${id}`);
  }

  // GET All Demands
  getAllDemands(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAllDemands`);
  }

  // CREATE Demand
  createDemand(demand: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/addDemand`, demand);
  }

  // UPDATE Demand
  updateDemand(id: number, demand: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/updateDemand/${id}`, demand);
  }

  // DELETE Demand
  deleteDemand(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteDemand/${id}`);
  }

  // Manage Selected Demand
  setSelectedDemand(demand: any | null) {
    this.selectedDemand.next(demand);
  }

  getSelectedDemand(): Observable<any | null> {
    return this.selectedDemand.asObservable();
  }
}
