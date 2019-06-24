import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLocalExpenseComponent } from './edit-local-expense.component';

describe('EditLocalExpenseComponent', () => {
  let component: EditLocalExpenseComponent;
  let fixture: ComponentFixture<EditLocalExpenseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditLocalExpenseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLocalExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
