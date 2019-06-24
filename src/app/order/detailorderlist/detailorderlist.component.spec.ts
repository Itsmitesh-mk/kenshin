import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailorderlistComponent } from './detailorderlist.component';

describe('DetailorderlistComponent', () => {
  let component: DetailorderlistComponent;
  let fixture: ComponentFixture<DetailorderlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailorderlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailorderlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
