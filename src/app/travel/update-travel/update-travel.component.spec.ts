import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTravelComponent } from './update-travel.component';

describe('UpdateTravelComponent', () => {
  let component: UpdateTravelComponent;
  let fixture: ComponentFixture<UpdateTravelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateTravelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateTravelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
