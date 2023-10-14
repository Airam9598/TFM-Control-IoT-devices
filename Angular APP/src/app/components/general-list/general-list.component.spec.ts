import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralListComponent } from './general-list.component';

describe('GeneralListComponent', () => {
  let component: GeneralListComponent;
  let fixture: ComponentFixture<GeneralListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GeneralListComponent]
    });
    fixture = TestBed.createComponent(GeneralListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
