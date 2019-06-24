import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditdateSchemeComponent } from './editdate-scheme.component';

describe('EditdateSchemeComponent', () => {
  let component: EditdateSchemeComponent;
  let fixture: ComponentFixture<EditdateSchemeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditdateSchemeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditdateSchemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
