import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevListComponent } from './list.component';

describe('ListComponent', () => {
  let component: DevListComponent;
  let fixture: ComponentFixture<DevListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DevListComponent]
    });
    fixture = TestBed.createComponent(DevListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
