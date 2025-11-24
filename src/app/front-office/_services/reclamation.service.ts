import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpParams  } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { environment } from "../../../environments/environment";



const Reclamation_url = environment.Reclamation_url + 'api/reclamations/';
const Reclamation_url1 = environment.Reclamation_url + 'api/predict/';




const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ReclamationService {
  
  constructor(private http: HttpClient) { }


  
  getAllReclamations(): Observable<any[]> {
    return this.http.get<any[]>(Reclamation_url + 'all', httpOptions);
  }


  getRecsUser(id:number): Observable<any[]> {
    return this.http.get<any[]>(Reclamation_url +  `${id}`, httpOptions);
  }


  addReclamation(userId: number, reclamation: any): Observable<any> {
    return this.http.post<any>(Reclamation_url + `add/${userId}`, reclamation, httpOptions);
  }


  saveResolvedReclamations(reclamations: any[]) {
    return this.http.post(Reclamation_url + 'save-resolved', reclamations,httpOptions);
  }


  predict( reclamation: any): Observable<any[]> {
    return this.http.post<any>(Reclamation_url1 + `top3`, reclamation, httpOptions);
  }


  readResolvedReclamations(): Observable<any[]> {
    return this.http.get<any[]>(Reclamation_url + 'resolved', httpOptions);
  }


 

  stat(): Observable<any> {
      return this.http.get<any>(`${Reclamation_url}stats`);
  
    }

  deleteResolvedReclamations(): Observable<any[]> {
    return this.http.delete<any[]>(Reclamation_url + 'resolved/clear', httpOptions);
  }

  addReclamation1(userId: string, reclamation: any): Observable<any> {
    return this.http.post<any>(Reclamation_url + `add1/${userId}`, reclamation, httpOptions);
  }


   // Update Reclamation by ID
   updateReclamation(id: number, reclamation: any): Observable<any> {
    return this.http.put<any>(Reclamation_url + `update/${id}`, reclamation, httpOptions);
  }

    // Update Reclamation by ID
    updateReclamation1(reclamation: any): Observable<any> {
      return this.http.put<any>(Reclamation_url + `update1`, reclamation, httpOptions);
    }
  

  // Delete Reclamation by ID
  deleteReclamation(id: number): Observable<any> {
    return this.http.delete<any>(Reclamation_url + `delete/${id}`, httpOptions);
  }



  sendEmail(toEmail: string, body: string, subject: string): Observable<string> {
    // Construct the HTTP parameters
    const params = new HttpParams()
      .set('toEmail', toEmail)
      .set('body', body)
      .set('subject', subject);

    // Make the POST request to the backend API
    return this.http.post<string>(Reclamation_url + `send`, null, { params });
}


 
  
  

 






 
}
