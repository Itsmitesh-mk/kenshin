import { Component, OnInit , ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { ConstantService } from 'src/app/constant.service';
import {MatDialog} from '@angular/material';
import { SnackBarOverview } from 'src/app/toast';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogComponent } from 'src/app/dialog';
import { UpdateConcernComponent } from '../update-concern/update-concern.component';
import { isPlatformBrowser } from '@angular/common';
import { ImageModalComponent } from '../image-modal/image-modal.component';

import * as $ from 'jquery';

@Component({
  selector: 'app-concern-detail',
  templateUrl: './concern-detail.component.html',
 
})
export class ConcernDetailComponent implements OnInit {
    id:any;
    concernReviews:any=[];
    concernDetail:any=[];
    draftDetail:any=[];
    user:any={}
    isForward:any=false;
    concern_form:any={};
    userId:any;
    msg:any;
    isProceed:any=true;
    other_form:any={};
    prefitmentlist:any=[];
    pre_fitment:any={};
    post_fitment:any={};
    tmp_list:any=[];
    tmp_list1:any=[];
    segmentList:any=[];
    finel_Array:any=[];
    categorylist:any=[];
    message:any;
    tmp_segmentList:any=[];
    product_list:any=[];
    partnumberlist:any=[];
    partnumberlist1:any=[];
    removeproductname:boolean;
    rolelists:any=[];
    tmp_array:any=[];
    role:any=[];
    isSave:boolean;
    itemList:any=[];
    productlist:any=[];
    isAssignCheck:boolean=true;
    loader:boolean;
    cartProductList:any=[];
    categorydetail:any=[]
    data:any={};
    rolelistsales1:any=[];
    tmp_categoryList:any=[];
  constructor(
    public db:ConstantService,
    public router:Router, 
    public route:ActivatedRoute,
    public toast:SnackBarOverview,
    public dialog: MatDialog,
    public alrt:DialogComponent,
    @Inject(PLATFORM_ID) private platformId: Object) {
    this.user = JSON.parse(localStorage.getItem('user')) || [];
    console.log(this.user);
    this.route.params.subscribe(params=>{
      console.log(params);
      this.id = params.id;
      console.log(this.id);
      this.concern_detail();
    });
   }
   dburl:any = '';
  ngOnInit() {
    this.dburl=this.db.dburl;
    this.concern_form.product_type=1
  }
  navigateList(){
    if(this.categorydetail.concernStatus == 2) {
      localStorage.setItem('concernListType', 'Submit');
      this.router.navigate(['/concern-list']);
     }
   if(this.categorydetail.concernStatus == 3) {
      localStorage.setItem('concernListType', 'Forward');
      this.router.navigate(['/concern-list']);
     }
    if(this.categorydetail.concernStatus == 4) {
      localStorage.setItem('concernListType', 'Approval');
      this.router.navigate(['/concern-list']);
     }
     if(this.categorydetail.concernStatus == 5) {
      localStorage.setItem('concernListType', 'Approved');
      this.router.navigate(['/concern-list']);
     }
     if(this.categorydetail.concernStatus == 6) {
      localStorage.setItem('concernListType', 'Rejected');
      this.router.navigate(['/concern-list']);
     }
     if(this.categorydetail.concernStatus == 7) {
      localStorage.setItem('concernListType', 'Document');
      this.router.navigate(['/concern-list']);
     }
     if(this.categorydetail.concernStatus == 8) {
      localStorage.setItem('concernListType', 'WH');
      this.router.navigate(['/concern-list']);
     }
     if(this.categorydetail.concernStatus == 9) {
      localStorage.setItem('concernListType', 'FM');
      this.router.navigate(['/concern-list']);
     }
    
  }
  isWHForward:any;
  calculateAmountWH(whacceptqty,i){
    this.isProceed=true;
    console.log(whacceptqty,i) 
    if(whacceptqty>=0){
      if(whacceptqty==''){
        whacceptqty=0;
      }
      if(this.tmp_detail[i].qty>=whacceptqty){
      this.tmp_detail[i].whrejectqty=parseInt(this.tmp_detail[i]['qty'])-parseInt(whacceptqty);
      console.log( this.tmp_detail[i].whrejectqty) 
      }
      else{
        this.alrt.error("WHAccept Qty should be less than or Equal to calim Qty");
        this.tmp_detail[i].whrejectqty='';
        this.tmp_detail[i].whacceptqty=0;
        console.log( this.tmp_detail[i].whacceptqty);
      }
    }
    else{
      this.alrt.error("Qty should be 0 or greater than 0 ");
      this.tmp_detail[i].whrejectqty='';
      this.tmp_detail[i].whacceptqty=0;
    }
    for(let i=0;i<this.tmp_detail.length;i++){
      if(this.tmp_detail[i].whacceptqty!=null){
        this.isWHForward=true;
      }
      else{
        this.isWHForward=false;
        break;
      }

    }
    console.log(this.isWHForward);
   
  }
  calculateAmount(acceptqty,i)
  {
    this.isProceed=true;
    console.log(acceptqty,i) 
    if(acceptqty>=0){
      if(acceptqty==''){
        acceptqty=0;
      }
      if(this.tmp_detail[i].qty>=acceptqty){
      this.tmp_detail[i].amount=parseInt(this.tmp_detail[i]['price'])*parseInt(acceptqty);
      this.tmp_detail[i].rejectqty=parseInt(this.tmp_detail[i]['qty'])-parseInt(acceptqty);
      console.log( this.tmp_detail[i].rejectqty) 
      }
      else{
        this.alrt.error("Accept Qty should be less than or Equal to calim Qty");
        this.tmp_detail[i].rejectqty='';
        this.tmp_detail[i].acceptqty=0;
        this.tmp_detail[i].amount=0;
        console.log( this.tmp_detail[i].acceptqty);
      }
    }
    else{
      this.alrt.error("Qty should be 0 or greater than 0 ");
      this.tmp_detail[i].rejectqty='';
      this.tmp_detail[i].acceptqty=0;
      this.tmp_detail[i].amount=0;
      console.log( this.tmp_detail[i].amount);
    }
    
    for(let i=0;i<this.tmp_detail.length;i++){
      if(this.tmp_detail[i].acceptqty!=null){
        this.isForward=true;
      }
      else{
        this.isForward=false;
        break;
      }

    }
    console.log(this.isForward);
    for(let i=0;i<this.tmp_detail.length;i++){
      if(this.tmp_detail[i].acceptqty!=this.tmp_detail[i].qty){
        this.isProceed=false;
      }
    }
   
  }
  tmp_detail:any=[];
  totalItem:any;
 concern_detail(){
  this.loader=true;
  this.db.fetchData( {concernId:this.id},'concern/list').subscribe((response)=>{
      console.log(response);
      this.categorydetail=response['data'][0];
      console.log(this.categorydetail);
      this.loader=false;
      this.totalItem=this.categorydetail.productConcerns.length;
      console.log(this.totalItem);
      
      for(let i=0;i<this.categorydetail.productConcerns.length;i++){
    
        this.tmp_detail.push({"productConcernId":this.categorydetail.productConcerns[i]['productConcernId'],"document":this.categorydetail.productConcerns[i]['document'],"whrejectqty":this.categorydetail.productConcerns[i]['whRejectedQuantity'],"whacceptqty":this.categorydetail.productConcerns[i]['whAcceptedQuantity'],"whremark":this.categorydetail.productConcerns[i]['whRemarks'],"rejectqty":this.categorydetail.productConcerns[i]['rejectedQuantity'],"acceptqty":this.categorydetail.productConcerns[i]['acceptedQuantity'],"dealerremark":this.categorydetail.productConcerns[i]['networkRemarks'],"salesremark":this.categorydetail.productConcerns[i]['salesRemarks'],"natureOfProblem":this.categorydetail.productConcerns[i]['natureOfComplaint'],partNumber:this.categorydetail.productConcerns[i]['partNumber'],productId:this.categorydetail.productConcerns[i]['productId'],concernId:this.categorydetail.productConcerns[i]['concernId'],price:this.categorydetail.productConcerns[i]['rate'],segment: this.categorydetail.productConcerns[i]['segmentCode'],category: this.categorydetail.productConcerns[i]['category'],qty:this.categorydetail.productConcerns[i]['qunatity'],amount:this.categorydetail.productConcerns[i]['netAmount'],tmpqty:this.categorydetail.productConcerns[i]['qunatity'],tmpamount:this.categorydetail.productConcerns[i]['netAmount'],invoice:this.categorydetail.productConcerns[i]['invoiceNumber'],date:this.categorydetail.productConcerns[i]['mfgDate'],application: this.categorydetail.productConcerns[i]['application']})
      
        if(this.categorydetail.productConcerns[i].qunatity!=this.categorydetail.productConcerns[i].acceptedQuantity)
       {
         this.isProceed=false;
       }
      }
      console.log(this.tmp_detail);
      for(let i=0;i<this.categorydetail.productConcerns.length;i++){
      
        if(this.categorydetail.productConcerns[i].acceptedQuantity!=null){
          this.isForward=true;
        }
        else{
          this.isForward=false;
          break;
        }
  
      }
      console.log(this.isForward);
      
      for(let i=0;i<this.categorydetail.productConcerns.length;i++){
        if(this.categorydetail.productConcerns[i].document){
          this.tmp_detail[i].isImage=true;
          console.log("hii");
          
        }
       this.addCart(this.tmp_detail[i],i);
      }
      this.categorydetail.totalQty=0;

      this.categorydetail.totalAmount=0;

      for(let i=0;i<this.categorydetail.productConcerns.length;i++) {
        if(this.categorydetail.concernType==1){
             
                console.log(this.categorydetail.productConcerns[i].netAmount, this.categorydetail.productConcerns[i].qunatity);
                this.categorydetail.totalQty= this.categorydetail.totalQty+this.categorydetail.productConcerns[i].qunatity;
                this.categorydetail.totalAmount= this.categorydetail.totalAmount+this.categorydetail.productConcerns[i].netAmount;
        }
  }
    })
 }
 addCart(product,index)
 {
  console.log(product);
if(this.concern_form.product_type==1){
 if(product.qty){
   if(this.tmp_array.length==0){
     this.tmp_array.push({category: product['category'],qty:product['qty'],amount:product['amount'],tmpqty:product['qty'],tmpamount:product['amount'],invoice:product['invoice'],date:product['date']});
     this.concernDetail.push({ "whrejectqty":product['whrejectqty'],"whacceptqty":product['whacceptqty'],"whremark":product['whremark'],"productConcernId":product['productConcernId'],category: product['category'],productId:product['productId'],price:product['price'],qty:product['qty'],amount:product['amount'],partNumber:product['partNumber'],segment:product['segment'],invoice:product['invoice'],date:product['date'],tmpqty:product['qty'],tmpamount:product['amount']});
      }
      else{
      //  const idIndex=this.concernDetail.findIndex(row => row.productId==product.productId)
       const idIndex=-1;
       console.log(idIndex);
       
    
         if(idIndex != -1)
         {
           console.log('check');
           
           
          const itemIndex = this.tmp_array.findIndex(row => row.category == product['category']);
          console.log(itemIndex);
          if(itemIndex != -1)
          {
               
         this.tmp_array[itemIndex].qty=parseInt(this.tmp_array[itemIndex].qty)-parseInt(this.concernDetail[idIndex].tmpqty);
         this.tmp_array[itemIndex].amount=parseInt(this.tmp_array[itemIndex].amount)-parseInt(this.concernDetail[idIndex].tmpamount);
         this.tmp_array[itemIndex].qty=parseInt(this.tmp_array[itemIndex].qty)+parseInt(product.qty);
         this.tmp_array[itemIndex].amount=parseInt(product.amount)+parseInt(this.tmp_array[itemIndex].amount);
          }
          this.concernDetail[idIndex]['qty']=parseInt(product.qty);
          this.concernDetail[idIndex]['tmpqty']=parseInt(product.qty);
          this.concernDetail[idIndex]['amount']=parseInt(product.amount);
          this.concernDetail[idIndex]['tmpamount']=parseInt(product.amount);
         }
         if(idIndex === -1)
         {
           this.concernDetail.push({ "whrejectqty":product['whrejectqty'],"whacceptqty":product['whacceptqty'],"whremark":product['whremark'],"productConcernId":product['productConcernId'],category: product['category'],"productId":product.productId,"qty":product.qty,"price":product.price,"amount":product['amount'],partNumber:product['partNumber'],segment:product['segment'],invoice:product['invoice'],date:product['date'],tmpamount:product['amount'],tmpqty:product['qty'],});
           const itemIndex = this.tmp_array.findIndex(row => row.category == product['category']);
          if(itemIndex === -1) {
           this.tmp_array.push({category: product['category'],qty:product['qty'],amount:product['amount'],invoice:product['invoice'],date:product['date'],tmpqty:product['qty'],tmpamount:product['amount'],});
          }
          else {
            console.log('checkccc');
            
           this.tmp_array[itemIndex].qty=parseInt(product['qty'])+parseInt(this.tmp_array[itemIndex].qty);
           this.tmp_array[itemIndex].amount=parseInt(product['amount'])+parseInt(this.tmp_array[itemIndex].amount);
         }
         }
}
console.log(this.tmp_array);
console.log(this.concernDetail);
if(this.tmp_array){
 this.concern_form.info=true;
 console.log(this.concern_form);
 
    }

  }
  else{
    this.alrt.error("Some Fields are Empty Please Fill Them First");
  }
 }
 else {
   if(product.qty){
     if(this.tmp_array.length==0){
       this.tmp_array.push({category: product['category'],qty:product['qty'],amount:product['amount'],tmpqty:product['qty'],tmpamount:product['amount'],invoice:product['invoice'],date:product['date'],statusName:product['statusName'],natureOfProblem:product['natureOfComplaint']});
       this.concernDetail.push({ "whrejectqty":product['whrejectqty'],"whacceptqty":product['whacceptqty'],"whremark":product['whremark'],"productConcernId":product['productConcernId'],category: product['category'],productId:product['productId'],price:product['price'],qty:product['qty'],amount:product['amount'],partNumber:product['partNumber'],segment:product['segment'],invoice:product['invoice'],date:product['date'],tmpqty:product['qty'],tmpamount:product['amount'],statusName:product['statusName'],natureOfProblem:product['natureOfComplaint']});
        }
        else{
         const idIndex=this.concernDetail.findIndex(row => row.productId==product.productId)
         console.log(idIndex);
         
      
           if(idIndex != -1)
           {
             console.log('check');
             
            console.log(this.finel_Array[idIndex]);
          
            const itemIndex = this.tmp_array.findIndex(row => row.category == product['category']);
            console.log(itemIndex);
            if(itemIndex != -1)
            {
                 
           this.tmp_array[itemIndex].qty=parseInt(this.tmp_array[itemIndex].qty)-parseInt(this.concernDetail[idIndex].tmpqty);
           this.tmp_array[itemIndex].amount=parseInt(this.tmp_array[itemIndex].amount)-parseInt(this.concernDetail[idIndex].tmpamount);
           console.log(this.concernDetail[idIndex]);
           
           this.tmp_array[itemIndex].qty=parseInt(this.tmp_array[itemIndex].qty)+parseInt(product.qty);
          
           this.tmp_array[itemIndex].amount=parseInt(product.amount)+parseInt(this.tmp_array[itemIndex].amount);
         
           console.log(this.tmp_array[itemIndex]);
            }
            this.concernDetail[idIndex]['qty']=parseInt(product.qty);
            this.concernDetail[idIndex]['amount']=parseInt(product.amount);
           }
           if(idIndex === -1)
           {
             this.concernDetail.push({"whrejectqty":product['whrejectqty'],"whacceptqty":product['whacceptqty'],"whremark":product['whremark'],"productConcernId":product['productConcernId'],category: product['category'],"productId":product.productId,"qty":product.qty,"price":product.price,"amount":product['amount'],partNumber:product['partNumber'],segment:product['segment'],invoice:product['invoice'],date:product['date'],tmpamount:product['amount'],tmpqty:product['qty'],statusName:product['statusName'],natureOfProblem:product['natureOfComplaint']});
             const itemIndex = this.tmp_array.findIndex(row => row.category == product['category']);
            if(itemIndex === -1) {
             this.tmp_array.push({category: product['category'],qty:product['qty'],amount:product['amount'],invoice:product['invoice'],date:product['date'],tmpqty:product['qty'],tmpamount:product['amount'],statusName:product['statusName'],natureOfProblem:product['natureOfComplaint']});
            }
            else {
              console.log('checkccc');
              
             this.tmp_array[itemIndex].qty=parseInt(product['qty'])+parseInt(this.tmp_array[itemIndex].qty);
             this.tmp_array[itemIndex].amount=parseInt(product['amount'])+parseInt(this.tmp_array[itemIndex].amount);
           }
           }
 }
 console.log(this.tmp_array);
 console.log(this.concernDetail);
 if(this.tmp_array){
   this.concern_form.info=true;
   console.log(this.concern_form);
   
      }

      
    }
    else{
      this.alrt.error("Some Fields are Empty Please Fill Them First");
    }
 }
}
isCart:boolean=false;
partnoArray:any=[];
str2:any;
cartArray:any=[];
isStatus:boolean=false;

addProduct(kk)
{
  console.log(kk);
  
  this.isCart=true;
  if(this.concern_form.product_type==1){
 for(let i=0;i<this.productlist.length;i++){
   if(this.productlist[i].datacheck==true){
     console.log('hii');
     
    this.cartArray.push(this.productlist[i]);
    if(this.productlist[i].qty&&this.productlist[i].invoice&&this.productlist[i].date){
      this.addCart(this.productlist[i],i);
    }
    else{
      console.log('test');
      this.partnoArray.push(this.productlist[i].partNumber)
    }
 }
 }  
 console.log(this.partnoArray);
 
 if(this.partnoArray.length){
  this.alrt.error("Some field are Empty Please Fill Them First");
 }
    
  console.log(this.cartArray);
}
else{
  for(let i=0;i<this.productlist.length;i++){
    if(this.productlist[i].datacheck==true){
      console.log('hii');
      
     this.cartArray.push(this.productlist[i]);
     if(this.productlist[i].qty){
       this.addCart(this.productlist[i],i);
     }
     else{
       console.log('test');
       this.partnoArray.push(this.productlist[i].partNumber)
     }
  }
  }  
  console.log(this.partnoArray);
  
  if(this.partnoArray.length){
   this.alrt.error("Some field are Empty Please Fill Them First");
  }
     
   console.log(this.cartArray);
}
}
temp:any=false;
  removeFromCart(index)
  {
    this.temp=false;

    this.alrt.delete("Product").then((result)=>{
      if(result)
      {
     
        console.log(this.tmp_array[index]['category']);
        this.concernDetail = this.concernDetail.filter(row => row.category != this.tmp_array[index]['category']);
        this.temp=true;
      }
      if(this.temp)
      {
        this.tmp_array.splice(index,1);

      }
    })
  }
  isItem:boolean=false;
  isIndex:any=-1;
  Show_Item(category,index){
    console.log(this.tmp_detail);
    for(let i=0;i<this.tmp_detail.length;i++){
    this.tmp_detail[i].datacheck=false;
    }
    if(this.isIndex!=index){
      this.isItem=true;
      this.itemList=[];
    }
    else{
      this.isItem=!this.isItem;
     
    }
    if(this.isItem){
      this.isIndex=index;
     for(let i=0;i<this.tmp_detail.length;i++){
      if(category === this.tmp_detail[i]['category'])
      {
        this.itemList.push(this.tmp_detail[i])
     
      }
    }
  }
  else{
    this.itemList=[];
  }
  

  }
  urls:any=[];
  
  openImageDialog(index): void {
    console.log(index);
    
   console.log(this.tmp_detail[index]);
   
    const dialogRef = this.dialog.open(ImageModalComponent, {
      width: '500px',
      data: {
        document:this.tmp_detail[index].document,
        concernStatus:this.categorydetail.concernStatus
      }
    });
  }
  productDetail(category)
  {
    const dialogRef = this.dialog.open(UpdateConcernComponent, {
      width: '1600px',
         data:{
           product:this.concernDetail,
            category,
            id:this.id,
            concern:this.concern_form
         }});
        dialogRef.afterClosed().subscribe(result => {
        console.log(result);
      console.log('The dialog was closed');
      let tmpCartArray=this.db.getData();
      console.log(tmpCartArray);
      if(tmpCartArray)
      {
        this.tmp_array=[];
        this.concernDetail=[];
        this.showInCart(tmpCartArray);
      }
    });
  }
  tmp:any=false;
  showInCart(orderArray:any=[])
  {
    console.log(orderArray);
    for(let i=0;i<orderArray.length;i++)
    {
      this.addCart(orderArray[i],i);
    }
    console.log(this.tmp_array);
  }
  isEdit:boolean=false;
  edit(){
   this.isEdit=true;
   console.log('isEdit',this.isEdit);
   
  }
  selectedFile:any=[];
  urlss:any=[];
  insertDocument(data)
  {

         this.urlss = [];
         this.selectedFile = [];

        let files = data.target.files;
        if (files) {
          for (let file of files) {
            let reader = new FileReader();
            reader.onload = (e: any) => {
              this.urlss.push(e.target.result);
            }
            reader.readAsDataURL(file);
          }
        }
        console.log(this.urlss);
        console.log(data.target.files.length);
        for(var i=0; i<data.target.files.length; i++)
        {
            this.selectedFile.push(data.target.files[i]);
        }

        console.log(this.selectedFile);

    
  }
  tmp_transport:any=[];
  documentData:any={}
  updateTransport(){
    for(var i=0; i<this.selectedFile.length; i++)
    {
        this.documentData.action=1;
        this.documentData.binaryData=this.urlss[i];
        this.documentData.documentType=1;
        this.documentData.documentName=this.selectedFile[i].name;
        this.documentData.referenceId=0;
        this.documentData.fileName="Document"+i+".pdf",this.selectedFile[i];
        this.documentData.iconName = "DocumentIcon"+i+".pdf",this.selectedFile[i];

        console.log(this.documentData);

    }

    console.log('hii');
    this.loader=true;
    this.db.fetchData({
      "concernId": this.id,
      "transporterName": this.categorydetail.transporterName,
      "modeOfTransport": this.categorydetail.modeOfTransport,
      "numberOfBoxes": this.categorydetail.numberOfBoxes,
      "lrNumber":  this.categorydetail.lrNumber,
      "document":this.documentData,
      "eWayBillNumber": this.categorydetail.eWayBillNumber
    },'concern/transport').subscribe((response)=>{
      console.log(response);
      this.message=response['message'];
      this.loader=false;
      this.isEdit=false;
      if(this.message=="Transport Details updated successfully")
      {
           this.concern_detail();
           this.toast.openSucess('Transport Details updated successfully','');
        
      }
      else
      {
          this.toast.openError('Something Went Wrong Please Try Again!!','');
      };
    })
  }
  
 
  whuserId:any;
  fmuserId:any;
  productConcernsModel:any=[];
  isTrue:boolean=false;
  submit(status){
    this.loader=true;    
   if(status==2){
    for(let i=0;i<this.tmp_detail.length;i++){
      this.tmp_detail[i].verified=false;
    }
   }
   else{
    for(let i=0;i<this.tmp_detail.length;i++){
      this.tmp_detail[i].verified=true;
    }
   }
   if(this.user.data.role==16){
     this.whuserId=this.user.data.userId;
   }
  else if(this.user.data.role==17){
    this.fmuserId=this.user.data.userId;
  }
    if(this.categorydetail.concernType==1){
      console.log(this.tmp_detail);
      for(let i=0;i<this.tmp_detail.length;i++){
        this.productConcernsModel.push(
        {  
        "whVerifiedBy": this.whuserId,
        "fmVerifiedBy": this.fmuserId,
        "productConcernId":this.tmp_detail[i].productConcernId,
        "concernId": this.tmp_detail[i].concernId,
        "productId":this.tmp_detail[i].productId,
        "segmentCode":this.tmp_detail[i].segment,
        "category":this.tmp_detail[i].category,
        "partNumber":this.tmp_detail[i].partNumber,
        "application": this.tmp_detail[i].application,
        "mfgDate": this.tmp_detail[i].date,
        "invoiceNumber": this.tmp_detail[i].invoice,
        "qunatity":  this.tmp_detail[i].qty,
        "acceptedQuantity": this.tmp_detail[i].acceptqty,
        "rejectedQuantity": this.tmp_detail[i].rejectqty,
        "networkRemarks":  this.tmp_detail[i].dealerremark,
        "salesRemarks":  this.tmp_detail[i].salesremark,
        "whAcceptedQuantity": this.tmp_detail[i].whacceptqty,
        "whRejectedQuantity": this.tmp_detail[i].whrejectqty,
        "whRemarks":this.tmp_detail[i].whremark,
        "rate":  this.tmp_detail[i].price,
        "document":this.tmp_detail[i].document,
        "netAmount":  this.tmp_detail[i].amount, 
        "verified": this.tmp_detail[i].verified})
       
      }
    this.db.fetchData({"concernId":this.id,
    "concernType": this.categorydetail.concernType,
    "raisedByNetworkId": this.categorydetail.raisedByNetworkId,
    "concernStatus": status,
    "productConcernType": this.categorydetail.productConcernType,"productConcernsModel":this.productConcernsModel},'concern/update').subscribe((response)=>{console.log(response);
      this.message=response['message'];
      this.loader=false;
      if(this.message=="Concern updated successfully")
      {
      
           this.toast.openSucess('Customer Concern status change successfully','');
           if(status == 3) {
            localStorage.setItem('concernListType', 'Forward');
            this.router.navigate(['/concern-list']);
           }
           if(status == 4) {
            localStorage.setItem('concernListType', 'Approval');
            this.router.navigate(['/concern-list']);
           }
           if(status == 5) {
            localStorage.setItem('concernListType', 'Approved');
            this.router.navigate(['/concern-list']);
           }
           if(status == 6) {
            localStorage.setItem('concernListType', 'Rejected');
            this.router.navigate(['/concern-list']);
           }
           if(status == 7) {
            localStorage.setItem('concernListType', 'Document');
            this.router.navigate(['/concern-list']);
           }
           if(status == 8) {
            localStorage.setItem('concernListType', 'WH');
            this.router.navigate(['/concern-list']);
           }

      }
      else
      {
          this.toast.openError('Something Went Wrong Please Try Again!!','');
      };
      for(let i=0;i<this.itemList.length;i++){
        this.itemList[i].datacheck=false;
        console.log(this.itemList[i].datacheck);
      }
    })
  }
    else{
      this.concernReviews.push({"concernId": this.id ,
      "natureOfComplaint": this.categorydetail.problem,
      "concernProductStatus":this.categorydetail.status})
      this.db.fetchData({"concernId": this.id,"concernReviews":this.concernReviews},'concern/review').subscribe((response)=>{console.log(response);
        this.message=response['message'];
        this.loader=false;
        if(this.message=="Concern updated successfully")
        {
         
             this.toast.openSucess('Customer Concern Updated Sucessfully','');
          
        }
        else
        {
            this.toast.openError('Something Went Wrong Please Try Again!!','');
        };
      })
     } 
  }
  finance:any={};
  updateFinance(){
    console.log(this.finance);
    this.db.fetchData({
      "concernId": this.id,
      "fmVerifiedBy": this.user.data.userId,
      "fmRemarks": this.finance.fmremark,
      "creditNote":this.finance.creditnote
    },'concern/creditnote').subscribe((response)=>{console.log(response);
      if(response['message']=="Concern updated successfully")
      {
        localStorage.setItem('concernListType', 'FM');
        this.router.navigate(['/concern-list']);
       }
       else
        {
            this.toast.openError('Something Went Wrong Please Try Again!!','');
        };
    })
  }
  setFocus(form) {
    console.log("hii");
    
    for (var key in form.controls)
     {
      if (form.controls.hasOwnProperty(key)) {
        if(form.controls[key].status=='INVALID')
        {
          if (isPlatformBrowser(this.platformId)) {
                    $('#'+key).focus();
                  }
                  break;
        }
          console.log(key + " -> " + form.controls[key].status);
      }
  }
    
  }
  MobileNumber(event: any) 
  {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) 
    {event.preventDefault(); }
   }
   processed(){
    this.alrt.confirmation('Concern Status').then((result) => {
      if(result)
      {
      console.log(this.id);
      this.db.fetchData('','concern/processed'+'?concernId='+this.id).subscribe((response)=>{console.log(response);
      })
      }})
   
   }
 
 
}
