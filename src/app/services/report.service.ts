import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Report {
  id: number;
  submissionDate: string;
  validatedByCompany: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = 'http://localhost:8089/Document/reports';

  constructor(private http: HttpClient) {}

  // ✅ Upload a Report
  uploadReport(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/add`, formData);
  }

  // ✅ Get All Reports
  getAllReports(): Observable<Report[]> {
    return this.http.get<Report[]>(`${this.apiUrl}/all`);
  }

  getReportStats() {
    return this.http.get<{ validated: number, notValidated: number }>(`${this.apiUrl}/stats`);
  }

  downloadReport(reportId: number, language: string) {
    const url = `${this.apiUrl}/api/download/${reportId}?language=${language}`;
    return this.http.get(url, { responseType: 'blob' });
  }

  // ✅ Get summarized report (PDF)
  getSummarizedReport(reportId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${reportId}/summary`, {
      responseType: 'blob',
      headers: new HttpHeaders({
        'Accept': 'application/pdf',
      }),
    });
  }

  // ✅ RÉSUMÉ IA - URL ET HEADERS CORRIGÉS
  getResume(reportId: number): Observable<Blob> {
    const url = `http://localhost:8089/Document/reports/resume/${reportId}`;
    return this.http.get(url, {
      responseType: 'blob',
      headers: new HttpHeaders({
        'Accept': 'application/pdf',
      }),
    });
  }

  // ✅ Search reports by ID and validatedByCompany status
  searchReports(id: number | null, validatedByCompany: boolean | null): Observable<Report[]> {
    let params = new HttpParams();

    if (id !== null) {
      params = params.set('id', id.toString());
    }

    if (validatedByCompany !== null) {
      params = params.set('validatedByCompany', validatedByCompany.toString());
    }

    return this.http.get<Report[]>(`${this.apiUrl}/search`, { params });
  }

  // ✅ Delete a report
  deleteReport(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
