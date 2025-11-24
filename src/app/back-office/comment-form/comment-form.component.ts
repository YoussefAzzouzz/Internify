import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommentService } from '../../services/comment.service';
import { Comment } from '../../models/comment';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.css']
})
export class CommentFormComponent implements OnInit {
  commentForm: FormGroup;
  isEditMode: boolean = false;
  commentId: number | null = null;

  @Input() comment!: Comment;  // For edit input
  @Output() commentUpdated = new EventEmitter<void>(); // Emit event for update
  @Output() cancel = new EventEmitter<void>(); // Emit event for cancel

  constructor(
    private fb: FormBuilder,
    private commentService: CommentService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.commentForm = this.fb.group({
      content: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(500),
        this.noWhitespaceValidator
      ]]
    });
  }

  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    return !isWhitespace ? null : { whitespace: true };
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.commentId = +id;
        this.loadComment(this.commentId); // Load the comment data if editing
      }
    });
  }

  // Load the comment data to be edited
  loadComment(id: number): void {
    this.commentService.getCommentById(id).subscribe(comment => {
      // Patch the form with the existing comment content
      this.commentForm.patchValue({ content: comment.content });
    });
  }

  // Handle form submission for both creating and editing
  onSubmit(): void {
    const formData = this.commentForm.value;  // Get form data

    if (this.isEditMode && this.commentId) {
      const updatedComment: Comment = { ...this.comment, content: formData.content }; // Merge form data with existing comment
      this.commentService.updateComment(this.commentId, updatedComment.content).subscribe(() => {
        this.commentUpdated.emit(); // Notify parent component that the comment was updated
        this.router.navigate(['/back-office/comment']); // Redirect after update
      });
    } else {
      // Handle new comment creation
      this.commentService.addComment(formData).subscribe(() => {
        this.router.navigate(['/comments']); // Navigate after adding a new comment
      });
    }
  }

  // Handle cancel event
  cancelEdit(): void {
    this.cancel.emit(); // Notify parent to cancel
  }
}
