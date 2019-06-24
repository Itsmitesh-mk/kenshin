import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentEndImageComponent } from './document-end-image.component';

describe('DocumentEndImageComponent', () => {
  let component: DocumentEndImageComponent;
  let fixture: ComponentFixture<DocumentEndImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentEndImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentEndImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
