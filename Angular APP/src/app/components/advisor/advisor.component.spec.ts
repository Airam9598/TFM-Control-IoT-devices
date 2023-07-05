import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvisorComponent } from './advisor.component';

describe('AdvisorComponent', () => {
  let component: AdvisorComponent;
  let fixture: ComponentFixture<AdvisorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdvisorComponent]
    });
    fixture = TestBed.createComponent(AdvisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
