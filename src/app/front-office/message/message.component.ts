import {Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '../../services/message.service';
import { WebSocketService } from '../../services/web-socket.service';
import { Message } from '../../models/message.model';
import { ConversationService } from "../../services/conversation.service";
import { Conversation } from '../../models/conversation.model';
import {User} from "../../models/user.model";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  messages: Message[] = [];
  conversationId!: number;
  userId!: number;
  conversation!: Conversation;
  errorMessage: string = '';
  connectedUser !: User;
  newMessageContent: string = '';
  editingMessageId: number | null = null;
  editedMessageContent: string = '';
  selectedFile: File | null = null;
  mediaRecorder: MediaRecorder | null = null;
  audioChunks: Blob[] = [];
  isRecording: boolean = false;
  suggestedReplies: string[] = [];
  isLoadingSuggestions: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private messageService: MessageService,
    private conversationService: ConversationService,
    private userService: UserService,
    private webSocketService: WebSocketService
  ) { }

  ngOnInit(): void {
    this.userId = +this.route.snapshot.paramMap.get('idUser')!;
    this.conversationId = +this.route.snapshot.paramMap.get('idConversation')!;
    this.loadConnectedUser();
    this.loadConversation();
    this.loadMessages();

    this.webSocketService.getMessageUpdates().subscribe((message: any) => {
      if (message.action === 'pinned' || message.action === 'unpinned') {
        const updatedMessage = message.message;
        const index = this.messages.findIndex(m => m.id === updatedMessage.id);
        if (index !== -1) {
          this.messages[index].isPinned = updatedMessage.isPinned;
        } else {
          this.messages.push(updatedMessage);
        }
      }
      if (message.id) {
        if (message.conversation.id === this.conversationId) {
          this.messages.push(message);
        }
      }
      else if (message.action === 'updated') {
        const updatedMessage = message.message;
        if (updatedMessage.conversation.id === this.conversationId) {
          const index = this.messages.findIndex(m => m.id === updatedMessage.id);
          if (index !== -1) {
            this.messages[index] = updatedMessage;
          } else {
            this.messages.push(updatedMessage);
          }
        }
      }
      else if (message.action === 'deleted') {
        const deletedMessage = message.message;
        if (deletedMessage.conversation.id === this.conversationId) {
          const index = this.messages.findIndex(m => m.id === deletedMessage.id);
          if (index !== -1) {
            this.messages[index] = deletedMessage;
          } else {
            this.messages.push(deletedMessage);
          }
        }
      }

      this.loadMessages();
    });
  }

  loadConnectedUser() {
    this.userService.getUserById(this.userId).subscribe(user => {
      this.connectedUser = user;
    });
  }

  loadConversation() {
    this.conversationService.getConversationById(this.conversationId).subscribe({
      next: (conversation) => {
        this.conversation = conversation;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération de la conversation:', err);
        this.errorMessage = 'Erreur lors de la récupération de la conversation.';
      }
    });
  }

  loadMessages() {
    this.conversationService.getMessagesByConversation(this.conversationId).subscribe(data => {
      this.messages = data;
      this.updateMessageStatusToRead();
    }, error => {
      console.error('Erreur lors de la récupération des messages:', error);
      this.errorMessage = 'Erreur lors de la récupération des messages.';
    });
  }

  sendMessage() {
    this.errorMessage = '';

    if (!this.newMessageContent.trim()) {
      this.errorMessage = 'The message cannot be empty.';
      return;
    }

    // ✅ Check toxicity first
    this.messageService.checkToxicity(this.newMessageContent).subscribe({
      next: (response) => {
        if (response.prediction === 'toxic') {
          this.errorMessage = 'Your message is toxic. Please revise it.';
          return;
        }

        // ✅ If message is clean → send it normally
        const newMessage: Message = {
          id: 0,
          content: this.newMessageContent,
          messageType: 'TEXT',
          sender: this.connectedUser,
          receiver: this.conversation.users[0].id === this.userId ? this.conversation.users[1] : this.conversation.users[0],
          status: 'SENT',
          isTyping: false,
          isPinned: false,
          readAt: null,
          attachmentUrl: null,
          conversation: this.conversation
        };

        this.messageService.sendMessage(newMessage).subscribe({
          next: () => {
            this.loadMessages();
            this.newMessageContent = '';
          },
          error: (err) => {
            console.error('Erreur lors de l\'envoi du message:', err);
          }
        });
      },
      error: (err) => {
        console.error('Error checking toxicity:', err);
        this.errorMessage = 'Could not check message toxicity. Try again later.';
      }
    });
  }

  deleteMessage(id: number) {
    this.messageService.deleteMessage(id).subscribe(() => {
      this.loadMessages();
    });
  }

  startEditing(message: Message) {
    this.editingMessageId = message.id;
    this.editedMessageContent = message.content;
  }

  submitEdit() {
    this.errorMessage = '';
    if (!this.editedMessageContent.trim()) {
      this.errorMessage = 'The message cannot be empty.';
      return;
    }
    if (this.editingMessageId !== null) {
      this.messageService.updateMessage(this.editingMessageId,this.editedMessageContent).subscribe({
        next: () => {
          this.loadMessages();
          this.cancelEdit();
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour du message:', err);
        }
      });
    }
  }

  cancelEdit() {
    this.editingMessageId = null;
    this.editedMessageContent = '';
  }

  updateMessageStatusToRead() {
    this.messages.forEach(message => {
      if (message.status === 'SENT' && message.receiver.id === this.userId) {
        this.messageService.updateMessageStatusToRead(message.id).subscribe({
          next: () => {
            message.status = 'READ';
            message.readAt = new Date();
          },
          error: (err) => {
            console.error('Error updating message status:', err);
          }
        });
      }
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadMessage() {
    this.errorMessage = '';

    if (this.selectedFile) {
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const validPdfType = 'application/pdf';

      if (!validImageTypes.includes(this.selectedFile.type) && this.selectedFile.type !== validPdfType) {
        this.errorMessage = 'Please upload a valid image file (JPEG, PNG, GIF) or a PDF file.';
        this.selectedFile = null;
        return;
      }

      const newMessage: Message = {
        id: 0,
        content: this.selectedFile.type === validPdfType ? 'PDF' : 'Image',
        messageType: this.selectedFile.type === validPdfType ? 'PDF' : 'IMAGE',
        sender: this.connectedUser ,
        receiver: this.conversation.users[0].id === this.userId ? this.conversation.users[1] : this.conversation.users[0],
        status: 'SENT',
        isTyping: false,
        isPinned: false,
        readAt: null,
        attachmentUrl: null,
      };

      this.messageService.sendMessageWithAttachment(newMessage, this.selectedFile, this.conversationId).subscribe({
        next: (response) => {
          this.messages.push(response);
          this.selectedFile = null;
        },
        error: (err) => {
          console.error('Error sending message:', err);
          this.errorMessage = 'Failed to send message. Please try again.';
        }
      });
    } else {
      this.errorMessage = 'Select a file first.';
    }
  }

  uploadAudio(audioBlob: Blob) {
    const timestamp = new Date().getTime();
    const audioFileName = `voice-message-${timestamp}.wav`;
    const audioFile = new File([audioBlob], audioFileName, { type: 'audio/wav' });

    const newMessage: Message = {
      id: 0,
      content: 'Audio',
      messageType: 'AUDIO',
      sender: this.connectedUser ,
      receiver: this.conversation.users[0].id === this.userId ? this.conversation.users[1] : this.conversation.users[0],
      status: 'SENT',
      isTyping: false,
      isPinned: false,
      readAt: null,
      attachmentUrl: null,
    };

    this.messageService.sendMessageWithAttachment(newMessage, audioFile, this.conversationId).subscribe({
      next: (response) => {
        this.messages.push(response);
      },
      error: (err) => {
        console.error('Error sending message:', err);
        this.errorMessage = 'Failed to send message. Please try again.';
      }
    });
  }

  startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];
      this.mediaRecorder.start();
      this.isRecording = true;

      this.mediaRecorder.ondataavailable = event => {
        this.audioChunks.push(event.data);
      };

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        this.uploadAudio(audioBlob);
      };
    });
  }

  stopRecording() {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      this.isRecording = false;
    }
  }

  toggleRecording() {
    if (this.isRecording) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
  }

  pinMessage(message: Message) {
    this.messageService.pinMessage(message.id).subscribe({
      next: () => {
        message.isPinned = !message.isPinned;

        this.webSocketService.emitMessageUpdate({
          action: message.isPinned ? 'pinned' : 'unpinned',
          message: message
        });
      },
      error: (err) => {
        console.error('Error pinning message:', err);
      }
    });
  }

  get hasPinnedMessages(): boolean {
    return this.messages.some(message => message.isPinned);
  }

  getSuggestionsForLastReceivedMessage(): void {
    // Find the last received message
    const lastReceived = [...this.messages]
      .reverse()
      .find(msg => msg.receiver.id === this.connectedUser.id);

    if (!lastReceived) {
      this.suggestedReplies = [];
      return;
    }

    const messageType = lastReceived.messageType;
    const content = lastReceived.content?.trim() || '';
    const attachmentUrl = lastReceived.attachmentUrl?.trim() || '';

    let inputText = '';

    // --- 🧠 Decide what to send based on message type ---
    if (messageType === 'TEXT') {
      inputText = content;
    } else {
      // Get file name only
      const fileName = attachmentUrl.split('/').pop();
      // Prepend your local backend path
      inputText = `C:/Users/Dell/OneDrive/Desktop/Internify-chat_back/uploads/${fileName}`;
    }

    this.isLoadingSuggestions = true;
    this.suggestedReplies = [];

    // ✅ Safe: always passing two strings
    this.messageService.getReplySuggestions(messageType, inputText).subscribe({
      next: (response) => {
        this.suggestedReplies = response.replies;
        this.isLoadingSuggestions = false;
        console.log('Suggested replies:', this.suggestedReplies);
      },
      error: (err) => {
        console.error('Error getting suggestions:', err);
        this.suggestedReplies = ['Error fetching suggestions.'];
        this.isLoadingSuggestions = false;
      }
    });
  }
}
