import { Component, OnInit } from '@angular/core';
import { JobSeekerService } from '../../front-office/_services/job-seeker.service';
import { EntrepriseService } from '../../front-office/_services/entreprise.service';
import {Chart, ChartData, ChartOptions} from 'chart.js';
import { ChartType } from 'chart.js';




// Register the necessary components for pie chart

// Register the necessary chart components
import { environment } from "../../../environments/environment";
import { AuthService } from "../../front-office/_services/auth.service";


import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {



  jobSeekers: any[] = [];
  Entreprises: any[] = [];
  statistics: any;


  currentPageJobSeekers: number = 1;
itemsPerPageJobSeekers: number = 2;

currentPageEntreprises: number = 1;
itemsPerPageEntreprises: number = 2;




  errorMessage: string = '';
  errorMessage1: string = '';

  editedJobSeeker: any = null; // holds the jobSeeker being edited
  editedEntreprise: any = null;

  isAdding = false;
  isAdding1 = false;

  newJobSeeker: any = {
    user: {
      username: '',
      email: '',
      password: '',
      phone: '',
      isVerified: 0
    },
    resume: '',
    skills: '',
    education: ''
  };

  newEntreprise: any = {
    user: {
      username: '',
      email: '',
      password: '',
      phone: '',
      isVerified: 0
    },

    companyDescription: '',
    address: '',
    contactNumber: null,
    logo: '',
    industry: '',
    companyWebsite: ''
  };


  isPasswordVisible: boolean = false;



  private apiUrl = environment.auth_url + 'statistics';  // Concatenate base API URL and endpoint
username: any;
email: any;
phone: any;

filteredJobSeekers: any[] = [];
filteredEntreprises: any[] = [];
searchTerm: any;


  constructor(private AuthService: AuthService,private http: HttpClient,private jobSeekerService: JobSeekerService,private entrepriseService: EntrepriseService) { }



  ngOnInit(): void {




    this.loadJobSeekers();
    this.loadEntrepriseServices();

    this.getStatisticsData();





  }

  getStatisticsData() {
    this.AuthService.getStatistics().subscribe(data => {
      this.createChart(data);

    });
  }


  createChart(data: any): void {
    const canvas = document.getElementById('statisticsChart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    // Check if ctx is not null
    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['jobSeekersCount', 'enterprisesCount'],
          datasets: [{
            label: 'Count',
            data: [data.jobSeekersCount, data.enterprisesCount],
            backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
            borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    } else {
      console.error('Failed to get canvas context');
    }
  }


  searchAdvancedUsers() {
    this.AuthService.searchAdvanced(this.searchTerm).subscribe({
      next: data => {
        this.jobSeekers = data.jobSeekers;
        this.Entreprises = data.entreprises;
      },
      error: err => {
        console.error('Error fetching search results', err);
      }
    });
  }








  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }


  loadJobSeekers(): void {
    this.jobSeekerService.getJobSeekers().subscribe({
      next: data => {
        this.jobSeekers = data;
      },
      error: err => {
        this.errorMessage = 'An error occurred while fetching job seekers.';
        console.error(err);
      }
    });
  }


  loadEntrepriseServices(): void {
    this.entrepriseService.getEntreprises().subscribe({
      next: data => {
        this.Entreprises = data;
      },
      error: err => {
        this.errorMessage = 'An error occurred while fetching Entreprises.';
        console.error(err);
      }
    });
  }

  onAdd() {
    this.isAdding = true;
  }

  onAdd1() {
    this.isAdding1 = true;
  }
  cancelAdd1() {
    this.isAdding1 = false;
  }


  cancelAdd() {
    this.isAdding = false;
  }



  onDelete(jobSeekerId: number): void {
    if (confirm('Are you sure you want to delete this job seeker?')) {
      this.jobSeekerService.deleteJobSeeker(jobSeekerId).subscribe({
        next: () => {
          // Optionally refresh the list or remove the deleted job seeker from the UI
          this.jobSeekers = this.jobSeekers.filter(js => js.user.id !== jobSeekerId);
          console.log('Job Seeker deleted successfully.');
          this. reloadPage();

        },
        error: err => {
          this.errorMessage = 'Failed to delete job seeker.';
          console.error(err);
        }
      });
    }
  }

  onDelete1(jobSeekerId: number): void {
    if (confirm('Are you sure you want to delete this job seeker?')) {
      this.entrepriseService.deleteEntreprise(jobSeekerId).subscribe({
        next: () => {
          // Optionally refresh the list or remove the deleted job seeker from the UI
          this.Entreprises = this.Entreprises.filter(js => js.user.id !== jobSeekerId);
          console.log('Entreprise deleted successfully.');
          this. reloadPage();

        },
        error: err => {
          this.errorMessage = 'Failed to delete Entreprise.';
          console.error(err);
        }
      });
    }
  }


  onEdit(jobSeeker: any): void {
    // Create a deep copy (or shallow copy if it's enough) so changes are not immediately reflected in the table.
    this.editedJobSeeker = { ...jobSeeker };
  }

  onEdit1(jobSeeker: any): void {
    // Create a deep copy (or shallow copy if it's enough) so changes are not immediately reflected in the table.
    this.editedEntreprise = { ...jobSeeker };
  }

  cancelEdit(): void {
    this.editedJobSeeker = null;
  }

  cancelEdit1(): void {
    this.editedEntreprise = null;
  }


  onSave(updatedJobSeeker: any): void {
    // Call your service's modify endpoint. Assume jobSeekerService.modifyJobSeeker returns an observable.
    this.jobSeekerService.updateJobSeeker1(updatedJobSeeker).subscribe({
      next: (response) => {
        // Update the local array with the updated job seeker details.
        const index = this.jobSeekers.findIndex(js => js.id === updatedJobSeeker.id);
        if (index !== -1) {
          this.jobSeekers[index] = response;
        }
        this.editedJobSeeker = null;
        this.errorMessage = '';

      },
      error: err => {
        if (err.status === 400) {
          this.errorMessage = err.error;  // Display the error message from the server
        } else {
          this.errorMessage = 'An unknown error occurred.';
        }
      }
    });
  }

  onSave1(updatedJobSeeker: any): void {
    // Call your service's modify endpoint. Assume jobSeekerService.modifyJobSeeker returns an observable.
    this.entrepriseService.updateEntreprise1(updatedJobSeeker).subscribe({
      next: (response) => {
        // Update the local array with the updated job seeker details.
        const index = this.Entreprises.findIndex(js => js.id === updatedJobSeeker.id);
        if (index !== -1) {
          this.Entreprises[index] = response;
        }
        this.editedEntreprise = null;
        this.errorMessage1 = '';

      },
      error: err => {
        if (err.status === 400) {
          this.errorMessage1 = err.error;  // Display the error message from the server
        } else {
          this.errorMessage1 = 'An unknown error occurred.';
        }
      }
    });
  }



  onSaveNew() {
    console.log('Job Seeker to save:', this.newJobSeeker);
    if (! this.newJobSeeker || ! this.newJobSeeker.resume || ! this.newJobSeeker.user) {
      console.error('Job Seeker data is incomplete:',  this.newJobSeeker);
      this.errorMessage = 'Please complete all required fields.';
      return;
    }

    this.jobSeekerService.addJobSeeker( this.newJobSeeker).subscribe({
      next: (response) => {
        this.jobSeekers.push(response); // Add new job seeker to the list
        this.isAdding = false; // Hide the add form
        this.errorMessage = '';
        this.resetNewJobSeeker();


      },
      error: err => {
        if (err.status === 400) {
          this.errorMessage = err.error;  // Display the error message from the server
        } else {
          this.errorMessage = 'An unknown error occurred.';
        }
      }
    });
  }

  onSaveNew1() {
    console.log('Job Seeker to save:', this.newEntreprise);
    if (! this.newEntreprise  || ! this.newEntreprise.user || ! this.newEntreprise.companyDescription|| ! this.newEntreprise.companyWebsite|| ! this.newEntreprise.industry
      || ! this.newEntreprise.logo||  ! this.newEntreprise.address|| ! this.newEntreprise.user.phone ||! this.newEntreprise.user.username
      ||! this.newEntreprise.user.email||! this.newEntreprise.user.password
    ) {
      console.error('Entreprise data is incomplete:',  this.newEntreprise);
      this.errorMessage1 = 'Please complete all required fields.';
      console.error(this.errorMessage1);

      return;
    }

    this.entrepriseService.addEntreprise( this.newEntreprise).subscribe({
      next: (response) => {
        this.Entreprises.push(response); // Add new job seeker to the list
        this.isAdding1 = false; // Hide the add form
        this.errorMessage1 = '';
        this.resetNewEntreprise();


      },
      error: err => {
        if (err.status === 400) {
          this.errorMessage1 = err.error;  // Display the error message from the server
        } else {
          this.errorMessage1 = 'An unknown error occurred.';
        }
      }
    });
  }


  reloadPage() {
    window.location.reload();
  }

  resetNewJobSeeker() {
    this.newJobSeeker = {
      user: {
        username: '',
        email: '',
        password: '',
        phone: '',
        isVerified: false
      },
      resume: '',
      skills: '',
      education: ''
    };
  }

  resetNewEntreprise() {
    this.newEntreprise = {
      user: {
        username: '',
        email: '',
        password: '',
        phone: '',
        isVerified: 0
      },

      companyDescription: '',
      address: '',
      contactNumber: null,
      logo: '',
      industry: '',
      companyWebsite: ''
    };
  }




  // Job Seekers Pagination
nextPageJobSeekers() {
  if (this.currentPageJobSeekers < Math.ceil(this.jobSeekers.length / this.itemsPerPageJobSeekers)) {
    this.currentPageJobSeekers++;
  }
}

prevPageJobSeekers() {
  if (this.currentPageJobSeekers > 1) {
    this.currentPageJobSeekers--;
  }
}

// Employers Pagination
nextPageEntreprises() {
  if (this.currentPageEntreprises < Math.ceil(this.Entreprises.length / this.itemsPerPageEntreprises)) {
    this.currentPageEntreprises++;
  }
}

prevPageEntreprises() {
  if (this.currentPageEntreprises > 1) {
    this.currentPageEntreprises--;
  }
}
getTotalPagesJobSeekers(): number {
  return Math.ceil(this.jobSeekers.length / this.itemsPerPageJobSeekers);
}

getTotalPagesEntreprises(): number {
  return Math.ceil(this.Entreprises.length / this.itemsPerPageEntreprises);
}





}
