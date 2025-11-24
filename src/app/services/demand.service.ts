import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

export interface StatisticsResponse {

  totalDemands: number;

  demandsByField: number;

  demandsByStatus: number;

}

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
  getStatistics(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/statistics`);
  }
  getNearbyDemands(lat: number, lng: number, radius: number): Observable<any[]> {

    return this.http.get<any[]>(`${this.apiUrl}/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);

  }

  getDemandStatistics(field?: string | null, status?: string | null): Observable<StatisticsResponse> {

    let params = new HttpParams();

    if (field) {

      params = params.set('field', field);

    }

    if (status) {

      params = params.set('status', status);

    }

    return this.http.get<StatisticsResponse>(`${this.apiUrl}/statistics`, { params });

  }
  // GET All Demands
  getAllDemands(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAllDemands`);
  }
  searchDemandsByField(field: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/search?field=${field}`);
  }
  downloadCv(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/downloadCv/${id}`, { responseType: 'blob' });
  }

  uploadCV(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    return this.http.post<any>("http://localhost:8088/internshipDemands/api/demands/upload-cv", formData);
  }
  parseCv(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/parseCv/${id}`);
  }
  createDemand(demand: any, cvFile: File | null): Observable<any> {
    const formData = new FormData();
    formData.append('demand', JSON.stringify(demand));

    if (cvFile) {
      formData.append('cv', cvFile, cvFile.name);
    }

    return this.http.post<any>(`${this.apiUrl}/addDemand`, formData);
  }

  // UPDATE Demand
  updateDemand(id: number, demand: any, cvFile: File | null): Observable<any> {
    const formData = new FormData();
    formData.append('demand', JSON.stringify(demand));

    if (cvFile) {
      formData.append('cv', cvFile, cvFile.name);
    }

    return this.http.put<any>(`${this.apiUrl}/updateDemand/${id}`, formData);
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
