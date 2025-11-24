import { Component, OnInit } from '@angular/core';
import { DemandService } from '../../services/demand.service';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DatePipe, formatDate} from "@angular/common";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-demand',
  templateUrl: './demand.component.html',
  styleUrls: ['./demand.component.css'],
  providers:[DatePipe]
})
export class DemandComponent implements OnInit {
  demands: any[] = [];
  searchQuery: string = '';
  fields: string[] = ['IT', 'Marketing', 'HR', 'Finance']; // Example field values, you can fetch these from the backend
  statuses: string[] = ['Pending', 'Accepted', 'Rejected']; // Example status values, you can fetch these from the backend
  selectedField: string = '';
  selectedStatus: string = '';
  statistics: any = null;

  constructor(private demandService: DemandService,private datePipe: DatePipe,private http: HttpClient) {}
  formatDate(date: number): string {
    return <string>this.datePipe.transform(date, 'short');  // Use 'short' or any other format you need
  }
  ngOnInit(): void {
    this.getAllDemands();
    this.getStatistics();
  }

  searchDemands() {
    if (this.selectedField) {
      this.demandService.searchDemandsByField(this.selectedField).subscribe((data) => {
        this.demands = data;
      });
    }
  }

  getStatistics(): void {
    // Create the query params based on selected values
    let params: any = {};
    if (this.selectedField) {
      params.field = this.selectedField;
    }
    if (this.selectedStatus) {
      params.status = this.selectedStatus;
    }

    // Send the request to the backend with the selected field and status
    this.http.get<any>('http://localhost/demands/statistics', { params })
      .subscribe(
        (response) => {
          this.statistics = response; // Store the response to display the statistics
        },
        (error) => {
          console.error('Error fetching statistics:', error);
        }
      );
  }


  getAllDemands() {
    this.demandService.getAllDemands().subscribe(data => {
      this.demands = data;
    });
  }

  deleteDemand(id: number) {
    this.demandService.deleteDemand(id).subscribe(() => {
      this.getAllDemands(); // Refresh list after delete
    });
  }


  sortOrder: string = ''; // Sorting order (asc/desc)




// Sort demands by date
  currentPage = 1; // Default page
  itemsPerPage = 2; // Items per page
  sortDemands() {
    if (this.sortOrder === 'asc') {
      this.demands.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else if (this.sortOrder === 'desc') {
      this.demands.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
  }






}
