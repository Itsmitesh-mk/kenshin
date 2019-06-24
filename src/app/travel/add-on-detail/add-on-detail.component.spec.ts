import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOnDetailComponent } from './add-on-detail.component';

describe('AddOnDetailComponent', () => {
  let component: AddOnDetailComponent;
  let fixture: ComponentFixture<AddOnDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOnDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOnDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
