import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog,MatDialogRef } from '@angular/material';
import { SnackBarOverview } from 'src/app/toast';
import { ConstantService } from 'src/app/constant.service';
import { DialogComponent } from 'src/app/dialog';
@Component({
  selector: 'app-update-status',
  templateUrl: './update-status.component.html',
})
export class UpdateStatusComponent implements OnInit {
   concernStatus:any={};
   product:any={};
   productlist:any=[];
   index:any;
  constructor(@Inject(MAT_DIALOG_DATA)public data,public dialog:MatDialog,public dialogRef: MatDialogRef<UpdateStatusComponent>,public toast:SnackBarOverview,public service:ConstantService,public confirm:DialogComponent) { 
     console.log(data);
     if(data.product){
       console.log("hii product");
       
     this.product=data.product;
     this.concernStatus.status=this.product.concernProductStatus;
     this.concernStatus.problem=this.product.natureOfComplaint;
     this.index=data.index;
     }
     else{
      console.log("hii productlist test");
     this.productlist=data.productlist;
     }
     }

  ngOnInit() {
  
  }
  onSubmit(){
    console.log(this.index);
    if(this.productlist.length!=0){
      if(this.concernStatus.status&&this.concernStatus.problem){
        for(let i=0;i<this.productlist.length;i++){
          if(this.productlist[i].datacheck==true){
            console.log("hello list");
            
        this.productlist[i].concernProductStatus=this.concernStatus.status;
        this.productlist[i].natureOfComplaint=this.concernStatus.problem;
          }
        }
        console.log(this.productlist);
         this.dialogRef.close();
        }
    }
    else{
    if(this.concernStatus.status&&this.concernStatus.problem){
    this.product.concernProductStatus=this.concernStatus.status;
    this.product.natureOfComplaint=this.concernStatus.problem;
    console.log(this.product);
     this.dialogRef.close();
    }
  }
 
   
  }
}
