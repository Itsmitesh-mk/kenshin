import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOutStationComponent } from './edit-out-station.component';

describe('EditOutStationComponent', () => {
  let component: EditOutStationComponent;
  let fixture: ComponentFixture<EditOutStationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditOutStationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditOutStationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
