import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandFormComponent } from './demand-form.component';

describe('DemandFormComponent', () => {
  let component: DemandFormComponent;
  let fixture: ComponentFixture<DemandFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DemandFormComponent]
    });
    fixture = TestBed.createComponent(DemandFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
