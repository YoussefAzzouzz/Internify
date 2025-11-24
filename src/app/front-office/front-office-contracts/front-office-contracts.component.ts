import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ContractService } from '../../services/contract.service';
import { Contract } from '../../models/contract';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-front-office-contracts',
  templateUrl: './front-office-contracts.component.html',
  styleUrls: ['./front-office-contracts.component.css']
})
export class FrontOfficeContractsComponent implements OnInit {
  contracts: Contract[] = [];  // ✅ Direct array (not BehaviorSubject)
  entrepriseId: number = 1; // Replace with dynamic value if needed

  constructor(
    private contractService: ContractService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef  // ✅ For manually triggering updates
  ) {}

  ngOnInit(): void {
    this.loadContracts();
  }

  loadContracts(): void {
    this.contractService.getContractsByEntreprise(this.entrepriseId).subscribe((data) => {
      this.contracts = data;
      console.log('Contracts Loaded:', this.contracts);
    });
  }

  deleteContract(id: number): void {
    if (confirm('Are you sure you want to delete this contract?')) {
      this.contractService.deleteContract(id).subscribe({
        next: () => {
          console.log('Deleting contract ID:', id);

          // ✅ Immediately fetch updated contract list from backend
          this.loadContracts();
        },
        error: (err) => {
          console.error('Error deleting contract:', err);
        }
      });
    }
  }


  updateContract(id: number): void {
    console.log("Update contract with ID:", id);
  }

  downloadContract(contractId: number) {
    this.http.get(`http://localhost:8089/Document/contracts/download/${contractId}`, {
      responseType: 'blob'
    }).subscribe(response => {
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `contract_${contractId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, error => {
      console.error('Error downloading contract:', error);
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PENDING': return 'badge bg-warning text-dark';
      case 'SIGNED': return 'badge bg-success';
      default: return 'badge bg-secondary';
    }
  }
}
