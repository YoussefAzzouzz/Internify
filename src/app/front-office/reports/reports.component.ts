import { Component, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ReportService} from "../../services/report.service";

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent {
  reports: any[] = [];
  showSignaturePad = false;
  selectedReportId: number | null = null;
  isDrawing = false;

  @ViewChild('signaturePad', { static: false }) signaturePadCanvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;

  constructor(private http: HttpClient,private report:ReportService) {}

  ngOnInit() {
    this.fetchReports();
  }

  fetchReports() {
    this.http.get<any[]>('http://localhost:8089/Document/reports/all').subscribe(data => {
      this.reports = data;
    });
  }

  getValidatedClass(validated: boolean): string {
    return validated ? 'badge-yes' : 'badge-no';
  }

  openSignaturePad(reportId: number) {
    this.selectedReportId = reportId;
    this.showSignaturePad = true;
    setTimeout(() => this.setupCanvas(), 0);
  }

  setupCanvas() {
    const canvas = this.signaturePadCanvas.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);
    this.ctx.strokeStyle = '#000000';
    this.ctx.lineWidth = 2;
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';

    canvas.addEventListener('mousedown', this.startDrawing.bind(this));
    canvas.addEventListener('mousemove', this.draw.bind(this));
    canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
    canvas.addEventListener('mouseleave', this.stopDrawing.bind(this));

    canvas.addEventListener('touchstart', this.startDrawing.bind(this));
    canvas.addEventListener('touchmove', this.draw.bind(this));
    canvas.addEventListener('touchend', this.stopDrawing.bind(this));
  }

  startDrawing(event: MouseEvent | TouchEvent) {
    this.isDrawing = true;
    this.ctx.beginPath();
    this.ctx.moveTo(this.getX(event), this.getY(event));
  }

  draw(event: MouseEvent | TouchEvent) {
    if (!this.isDrawing) return;
    this.ctx.lineTo(this.getX(event), this.getY(event));
    this.ctx.stroke();
  }
  closeSignaturePad() {
    this.showSignaturePad = false; // Hide the signature pad modal
  }

  stopDrawing() {
    this.isDrawing = false;
    this.ctx.closePath();
  }

  getX(event: MouseEvent | TouchEvent): number {
    return event instanceof MouseEvent
      ? event.offsetX
      : event.touches[0].clientX - this.signaturePadCanvas.nativeElement.getBoundingClientRect().left;
  }

  getY(event: MouseEvent | TouchEvent): number {
    return event instanceof MouseEvent
      ? event.offsetY
      : event.touches[0].clientY - this.signaturePadCanvas.nativeElement.getBoundingClientRect().top;
  }

  clearSignature() {
    this.ctx.clearRect(0, 0, this.signaturePadCanvas.nativeElement.width, this.signaturePadCanvas.nativeElement.height);
  }

  submitSignature() {
    const canvas = this.signaturePadCanvas.nativeElement;
    let signatureBase64 = canvas.toDataURL('image/png').replace(/^data:image\/png;base64,/, '');

    this.http.put(`http://localhost:8089/Document/reports/sign/${this.selectedReportId}`, { signature: signatureBase64 })
      .subscribe(() => {
        this.showSignaturePad = false;
        this.fetchReports();
      });
  }

  downloadReport(reportId: number) {
    const apiUrl = `http://localhost:8089/Document/reports/download/${reportId}`;
    this.http.get(apiUrl, { responseType: 'blob' }).subscribe(blob => {
      console.log('Downloaded Blob size:', blob.size); // Log blob size
      if (blob.size === 0) {
        alert("Download failed: Empty file returned");
        return;
      }

      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `Report_${reportId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(downloadUrl); // cleanup
    }, error => {
      console.error('Download failed', error);
      alert('Download error occurred');
    });
  }


  delete(id: number): void {
    if (confirm('Are you sure you want to delete this contract?')) {
      this.report.deleteReport(id).subscribe({
        next: () => {
          console.log('Deleting contract ID:', id);

          // ✅ Immediately fetch updated contract list from backend
          this.fetchReports();
        },
        error: (err) => {
          console.error('Error deleting contract:', err);
        }
      });
    }
  }

}
