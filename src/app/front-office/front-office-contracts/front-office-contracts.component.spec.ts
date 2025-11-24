import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontOfficeContractsComponent } from './front-office-contracts.component';

describe('FrontOfficeContractsComponent', () => {
  let component: FrontOfficeContractsComponent;
  let fixture: ComponentFixture<FrontOfficeContractsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FrontOfficeContractsComponent]
    });
    fixture = TestBed.createComponent(FrontOfficeContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
