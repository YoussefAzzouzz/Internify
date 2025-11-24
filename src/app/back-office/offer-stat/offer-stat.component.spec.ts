import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferStatComponent } from './offer-stat.component';

describe('OfferStatComponent', () => {
  let component: OfferStatComponent;
  let fixture: ComponentFixture<OfferStatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OfferStatComponent]
    });
    fixture = TestBed.createComponent(OfferStatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
