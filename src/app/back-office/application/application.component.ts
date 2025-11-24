import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { Router, RouterLink } from '@angular/router';
import { ApplicationService } from 'src/app/services/application.service';
import { Application } from 'src/app/models/application';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  standalone: true,
  imports: [
    CommonModule, // Ajout du CommonModule pour activer *ngFor et *ngIf
    RouterLink
  ],
  styleUrls: ['./application.component.css']
})
export class ApplicationComponent implements OnInit {
  applications: Application[] = [];

  constructor(
    private applicationService: ApplicationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getApplications();
  }

  getApplications(): void {
    this.applicationService.getApplications().subscribe((data) => {
      this.applications = data;
    });
  }

  editApplication(id: number | undefined): void {
    if (id !== undefined) {
      console.log("Navigating to edit page for application ID:", id);
      this.router.navigate([`/back-office/edit-application/${id}`]);
    } else {
      console.error("Invalid application ID:", id);
    }
  }



  deleteApplication(id: number): void {
    if (confirm('Are you sure you want to delete this application?')) {
      this.applicationService.deleteApplication(id).subscribe(() => {
        alert('Application deleted successfully!');
        this.getApplications(); // Rafraîchir la liste
      });
    }
  }
}
