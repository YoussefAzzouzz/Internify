import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent {
  constructor(private router: Router) {}

  goToDocuments() {
    this.router.navigate(['/documents']); // Navigates to Contracts
  }

  goToAddReport() {
    this.router.navigate(['/add-report']); // Navigates to Add Report
  }

}
