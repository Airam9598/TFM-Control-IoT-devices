import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditZoneComponent } from './edit.component';

describe('EditComponent', () => {
  let component: EditZoneComponent;
  let fixture: ComponentFixture<EditZoneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditZoneComponent]
    });
    fixture = TestBed.createComponent(EditZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
