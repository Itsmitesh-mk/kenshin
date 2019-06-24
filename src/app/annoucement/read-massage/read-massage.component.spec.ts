import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadMassageComponent } from './read-massage.component';

describe('ReadMassageComponent', () => {
  let component: ReadMassageComponent;
  let fixture: ComponentFixture<ReadMassageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadMassageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadMassageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
