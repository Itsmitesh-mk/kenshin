import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EversionDetailComponent } from './eversion-detail.component';

describe('EversionDetailComponent', () => {
  let component: EversionDetailComponent;
  let fixture: ComponentFixture<EversionDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EversionDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EversionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
