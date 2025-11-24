import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contract } from '../models/contract';

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  private apiUrl = 'http://localhost:8089/Document/contracts';

  constructor(private http: HttpClient) {}

  createContract(contract: any, file?: File): Observable<any> {
    const formData = new FormData();

    // Convert contract object to JSON string
    formData.append('contract', JSON.stringify(contract));

    // Append file only if provided
    if (file) {
      formData.append('file', file);
    }

    return this.http.post(`${this.apiUrl}/create`, formData);
  }

  getFilteredContracts(id: number | null, status: string): Observable<any> {
    let params = new HttpParams();
    if (id !== null) {
      params = params.append('id', id.toString());
    }
    if (status) {
      params = params.append('status', status);
    }

    return this.http.get<any>(`${this.apiUrl}/search`, { params }); // Make GET request to the backend
  }

  getAllContracts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAllContracts`);
  }

  getContractsByEntreprise(entrepriseId: number): Observable<Contract[]> {
    return this.http.get<Contract[]>(`${this.apiUrl}/entreprise/${entrepriseId}`);
  }

  deleteContract(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

  getContractsByStatus(): Observable<any> {
    return this.http.get<any>('http://localhost:8089/Document/contracts/statistics/status');
  }



}
