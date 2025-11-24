import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageStatsComponent } from './message-stats.component';

describe('MessageStatsComponent', () => {
  let component: MessageStatsComponent;
  let fixture: ComponentFixture<MessageStatsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MessageStatsComponent]
    });
    fixture = TestBed.createComponent(MessageStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
