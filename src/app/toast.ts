import { OnInit, Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material';


@Injectable({ providedIn: 'root' })


export class SnackBarOverview implements OnInit {
  
  constructor(public snackBar: MatSnackBar) { }
  
  ngOnInit() {
  } 
  
  openSucess(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2500,
   
      verticalPosition: 'top'
    });
  }

  openError(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2500,
      verticalPosition: 'top',
    });
  }
      
}
