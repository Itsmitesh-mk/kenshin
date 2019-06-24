import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadPopupComponent } from './read-popup.component';

describe('ReadPopupComponent', () => {
  let component: ReadPopupComponent;
  let fixture: ComponentFixture<ReadPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
