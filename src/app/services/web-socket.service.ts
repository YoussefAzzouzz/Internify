import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { TokenStorageService } from "../front-office/_services/token-storage.service";

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient: any;
  private messagesSubject = new Subject<any>();
  private messageUpdatesSubject = new Subject<any>();
  private notificationsSubject = new Subject<any>();
  private userId!: number;

  constructor(private tokenService: TokenStorageService) {
    this.connect();
  }

  connect() {
    const token = this.tokenService.getToken(); // Get JWT token

    if (!token) {
      console.error('No token found');
      return; // Stop connection if no token
    }

    // Log the token to check if it is being correctly retrieved
    console.log('Connecting with token:', token);

    const socket = new SockJS('http://localhost:8099/internify/ws');
    this.stompClient = Stomp.over(socket);

    // Log the WebSocket connection URL and headers
    console.log('WebSocket connection URL:', 'http://localhost:8099/internify/ws');
    console.log('Authorization Header:', { Authorization: `Bearer ${token}` });

    // Connect and add authorization header with Bearer token
    this.stompClient.connect({ Authorization: `Bearer ${token}` }, (frame: any) => {
      // Log the frame on successful connection
      console.log('Connected: ', frame);

      // Subscribe to the topics
      this.stompClient.subscribe('/topic/conversations', (message: any) => {
        console.log('Received message from /topic/conversations:', message);  // Log incoming messages
        this.messagesSubject.next(JSON.parse(message.body));
      });

      this.stompClient.subscribe('/topic/messages', (message: any) => {
        console.log('Received message from /topic/messages:', message);  // Log incoming messages
        this.messageUpdatesSubject.next(JSON.parse(message.body));
      });

      if (this.userId) {  // Ensure userId is set
        this.stompClient.subscribe(`/topic/notifications/${this.userId}`, (message: any) => {
          console.log('Received notification for userId:', this.userId, message);  // Log incoming notifications
          this.notificationsSubject.next(JSON.parse(message.body));
        });
      } else {
        console.warn('UserId is not set. No notifications will be received.');
      }

    }, (error: any) => {
      console.error('WebSocket connection error:', error);
    });
  }

  getMessages() {
    return this.messagesSubject.asObservable();
  }

  getMessageUpdates() {
    return this.messageUpdatesSubject.asObservable();
  }

  emitMessageUpdate(message: any) {
    this.messageUpdatesSubject.next(message);
  }

  setUserId(userId: number) { // Method to set userId
    this.userId = userId;
  }

  getNotifications() {
    return this.notificationsSubject.asObservable(); // New method to get notifications
  }
}
