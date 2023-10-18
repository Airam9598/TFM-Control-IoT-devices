import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryShowComponent } from './history-show.component';

describe('HistoryShowComponent', () => {
  let component: HistoryShowComponent;
  let fixture: ComponentFixture<HistoryShowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistoryShowComponent]
    });
    fixture = TestBed.createComponent(HistoryShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
