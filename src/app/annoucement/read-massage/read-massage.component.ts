import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-read-massage',
  templateUrl: './read-massage.component.html',
  styleUrls: ['./read-massage.component.scss']
})
export class ReadMassageComponent implements OnInit {

  massage:any;
  constructor(@Inject(MAT_DIALOG_DATA)public data) { 
    console.log(data);
    this.massage=data.massage;
  }

  ngOnInit() {
  }

}
