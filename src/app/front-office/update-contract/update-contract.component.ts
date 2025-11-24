import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-update-contract',
  templateUrl: './update-contract.component.html',
  styleUrls: ['./update-contract.component.css']
})
export class UpdateContractComponent implements OnInit {
  contractId!: number;
  contract: any = {
    startDate: '',
    endDate: '',
    status: '',
    fileData: ''
  };
  statusOptions = ['PENDING', 'SIGNED'];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.contractId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadContract();
  }

  // Fetch contract details
  loadContract() {
    this.http.get<any>(`http://localhost:8089/Document/contracts/contract/${this.contractId}`)
      .subscribe(response => {
        console.log('Contract fetched:', response);
        this.contract = response;

        // Convert date format to YYYY-MM-DD for the input fields
        if (this.contract.startDate) {
          this.contract.startDate = this.formatDate(this.contract.startDate);
        }
        if (this.contract.endDate) {
          this.contract.endDate = this.formatDate(this.contract.endDate);
        }
      }, error => {
        console.error('Error fetching contract:', error);
      });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toISOString().split('T')[0];
  }

  // Update contract
  updateContract() {
    const updatedData: any = {
      startDate: this.contract.startDate,
      endDate: this.contract.endDate,
      status: this.contract.status,
      fileData: this.contract.fileData || ""
    };

    // Include fileData only if necessary
    if (this.contract.fileData) {
      updatedData.fileData = this.contract.fileData;
    }

    this.http.put(`http://localhost:8089/Document/contracts/update/${this.contractId}`, updatedData, { responseType: 'text' })
      .subscribe(response => {
        console.log("Response:", response);  // ✅ Debugging
        alert(response);  // ✅ Should display "Contract updated successfully!"
        this.router.navigate(['/front-office/contract']);
      }, error => {
        console.error('Error updating contract:', error);
      });

  }
}
