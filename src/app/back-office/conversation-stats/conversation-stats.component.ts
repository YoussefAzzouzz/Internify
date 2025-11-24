import {Component, OnInit} from '@angular/core';
import {ConversationService} from "../../services/conversation.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-conversation-stats',
  templateUrl: './conversation-stats.component.html',
  styleUrls: ['./conversation-stats.component.css']
})
export class ConversationStatsComponent implements OnInit{
  conversationId: number = 0; // Used for the conversation ID
  totalStats: any = { TOTAL: 0, IMAGE: 0, TEXT: 0, AUDIO: 0, PDF: 0, };
  avgTime: string = '';
  errorMessage: string = '';

  constructor(private conversationService: ConversationService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Fetch conversation ID from the route parameters
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.conversationId = +id; // Convert id to number
        this.fetchConversationStats();
      }
    });
  }

  // Function to fetch the conversation statistics
  fetchConversationStats(): void {
    if (this.conversationId) {
      this.conversationService.getConversationStatistics(this.conversationId).subscribe(
        stats => {
          this.totalStats = {
            TOTAL: stats.totalMessages || 0,
            IMAGE: stats.typeCounts['IMAGE'] || 0,
            TEXT: stats.typeCounts['TEXT'] || 0,
            AUDIO: stats.typeCounts['AUDIO'] || 0,
            PDF: stats.typeCounts['PDF'] || 0
          };

          // Handle average time between messages
          const avgTimeInSeconds = parseFloat(stats.averageTimeBetweenMessages);
          this.avgTime = this.formatTime(avgTimeInSeconds);
        },
        error => {
          console.error('Error fetching conversation stats:', error);
          this.errorMessage = 'Error fetching conversation statistics.';
        }
      );
    } else {
      this.errorMessage = 'Invalid conversation ID.';
    }
  }

  // Helper function to convert seconds into a readable format (hours:minutes:seconds)
  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  }
}
