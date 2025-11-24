import { Component } from '@angular/core';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'app-add-report',
  templateUrl: './add-report.component.html',
  styleUrls: ['./add-report.component.css']
})
export class AddReportComponent {
  selectedFile: File | null = null;
  message: string = '';

  constructor(private reportService: ReportService) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadReport() {
    if (!this.selectedFile) {
      this.message = 'Please select a file!';
      return;
    }

    this.reportService.uploadReport(this.selectedFile).subscribe(
      () => this.message = 'Report uploaded successfully!',
      error => this.message = 'Failed to upload report.'
    );
  }
}
