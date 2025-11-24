import { Component } from '@angular/core';
import { ContractService } from '../../services/contract.service';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-add-contract',
  templateUrl: './add-contract.component.html',
  styleUrls: ['./add-contract.component.css']
})
export class AddContractComponent {
  contract = {
    entrepriseId: 1,  // Example entreprise ID, replace with actual logged-in user
    jobSeekerId: 1,
    offerId: 1,
    startDate: '',
    endDate: '',
    status: 'PENDING',
    fileData: null
  };

  offers: any[] = [];
  jobSeekers: any[] = [];

  selectedFile!: File | null;

  constructor(private contractService: ContractService, private http: HttpClient) {
  }

  ngOnInit() {
    this.loadOffers();
    this.loadJobSeekers();
    this.getEntrepriseId(); // If needed, fetch the logged-in entreprise ID
  }

  loadOffers() {
    this.http.get('http://localhost:8089/offer').subscribe((data: any) => {
      this.offers = data;
    });
  }

  loadJobSeekers() {
    this.http.get('http://localhost:8089/jobseeker').subscribe((data: any) => {
      this.jobSeekers = data;
    });
  }

  getEntrepriseId() {
    this.http.get('http://localhost:8089/authenticated-entreprise-id').subscribe((data: any) => {
      this.contract.entrepriseId = data.id;
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.selectedFile = file ? file : undefined; // Ensures it's never `null`
  }


  submitContract() {
    if (!this.contract.jobSeekerId || !this.contract.offerId || !this.contract.startDate || !this.contract.endDate) {
      alert('Please fill all required fields.');
      return;
    }

    // Pass undefined instead of null if no file is selected
    this.contractService.createContract(this.contract, this.selectedFile || undefined)
      .subscribe(
        response => {
          console.log('Contract created:', response);
          alert('Contract successfully added!');
        },
        error => {
          console.error('Error:', error);
          alert('Failed to add contract.');
        }
      );
  }
}
