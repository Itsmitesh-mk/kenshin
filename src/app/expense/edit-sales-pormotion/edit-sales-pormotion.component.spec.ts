import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSalesPormotionComponent } from './edit-sales-pormotion.component';

describe('EditSalesPormotionComponent', () => {
  let component: EditSalesPormotionComponent;
  let fixture: ComponentFixture<EditSalesPormotionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSalesPormotionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSalesPormotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
