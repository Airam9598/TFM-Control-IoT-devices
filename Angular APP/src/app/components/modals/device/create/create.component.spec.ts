import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDevComponent } from './create.component';

describe('CreateComponent', () => {
  let component: CreateDevComponent;
  let fixture: ComponentFixture<CreateDevComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateDevComponent]
    });
    fixture = TestBed.createComponent(CreateDevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
