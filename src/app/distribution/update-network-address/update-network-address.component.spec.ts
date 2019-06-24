import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateNetworkAddressComponent } from './update-network-address.component';

describe('UpdateNetworkAddressComponent', () => {
  let component: UpdateNetworkAddressComponent;
  let fixture: ComponentFixture<UpdateNetworkAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateNetworkAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateNetworkAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
