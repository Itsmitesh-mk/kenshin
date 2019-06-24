import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemainingLeaveComponent } from './remaining-leave.component';

describe('RemainingLeaveComponent', () => {
  let component: RemainingLeaveComponent;
  let fixture: ComponentFixture<RemainingLeaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemainingLeaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemainingLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
