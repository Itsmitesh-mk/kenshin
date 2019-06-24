import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditmiscComponent } from './editmisc.component';

describe('EditmiscComponent', () => {
  let component: EditmiscComponent;
  let fixture: ComponentFixture<EditmiscComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditmiscComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditmiscComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
