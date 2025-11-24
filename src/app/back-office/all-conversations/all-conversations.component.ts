import {Component, OnInit} from '@angular/core';
import {Conversation} from "../../models/conversation.model";
import {ConversationService} from "../../services/conversation.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-all-conversations',
  templateUrl: './all-conversations.component.html',
  styleUrls: ['./all-conversations.component.css']
})
export class AllConversationsComponent implements OnInit{
  conversations: Conversation[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 2;

  constructor(
    private conversationService: ConversationService
  ) {}

  ngOnInit(): void {
    this.conversationService.getAllConversations().subscribe(data => {
      this.conversations = data;
    });
  }

  get paginatedConversations(): Conversation[] {
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

  protected readonly Math = Math;
}
