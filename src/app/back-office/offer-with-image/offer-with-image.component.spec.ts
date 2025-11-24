import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferWithImageComponent } from './offer-with-image.component';

describe('OfferWithImageComponent', () => {
  let component: OfferWithImageComponent;
  let fixture: ComponentFixture<OfferWithImageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OfferWithImageComponent]
    });
    fixture = TestBed.createComponent(OfferWithImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
