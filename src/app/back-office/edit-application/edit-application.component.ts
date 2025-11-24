import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationService } from '../../services/application.service';
import { Application } from '../../models/application';

@Component({
  selector: 'app-edit-application',
  templateUrl: './edit-application.component.html',
  styleUrls: ['./edit-application.component.css']
})
export class EditApplicationComponent implements OnInit {
  application: Application = {
    id: 0, cv: '', motivationLetter: '', status: 'Pending', offerId: 0, userId: 1,
    accepted: 0,
    matchScore: 0
  };

  constructor(
    private route: ActivatedRoute,
    private applicationService: ApplicationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const appId = this.route.snapshot.paramMap.get('id');
    if (appId) {
      const id = Number(appId);
      if (!isNaN(id)) {
        this.applicationService.getApplicationById(id).subscribe((data) => {
          this.application = data;
        });
      } else {
        console.error('Invalid Application ID format');
      }
    }
  }

  updateApplication(): void {
    console.log('Updating application:', this.application);
    this.applicationService.updateApplication(this.application).subscribe({
      next: () => {
        alert('Application updated successfully!');
        this.router.navigate(['back-office/applications']);
      },
      error: (err) => {
        console.error('Error updating application:', err);
        alert('Failed to update application');
      }
    });
  }


  deleteApplication(): void {
    if (confirm('Are you sure you want to delete this application?')) {
      this.applicationService.deleteApplication(this.application.id).subscribe(() => {
        alert('Application deleted successfully!');
        this.router.navigate(['back-office/applications']);
      });
    }
  }
}
