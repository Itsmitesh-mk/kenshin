import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllFollowupListComponent } from './all-followup-list.component';

describe('AllFollowupListComponent', () => {
  let component: AllFollowupListComponent;
  let fixture: ComponentFixture<AllFollowupListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllFollowupListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllFollowupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
