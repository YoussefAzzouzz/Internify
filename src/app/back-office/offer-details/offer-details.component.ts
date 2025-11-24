import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OfferService } from 'src/app/services/offer.service';
import { CommentService } from 'src/app/services/comment.service';
import { ApplicationService } from 'src/app/services/application.service';
import { Comment } from 'src/app/models/comment';
import { Application } from 'src/app/models/application';

@Component({
  selector: 'app-offer-details',
  templateUrl: './offer-details.component.html',
  styleUrls: ['./offer-details.component.css']
})
export class OfferDetailsComponent implements OnInit {
  offer: any;
  comments: Comment[] = [];
  applications: Application[] = [];

  newComment: string = '';
  newApplication: Application = {
    id: 0,
    cv: '',
    motivationLetter: '',
    status: 'Pending',
    offerId: 0,
    userId: 1,
    skills: '',
    experience: 0,
    cvScore: 0,
    accepted: 0,
    matchScore: 0
  };

  selectedFile: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private offerService: OfferService,
    private commentService: CommentService,
    private applicationService: ApplicationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const offerId = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(offerId)) {
      this.loadOfferDetails(offerId);
    } else {
      console.error('Invalid offer ID');
    }
  }

  private loadOfferDetails(offerId: number): void {
    this.offerService.getOfferbyId(offerId).subscribe((data) => {
      this.offer = data;
      this.getComments(offerId);
      this.getApplications(offerId);
    });
  }

  // Match helpers
  getMatchPercentage(score: number | null | undefined): number {
    const n = Number(score);
    let pct = 0;
    if (Number.isFinite(n)) {
      pct = n > 0 && n <= 1 ? n * 100 : n;
    }
    return Math.max(0, Math.min(100, Math.round(pct)));
  }

  matchFillClass(pct: number): string {
    return pct > 50 ? 'match-bar__fill--green' : 'match-bar__fill--red';
  }

  // Comments
  getComments(offerId: number): void {
    this.offerService.getCommentsByOfferId(offerId).subscribe(comments => {
      this.comments = comments;
    });
  }

  addComment(offerId: number): void {
    if (!this.newComment.trim()) {
      alert('Comment cannot be empty');
      return;
    }

    const comment: Comment = {
      content: this.newComment,
      creationDate: new Date(),
      offerId: offerId,
      userId: 1 // hardcoded for now
    };

    this.commentService.addCommentToOffer(comment.offerId, comment.content).subscribe(() => {
      this.getComments(offerId);
      this.newComment = '';
      alert('Comment added successfully!');
    });
  }

  // Applications
  getApplications(offerId: number): void {
    this.applicationService.getApplicationsByOffer(offerId).subscribe(apps => {
      this.applications = apps.map(app => ({
        ...app,
        accepted: app.accepted ?? 0,
        matchScore: app.matchScore ?? 0
      }));
    });
  }

  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  addApplicationWithPdf(): void {
    if (!this.selectedFile) {
      alert('Please select a CV PDF file');
      return;
    }

    if (!this.newApplication.motivationLetter.trim()) {
      alert('Motivation Letter cannot be empty');
      return;
    }

    if (!this.offer?.id) {
      alert('Offer ID is missing');
      return;
    }

    const formData = new FormData();
    formData.append('cvFile', this.selectedFile);
    formData.append('motivationLetter', this.newApplication.motivationLetter);
    formData.append('offerId', this.offer.id.toString());
    formData.append('userId', '1'); // hardcoded for testing

    this.applicationService.applyForOfferWithPdf(formData).subscribe(
      (app: Application) => {
        alert('Application submitted successfully!');
        this.getApplications(this.offer.id);
        this.newApplication.motivationLetter = '';
        this.selectedFile = null;
      },
      (error) => {
        console.error(error);
        alert('Failed to submit application');
      }
    );
  }

  deleteOffer(id: number): void {
    if (confirm('Are you sure you want to delete this offer?')) {
      this.offerService.deleteOffer(id).subscribe(() => {
        this.router.navigate(['/back-office/offers']);
      });
    }
  }
}