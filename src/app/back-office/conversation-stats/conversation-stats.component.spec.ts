import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationStatsComponent } from './conversation-stats.component';

describe('ConversationStatsComponent', () => {
  let component: ConversationStatsComponent;
  let fixture: ComponentFixture<ConversationStatsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConversationStatsComponent]
    });
    fixture = TestBed.createComponent(ConversationStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
