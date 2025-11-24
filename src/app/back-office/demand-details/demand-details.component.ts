import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DemandService} from "../../services/demand.service";
import {EvaluationService} from "../../services/evaluation.service";
import {ResponseService} from "../../services/response.service";
import {DatePipe} from "@angular/common";
import  jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';


@Component({
  selector: 'app-demand-details',
  templateUrl: './demand-details.component.html',
  styleUrls: ['./demand-details.component.css'],
  providers: [DatePipe]
})
export class DemandDetailsComponent implements OnInit {
  demand: any;
  evaluations: any[] = [];responses: any[] = [];
  newEvaluation = { rating: 5, comment: '' };
  userId = 1; // Replace with dynamic user ID from authentication system
  commentSearch: string = '';
  private searchSubject = new Subject<string>();

  constructor(private router: Router,
              private route: ActivatedRoute,
              private demandService: DemandService,
              private evaluationService: EvaluationService,
              private responseService: ResponseService,private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    const demandId = this.route.snapshot.paramMap.get('id');
    if (demandId) {
      this.loadDemandDetails(+demandId);
      this.loadEvaluations(+demandId);
      this.loadResponses(+demandId);
    }

    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchText => {
      this.searchResponsesByComment(searchText);
    });
  }
  onSearchInput(value: string) {
    this.searchSubject.next(value);
  }


  loadResponses(demandId: number): void {
    this.responseService.getResponsesByDemand(demandId).subscribe(responses => {
      this.responses = responses;
    });
  }
  formatDate(date: number): string {
    return <string>this.datePipe.transform(date, 'short');  // Use 'short' or any other format you need
  }

  resetResponses(demandId: number) {
    this.responseService.getResponsesByDemand(demandId).subscribe((data) => {
      this.responses = data;// Optionally refresh the map
      this.commentSearch = '';    // Clear the search input
    });
  }
  searchResponsesByComment(comment: string) {
    if (comment.trim()) {
      this.responseService.searchResponsesByComment(comment).subscribe((data) => {
        this.responses = data;
      });
    } else {
      this.resetResponses(this.demand?.id);
    }
  }

  loadDemandDetails(demandId: number) {
    this.demandService.getDemandById(demandId).subscribe((data) => {
      this.demand = data;
    });
  }

  loadEvaluations(demandId: number) {
    this.evaluationService.getEvaluations(demandId).subscribe((data) => {
      this.evaluations = data;
    });
  }
  sortOrder: string = ''; // Sorting order (asc/desc)
  navigateToDemandList(): void {
    const currentUrl = this.router.url;
    if (currentUrl.includes('/front-office')) {
      this.router.navigate(['/front-office/demand']);
    } else {
      this.router.navigate(['/back-office/demand']);
    }
  }
  sortResponses() {
    if (this.sortOrder === 'asc') {
      this.responses.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else if (this.sortOrder === 'desc') {
      this.responses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
  }
  submitEvaluation() {
    if (!this.newEvaluation.comment.trim()) {
      alert('Please enter a comment.');
      return;
    }

    const demandId = this.demand.id;
    this.evaluationService.addEvaluation(demandId, this.newEvaluation.rating, this.newEvaluation.comment)
      .subscribe({
        next: (response) => {
          this.evaluations.push(response); // Update the UI with new evaluation
          this.newEvaluation = { rating: 5, comment: '' }; // Reset form
        },
        error: (err) => {
          console.error('Error adding evaluation:', err);
        },
      });
  }
  downloadCv(id: number): void {
    this.demandService.downloadCv(id).subscribe(
      (response) => {
        const blob = new Blob([response], { type: 'application/pdf' });  // Assuming the CV is a PDF
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'cv.pdf';  // You can use the demand title or any other dynamic value here
        a.click();
        window.URL.revokeObjectURL(url);  // Clean up after download
      },
      (error) => {
        console.error('Error downloading CV:', error);
      }
    );
  }
  exportResponsesAsPDF() {
    const doc = new jsPDF();

    doc.text('Responses for Demand', 14, 10);

    const tableData = this.responses.map((r: any) => [
      this.formatDate(r.date),
      r.status,
      r.comment,
    ]);

    autoTable(doc, {
      head: [['Date', 'Status', 'Comment']],
      body: tableData,
    });

    doc.save('responses.pdf');
  }

}
