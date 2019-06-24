import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-qr-code-detail',
  templateUrl: './qr-code-detail.component.html'
})
export class QrCodeDetailComponent implements OnInit {

  step = 0;
  loader:any=true;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  constructor() { }

  ngOnInit() {
  }

}
