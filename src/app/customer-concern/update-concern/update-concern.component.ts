import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { SnackBarOverview } from 'src/app/toast';
import { ConstantService } from 'src/app/constant.service';
import { DialogComponent } from 'src/app/dialog';
@Component({
  selector: 'app-update-concern',
  templateUrl: './update-concern.component.html',
})
export class UpdateConcernComponent implements OnInit {
  productList:any=[];
  concern:any=[];
  tmp_productList:any=[];
  finalProductList:any=[];
  sales:any={};
  category:any;
  maxDateValue:any;
  id:any;
  url:any;
  request:any;
  api:any;
  concernStatus:any;
  user:any={};
  constructor(@Inject(MAT_DIALOG_DATA)public data,public dialog:MatDialog,public toast:SnackBarOverview,public service:ConstantService,public confirm:DialogComponent) { 
    console.log(data);
    this.user = JSON.parse(localStorage.getItem('user')) || [];
    console.log(this.user);
    this.concernStatus=data['concernStatus']
    this.category=data['category'];
    this.tmp_productList=data['product'];
    this.finalProductList=data['product'];
    this.concern=data['concern'];
    this.id=data['id'];
  
    this.get_detail();
    console.log(this.concernStatus);
  }
  ngOnInit() {
    
    this.maxDateValue=new Date();
  }
  isView:boolean=false;
  docId:any;
  urlData:any;
  isAlready:boolean=false;
  showImage(index){
    this.isAlready=false;
    this.isView=true;
    this.url=this.service.dburl;
    this.request='download/document/';
    this.api=this.url+this.request;
    if(this.productList[index].document.binaryData!=null){
      this.isAlready=false;
      this.urlData=this.productList[index].document.binaryData;
    }
    else{
      this.docId=this.productList[index].document.documentId;
      this.isAlready=true;
      console.log(this.docId,this.productList[index]);   
    }
  
  }
  get_detail(){
    console.log(this.data);
    console.log(this.tmp_productList);
    
    for(let i=0;i<this.tmp_productList.length;i++){
      if(this.category === this.tmp_productList[i]['category'])
      {
        this.productList.push(
   { "amount":this.tmp_productList[i].amount,
    "category": this.tmp_productList[i].category,
    "date": this.tmp_productList[i].date,
    "invoice": this.tmp_productList[i].invoice,
    "partNumber": this.tmp_productList[i].partNumber,
    "priceUnit":this.tmp_productList[i].priceUnit,
    "productId":this.tmp_productList[i].productId,
    "qty":this.tmp_productList[i].qty,
    "segment":this.tmp_productList[i].segment,
    "tmpamount":this.tmp_productList[i].tmpamount,
    "tmpqty":this.tmp_productList[i].tmpqty,
    "productName":this.tmp_productList[i].productName,
    "isDealerItem":this.tmp_productList[i].isDealerItem,
    "document":this.tmp_productList[i].document,
    "natureOfComplaint": this.tmp_productList[i].natureOfComplaint,
    "status":this.tmp_productList[i].status,
    "statusUpdatedByUser": this.tmp_productList[i].statusUpdatedByUser,
    "statusUpdatedOn": this.tmp_productList[i].statusUpdatedOn
        }
        )
     
      }
    
    }
    console.log(this.productList);
    this.service.setData(this.tmp_productList);
    
  }

price:any;
amount:any;
  calculateAmount(qty,i,id)
  {
    console.log(this.data);
    console.log(this.productList,i);
    if(parseInt(this.productList[i].priceUnit)>0)
   {
    this.price=this.productList[i].priceUnit;
    this.amount=parseInt(qty)*parseInt(this.productList[i]['priceUnit']);
   }
     
      
  }
  remove(id,index)
  {
    console.log(id,index);
    
    this.confirm.delete("product").then((result) => {
      console.log(result);
      if(result)
      {
        this.productList.splice(index,1)
        for(let i=0;i<this.tmp_productList.length;i++)
        {
          if(this.tmp_productList[i]['productId']==id)
          {
            this.tmp_productList.splice(i,1);
          }
        }
        if(this.tmp_productList.length==0){
          this.dialog.closeAll();
        }
      }
    });
   
  }
  saveUpdate()
  {
    console.log("save");
    console.log(this.tmp_productList);
    
    this.service.setData(this.tmp_productList);
    this.dialog.closeAll();
  }
  saveProduct(product,i)
  {
    
    if(this.concern.product_type==1){
    if(product.qty&&product.invoice&&product.date)
   {
    this.productList[i].priceUnit=this.price;
    this.productList[i].amount=this.amount;
    let index=this.tmp_productList.findIndex(x=>x.productId==product.productId)
    console.log(index);
    this.tmp_productList[index].priceUnit=this.productList[i].priceUnit;
    this.tmp_productList[index].amount=this.productList[i].amount;
    this.tmp_productList[index].qty=this.productList[i].qty;
    this.tmp_productList[index].invoice=this.productList[i].invoice;
    this.tmp_productList[index].date=this.productList[i].date;
    this.toast.openSucess('Updated Sucessfully!!','');
    console.log(this.productList);
    console.log(this.tmp_productList[i].qty);
    
  }
  else{
   
     this.toast.openError('Please Enter Empty Fields!!','');
     this.service.setData(this.tmp_productList);
  }
}
else{
  if(product.qty)
  {
    this.productList[i].priceUnit=this.price;
    this.productList[i].amount=this.amount;
    this.tmp_productList[i].priceUnit=this.productList[i].priceUnit;
    this.tmp_productList[i].amount=this.productList[i].amount;
    this.tmp_productList[i].qty=this.productList[i].qty;
    this.toast.openSucess('Updated Sucessfully!!','');
    console.log(this.productList);
   this.toast.openSucess('Updated Sucessfully!!','');
 }
 else{
  
    this.toast.openError('Please Enter Empty Fields!!','');
    this.service.setData(this.tmp_productList);
 }
}

}
}
