import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

const AUTH_API = environment.auth_url + 'api/locations/';

@Injectable({
  providedIn: 'root',
})
export class LocationServiceService {
  constructor(private http: HttpClient) {}

  removeFirstLocation(username: string): Observable<any> {
    return this.http.delete(`${AUTH_API}remove-first?username=${username}`);
  }
  
}
