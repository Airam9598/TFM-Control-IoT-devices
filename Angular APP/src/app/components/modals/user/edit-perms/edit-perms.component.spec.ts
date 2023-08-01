import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPermsComponent } from './edit-perms.component';

describe('EditPermsComponent', () => {
  let component: EditPermsComponent;
  let fixture: ComponentFixture<EditPermsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditPermsComponent]
    });
    fixture = TestBed.createComponent(EditPermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
