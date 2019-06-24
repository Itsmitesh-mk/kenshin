import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemepopupComponent } from './schemepopup.component';

describe('SchemepopupComponent', () => {
  let component: SchemepopupComponent;
  let fixture: ComponentFixture<SchemepopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchemepopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemepopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
