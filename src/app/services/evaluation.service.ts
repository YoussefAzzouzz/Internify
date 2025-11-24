import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
  private apiUrl = 'http://localhost:8088/internshipDemands/api/evaluations';

  constructor(private http: HttpClient) {}

  getEvaluations(demandId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getEvaluations/${demandId}`);
  }

  addEvaluation(demandId: number, rating: number, comment: string): Observable<any> {
    const url = `${this.apiUrl}/addEvaluation/${demandId}/${rating}?comment=${encodeURIComponent(comment)}`;
    return this.http.post<any>(url, {});
  }

}

