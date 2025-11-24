import { Injectable } from '@angular/core';
import {map, Observable} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Offer} from "../models/offer";

@Injectable({
  providedIn: 'root'
})
export class OfferService {

  private apiUrl = 'http://localhost:8011/piproj/offers/Get-All-Offers';

  constructor(private http: HttpClient) { }

  getOffers(): Observable<Offer[]> {
    return this.http.get<Offer[]>(this.apiUrl);
  }
  deleteOffer(id: number): Observable<void> {
    console.log(`Deleting offer with ID: ${id}`); // Debugging
    return this.http.delete<void>(`http://localhost:8011/piproj/offers/Delete-Offer/${id}`);
  }
  addOffer(offer: any): Observable<any> {
    return this.http.post<any>('http://localhost:8011/piproj/offers/Add-Offer', offer);
  }

  updateOffer(id: number, offer: FormData): Observable<any> {
    return this.http.put<any>(`http://localhost:8011/piproj/offers/Update-Offer/${id}`, offer);
  }


  getOfferbyId(id: number): Observable<Offer>{
    return this.http.get<Offer>(`http://localhost:8011/piproj/offers/GetOfferById/${id}`);
  }

  getCommentsByOfferId(id: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8011/piproj/offers/GetComments/${id}`);
  }

  getApplicationsByOfferId(id: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8011/piproj/offers/GetAppById/${id}`);
  }
  searchOffers(title: string): Observable<any> {
    return this.http.get<any>(`http://localhost:8011/piproj/offers/search?title=${title}`)
  }
  acceptApplication(applicationId: number): Observable<any> {
    return this.http.put<any>(`http://localhost:8011/piproj/offers/accept/${applicationId}`, {});
  }

  denyApplication(applicationId: number): Observable<any> {
    return this.http.delete<any>(`http://localhost:8011/piproj/offers/deny/${applicationId}`);
  }
  getBestOffers(): Observable<{ offer: Offer, score: number }[]> {
    return this.http.get<{ [key: string]: number }>('http://localhost:8011/piproj/offers/best-offers')
      .pipe(

        map(response => Object.entries(response).map(([key, value]) => ({
          offer: JSON.parse(key), // Convert string key back to Offer object
          score: value
        })))
      );
  }
  addOfferWithImage(offerData: any): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('title', offerData.title);
    formData.append('description', offerData.description);
    formData.append('category', offerData.category);
    formData.append('datePub', offerData.datePub);
    formData.append('dateExp', offerData.dateExp);
    formData.append('image', offerData.image, offerData.image.name);

    return this.http.post(`http://localhost:8011/piproj/offers/add`, formData);
  }
  formatDate(date: any): string {
    const parsedDate = new Date(date);
    return parsedDate.toISOString(); // ISO string format (e.g., "2025-04-10T00:00:00.000Z")
  }

  updateOfferWithImage(
    id: number,
    title: string,
    description: string,
    category: string,
    datePub: string,
    dateExp: string,
    image?: File
  ): Observable<any> {
    const formData = new FormData();

    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('datePub', datePub);
    formData.append('dateExp', dateExp);

    if (image) {
      formData.append('image', image);
    }

    return this.http.put(`http://localhost:8011/piproj/offers/updateWithImage/${id}`, formData);
  }
  downloadScrapedFile(offerId: number): Observable<Blob> {
    const url = `http://localhost:8011/piproj/offers/scrape/${offerId}/download`;
    return this.http.get(url, { responseType: 'blob' });
  }


}


