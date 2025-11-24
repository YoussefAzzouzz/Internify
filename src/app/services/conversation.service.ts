import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Conversation } from '../models/conversation.model';
import { Message } from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {
  private baseUrl = 'http://localhost:8099/internify/conversations';

  constructor(private http: HttpClient) { }

  getConversations(userId: number): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(`${this.baseUrl}/user/${userId}`);
  }

  createConversation(conversation: Conversation): Observable<Conversation> {
    return this.http.post<Conversation>(this.baseUrl, conversation);
  }

  deleteConversation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getMessagesByConversation(conversationId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.baseUrl}/${conversationId}/messages`);
  }

  getConversationById(conversationId: number): Observable<Conversation> {
    return this.http.get<Conversation>(`${this.baseUrl}/${conversationId}`);
  }

  toggleFavorite(conversationId: number, userId: number): Observable<Conversation> {
    return this.http.put<Conversation>(`${this.baseUrl}/${conversationId}/favorite/${userId}`, {});
  }

  toggleMute(conversationId: number, userId: number): Observable<Conversation> {
    return this.http.put<Conversation>(`${this.baseUrl}/${conversationId}/mute/${userId}`, {});
  }

  searchMessages(conversationId: number, content?: string, sentDate?: string): Observable<Message[]> {
    let params: any = {};
    if (content) params.content = content;
    if (sentDate) params.sentDate = sentDate;

    return this.http.get<Message[]>(`${this.baseUrl}/${conversationId}/search`, { params });
  }

  getAllConversations(): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(this.baseUrl);
  }

  getConversationStatistics(conversationId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${conversationId}/stats`);
  }
}
