import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdviseList } from './list.component';

describe('ListComponent', () => {
  let component: AdviseList;
  let fixture: ComponentFixture<AdviseList>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdviseList]
    });
    fixture = TestBed.createComponent(AdviseList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
