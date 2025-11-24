import { Component, OnInit } from '@angular/core';
import { CommentService } from '../../services/comment.service';
import { Comment } from '../../models/comment';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  comments: Comment[] = [];
  newComment: Comment = { content: '', creationDate: new Date(), offerId: 0, userId: 0 };
  editingComment: Comment | null = null; // Stocke le commentaire en cours d'édition

  constructor(private commentService: CommentService) {}

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments(): void {
    this.commentService.getComments().subscribe((data) => {
      this.comments = data;
    });
  }

  addComment(): void {
    if (this.newComment.content.trim()) {
      this.commentService.addComment(this.newComment).subscribe(() => {
        this.loadComments();
        this.newComment = { content: '', creationDate: new Date(), offerId: 0, userId: 0 };
      });
    }
  }

  deleteComment(id: number): void {
    this.commentService.deleteComment(id).subscribe(() => {
      this.loadComments();
    });
  }

  editComment(comment: Comment): void {
    this.editingComment = { ...comment }; // Crée une copie pour éviter la modification directe
  }


  cancelEdit(): void {
    this.editingComment = null; // Annule l'édition
  }
}
