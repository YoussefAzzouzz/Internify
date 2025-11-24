import { Component, OnInit } from '@angular/core';
import { ContractService } from '../../services/contract.service';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-contract-list',
  templateUrl: './contract-list.component.html',
  styleUrls: ['./contract-list.component.css']
})
export class ContractListComponent implements OnInit {
  contracts: any[] = [];
  chart: any;
  contractsByStatus: { [key: string]: number } = {};
  contractChartLabels: string[] = [];
  contractChartData: number[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 3;

  idFilter: number | null = null;
  statusFilter: string = '';

  pageChanged(event: any): void {
    this.currentPage = event.page;
  }

  constructor(private contractService: ContractService) {}

  ngOnInit() {
    this.loadContracts();
    this.loadContractsByStatus();
  }
  loadContractsByStatus() {
    this.contractService.getContractsByStatus().subscribe(
      data => {
        this.contractsByStatus = data;
        this.createChart();
      },
      error => {
        console.error('Error fetching contract statistics', error);
      }
    );
  }

  createChart() {
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart("contractChart", {
      type: 'pie',
      data: {
        labels: Object.keys(this.contractsByStatus),
        datasets: [{
          data: Object.values(this.contractsByStatus),
          backgroundColor: ['red', 'blue', 'green']
        }]
      }
    });
  }

  loadContracts() {
    this.contractService.getAllContracts().subscribe(
      data => {
        this.contracts = data;
      },
      error => {
        console.error('Error fetching contracts', error);
      }
    );
  }
  getStatusClass(status: string): string {
    switch (status) {
      case 'PENDING': return 'badge-warning';
      case 'SIGNED': return 'badge-success';

      default: return 'badge-secondary';
    }
  }

  applyFilters() {
    this.contractService.getFilteredContracts(this.idFilter, this.statusFilter)
      .subscribe(
        data => {
          this.contracts = data;
          this.currentPage = 1; // Reset pagination after applying filters
        },
        error => {
          console.error('Error filtering contracts', error);
        }
      );
  }





  isSidebarCollapsed = false;
  menuItems = [
    { path: '/back-office', title: 'Dashboard', icon: 'dashboard', class: '' },
    { path: '/back-office/demand', title: 'Internship Demands', icon: 'people', class: '' },
    { path: '/back-office/settings', title: 'Settings', icon: 'settings', class: '' }
  ];

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

}
