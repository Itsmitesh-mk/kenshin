import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { SnackBarOverview } from 'src/app/toast';
import { ConstantService } from 'src/app/constant.service';
import { DialogComponent } from 'src/app/dialog';
@Component({
  selector: 'app-detailorderlist',
  templateUrl: './detailorderlist.component.html',
  styleUrls: ['./detailorderlist.component.scss']
})
export class DetailorderlistComponent implements OnInit {

  productList:any=[];
  tmp_productList:any=[];
  finalProductList:any=[];

  category:any;

  constructor(@Inject(MAT_DIALOG_DATA)public data,public dialog:MatDialog,public toast:SnackBarOverview,public service:ConstantService,public confirm:DialogComponent) {

    console.log(data);
    this.category=data['category'];
    this.tmp_productList=data['product'];
    this.finalProductList=data['product'];

    for(let i=0;i<this.tmp_productList.length;i++){
      if(this.category === this.tmp_productList[i]['category'])
      {
        this.productList.push(this.tmp_productList[i])
      }
    }
    console.log(this.productList);
    
    
   }

  ngOnInit() {
  }

}
