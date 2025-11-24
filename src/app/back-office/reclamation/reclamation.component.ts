import { Component, OnInit } from '@angular/core';
import { ReclamationService } from '../../front-office/_services/reclamation.service';
import { ChartData, ChartOptions } from 'chart.js';
import { FormsModule } from '@angular/forms';


import { AuthService } from '../../front-office/_services/auth.service';
import { Router } from '@angular/router';
import { Chart } from 'chart.js';
import { CommonModule } from '@angular/common';




@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],  // ✅ Import both CommonModule and FormsModule here
  selector: 'app-reclamation',
  templateUrl: './reclamation.component.html',
  styleUrls: ['./reclamation.component.css']
})
export class ReclamationComponent implements OnInit {
 



  
  onRespond(reclamation: any) {
    // Navigate to the 'reclamation2' route and pass the reclamation object via router state
    this.router.navigate(['/back-office/Reclamation2'], { state: { reclamation } });
  }



  Reclamations: any[] = [];
  Users: any[] = [];
  data1: any;



  editedReclamation: any = null; // holds the reclamation being edited

isAdding = false;
isResponseEnabled: boolean = false;
// flag for adding a new reclamation

newReclamation: any = {
  user: {
    username: '', 
  },
  subject: '',     
  message: '',     // Message or details of the reclamation
  status: '',      // The status of the reclamation (e.g., Pending, Resolved)
  createdAt: '',   // Date when the reclamation was created
    // Date when the reclamation was last updated
};

errorMessage: string = '';


editedReclamtion: any = null; // holds the jobSeeker being edited

currentPageRec: number = 1;
itemsPerPageRecs: number = 2;
  constructor(private ReclamationService: ReclamationService,private AuthService: AuthService,private router: Router) { }



  ngOnInit(): void {
    this.ReclamationService.stat().subscribe(data => {
      this.createChart(data);
    });


    this.loadReclamation();
    

    this.AuthService.getUsers().subscribe({
      next: data => {
        this.Users = data;
      },
      error: err => {
        this.errorMessage = 'An error occurred while fetchingUsers.';
        console.error(err);
      }
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
                labels: ['Pending', 'Resolved'],
                datasets: [{
                    label: 'Count',
                    data: [data.pending, data.resolved],
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

  loadReclamation(): void {
    this.ReclamationService.getAllReclamations().subscribe({
      next: data => {
        this.Reclamations = data;
      },
      error: err => {
        this.errorMessage = 'An error occurred while fetching job seekers.';
        console.error(err);
      }
    });
  }


  onAdd() {
    this.isAdding = true;
  }

  onAdd1() {
    this.isResponseEnabled = true;
  }


  onSaveNew() {
    console.log('Job Seeker to save:', this.newReclamation);
    if (! this.newReclamation ) {
      console.error('Job Seeker data is incomplete:',  this.newReclamation);
      this.errorMessage = 'Please complete all required fields.';
      return;
    }
    
    this.ReclamationService.addReclamation1(this.newReclamation.user.username, this.newReclamation).subscribe({
      next: (response) => {
        this.Reclamations.push(response); // Add new job seeker to the list
        this.isAdding = false; // Hide the add form
        this.errorMessage = '';
        this.resetReclamation();


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

  
  resetReclamation() {
   this. newReclamation= {
      user: {
        username: '', 
      },
      subject: '',     
      message: '',     // Message or details of the reclamation
      status: '',      // The status of the reclamation (e.g., Pending, Resolved)
      createdAt: '',   // Date when the reclamation was created
      updatedAt: '',   // Date when the reclamation was last updated
    };
    
  }


  onEdit(reclamation: any): void {
    console.log('Editing reclamation:', reclamation);  // Add a log to check if it’s being called correctly
    this.editedReclamation = { ...reclamation };  // Make a copy to avoid direct binding issues
}

onUpdate(updatedRec: any): void {
    // Call the service to update the reclamation
    this.ReclamationService.updateReclamation(updatedRec.id, updatedRec).subscribe({
        next: (response) => {
            // Update the local array with the updated reclamation
            const index = this.Reclamations.findIndex(r => r.id === updatedRec.id);
            if (index !== -1) {
                this.Reclamations[index] = response;
            }
            this.editedReclamation = null; // Exit edit mode
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




cancelEdit(): void {
  // Reset the editedReclamation to null or restore the original reclamation data
  this.editedReclamation = null;
}




onDelete(recid: number): void {
  if (confirm('Are you sure you want to delete this job seeker?')) {
    this.ReclamationService.deleteReclamation(recid).subscribe({
      next: () => {
        // Optionally refresh the list or remove the deleted job seeker from the UI
       
        this.Reclamations = this.Reclamations.filter(js => js.user.id !== recid);
        console.log('Job Seeker deleted successfully.');
        this. reloadPage();
      },
      error: err => {
        this.Reclamations = this.Reclamations.filter(js => js.user.id !== recid);
        console.log('Job Seeker deleted successfully.');
        this. reloadPage();
      }
    });
  }
}

reloadPage() {
  window.location.reload();
}




    // Job Seekers Pagination




}
