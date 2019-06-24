import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { SnackBarOverview } from 'src/app/toast';
import { ConstantService } from 'src/app/constant.service';

@Component({
  selector: 'app-pending-order',
  templateUrl: './pending-order.component.html',
  styleUrls: ['./pending-order.component.scss']
})
export class PendingOrderComponent implements OnInit {

  productList:any=[];
  tmp_productList:any=[];
  finalProductList:any=[];

  category:any;

  constructor(@Inject(MAT_DIALOG_DATA)public data,public dialog:MatDialog) {

    console.log(data);
    this.productList=data;
    console.log(this.productList);
    
    // this.tmp_productList=data['product'];
    // this.finalProductList=data['product'];

    
    // console.log(this.productList);
    
    
   }

  ngOnInit() {
  }

}
