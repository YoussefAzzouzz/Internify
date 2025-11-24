import { Component, OnInit } from '@angular/core';
import { ReportService, Report } from '../../services/report.service';
import { Chart } from "chart.js";

@Component({
  selector: 'app-view-reports',
  templateUrl: './view-reports.component.html',
  styleUrls: ['./view-reports.component.css']
})
export class ViewReportsComponent implements OnInit {
  reports: Report[] = [];
  chart: any;
  reportStats = { validated: 0, notValidated: 0 };
  currentPage: number = 1;
  itemsPerPage: number = 3;
  selectedLanguages: { [key: number]: string } = {};
  summary: string = '';
  idFilter: number | null = null;
  validatedByCompanyFilter: boolean | null = null;

  constructor(private reportService: ReportService) {}

  ngOnInit() {
    this.reportService.getAllReports().subscribe(
      data => this.reports = data,
      error => console.error('Error fetching reports', error)
    );

    this.reportService.getReportStats().subscribe(
      stats => {
        this.reportStats = stats;
        this.createChart();
      },
      error => console.error('Error fetching stats', error)
    );
  }

  pageChanged(event: any) {
    this.currentPage = event.page;
  }

  createChart() {
    if (this.chart) this.chart.destroy();

    this.chart = new Chart("reportChart", {
      type: 'bar',
      data: {
        labels: ['Validated', 'Not Validated'],
        datasets: [{
          label: 'Reports',
          data: [this.reportStats.validated, this.reportStats.notValidated],
          backgroundColor: ['#4CAF50', '#F44336'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }

  getValidatedClass(isValidated: boolean): string {
    return isValidated ? 'badge-yes' : 'badge-no';
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

  // ✅ Download the translated report in the selected language
  downloadReport(reportId: number): void {
    const language = this.selectedLanguages[reportId] || 'french';
    this.reportService.downloadReport(reportId, language).subscribe(blob => {
      const file = new Blob([blob], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(file);
      link.download = `report_${reportId}_${language}.pdf`;
      link.click();
    });
  }

  // ✅ Download summarized report (PDF)
  downloadSummary(reportId: number): void {
    this.reportService.getSummarizedReport(reportId).subscribe(
      (pdfBlob) => {
        const url = window.URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `summary_report_${reportId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => console.error('Error downloading the report: ', error)
    );
  }

  // ✅ RÉSUMÉ IA - CORRIGÉ
  getResume(reportId: number): void {
    this.reportService.getResume(reportId).subscribe({
      next: (pdfBlob: Blob) => {
        // Create a download link from the Blob
        const downloadUrl = window.URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `resume_report_${reportId}.pdf`;
        document.body.appendChild(link); // Required for Firefox
        link.click();
        link.remove();
        window.URL.revokeObjectURL(downloadUrl);
        console.log('✅ Résumé PDF téléchargé avec succès');
      },
      error: (err) => {
        console.error('❌ Erreur lors du téléchargement du résumé PDF:', err);
        alert('Impossible de télécharger le résumé du rapport, veuillez réessayer.');
      }
    });
  }

  // ✅ Apply the search filters
  applyFilters(): void {
    this.reportService.searchReports(this.idFilter, this.validatedByCompanyFilter).subscribe(
      (filteredReports) => this.reports = filteredReports,
      (error) => console.error('Error fetching filtered reports', error)
    );
  }
}
