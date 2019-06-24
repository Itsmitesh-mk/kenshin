import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';

import { PlaceModalComponent } from '../place-modal/place-modal.component';

@Component({
  selector: 'app-territory-detail',
  templateUrl: './territory-detail.component.html'
})
export class TerritoryDetailComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit() {

  }
  openDialog(): void {
    const dialogRef = this.dialog.open(PlaceModalComponent, {
      width: '500px',
    });
  }

  active:any = {};
  toggleterritory(key,action)
  {
      console.log(action);
      console.log(key);
      
      if (action == 'open')
      {
         this.active[key] = true; 
      }

      if (action == 'close')
      {
          this.active[key] = false;
      }

      console.log(this.active);
  }

}
