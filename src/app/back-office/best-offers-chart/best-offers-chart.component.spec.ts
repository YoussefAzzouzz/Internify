import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BestOffersChartComponent } from './best-offers-chart.component';

describe('BestOffersChartComponent', () => {
  let component: BestOffersChartComponent;
  let fixture: ComponentFixture<BestOffersChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BestOffersChartComponent]
    });
    fixture = TestBed.createComponent(BestOffersChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
