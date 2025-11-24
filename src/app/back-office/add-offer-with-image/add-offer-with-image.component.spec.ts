import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOfferWithImageComponent } from './add-offer-with-image.component';

describe('AddOfferWithImageComponent', () => {
  let component: AddOfferWithImageComponent;
  let fixture: ComponentFixture<AddOfferWithImageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddOfferWithImageComponent]
    });
    fixture = TestBed.createComponent(AddOfferWithImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
