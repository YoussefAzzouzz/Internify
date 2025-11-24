import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../models/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = 'http://localhost:8011/piproj/Comment/';

  constructor(private http: HttpClient) {}

  getComments(): Observable<Comment[]> {
   return this.http.get<Comment[]>(`http://localhost:8011/piproj/Comment/retrieve-all-comments`);
  }

  getCommentById(id: number): Observable<Comment> {
    return this.http.get<Comment>(`${this.apiUrl}/GetComment/${id}`);
  }

  addComment(comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(`http://localhost:8011/piproj/Comment/Add-Comment`, comment);
  }

  updateComment(commentId: number, newContent: string): Observable<Comment> {
    return this.http.put<Comment>(`${this.apiUrl}update/${commentId}`, newContent);
  }

  deleteComment(id: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:8011/piproj/Comment/Delete-Comment/${id}`);
  }

  addCommentToOffer(offerId: number, content: string): Observable<Comment> {
    // Make sure the backend API endpoint matches this format
    return this.http.put<Comment>(
      `http://localhost:8011/piproj/Comment/Add-Comment-Offer/${offerId}?content=${content}`,
      {}
    );
  }
}
