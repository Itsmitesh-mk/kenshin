import { Component, OnInit,Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material'
import { ConstantService } from '../../constant.service';
import { Router } from '@angular/router';
import { SnackBarOverview } from 'src/app/toast';
@Component({
  selector: 'app-product-modal',
  templateUrl: './product-modal.component.html',
})
export class ProductModalComponent implements OnInit {
 
  loader:boolean;
   extraData:any={};
   id:any;
   doc:any=[];
   product_detail:any=[];
   productdata:any;
   url:any;
   requestfn:any;
   api:any;
   message:any;
  constructor(  public router:Router,public dialogRef: MatDialogRef<ProductModalComponent>,@Inject(MAT_DIALOG_DATA) public data:any,public db:ConstantService,public toast:SnackBarOverview){ 
    console.log(data);
    this.extraData=this.data;
    console.log(this.extraData.isLive);
    // this.extraData.extraField1=this.data.productSpecification1;
    // this.extraData.extraField2=this.data.productSpecification2;
    // this.extraData.extraField3=this.data.productSpecification3;
    // this.extraData.extraField4=this.data.productSpecification4;
    // this.extraData.extraField5=this.data.productSpecification5;
    console.log(this.data.documents);
    this.id=this.data.productId;
  }
  ngOnInit() {
  }
  update_detail(){
    if(this.data.type=='App'){
      console.log('hello');
      this.db.fetchData({"productId":this.data.productId ,   "isLive":this.extraData.isLive,
    },'product/live').subscribe((response)=>{console.log(response)
      this.message=response['message']
      this.loader=false;
      if(this.message=="Product updated successfully")
      {
        this.toast.openSucess('Product updated successfully','');
        this.router.navigate(['/product-detail/'+this.id]) 
      }
      else
      {
        this.toast.openError('Something Went Wrong Please Try Again!!','');
      }
    });
    }
    else{
    this.loader=true;
    console.log(this.extraData);
    this.db.fetchData({"productId":this.data.productId ,
    "productSpecification1":  this.extraData.productSpecification1,
    "productSpecification2":  this.extraData.productSpecification2,
    "productSpecification3": this.extraData.productSpecification3,
    "productSpecification4":  this.extraData.productSpecification4,
    "productSpecification5": this.extraData.productSpecification5,
    "specificationUOM": "string",
    "isLive":this.extraData.isLive,
    "aditionalField1Label": this.extraData.aditionalField1Label,
    "aditionalField1Value": this.extraData.aditionalField1Value ,
    "aditionalField2Label":  this.extraData.aditionalField2Label,
    "aditionalField2Value": this.extraData.aditionalField2Value,
    "aditionalField3Label":  this.extraData.aditionalField3Label,
    "aditionalField3Value":  this.extraData.aditionalField3Value,
    "aditionalField4Label": this.extraData.aditionalField4Label,
    "aditionalField4Value": this.extraData.aditionalField4Value,
      },'product/update').subscribe((response)=>{console.log(response)
      this.message=response['message']
      this.loader=false;
      if(this.message=="Product updated successfully")
      {
        this.toast.openSucess('Product updated successfully','');
        this.router.navigate(['/product-detail/'+this.id]) 
      }
      else
      {
        this.toast.openError('Something Went Wrong Please Try Again!!','');
      }
    
     });
    }
    this.dialogRef.close();
  
  }

  onNoClick(): void {
    this.dialogRef.close();
    console.log(this.data)
  }
}
