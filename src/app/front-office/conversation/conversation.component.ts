import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConversationService } from '../../services/conversation.service';
import { UserService } from '../../services/user.service';
import { WebSocketService } from '../../services/web-socket.service';
import { Conversation } from '../../models/conversation.model';
import { User } from '../../models/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import {Message} from "../../models/message.model";
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit {
  conversations: Conversation[] = [];
  userId!: number;
  connectedUser !: User;
  newEmail: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 2;
  errorMessage: string = '';
  private emailPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  recommendedUsers: User[] = [];
  allUsers: User[] = [];
  recommendedClicked: boolean = false;
  loadingRecommended: boolean = false;

  constructor(
    private conversationService: ConversationService,
    private userService: UserService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private webSocketService: WebSocketService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.userId = +this.route.snapshot.paramMap.get('idUser')!;
    this.loadConnectedUser();
    this.loadConversations();

    this.webSocketService.getMessages().subscribe((message: any) => {
      if (message.id) {
        this.conversations.push(message);
      } else if (typeof message === 'string' && message.startsWith('deleted:')) {
        const idToDelete = parseInt(message.split(':')[1], 10);
        this.conversations = this.conversations.filter(c => c.id !== idToDelete);
      }
      this.loadConversations();
    });

    this.webSocketService.setUserId(this.userId);
    this.webSocketService.getNotifications().subscribe((message: Message) => {
      if (!this.isUserMuted(message.conversation!,this.connectedUser))
        this.handleNewMessage(message); // Call the method to handle new messages
    });
  }

  loadConnectedUser() {
    this.userService.getUserById(this.userId).subscribe(user => {
      this.connectedUser = user;
    });
  }

  loadConversations() {
    this.conversationService.getConversations(this.userId).subscribe(data => {
      this.conversations = data;
    });
  }

  deleteConversation(id: number) {
    this.conversationService.deleteConversation(id).subscribe(() => {
    });
  }

  createConversation(email: string) {
    this.errorMessage = '';

    if (!email.trim()) {
      this.errorMessage = 'The email field cannot be empty.';
      return;
    }

    if (!this.emailPattern.test(email)) {
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }

    if (this.connectedUser.email === email) {
      this.errorMessage = 'You cannot create a conversation with yourself.';
      return;
    }

    this.conversationService.getConversations(this.userId).subscribe(existingConversations => {
      const userExists = existingConversations.some(conversation =>
        conversation.users.some(user => user.email === email)
      );

      if (userExists) {
        this.errorMessage = 'A conversation with this user already exists.';
        return;
      }

      this.userService.getUserByEmail(email).subscribe(user => {
        const newConversation: Conversation = {
          id: 0,
          users: [user, this.connectedUser ],
          userFavorites: [],
          unreadMessagesCount: 0,
          mutedBy: []
        };

        this.conversationService.createConversation(newConversation).subscribe(() => {
          this.newEmail = '';
          this.loadConversations();
        });
      }, error => {
        this.errorMessage = 'No user found with this email address.';
      });
    });
  }

  get paginatedConversations() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.conversations.slice(startIndex, startIndex + this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage * this.itemsPerPage < this.conversations.length) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  shouldShowPagination(): boolean {
    return this.conversations.length > this.itemsPerPage;
  }

  toggleFavorite(conversation: Conversation) {
    this.conversationService.toggleFavorite(conversation.id, this.userId).subscribe(updatedConversation => {
      // Update the local conversation list with the updated conversation
      const index = this.conversations.findIndex(c => c.id === updatedConversation.id);
      if (index !== -1) {
        this.conversations[index] = updatedConversation;
      }
    });
  }

  isUserFavorite(conversation: Conversation, user:User): boolean {
    for (const user of conversation.userFavorites)
      if (user.id === this.connectedUser.id)
        return true;
  return false;
  }

  handleNewMessage(message: Message) { // Specify the type as Message
    this.snackBar.open('New message from ' + message.sender.username, '✖', { // Adjust according to your Message structure
      duration: 3000,
      verticalPosition: 'top', // Position at the top
      panelClass: ['custom-snackbar']
    });
  }

  toggleMute(conversation: Conversation) {
    this.conversationService.toggleMute(conversation.id, this.userId).subscribe(updatedConversation => {
      const index = this.conversations.findIndex(c => c.id === updatedConversation.id);
      if (index !== -1) {
        this.conversations[index] = updatedConversation; // Update the conversation in the list
      }
    }, error => {
      console.error('Error toggling mute:', error);
      // Optionally, show an error message to the user
    });
  }

  isUserMuted(conversation: Conversation, user:User): boolean {
    for (const user of conversation.mutedBy)
      if (user.id === this.connectedUser.id)
        return true;
    return false;
  }

  showRecommendedFriends() {
    this.loadingRecommended = true;
    // Step 1: Get input for recommendation
    this.userService.getAllUsers().subscribe(users => {
      this.allUsers = users;

      // Step 2: Get input for recommendation from your backend
      this.messageService.getRecommendationInput().subscribe(usersInput => {

        // Step 3: Get recommended users from Flask
        this.messageService.getRecommendedFriends(usersInput).subscribe(recommendations => {

          // Step 4: Extract all user IDs that already have a conversation
          const existingUserIds = this.conversations
            .map(conv => conv.users.map(u => u.id))
            .flat();

          // Step 5: Filter recommended users
          this.recommendedUsers = this.allUsers.filter(u =>
            recommendations.some(r => r.id === u.id && r.recommended) &&
            u.id !== this.userId &&                  // remove current user
            !existingUserIds.includes(u.id)         // remove users with existing conversation
          );

          console.log('Filtered Recommended Users:', this.recommendedUsers);
          this.loadingRecommended = false;

        }, err => {
          console.error('Error fetching recommendations from Flask:', err);
          this.loadingRecommended = false;
        });

      }, err => {
        console.error('Error fetching recommendation input from backend:', err);
        this.loadingRecommended = false;
      });
    });
  }

  protected readonly Math = Math;
}
