import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Reclamation2Component } from './reclamation2.component';

describe('Reclamation2Component', () => {
  let component: Reclamation2Component;
  let fixture: ComponentFixture<Reclamation2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Reclamation2Component]
    });
    fixture = TestBed.createComponent(Reclamation2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
