import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-read-popup',
  templateUrl: './read-popup.component.html',
  styleUrls: ['./read-popup.component.scss']
})
export class ReadPopupComponent implements OnInit {

  user:any=[];
  status:any;
  constructor(@Inject(MAT_DIALOG_DATA)public data) {
    console.log(data);
    this.user=data.User;
    this.status=data.status;
   }

  ngOnInit() {
  }

}
