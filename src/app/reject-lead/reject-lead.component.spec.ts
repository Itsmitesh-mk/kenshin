import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectLeadComponent } from './reject-lead.component';

describe('RejectLeadComponent', () => {
  let component: RejectLeadComponent;
  let fixture: ComponentFixture<RejectLeadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RejectLeadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectLeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
