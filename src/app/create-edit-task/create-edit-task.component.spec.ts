import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditTaskComponent } from './create-edit-task.component';

describe('CreateEditTaskComponent', () => {
  let component: CreateEditTaskComponent;
  let fixture: ComponentFixture<CreateEditTaskComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateEditTaskComponent]
    });
    fixture = TestBed.createComponent(CreateEditTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
