import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-schemepopup',
  templateUrl: './schemepopup.component.html',
  styleUrls: ['./schemepopup.component.scss']
})
export class SchemepopupComponent implements OnInit {

  schemeList:any;
  constructor(@Inject(MAT_DIALOG_DATA)public data) {
    console.log(data);
    this.schemeList=data;
    console.log(this.schemeList);
    
    // this.user=data.User;
    // this.status=data.status;
   }
  ngOnInit() {
  }

}
