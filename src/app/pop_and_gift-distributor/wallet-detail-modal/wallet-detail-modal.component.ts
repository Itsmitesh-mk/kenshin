import { Component, OnInit, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { ConstantService } from '../../constant.service';
import { SnackBarOverview } from 'src/app/toast';

@Component({
  selector: 'app-wallet-detail-modal',
  templateUrl: './wallet-detail-modal.component.html'
})
export class WalletDetailModalComponent implements OnInit {


  itemData:any = {};
  totalPointsRedeemed:any;

  constructor(public dialogRef: MatDialogRef<WalletDetailModalComponent>,@Inject(MAT_DIALOG_DATA) public data:any,public db:ConstantService,public toast:SnackBarOverview) { 

       console.log(this.data);

       this.itemData = this.data;
       console.log(this.itemData);

       this.totalPointsRedeemed = 0;

        for (let index = 0; index < this.itemData.length; index++) {

              this.totalPointsRedeemed += this.itemData[index].totalPointsRedeemed;
        }

        console.log(this.totalPointsRedeemed);
  }

  ngOnInit() {

     
      

       
  }

}
