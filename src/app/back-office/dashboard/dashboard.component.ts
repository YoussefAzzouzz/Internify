import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {DemandService, StatisticsResponse} from "../../services/demand.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  fields: string[] = ['IT', 'Marketing', 'HR', 'Finance']; // Example fields
  statuses: string[] = ['Pending', 'Approved', 'Rejected']; // Example statuses
  selectedField: string = '';
  selectedStatus: string = '';
  statistics: StatisticsResponse | null = null;

  field: string | null = null;

  status: string | null = null;


  chartLabels: string[] = ['Active', 'Approved', 'Pending'];
  chartData: number[] = [0, 0, 0];

  constructor(private http: HttpClient,private demandService: DemandService) {}

  ngOnInit(): void {
    this.fetchStatistics();
  }

  fetchStatistics(): void {

    this.demandService.getDemandStatistics(this.field, this.status).subscribe(

      (data) => {

        this.statistics = data;

      },

      (error) => {

        console.error('Error fetching statistics', error);

      }

    );

  }

  updateStatistics(field: string | null, status: string | null): void {

    this.field = field;

    this.status = status;

    this.fetchStatistics();

  }
}
