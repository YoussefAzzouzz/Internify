import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-best-offers-chart',
  templateUrl: './best-offers-chart.component.html',
  styleUrls: ['./best-offers-chart.component.css']
})
export class BestOffersChartComponent implements OnInit {
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadBestOffers();
  }

  loadBestOffers() {
    this.http.get<any[]>('http://localhost:8011/piproj/offers/best-offers').subscribe(data => {
      const offerTitles = data.map(offer => offer.title);
      const offerScores = data.map(offer => offer.score);

      this.createChart(offerTitles, offerScores);
    });
  }

  createChart(labels: string[], data: number[]) {
    new Chart("bestOffersChart", {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Best Offers (Last 30 Days)',
          data: data,
          backgroundColor: 'rgba(75,112,192,0.6)',
          borderColor: 'rgb(20,59,147)',
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
}
