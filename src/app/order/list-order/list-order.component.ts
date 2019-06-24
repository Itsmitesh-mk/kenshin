import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { SnackBarOverview } from 'src/app/toast';
import { ConstantService } from 'src/app/constant.service';
import { DialogComponent } from 'src/app/dialog';

@Component({
  selector: 'app-list-order',
  templateUrl: './list-order.component.html',
  styleUrls: ['./list-order.component.scss']
})
export class ListOrderComponent implements OnInit {

  productList:any=[];
  tmp_productList:any=[];
  finalProductList:any=[];
  div:any=false;
  category:any;

  constructor(@Inject(MAT_DIALOG_DATA)public data,public alrt:DialogComponent,public dialog:MatDialog,public toast:SnackBarOverview,public service:ConstantService,public confirm:DialogComponent) {

    console.log(data);
    this.category=data['category'];
    this.tmp_productList=data['product'];
    this.finalProductList=data['product'];

    for(let i=0;i<this.tmp_productList.length;i++){
      if(this.category === this.tmp_productList[i]['category'])
      {
        this.productList.push(
          {
            "amount":this.tmp_productList[i].amount,
            "category":this.tmp_productList[i].category,
            "gstPercentage":this.tmp_productList[i].gstPercentage,
            "gstamount":this.tmp_productList[i].gstamount,
            "itemValue":this.tmp_productList[i].itemValue,
            "model":this.tmp_productList[i].model,
            "moq":this.tmp_productList[i].moq,
            "oem":this.tmp_productList[i].oem,
            "partNumber":this.tmp_productList[i].partNumber,
            "priceSupport":this.tmp_productList[i].priceSupport,
            "discountedListPrice":this.tmp_productList[i].discountedListPrice,
            "productId":this.tmp_productList[i].productId,
            "quantity":this.tmp_productList[i].quantity,
            "segment":this.tmp_productList[i].segment
          }
          );
      }
      if(i==this.tmp_productList.length-1)
      {
        for(let j=0;j<this.productList.length;j++)
        {
          this.productList[j].edit=false;
        }
      }
    }
    console.log(this.productList);
    this.service.setData(this.tmp_productList);
   }

  ngOnInit() {
  }

  checkValidate(index)
  {
    if(parseFloat(this.productList[index].quantity)%parseFloat(this.productList[index].moq)!=0)
    {
      this.alrt.alertWarning("Order Quantity should multiple of "+parseFloat(this.productList[index].moq))
    }
  }

  calculateAmount(index,quantity)
  {
    this.productList[index].edit=true;
    console.log(index,quantity,this.productList[index].itemValue);
   if(parseFloat(this.productList[index].itemValue)>0)
   {
    this.itemValue=this.productList[index].itemValue;
    this.itemAmount=parseFloat(quantity)*parseFloat(this.productList[index].itemValue);
   }
  }
  saveUpdate()
  {
    console.log("save");
    this.service.setData(this.tmp_productList);
    this.dialog.closeAll();
  }

  itemValue:any;
  itemAmount:any;
  // priceSupport:any;
  // calculatePriceSupport(index,priceSupport)
  // {
  //   this.productList[index].edit=true;
  //   console.log(index,priceSupport);
  //   if(priceSupport !=null)
  //   {
  //     this.itemValue=parseFloat(this.productList[index].itemValue)-parseFloat(priceSupport);
  //     this.itemAmount=parseFloat(this.productList[index].quantity)*this.itemValue;
  //     this.priceSupport=priceSupport;
  //   }
  // }

  saveproduct(index,id)
  {
   if(parseFloat(this.productList[index].quantity)% parseFloat(this.productList[index].moq)==0 )
   {
    this.productList[index].edit=false;
   this.productList[index].itemValue=this.itemValue;
   this.productList[index].amount=this.itemAmount;

   let pindex=this.tmp_productList.findIndex(row=>row.productId==this.productList[index].productId)
  //  this.productList[index].priceSupport=this.priceSupport;
   console.log(this.productList[index]);
   this.tmp_productList[pindex].itemValue=this.productList[index].itemValue;
   this.tmp_productList[pindex].amount=this.productList[index].amount;
   this.tmp_productList[pindex].quantity=this.productList[index].quantity;
   this.tmp_productList[pindex].priceSupport=this.productList[index].priceSupport;
   console.log(pindex);
   
   this.service.setData(this.tmp_productList);

    this.toast.openSucess("Product List Update","SuccessFully");}
    else{
      this.alrt.alertWarning("Order Quantity should multiple of "+parseFloat(this.productList[index].moq))
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
      }
    });
  }

}
