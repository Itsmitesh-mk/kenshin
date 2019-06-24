import { Component, OnInit, Renderer2  } from '@angular/core';
import { ConstantService } from '../../constant.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SnackBarOverview } from 'src/app/toast';
import { DialogComponent } from 'src/app/dialog';
import { ImageModalComponent } from '../image-modal/image-modal.component';
import { UpdateConcernComponent } from '../update-concern/update-concern.component';
import {MatDialog} from '@angular/material';
import * as moment from 'moment';
// import { userInfo } from 'os';
// import { userInfo } from 'os';
// import { userInfo } from 'os';
// import { userInfo } from 'os';
@Component({
  selector: 'app-draft-detail',
  templateUrl: './draft-detail.component.html',

})
export class DraftDetailComponent implements OnInit {
  id:any;
  draftDetail:any=[];
  user:any={}
  concern_form:any={};
  userId:any;
  msg:any;
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
  tmp_detail:any=[];
  rolelists:any=[];
  tmp_array:any=[];
  producttmpList:any=[];
  role:any=[];
  isSave:boolean;
  productlist:any=[];
  isAssignCheck:boolean=true;
  loader:boolean;
  totalItem:any;
  totalItems:any;
  idIndex:any;
  maxDateValue:any;
  cartProductList:any=[];
  concernDetail:any=[]
  data:any={};
  categorydetail:any=[];
  // concernStatus1:any=3;
  isDraft:boolean=false;
  rolelistsales1:any=[];
  distributorList:any=[];
  tmp_categoryList:any=[];
  dropdownSettings1:any = {};
  dropdownSettings2:any = {};
  dropdownSettings3:any = {};
  constructor(public db:ConstantService,
    public router:Router, 
    public route:ActivatedRoute,
    public toast:SnackBarOverview,
    public dialog: MatDialog,
    public alrt:DialogComponent
     ) {
      this.route.params.subscribe(params=>{
        console.log(params);
        this.id = params.id;
        console.log(this.id);
        this.draft_detail();
      });
     this.user = JSON.parse(localStorage.getItem('user')) || [];
     console.log(this.user);
     if(this.user.data.userType==2){
      this.distributorList=this.user['data']['salesUser']['staffWithJuniors']['salesUserNetworks'];
      console.log(this.distributorList);
      }
      else{
       this.userId = this.user['data']['distributerNetwork']['networkId'];
       console.log(this.user['data']['distributerNetwork']['networkId']);
     
      }
    }
  
  ngOnInit() {
    this.isSave=true;
    this.segment_list();
    this.category_list();
    console.log(this.user.data.userType,this.draftDetail.concernStatus);
    this.concern_form.info=false;
    this.dropdownSettings1 = {
      singleSelection: true,
      closeDropDownOnSelection:true,
      idField: 'segmentCode',
      textField: 'segment',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
      maxHeight: 197
    };
    this.dropdownSettings2 = {
      closeDropDownOnSelection:true,
      singleSelection: true,
      idField: 'value',
      textField: 'text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
      maxHeight: 197
    };
    this.dropdownSettings3 = {
      singleSelection: false,
      idField: 'productName',
      textField: 'productName',
      enableCheckAll:false,
      allowSearchFilter: true,
      maxHeight: 197
    };  
    this.maxDateValue=new Date();
  
  }
  tmp_draft:any=[];
  draft_detail(){
    console.log(this.id);
  this.loader=true;
    this.db.fetchData( {concernId:this.id},'concern/list').subscribe((response)=>{
        console.log(response);
        this.loader=false;
        this.draftDetail=response['data'][0];
        this.totalItems=this.draftDetail.productConcerns.length;
        this.userId=response['data'][0]['raisedByNetworkId'];
        this.proceed();
        this.productCheck();
        this.check();
        if(this.user.data.userType==3&&this.draftDetail.concernStatus==3){
            this.concern_detail();
        }else{
          console.log(this.draftDetail);
          for(let i=0;i<this.draftDetail.productConcerns.length;i++){
            this.tmp_draft.push({document:this.draftDetail.productConcerns[i]['document'],productConcernId:this.draftDetail.productConcerns[i]['productConcernId'],natureOfComplaint:this.draftDetail.productConcerns[i]['natureOfComplaint'],statusUpdatedOn:this.draftDetail.productConcerns[i]['statusUpdatedOn'],status:this.draftDetail.productConcerns[i]['status'],statusUpdatedByUser:this.draftDetail.productConcerns[i]['statusUpdatedByUser'],productName: this.draftDetail.productConcerns[i]['productName'],partNumber:this.draftDetail.productConcerns[i]['partNumber'],productId:this.draftDetail.productConcerns[i]['productId'],priceUnit:this.draftDetail.productConcerns[i]['rate'],segment: this.draftDetail.productConcerns[i]['segmentCode'],category: this.draftDetail.productConcerns[i]['category'],qty:this.draftDetail.productConcerns[i]['qunatity'],amount:this.draftDetail.productConcerns[i]['netAmount'],tmpqty:this.draftDetail.productConcerns[i]['qunatity'],tmpamount:this.draftDetail.productConcerns[i]['netAmount'],invoice:this.draftDetail.productConcerns[i]['invoiceNumber'],date:this.draftDetail.productConcerns[i]['mfgDate'],application: this.draftDetail.productConcerns[i]['application'],isDealerItem:false})
          }
          console.log(this.tmp_draft);
          for(let i=0;i<this.draftDetail.productConcerns.length;i++){
            this.isDraft=true;
           this.addCart(this.tmp_draft[i],i);
         
          }
        } 
      })
   }
   resubmit(){
     console.log('hii');
     
   }
  productCheck(){
    this.concern_form.isProceed=false;
    this.concern_form.isCheck=false;
    this.concern_form.info=false;
    this.productlist=[];
    this.tmp_array=[];
    this.concernDetail=[];
    console.log(this.concern_form);
  }
  proceed(){
    this.isSave=false;
    this.concern_form.isProceed=true;
    this.concern_form.isCheck=false;
    console.log(this.concern_form);
    
  }
  check(){
    console.log("success");
    console.log(this.concern_form);
    if(this.draftDetail.concernType=='2'){
      this.concern_form.info=true;
    }
    else
    this.concern_form.info=false;
  }
  segment_list(){
    this.loader=true;
    console.log('hello');
    if(this.user.data.userType==3){
      this.segmentList=this.user['data']['distributerNetwork']['networkSegments'];
      this.tmp_segmentList=this.segmentList;
      console.log(this.segmentList);
    }
    else{
      this.segmentList=this.user['data']['salesUser']['staffSegments'];
      this.tmp_segmentList=this.segmentList;
      console.log(this.segmentList);
    }
   }  
   category_list(){
     this.loader=true;
    this.db.fileData('','category/list/').subscribe((response)=>{
      this.categorylist=response['data'];
      this.tmp_categoryList=this.categorylist;
      console.log(response);
      this.loader=false;
    });
  } 
  catsearch:any=[];
  tmp_cat:any=[];
  categorySearch()
  {
    this.categorylist=[];
    for(var i=0;i<this.tmp_categoryList.length; i++)
      {
        this.catsearch.search=this.catsearch.search.toLowerCase();
        this.tmp_cat=this.tmp_categoryList[i]['text'].toLowerCase();
        if(this.tmp_cat.includes(this.catsearch.search))
        {
          this.categorylist.push(this.tmp_categoryList[i]);
        }     
      }    
  }

  onItemDeSelect(event,segment,category,productName){
    console.log(event,segment,category,productName);
    console.log(event,productName);
    for(let i=0;i<this.tmpProductList.length;i++){
      if(this.tmpProductList[i].productName==event){
        this.tmpProductList.splice(i,1);
      }
    }
console.log(this.tmpProductList);

  }
 tmpproduct_list:any=[];
 productList(segment,category)
  {
    this.data.product=[];
    let selectedSegment="";
    let selectedCategory="";
    if(segment!=null || category!=null){
      if(segment!=null && category!=null){
        selectedCategory=category[0];
        selectedSegment=segment[0];
        }
        else if(segment!=null){
        selectedSegment=segment[0];
        }
        else if(category!=null){
           selectedCategory=category[0];

        }
    }
    this.productlist=[];
    this.loader=true;
    console.log(this.data);
      this.db.fetchData({"segmentCode": selectedSegment,"categoryCode": selectedCategory,"currentPage": 1,"pageSize": 500},"product/list").subscribe((result)=>{
      console.log(result);
      setTimeout (() => {
        this.loader=false;
        
    }, 700);
      if(result)
      {
        this.producttmpList=result['data'];
        this.product_list=[];
        console.log(this.producttmpList);
        for(let i=0;i<this.producttmpList.length;i++){
         let index=this.product_list.findIndex(x=>x.productName==this.producttmpList[i].productName);
         console.log(index);
           if(index==-1){
           this.product_list.push(this.producttmpList[i]);
         }
      }
      this.tmpproduct_list=this.product_list;
      }
      })
        
  }
  subsegsearch:any=[];
  tmp_subseg:any=[];
  subSegmentSearch()
  {
    this.product_list=[];
    for(var i=0;i<this.tmpproduct_list.length; i++)
      {
        this.subsegsearch.search=this.subsegsearch.search.toLowerCase();
        this.tmp_subseg=this.tmpproduct_list[i]['productName'].toLowerCase();
        if(this.tmp_subseg.includes(this.subsegsearch.search))
        {
          this.product_list.push(this.tmpproduct_list[i]);
        }     
      }    
  }
  
  tmpProductList:any=[];
    getCartProductList(event,segment,category,productname)
    {
      console.log(event,segment,category,productname);
      let selectedCategory="";
      let selectedSegment="";
      let selectedproduct="";
      if(segment!=null || category!=null || productname!=null){
        if(segment!=null && category!=null && productname!=null){
          console.log("hii");
          
          selectedCategory=category[0];
           selectedSegment=segment[0];
           selectedproduct=productname[productname.length-1]
        }
        else if(segment!=null && productname){
        selectedSegment=segment[0];
        selectedproduct=productname[productname.length-1]
        }
        else if(productname!=null && productname){
        selectedCategory=category[0];
        selectedproduct=productname[productname.length-1]
        }
      }
        this.loader=true;
      console.log(segment,category,productname);
      this.db.fetchData({"segmentCode":selectedSegment,"categoryCode":selectedCategory,"productName":selectedproduct,"currentPage": 1,"pageSize": 500},"product/list").subscribe((result)=>{
        console.log(result);
        this.loader=false;
        if(result['status']=='Success')
        {
          this.cartProductList=result['data'];
          for(let i=0;i<this.cartProductList.length;i++)
          {
            this.cartProductList[i].qty='';
            this.cartProductList[i].amount=0; 
            this.cartProductList.isImage=false;
            this.cartProductList.document='';
          }
          this.productlist=this.productlist.concat(this.cartProductList);
          this.tmpProductList=this.productlist;
          this.tmpProductList=this.productlist;
          for(let i=0;i<this.tmpProductList.length;i++){
          this.tmpProductList[i].priceUnit=this.tmpProductList[i]['mrp'];
          this.tmpProductList.isImage=false;
          }
          console.log(this.tmpProductList);
        }
      })
      
    }
    add:boolean=false;
    calculateAmount(qty,i)
    {
      this.add=false;
      console.log(qty,i);
      this.isDraft=false;
      if(qty>0){
        this.productlist[i].datacheck=true;
        this.productlist[i].qty=qty;
        this.productlist[i].amount=parseInt(this.productlist[i]['priceUnit'])*parseInt(qty);
        this.add=true;
      }
      else{
        this.alrt.error("Qty should be greater than 0");
        this.productlist[i].datacheck=false;
        this.productlist[i].qty.value='';
        this.productlist[i].amount=0;
        console.log(this.productlist[i].qty);
        
      }
      console.log(this.productlist);
      
      
    }
    select(product,index){
      console.log(product.datacheck); 
      if(product.datacheck==false){
        product.invoice='';
        product.date='';
        product.qty='';
      }
      let checkdata=this.productlist.findIndex(x=>x.datacheck==true)
      if(checkdata==-1){
       this.add=false;
      }

    }
    // cartArray:any=[];

    selectedFile:any=[];
    name:any;
    urls:any=[];
    documentData:any=[];
    concernData:any;
    insertImage(data,productName,index)
    {
      this.urls=[];
      this.documentData=[];
      this.selectedFile=[];
      this.name=productName;
      let files = data.target.files;
  
          if (files) {
            for (let file of files) {
              let reader = new FileReader();
              reader.onload = (e: any) => {
                this.urls.push(e.target.result);
              }
              reader.readAsDataURL(file);
            }
          }
  
          console.log(this.urls);
  
  
          setTimeout(() => {
  
            console.log(this.urls[0]);
            console.log(data.target.files.length);
            for(var i=0; i<data.target.files.length; i++)
            {
                this.selectedFile.push(data.target.files[i]);
            }
  
            console.log(this.urls[0]);
    
            console.log(this.urls[0],this.selectedFile[0]);
            this.concernData=new FormData;
            this.concernData.action=1;
            this.concernData.binaryData=this.urls[0];
            this.concernData.documentType=3;
            this.concernData.documentName=this.name;
            this.concernData.referenceId=0;
            this.concernData.fileName="image"+i+".jpg", this.selectedFile[0];
            console.log(this.urls);
      
            this.productlist[index].isImage=true;  
            this.documentData.push({
              
                "documentType": this.concernData.documentType,
                "documentName":this.concernData.documentName,
                "fileName":   this.concernData.fileName,
                "referenceId":   this.concernData.referenceId,
                "iconName":   this.concernData.fileName,
                "binaryData":  this.concernData.binaryData,
                "action":  this.concernData.action
            })
  
            this.productlist[index].document=this.documentData[0];
            console.log(this.productlist[index].document);
          }, 1000);
         
    
  }
  doc:any;
  openImageDialog(index): void {
    console.log("hello");
    if(this.draftDetail.concernStatus==1){
      this.doc=this.productlist[index].document.binaryData
    }
    else{
      this.doc=this.tmp_detail[index].document.binaryData
    }
    const dialogRef = this.dialog.open(ImageModalComponent, {
      width: '500px',
      data:{
      concernStatus:0,
      document: this.doc
      } 
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(result==true){
        console.log('The dialog was closed');
      }
      else{
        console.log('The dialog was closed');
        this.selectedFile=[];
        this.urls=[];
        this.productlist[index].document='';
        this.productlist[index].isImage=false;
      }
    
    });
  }
    openImageDialog1(index): void {
      console.log(index);
      
      const dialogRef = this.dialog.open(ImageModalComponent, {
        width: '500px',
        data:{
        concernStatus:this.categorydetail.concernStatus,
        document:this.tmp_detail[index].document
        } 
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
        if(result==true){
          console.log('The dialog was closed');
        }
        else{
          console.log('The dialog was closed');
          this.selectedFile=[];
          this.urls=[];
          this.productlist[index].document={};
          this.productlist[index].isImage=false;
        }
      
      });
    }
  addCart(product,index)
  {
  
    this.isCart=true;
   console.log(product);
 if(this.draftDetail.productConcernType==1){
  if(product.qty && product.invoice && product.date){
    if(this.tmp_array.length==0){
      console.log("hii test0");
         this.tmp_array.push({productConcernId:product['productConcernId'],document:product['document'],natureOfComplaint:product['natureOfComplaint'],statusUpdatedOn:product['statusUpdatedOn'],status:product['status'],statusUpdatedByUser:product['statusUpdatedByUser'],isDealerItem:product['isDealerItem'],productName: product['productName'],category: product['category'],qty:product['qty'],amount:product['amount'],tmpqty:product['qty'],tmpamount:product['amount'],invoice:product['invoice'],date:product['date']});
         this.tmp_detail.push({productConcernId:product['productConcernId'],document:product['document'],"acceptqty":product['acceptqty'],"rejectqty":product['rejectqty'],"dealerremark":product['dealerremark'],"salesremark":product['salesremark'],"natureOfProblem":product['natureOfProblem'],partNumber:product['partNumber'],productId:product['productId'],concernId:product['concernId'],priceUnit:product['priceUnit'],segment:product['segment'],category: product['category'],qty:product['qty'],amount:product['amount'],tmpqty:product['qty'],tmpamount:product['amount'],invoice:product['invoice'],date:product['date'],application:product['application'],verified:product['verified']})
         this.concernDetail.push({productConcernId:product['productConcernId'],document:product['document'],natureOfComplaint:product['natureOfComplaint'],statusUpdatedOn:product['statusUpdatedOn'],status:product['status'],statusUpdatedByUser:product['statusUpdatedByUser'],isDealerItem:product['isDealerItem'],productName: product['productName'],category: product['category'],productId:product['productId'],priceUnit:product['priceUnit'],qty:product['qty'],amount:product['amount'],partNumber:product['partNumber'],segment:product['segment'],invoice:product['invoice'],date:product['date'],tmpqty:product['qty'],tmpamount:product['amount']});
       }
       else{
        console.log(this.draftDetail.concernStatus,this.user.data.userType,product.verified);
         if(this.draftDetail.concernStatus=='3' && this.user.data.userType=='3'){
        if(this.draftDetail.concernStatus=='3' && this.user.data.userType=='3' && !product.verified){
          console.log("hii test1");
          console.log(this.tmp_detail);
          this.idIndex=this.tmp_detail.findIndex(row => row.productId==product.productId && !row.verified);
          console.log(this.idIndex);
     }
         else{
      
            console.log("hii test3");
            // this.idIndex=this.tmp_detail.findIndex(row => row.productId==product.productId);
            this.idIndex=-1;
             
         }
        }
        else{
           this.idIndex=this.concernDetail.findIndex(row => row.productId==product.productId);
        }

        console.log(this.idIndex);
        
     
          if(this.idIndex != '-1')
          {
            console.log('check');
           const itemIndex = this.tmp_array.findIndex(row => row.category == product['category']);
           console.log(itemIndex);
           if(itemIndex != -1)
           {
            console.log(this.tmp_array[itemIndex].qty,this.concernDetail[this.idIndex].tmpqty)
          this.tmp_array[itemIndex].qty=parseInt(this.tmp_array[itemIndex].qty)-parseInt(this.concernDetail[this.idIndex].tmpqty);
          this.tmp_array[itemIndex].amount=parseInt(this.tmp_array[itemIndex].amount)-parseInt(this.concernDetail[this.idIndex].tmpamount);
          this.tmp_array[itemIndex].qty=parseInt(this.tmp_array[itemIndex].qty)+parseInt(product.qty);
          this.tmp_array[itemIndex].amount=parseInt(product.amount)+parseInt(this.tmp_array[itemIndex].amount);
           }
           this.concernDetail[this.idIndex]['qty']=parseInt(product.qty);
           this.concernDetail[this.idIndex]['tmpqty']=parseInt(product.qty);
           this.concernDetail[this.idIndex]['amount']=parseInt(product.amount);
           this.concernDetail[this.idIndex]['tmpamount']=parseInt(product.amount);
           if(product.document!=''){
             if(this.concernDetail[this.idIndex].document!=null){
             this.db.fetchData( [{
              "documentId": this.concernDetail[this.idIndex].document.documentId,
              "action": 2,
              "fileName": this.concernDetail[this.idIndex].document.fileName,
            }],'document/update').subscribe((response)=>{console.log(response);
              this.concernDetail[this.idIndex]['document']=product['document'];
            })
             }
             else{
              this.concernDetail[this.idIndex]['document']=product['document'];
             }
           }
         
           this.tmp_detail[this.idIndex]['qty']=parseInt(product.qty);
           this.tmp_detail[this.idIndex]['tmpqty']=parseInt(product.qty);
           this.tmp_detail[this.idIndex]['amount']=parseInt(product.amount);
           this.tmp_detail[this.idIndex]['tmpamount']=parseInt(product.amount);
          }
          if(this.idIndex == '-1')
          {
            console.log("hii -1");
            this.tmp_detail.push({productConcernId:product['productConcernId'],document:product['document'],"acceptqty":product['acceptqty'],"rejectqty":product['rejectqty'],"dealerremark":product['dealerremark'],"salesremark":product['salesremark'],"natureOfProblem":product['natureOfProblem'],partNumber:product['partNumber'],productId:product['productId'],concernId:product['concernId'],priceUnit:product['priceUnit'],segment:product['segment'],category: product['category'],qty:product['qty'],amount:product['amount'],tmpqty:product['qty'],tmpamount:product['amount'],invoice:product['invoice'],date:product['date'],application:product['application'],verified:product['verified']})
            this.concernDetail.push({productConcernId:product['productConcernId'],document:product['document'],natureOfComplaint:product['natureOfComplaint'],statusUpdatedOn:product['statusUpdatedOn'],status:product['status'],statusUpdatedByUser:product['statusUpdatedByUser'],isDealerItem:product['isDealerItem'],productName: product['productName'],category: product['category'],"productId":product.productId,"qty":product.qty,"priceUnit":product.priceUnit,"amount":product['amount'],partNumber:product['partNumber'],segment:product['segment'],invoice:product['invoice'],date:product['date'],tmpamount:product['amount'],tmpqty:product['qty'],});
            const itemIndex = this.tmp_array.findIndex(row => row.category == product['category']);
           if(itemIndex === -1) {
            this.tmp_array.push({document:product['document'],natureOfComplaint:product['natureOfComplaint'],statusUpdatedOn:product['statusUpdatedOn'],status:product['status'],statusUpdatedByUser:product['statusUpdatedByUser'],isDealerItem:product['isDealerItem'],productName: product['productName'],category: product['category'],qty:product['qty'],amount:product['amount'],invoice:product['invoice'],date:product['date'],tmpqty:product['qty'],tmpamount:product['amount'],});
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
     console.log(this.isDraft);
     if(!this.isDraft){
       console.log("pre");
     this.productlist[index].datacheck=false;
     if(this.productlist[index].datacheck==false)
      {
        this.productlist[index].qty='';
        this.productlist[index].invoice='';
        this.productlist[index].amount=0;
        this.productlist[index].date='';
        this.toast.openSucess('Concern added successfully To Cart','');
     
       
    }
    else
    {
       this.toast.openError('Something Went Wrong Please Try Again!!','');
    }
     
  }
  for(let i=0;i<this.tmp_array.length;i++){
    this.tmp_array[i].totalItem=0;
    for(let j=0;j<this.concernDetail.length;j++){
    if(this.tmp_array[i].category==this.concernDetail[j].category){
      this.tmp_array[i].totalItem=  this.tmp_array[i].totalItem+1;
    }
    }
  }
  console.log( this.tmp_array);
   }
   else{
     this.alrt.error("Some Fields are Empty Please Fill Them First");
   }
   let checkdata=this.productlist.findIndex(x=>x.datacheck==true)
     if(checkdata==-1){
      this.add=false;
     }
  }
  else {
    if(product.qty){
      if(this.tmp_array.length==0){
        this.tmp_array.push({productConcernId:product['productConcernId'],document:product['document'],natureOfComplaint:product['natureOfComplaint'],statusUpdatedOn:product['statusUpdatedOn'],status:product['status'],statusUpdatedByUser:product['statusUpdatedByUser'],isDealerItem:product['isDealerItem'],productName: product['productName'],category: product['category'],qty:product['qty'],amount:product['amount'],tmpqty:product['qty'],tmpamount:product['amount'],invoice:product['invoice'],date:product['date']});
        this.tmp_detail.push({productConcernId:product['productConcernId'],document:product['document'],"acceptqty":product['acceptqty'],"rejectqty":product['rejectqty'],"dealerremark":product['dealerremark'],"salesremark":product['salesremark'],"natureOfProblem":product['natureOfProblem'],partNumber:product['partNumber'],productId:product['productId'],concernId:product['concernId'],priceUnit:product['priceUnit'],segment:product['segment'],category: product['category'],qty:product['qty'],amount:product['amount'],tmpqty:product['qty'],tmpamount:product['amount'],invoice:product['invoice'],date:product['date'],application:product['application'],verified:product['verified']})
        this.concernDetail.push({productConcernId:product['productConcernId'],document:product['document'],natureOfComplaint:product['natureOfComplaint'],statusUpdatedOn:product['statusUpdatedOn'],status:product['status'],statusUpdatedByUser:product['statusUpdatedByUser'],isDealerItem:product['isDealerItem'],productName: product['productName'],category: product['category'],productId:product['productId'],priceUnit:product['priceUnit'],qty:product['qty'],amount:product['amount'],partNumber:product['partNumber'],segment:product['segment'],invoice:product['invoice'],date:product['date'],tmpqty:product['qty'],tmpamount:product['amount']});
         }
         else{
          console.log(this.draftDetail.concernStatus,this.user.data.userType,product.verified);
           if(this.draftDetail.concernStatus=='3' && this.user.data.userType=='3'){
          if(this.draftDetail.concernStatus=='3' && this.user.data.userType=='3' && !product.verified){
            console.log("hii test1");
            console.log(this.tmp_detail);
            this.idIndex=this.tmp_detail.findIndex(row => row.productId==product.productId && !row.verified);
            console.log(this.idIndex);
       }
           else{
        
              console.log("hii test3");
              this.idIndex=this.tmp_detail.findIndex(row => row.productId==product.productId);
               
           }
          }
          else{
             this.idIndex=this.concernDetail.findIndex(row => row.productId==product.productId);
          }
  
          console.log(this.idIndex);
          
       
            if(this.idIndex != '-1')
            {
              console.log('check');
             const itemIndex = this.tmp_array.findIndex(row => row.category == product['category']);
             console.log(itemIndex);
             if(itemIndex != -1)
             {
              console.log(this.tmp_array[itemIndex].qty,this.concernDetail[this.idIndex].tmpqty)
            this.tmp_array[itemIndex].qty=parseInt(this.tmp_array[itemIndex].qty)-parseInt(this.concernDetail[this.idIndex].tmpqty);
            this.tmp_array[itemIndex].amount=parseInt(this.tmp_array[itemIndex].amount)-parseInt(this.concernDetail[this.idIndex].tmpamount);
            this.tmp_array[itemIndex].qty=parseInt(this.tmp_array[itemIndex].qty)+parseInt(product.qty);
            this.tmp_array[itemIndex].amount=parseInt(product.amount)+parseInt(this.tmp_array[itemIndex].amount);
             }
             this.concernDetail[this.idIndex]['qty']=parseInt(product.qty);
             this.concernDetail[this.idIndex]['tmpqty']=parseInt(product.qty);
             this.concernDetail[this.idIndex]['amount']=parseInt(product.amount);
             this.concernDetail[this.idIndex]['tmpamount']=parseInt(product.amount);
             this.concernDetail[this.idIndex]['document']=product.document;
             this.tmp_detail[this.idIndex]['qty']=parseInt(product.qty);
             this.tmp_detail[this.idIndex]['tmpqty']=parseInt(product.qty);
             this.tmp_detail[this.idIndex]['amount']=parseInt(product.amount);
             this.tmp_detail[this.idIndex]['tmpamount']=parseInt(product.amount);
            }
            if(this.idIndex == '-1')
            {
              console.log("hii -1");
              this.tmp_detail.push({productConcernId:product['productConcernId'],document:product['document'],"acceptqty":product['acceptqty'],"rejectqty":product['rejectqty'],"dealerremark":product['dealerremark'],"salesremark":product['salesremark'],"natureOfProblem":product['natureOfProblem'],partNumber:product['partNumber'],productId:product['productId'],concernId:product['concernId'],priceUnit:product['priceUnit'],segment:product['segment'],category: product['category'],qty:product['qty'],amount:product['amount'],tmpqty:product['qty'],tmpamount:product['amount'],invoice:product['invoice'],date:product['date'],application:product['application'],verified:product['verified']})
              this.concernDetail.push({productConcernId:product['productConcernId'],document:product['document'],natureOfComplaint:product['natureOfComplaint'],statusUpdatedOn:product['statusUpdatedOn'],status:product['status'],statusUpdatedByUser:product['statusUpdatedByUser'],isDealerItem:product['isDealerItem'],productName: product['productName'],category: product['category'],"productId":product.productId,"qty":product.qty,"priceUnit":product.priceUnit,"amount":product['amount'],partNumber:product['partNumber'],segment:product['segment'],invoice:product['invoice'],date:product['date'],tmpamount:product['amount'],tmpqty:product['qty'],});
              const itemIndex = this.tmp_array.findIndex(row => row.category == product['category']);
             if(itemIndex === -1) {
              this.tmp_array.push({document:product['document'],natureOfComplaint:product['natureOfComplaint'],statusUpdatedOn:product['statusUpdatedOn'],status:product['status'],statusUpdatedByUser:product['statusUpdatedByUser'],isDealerItem:product['isDealerItem'],productName: product['productName'],category: product['category'],qty:product['qty'],amount:product['amount'],invoice:product['invoice'],date:product['date'],tmpqty:product['qty'],tmpamount:product['amount'],});
             }
             else {
               console.log('checkccc');
               
              this.tmp_array[itemIndex].qty=parseInt(product['qty'])+parseInt(this.tmp_array[itemIndex].qty);
              this.tmp_array[itemIndex].amount=parseInt(product['amount'])+parseInt(this.tmp_array[itemIndex].amount);
            }
            }
  }
  console.log(this.concernDetail);
  if(this.tmp_array){
    this.concern_form.info=true;
    console.log(this.concern_form);
    
       }
       console.log(this.isDraft);
       if(!this.isDraft){
        console.log("post");
       this.productlist[index].datacheck=false;
       if(this.productlist[index].datacheck==false)
        {
          this.productlist[index].qty='';
          this.productlist[index].invoice='';
          this.productlist[index].date='';
          this.productlist[index].amount=0;
          this.toast.openSucess('Concern updated successfully','');
       
         
      }
      else
      {
         this.toast.openError('Something Went Wrong Please Try Again!!','');
      }
    }
    for(let i=0;i<this.tmp_array.length;i++){
      this.tmp_array[i].totalItem=0;
      for(let j=0;j<this.concernDetail.length;j++){
      if(this.tmp_array[i].category==this.concernDetail[j].category){
        this.tmp_array[i].totalItem=  this.tmp_array[i].totalItem+1;
      }
      }
    }
    console.log( this.tmp_array);
     }
     else{
       this.alrt.error("Some Fields are Empty Please Fill Them First");
     }
     let checkdata=this.productlist.findIndex(x=>x.datacheck==true)
     if(checkdata==-1){
      this.add=false;
     }
  }
  for(let i=0;i<this.tmp_detail.length;i++){
    if(this.tmp_detail[i].document){
      this.tmp_detail[i].isImage=true
    }
  }
}
isCart:boolean=false;
isProceed:any=true;
isResubmit:any=false;
partnoArray:any=[];
str2:any;
isRemark:any=false;
remark(){
  this.isRemark=false;
  this.isProceed=false;
for(let i=0;i<this.tmp_detail.length;i++){
  if(this.tmp_detail[i].dealerremark!=''){
    this.isRemark=true;
    this.isProceed=true;
  }
}
}
addProduct(kk)
{
  this.partnoArray=[];
  console.log(kk);
 
  this.isCart=true;
  if(this.draftDetail.productConcernType==1){
 for(let i=0;i<this.productlist.length;i++){
   if(this.productlist[i].datacheck==true){
     console.log('hii');
      // this.cartArray.push(this.productlist[i]);
      console.log(i,this.productlist[i].qty,this.productlist[i].invoice,this.productlist[i].date);
      
     if(this.productlist[i].qty && this.productlist[i].invoice && this.productlist[i].date){
      this.isProceed=false;
      this.isResubmit=true;

      console.log(i,this.productlist[i].qty,this.productlist[i].invoice,this.productlist[i].date);

      if(this.draftDetail.concernStatus=='3' && this.user.data.userType=='3'){

      console.log(i,this.productlist[i].qty,this.productlist[i].invoice,this.productlist[i].date);

        console.log(this.productlist[i]);
        console.log("check condition");
      this.productlist[i].isDealerItem=true;
      this.productlist[i].verified=false;
      }
      console.log(this.productlist[i]);

      const cartArr = JSON.parse(JSON.stringify(this.productlist[i]));
      this.addCart(cartArr,i);
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
    
  // console.log(this.cartArray);
}
else{
  for(let i=0;i<this.productlist.length;i++){
    if(this.productlist[i].datacheck==true){
      console.log('hii');
    //  this.cartArray.push(this.productlist[i]);
     if(this.productlist[i].qty){
     
        this.isProceed=false;
        this.isResubmit=true;
  
        console.log(i,this.productlist[i].qty,this.productlist[i].invoice,this.productlist[i].date);
  
        if(this.draftDetail.concernStatus=='3' && this.user.data.userType=='3'){
  
        console.log(i,this.productlist[i].qty,this.productlist[i].invoice,this.productlist[i].date);
  
          console.log(this.productlist[i]);
          console.log("check condition");
        this.productlist[i].isDealerItem=true;
        this.productlist[i].verified=false;
        }
        console.log(this.productlist[i]);
  
        const cartArr = JSON.parse(JSON.stringify(this.productlist[i]));
        this.addCart(cartArr,i);
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
     
  //  console.log(this.cartArray);
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

productDetail(category)
{
  this.concern_form.product_type=this.draftDetail.productConcernType;
  const dialogRef = this.dialog.open(UpdateConcernComponent, {
    width: '1024px',
       data:{
         product:this.concernDetail,
          category,
          concern:this.concern_form,
          concernStatus:this.draftDetail.concernStatus
       }});
      dialogRef.afterClosed().subscribe(result => {
      console.log(result);
       this.isDraft=true;
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
    orderArray[i].isDealerItem=true;
    console.log(orderArray);
    this.addCart(orderArray[i],i);
  }
  console.log(this.tmp_array);
}
 
    productName:any=[];
    tmp_pro:any=[];
    productSearchByNumber()
    {
      console.log("hello");
      
      this.productlist=[];
      for(var i=0;i<this.tmpProductList.length; i++)
        {
          this.productName.search=this.productName.search.toLowerCase();
          this.tmp_pro=this.tmpProductList[i]['partNumber'].toLowerCase();
          if(this.tmp_pro.includes(this.productName.search))
          {
            this.productlist.push(this.tmpProductList[i]);
          }     
        }
    }
 cartList:any=[];
 

 partno_list(){
   this.loader=true;
   if(this.draftDetail.productConcernType==1){
  this.db.fetchData({ "currentPage": 1,
   "pageSize": 50,  "segmentCode":this.pre_fitment.segment,"categoryCode":this.pre_fitment.category,},'product/list').subscribe((response)=>{
    this.partnumberlist=response['data'];
   console.log(this.partnumberlist);
   this.loader=false;
  });
}
else{
  this.db.fetchData({ "currentPage": 1,
  "pageSize": 50,  "segmentCode":this.post_fitment.segment,"categoryCode":this.post_fitment.category,},'product/list').subscribe((response)=>{
   this.partnumberlist1=response['data'];
  console.log(this.partnumberlist1);
  this.loader=false;
 });
}
} 
  rolelist(){
    this.loader=true;
    this.db.fileData('','usertype/list').subscribe((response)=>{
      console.log(response);
      this.loader=false;
      this.rolelists=response['data'];
      let filterrolesales= this.rolelists.filter(x => x.userTypeId==2);
      this.rolelistsales1=filterrolesales[0].roles;
      console.log(this.rolelistsales1);
    });
  }
 
  
  select_role(value,index,event)
  {
    if(event.checked)
    {
      this.isAssignCheck=true;
      this.role.push(value);
      console.log(this.role);
   }
    else
    {
      console.log(index);
      console.log(this.role[0]);
      
          for( var j=0;j<this.rolelistsales1.length;j++)
          {
            if(this.rolelistsales1[index]['roleId']==this.role[j])
            {
              this.role.splice(j,1);
            }
          }
          console.log(this.role);
    }
  }
  active:any = {};
  toggleterritory(key,action)
  {
    console.log(action);
    console.log(key);
    
    if(action == 'open')
    { this.active[key] = true; }
    if(action == 'close')
    { this.active[key] = false;}

    console.log(this.active);
  }
  segsearch:any=[];
  tmp_seg:any=[];
  segmentSearch()
  {
    this.segmentList=[];
    for(var i=0;i<this.tmp_segmentList.length; i++)
      {
        this.segsearch.search=this.segsearch.search.toLowerCase();
        this.tmp_seg=this.tmp_segmentList[i]['text'].toLowerCase();
        if(this.tmp_seg.includes(this.segsearch.search))
        {
          this.segmentList.push(this.tmp_segmentList[i]);
        }     
      }    

  }
  productConcernType:any;
  verified:any;
  productConcernsModel:any=[];
  onSubmit(status){
    console.log(this.concernDetail);
    
    if(this.user.data.userType==3) {
      this.verified=false;
   } else {
    this.verified=true;
   }
    if(this.draftDetail.concernType==1){
      if(this.draftDetail.productConcernType==1){
        this.productConcernType=1;
      }
      else{
        this.productConcernType=2;
      }
      console.log(this.tmp_array);
      if(this.tmp_array.length!=0){
        this.loader=true;
          console.log(this.concernDetail.length);
            if(this.user.data.userType==2){
          for(let i=0;i<this.concernDetail.length;i++){
            console.log(this.concernDetail[i]);
            
            this.productConcernsModel.push( {
              "productConcernId":this.concernDetail[i].productConcernId,
              "concernId":this.draftDetail.concernId,
              "segmentCode":this.concernDetail[i].segment,
              "category":this.concernDetail[i].category,
              "partNumber": this.concernDetail[i].partNumber,
              "qunatity":this.concernDetail[i].qty,
              "rejectedQuantity": 0,
              "rate": this.concernDetail[i].priceUnit,
              "productId": this.concernDetail[i].productId,
              "netAmount":this.concernDetail[i].amount,
              "mfgDate": this.concernDetail[i].date,
              "acceptedQuantity":this.concernDetail[i].qty,
              "document":this.concernDetail[i].document,
              "invoiceNumber": this.concernDetail[i].invoice,
              "verified": this.verified
            })
         

          }
        }
        else{
          for(let i=0;i<this.concernDetail.length;i++){
            console.log(this.concernDetail[i]);
          this.productConcernsModel.push( {
            "productConcernId":this.concernDetail[i].productConcernId,
            "concernId": this.draftDetail.concernId,
            "segmentCode":this.concernDetail[i].segment,
            "category":this.concernDetail[i].category,
            "partNumber": this.concernDetail[i].partNumber,
            "document":this.concernDetail[i].document,
            "qunatity":this.concernDetail[i].qty,
            "rate": this.concernDetail[i].priceUnit,
            "productId": this.concernDetail[i].productId,
            "netAmount":this.concernDetail[i].amount,
            "mfgDate": this.concernDetail[i].date,
            "invoiceNumber": this.concernDetail[i].invoice,
            "verified": this.verified
        })
      }
     }
            console.log(this.productConcernsModel);
          this.db.fetchData({  "concernId":this.draftDetail.concernId, "productConcernType":this.productConcernType,"concernStatus": status,"concernType": this.draftDetail.concernType, "raisedByNetworkId": this.userId, 
           "productConcernsModel": this.productConcernsModel},'concern/update').subscribe((response)=>{console.log(response)
            this.message=response['message'];
            this.loader=false;
            if(this.message=="Concern updated successfully")
            {
                 this.toast.openSucess('Concern updated successfully','');
                 if(status == 1) {
                  localStorage.setItem('concernListType', 'Draft');
                  this.router.navigate(['/concern-list']);
                 }
                 if(status == 2) {
                  localStorage.setItem('concernListType', 'Submit');
                  this.router.navigate(['/concern-list']);
                 }
                 if(status == 3) {
                  localStorage.setItem('concernListType', 'Forward');
                  this.router.navigate(['/concern-list']);
                 }
            }
            else
            {
                this.toast.openError('Something Went Wrong Please Try Again!!','');
            };
          })
     
      }
    else{
      this.alrt.error("Please Select Some Product");
    }
    
    }
}
submit(status){
  this.loader=true;
  console.log(status);
  
  for(let i=0;i<this.tmp_detail.length;i++){
    this.productConcernsModel.push(
    {  
    "productConcernId": this.tmp_detail[i].productConcernId,
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
    "networkRemarks": this.tmp_detail[i].dealerremark,
    "salesRemarks":  this.tmp_detail[i].salesremark,
    "rate":  this.tmp_detail[i].priceUnit,
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
      
      if(status == 2) {
        localStorage.setItem('concernListType', 'Submit');
        this.router.navigate(['/concern-list']);
       }
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
         this.toast.openSucess('Customer Concern status change successfully','');
    }
    else
    {
        this.toast.openError('Something Went Wrong Please Try Again!!','');
    }
  })
}
cat_detail:any=[];
concern_detail(){
  this.isDraft=true;
  this.loader=true;
  this.db.fetchData( {concernId:this.id},'concern/list').subscribe((response)=>{
      console.log(response);
      this.categorydetail=response['data'][0];
      this.totalItem=this.categorydetail.productConcerns.length;
      console.log(this.totalItem);
      console.log(this.categorydetail);
      this.loader=false;
      for(let i=0;i<this.categorydetail.productConcerns.length;i++){
    
        this.cat_detail.push({"productConcernId":this.categorydetail.productConcerns[i].productConcernId,"document":this.categorydetail.productConcerns[i]['document'],"dealerremark":this.categorydetail.productConcerns[i]['networkRemarks'],"salesremark":this.categorydetail.productConcerns[i]['salesRemarks'],"natureOfProblem":this.categorydetail.productConcerns[i]['natureOfComplaint'],partNumber:this.categorydetail.productConcerns[i]['partNumber'],productId:this.categorydetail.productConcerns[i]['productId'],concernId:this.categorydetail.productConcerns[i]['concernId'],priceUnit:this.categorydetail.productConcerns[i]['rate'],segment: this.categorydetail.productConcerns[i]['segmentCode'],category: this.categorydetail.productConcerns[i]['category'],qty:this.categorydetail.productConcerns[i]['qunatity'],amount:this.categorydetail.productConcerns[i]['netAmount'],tmpqty:this.categorydetail.productConcerns[i]['qunatity'],tmpamount:this.categorydetail.productConcerns[i]['netAmount'],invoice:this.categorydetail.productConcerns[i]['invoiceNumber'],date:this.categorydetail.productConcerns[i]['mfgDate'],application: this.categorydetail.productConcerns[i]['application'],verified: this.categorydetail.productConcerns[i]['verified']})
        if(this.categorydetail.productConcerns[i].rejectedQuantity==0 && this.categorydetail.productConcerns[i]['acceptedQuantity']==0){
          this.cat_detail[i].rejectqty='';
          this.cat_detail[i]['acceptqty']='';
         }
         else{
          this.cat_detail[i].rejectqty=this.categorydetail.productConcerns[i]['rejectedQuantity'];
          this.cat_detail[i]['acceptqty']=this.categorydetail.productConcerns[i]['acceptedQuantity']; 
         }
      }
      console.log(this.cat_detail);
      
      for(let i=0;i<this.cat_detail.length;i++){
        console.log(this.cat_detail[i]);
       this.addCart(this.cat_detail[i],i);
      }
      this.categorydetail.totalQty=0;

      this.categorydetail.totalAmount=0;

      for(let i=0;i<this.categorydetail.productConcerns.length;i++) {
      
        
        if(this.categorydetail.concernType==1){
          console.log('hii');
                console.log(this.categorydetail.productConcerns[i].netAmount, this.categorydetail.productConcerns[i].qunatity);
                this.categorydetail.totalQty= this.categorydetail.totalQty+this.categorydetail.productConcerns[i].qunatity;
                this.categorydetail.totalAmount= this.categorydetail.totalAmount+this.categorydetail.productConcerns[i].netAmount;
        }

  }
    })
 }
 itemList:any=[];
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
  console.log(this.itemList);
  
}
else{
  this.itemList=[];
}


}
}
