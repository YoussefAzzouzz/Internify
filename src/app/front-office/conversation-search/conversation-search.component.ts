import {Component, OnInit} from '@angular/core';
import {Message} from "../../models/message.model";
import {FormControl} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {ConversationService} from "../../services/conversation.service";
import {WebSocketService} from "../../services/web-socket.service";
import {debounceTime} from "rxjs";

@Component({
  selector: 'app-conversation-search',
  templateUrl: './conversation-search.component.html',
  styleUrls: ['./conversation-search.component.css']
})
export class ConversationSearchComponent implements OnInit{
  conversationId!: number;
  userId!: number;
  messages: Message[] = [];

  contentControl = new FormControl('');
  dateControl = new FormControl('');

  constructor(
    private route: ActivatedRoute,
    private conversationService: ConversationService,
    private webSocketService: WebSocketService
  ) {}

  ngOnInit(): void {
    this.conversationId = +this.route.snapshot.paramMap.get('idConversation')!;
    this.userId = +this.route.snapshot.paramMap.get('idUser')!;
    this.loadMessages();

    this.contentControl.valueChanges.pipe(debounceTime(300)).subscribe(() => this.loadMessages());
    this.dateControl.valueChanges.subscribe(() => this.loadMessages());

    this.webSocketService.getMessageUpdates().subscribe(() => {
      this.loadMessages(); // update in real time
    });
  }

  loadMessages(): void {
    const content = this.contentControl.value || undefined;
    const sentDate = this.dateControl.value ? new Date(this.dateControl.value).toISOString() : undefined;

    this.conversationService.searchMessages(this.conversationId, content, sentDate).subscribe(data => {
      this.messages = data;
    });
  }
}
