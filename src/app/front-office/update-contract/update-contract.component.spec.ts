import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateContractComponent } from './update-contract.component';

describe('UpdateContractComponent', () => {
  let component: UpdateContractComponent;
  let fixture: ComponentFixture<UpdateContractComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateContractComponent]
    });
    fixture = TestBed.createComponent(UpdateContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
