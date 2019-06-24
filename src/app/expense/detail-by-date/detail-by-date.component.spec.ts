import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailByDateComponent } from './detail-by-date.component';

describe('DetailByDateComponent', () => {
  let component: DetailByDateComponent;
  let fixture: ComponentFixture<DetailByDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailByDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailByDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
