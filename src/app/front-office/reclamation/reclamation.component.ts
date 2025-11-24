import { Component, OnInit } from '@angular/core';
import { ReclamationService } from '../_services/reclamation.service'; // Adjust the import path accordingly
import { TokenStorageService } from '../_services/token-storage.service'; // Adjust the import path accordingly


@Component({
  selector: 'app-reclamation',
  templateUrl: './reclamation.component.html',
  styleUrls: ['./reclamation.component.css']
})
export class ReclamationComponent implements OnInit {
  Reclamations: any[] = [];  // Using any instead of a specific model
  newReclamation: any = {
    user: { username: '' },  // Static username for now
    subject: '',
    message: '',
    status: 'PENDING',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  editedReclamation: any = null;
  User: any = null;
  isAdding = false;
  errorMessage: string | null = null;

  constructor(private reclamationService: ReclamationService,private TokenStorageService: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.loadReclamations();
  }

  loadReclamations() {
    this.User=this.TokenStorageService.getUser();
    this.reclamationService.getRecsUser(this.User.id).subscribe(
      (data) => {
        this.Reclamations = data;
      },
      (err) => {
        
        this.errorMessage = 'Failed to load reclamations.';
        console.error(err);
      }
    );
  }

  onAdd(): void {
    this.isAdding = true;
  }

  onSaveNew(): void {
    if (!this.newReclamation.subject || !this.newReclamation.message) {
      this.errorMessage = 'Subject and message are required.';
      return;
    }

    this.reclamationService.addReclamation1(this.User.username,this.newReclamation).subscribe(
      () => {
        this.loadReclamations();
        this.isAdding = false;
        this.newReclamation = { user: { username: '' }, subject: '', message: '', status: 'PENDING', createdAt: new Date(), updatedAt: new Date() };
      },
      (err) => {
        this.errorMessage = 'Failed to save reclamation.';
        console.error(err);
      }
    );
  }

  onEdit(reclamation: any): void {
    this.editedReclamation = { ...reclamation };
  }

  onUpdate(): void {
    if (!this.editedReclamation?.subject || !this.editedReclamation?.message) {
      this.errorMessage = 'Subject and message are required.';
      return;
    }

    this.reclamationService.updateReclamation(this.editedReclamation.id,this.editedReclamation).subscribe(
      () => {
        this.loadReclamations();
        this.editedReclamation = null;
      },
      (err) => {
        this.errorMessage = 'Failed to update reclamation.';
        console.error(err);
      }
    );
  }

  onDelete(recid: number): void {
    if (confirm('Are you sure you want to delete this reclamation?')) {
      this.reclamationService.deleteReclamation(recid).subscribe(
        () => {
        },
        (err) => {
          this.loadReclamations();

        }
      );
    }
  }

  cancelEdit(): void {
    this.editedReclamation = null;
  }
}
