import { Component, OnInit, Renderer2  } from '@angular/core';
import { ConstantService } from '../../constant.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SnackBarOverview } from 'src/app/toast';
import { DialogComponent } from 'src/app/dialog';
import { UpdateConcernComponent } from '../update-concern/update-concern.component';
import { UpdateStatusComponent } from '../update-status/update-status.component';
import {MatDialog} from '@angular/material';
import { ImageModalComponent } from '../image-modal/image-modal.component';

// import { userInfo } from 'os';



@Component({
  selector: 'app-add-concern',
  templateUrl: './add-concern.component.html',
})
export class AddConcernComponent implements OnInit {
  user:any={}
  concern_form:any={};
  userId:any;
  msg:any;
  selectedFile:any=[];
  concernReviews:any=[];
  other_form:any={};
  prefitmentlist:any=[];
  pre_fitment:any={};
  post_fitment:any={};
  action="1";
  tmp_list:any=[];
  concernData:any=[];
  tmp_list1:any=[];
  name:any;
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
  maxDateValue:any;
  productlist:any=[];
  isAssignCheck:boolean=true;
  loader:boolean;
  producttmpList:any=[];
  cartProductList:any=[];
  concernDetail:any=[]
  data:any={};
  distributorasmList:any=[];
  distributorList:any=[];
  rolelistsales1:any=[];
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
     this.user = JSON.parse(localStorage.getItem('user')) || [];
     console.log(this.user);
     if(this.user.data.userType==2){
     this.distributorList=this.user['data']['salesUser']['userNetworks'];
     console.log(this.distributorList);
     }

     else{
      this.userId = this.user['data']['distributerNetwork']['networkId'];
      console.log(this.user['data']['distributerNetwork']['networkId']);
     }
     
    }
  ngOnInit() {
  
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
      // selectAllText: 'Select All',
      // unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
      maxHeight: 197
    };  
  this.maxDateValue=new Date();
  this.isSave=true;
    this.segment_list();
    this.category_list();
   
    this.concern_form.info=false;
  }
  salesNetworkTerritories:any=[];
  get_network(){
    console.log(this.concern_form.distributor);
    this.userId=this.concern_form.distributor;
    console.log( this.userId);
    if(this.user.data.userType=='2'){
    this.db.fetchData({'networkId': this.concern_form.distributor},"network/list").subscribe((response)=>{
    console.log(response['data'][0]['networkTerritories']);
    this.salesNetworkTerritories=response['data'][0]['networkTerritories']
    console.log(this.salesNetworkTerritories);
    this.check();
    })
  }
  }
  productCheck(){
    this.concern_form.isProceed=false;
    this.concern_form.isCheck=false;
    this.concern_form.info=false;
    this.productlist=[];
    this.tmp_array=[];
    this.concernDetail=[];
    this.data.product=[];
    this.data.segment=[];
    this.data.category=[];
    console.log(this.concern_form);
  }
  proceed(){
  
    this.concern_form.isProceed=true
    console.log(this.concern_form);
    
  }
  roles:any=[];
  territoryIds:any=[];
  check(){
    console.log("success");
    console.log(this.concern_form);
    if(this.concern_form.claim_type=='2'){
      this.loader=true;
      this.concern_form.info=true;
      console.log(this.user);
      if(this.user.data.userType==2){
        for(let i=0;i<this.salesNetworkTerritories.length;i++){
          this.territoryIds.push(this.salesNetworkTerritories[i].territoryId)
          }
      }
      else{
        for(let i=0;i<this.user.data.distributerNetwork.networkTerritories.length;i++){
          this.territoryIds.push(this.user.data.distributerNetwork.networkTerritories[i].territoryId)
          }
      }
     
      var s=this.territoryIds.join("&territoryIds=")
      var data="?territoryIds="+s;
      console.log(this.territoryIds);
      console.log(data);
      this.db.fetchData({},'territory/salesusers'+data).subscribe((response)=>
      {console.log(response);
        this.roles=response['data']
        this.loader=false;
        let index= this.roles.findIndex(x => x.role==6);
        if(index!=-1){
          this.rolelistsales1.push({"roleId":6,"roleName":"National Manager"})
        }
        let index1= this.roles.findIndex(x => x.role==7);
        if(index1!=-1){
          this.rolelistsales1.push({"roleId":7,"roleName":"Regional Manager"})
        }
        let index2= this.roles.findIndex(x => x.role==8);
        if(index2!=-1){
          this.rolelistsales1.push({"roleId":8,"roleName":"Area Manager"})
        }
        let index3= this.roles.findIndex(x => x.role==10);
        if(index3!=-1){
          this.rolelistsales1.push({"roleId":10,"roleName":"Territory Incharge"})
        }
      console.log(this.rolelistsales1);
      for(let i=0;i<this.rolelistsales1.length;i++){
        if(this.rolelistsales1[i].roleId==this.user.data.role){
          this.rolelistsales1[i].isAssign=true;
          this.select_role(this.rolelistsales1[i].roleId,i, this.rolelistsales1[i].isAssign);
        }
        else{
          this.rolelistsales1[i].isAssign=false;
        }
      }
      })
   
       
    }
    else
    this.concern_form.info=false;
  }
  segment_list(){

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


 tmpproduct_list:any=[];
 productList(segment,category)
  {
     this.data.product=[];
    this.product_list=[];
    console.log(segment,category);
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
    

      this.db.fetchData({"segmentCode":selectedSegment,"categoryCode": selectedCategory,"currentPage": 1,"pageSize": 500},"product/list").subscribe((result)=>{
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
      console.log(this.product_list);
      
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
      console.log( selectedCategory,
        selectedSegment,
        selectedproduct);
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
            this.cartProductList[i].isImage=false;
            this.cartProductList[i].document='';
           
          }
          this.productlist=this.productlist.concat(this.cartProductList);
          this.tmpProductList=this.productlist;
          for(let i=0;i<this.tmpProductList.length;i++){
          this.tmpProductList[i].priceUnit=this.tmpProductList[i]['mrp'];this.tmpProductList[i].priceUnit=this.tmpProductList[i]['mrp']
          this.tmpProductList[i].isImage=false;
        }
          console.log(this.tmpProductList);
          
        }
      })
      
    }
    add:boolean=false;
    calculateAmount(qty,i)
    {
      this.add=false;
      this.isedit=false;
      console.log(qty,i);
      
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
    cartArray:any=[];
   
   
  addCart(product,index)
  {
 
   this.isCart=true;
  this.isSave=false;
  console.log(product,index);
 if(this.concern_form.product_type==1){

 
  if(product.qty && product.invoice && product.date) {
    if(this.tmp_array.length==0){
      this.tmp_array.push({document:product['document'],productName: product['productName'],category: product['category'],qty:product['qty'],amount:product['amount'],tmpqty:product['qty'],tmpamount:product['amount'],invoice:product['invoice'],date:product['date'],natureOfComplaint:product['natureOfComplaint'],concernProductStatus:product['concernProductStatus']});
      this.concernDetail.push({document:product['document'],productName: product['productName'],category: product['category'],productId:product['productId'],priceUnit:product['priceUnit'],qty:product['qty'],amount:product['amount'],partNumber:product['partNumber'],segment:product['segment'],invoice:product['invoice'],date:product['date'],tmpqty:product['qty'],tmpamount:product['amount'],natureOfComplaint:product['natureOfComplaint'],concernProductStatus:product['concernProductStatus']});
       }
       else{
        const idIndex=this.concernDetail.findIndex(row => row.productId==product.productId)
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
            this.concernDetail.push({document:product['document'],productName: product['productName'],category: product['category'],"productId":product.productId,"qty":product.qty,"priceUnit":product.priceUnit,"amount":product['amount'],partNumber:product['partNumber'],segment:product['segment'],invoice:product['invoice'],date:product['date'],tmpamount:product['amount'],tmpqty:product['qty'],natureOfComplaint:product['natureOfComplaint'],concernProductStatus:product['concernProductStatus']});
            const itemIndex = this.tmp_array.findIndex(row => row.category == product['category']);
           if(itemIndex === -1) {
            this.tmp_array.push({document:product['document'],productName: product['productName'],category: product['category'],qty:product['qty'],amount:product['amount'],invoice:product['invoice'],date:product['date'],tmpqty:product['qty'],tmpamount:product['amount'],natureOfComplaint:product['natureOfComplaint'],concernProductStatus:product['concernProductStatus']});
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
     console.log(this.tmpCartArray);
     if(!this.isedit){
     this.productlist[index].datacheck=false;
     if(this.productlist[index].datacheck==false)
      {
        this.productlist[index].qty='';
        this.productlist[index].invoice='';
        this.productlist[index].date='';
        this.productlist[index].amount=0;
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
     this.alrt.error("Fields are Empty Please Fill Them First");
     console.log(product);
   }
   let checkdata=this.productlist.findIndex(x=>x.datacheck==true)
   if(checkdata==-1){
    this.add=false;
   }
  }
  else {
  
    if(product.qty){
      if(this.tmp_array.length==0){
        this.tmp_array.push({document:product['document'],productName: product['productName'],category: product['category'],qty:product['qty'],amount:product['amount'],tmpqty:product['qty'],tmpamount:product['amount'],invoice:product['invoice'],date:product['date'],natureOfComplaint:product['natureOfComplaint'],concernProductStatus:product['concernProductStatus']});
        this.concernDetail.push({document:product['document'],productName: product['productName'],category: product['category'],productId:product['productId'],priceUnit:product['priceUnit'],qty:product['qty'],amount:product['amount'],partNumber:product['partNumber'],segment:product['segment'],invoice:product['invoice'],date:product['date'],tmpqty:product['qty'],tmpamount:product['amount'],natureOfComplaint:product['natureOfComplaint'],concernProductStatus:product['concernProductStatus']});
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
              this.concernDetail.push({document:product['document'],productName: product['productName'],category: product['category'],"productId":product.productId,"qty":product.qty,"priceUnit":product.priceUnit,"amount":product['amount'],partNumber:product['partNumber'],segment:product['segment'],invoice:product['invoice'],date:product['date'],tmpamount:product['amount'],tmpqty:product['qty'],natureOfComplaint:product['natureOfComplaint'],concernProductStatus:product['concernProductStatus']});
              const itemIndex = this.tmp_array.findIndex(row => row.category == product['category']);
             if(itemIndex === -1) {
              this.tmp_array.push({document:product['document'],productName: product['productName'],category: product['category'],qty:product['qty'],amount:product['amount'],invoice:product['invoice'],date:product['date'],tmpqty:product['qty'],tmpamount:product['amount'],natureOfComplaint:product['natureOfComplaint'],concernProductStatus:product['concernProductStatus']});
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
       this.productlist[index].datacheck=false;
       if(this.productlist[index].datacheck==false)
        {
          this.productlist[index].qty='';
          this.productlist[index].invoice='';
          this.productlist[index].date='';
          this.toast.openSucess('Concern added successfully To Cart','');
       
         
      }
      else
      {
         this.toast.openError('Something Went Wrong Please Try Again!!','');
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
       this.alrt.error("Fields are Empty Please Fill Them First");
       
       
     }
     let checkdata=this.productlist.findIndex(x=>x.datacheck==true)
     if(checkdata==-1){
      this.add=false;
     }
  }
}
isCart:boolean=false;
partnoArray:any=[];
str2:any;
addProduct(kk)
{
  this.partnoArray=[];
  console.log(kk);
  this.isedit=false;
  this.isCart=true;
  console.log(this.isCart);
  
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
      console.log(this.productlist[i]);
      console.log(this.cartArray[i]);
    }
 }
 }  
 console.log(this.partnoArray);
 console.log(this.productlist);
 if(this.partnoArray.length){
  this.alrt.error("Field are Empty Please Fill Them First");
 }
    
 
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
   this.alrt.error("field are Empty Please Fill Them First");
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
  addStatus(product,index){
    console.log("hii");
    const dialogRef = this.dialog.open(UpdateStatusComponent, {
      width: '1600px',
         data:{
           product:product,
            index:index
         }});
         dialogRef.afterClosed().subscribe(result => {
          console.log(result);
        console.log('The dialog was closed');
        console.log(product);
      });
  }

  urls:any=[];
  documentData:any=[];
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
  
  openImageDialog(index): void {
    const dialogRef = this.dialog.open(ImageModalComponent, {
      width: '500px',
      data:{
       concernStatus:0,
       document:this.productlist[index].document.binaryData
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
  tmpCartArray:any=[];
  isedit:boolean=false;
productDetail(category)
{
  const dialogRef = this.dialog.open(UpdateConcernComponent, {
    width: '1600px',
       data:{
         product:this.concernDetail,
          category,
          concern:this.concern_form
       }});
      dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.isedit=true;
    console.log('The dialog was closed');
    this.tmpCartArray=this.db.getData();
    console.log(this.tmpCartArray);
    if(this.tmpCartArray)
    {
      this.tmp_array=[];
      this.concernDetail=[];
      this.showInCart(this.tmpCartArray);
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
    orderArray[i].datacheck=true;
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
   if(this.concern_form.product_type==1){
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


  select_role(value,index,event)
  {
    console.log(event);
    
    if(event)
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
  productConcernsModel:any=[];
  productConcernType:any;
  verified:any;
  onSubmit(status) {

     console.log(status);

     if(this.concern_form.claim_type==2) {

              this.isAssignCheck=false;
              for(let i=0;i<this.rolelistsales1.length;i++) {

                    console.log(this.rolelistsales1[i].isAssign);
                    
                    if(this.rolelistsales1[i].isAssign){
                      this.isAssignCheck=true;
                    }
              }

              console.log(this.isAssignCheck);
              if(!this.isAssignCheck)
              {
            
                return;
              }
              this.db.fetchData({ "concernStatus": status, "concernType": this.concern_form.claim_type, "raisedByNetworkId": this.userId,  "concernDetails": this.other_form.description,"concernRolesModel":this.role},'concern/add').subscribe((response)=>{
                
                    console.log(response)
                    // this.message=response['message'];
                    this.loader=false;
                    if(response['status']=="Success")
                    {
                        this.toast.openSucess('Concern added successfully','');
                        this.router.navigate(['/concern-list']);
                       
                    }
                    else
                    {
                        this.toast.openError('Something Went Wrong Please Try Again!!','');
                    };
              })
    }

    if(this.concern_form.claim_type==1) {

          if(this.concern_form.product_type==1) {
             this.productConcernType=1;
          } else {
            this.productConcernType=2;
          }

          if(this.user.data.userType==3) {
            this.verified=false;
         } else {
          this.verified=true;
         }

          console.log(this.tmp_array);
          if(this.tmp_array.length!=0) {
              this.loader=true;
              console.log(this.concernDetail.length);
              if(this.user.data.userType==2){
              for(let i=0;i<this.concernDetail.length;i++) {

                    console.log(this.concernDetail[i]);
                    
                    this.productConcernsModel.push( {
                        "segmentCode":this.concernDetail[i].segment,
                        "category":this.concernDetail[i].category,
                        "partNumber": this.concernDetail[i].partNumber,
                        "qunatity":this.concernDetail[i].qty,
                        "rate": this.concernDetail[i].priceUnit,
                        "productId": this.concernDetail[i].productId,
                        "netAmount":this.concernDetail[i].amount,
                        "mfgDate": this.concernDetail[i].date,
                        "rejectedQuantity": 0,
                        "document":this.concernDetail[i].document,
                        "acceptedQuantity":this.concernDetail[i].qty,
                        "invoiceNumber": this.concernDetail[i].invoice,
                        "verified": this.verified
                    })
              }

            }
            else{
              for(let i=0;i<this.concernDetail.length;i++) {

              console.log(this.concernDetail[i]);
                    
              this.productConcernsModel.push( {
                  "segmentCode":this.concernDetail[i].segment,
                  "category":this.concernDetail[i].category,
                  "partNumber": this.concernDetail[i].partNumber,
                  "qunatity":this.concernDetail[i].qty,
                  "rate": this.concernDetail[i].priceUnit,
                  "productId": this.concernDetail[i].productId,
                  "netAmount":this.concernDetail[i].amount,
                  "mfgDate": this.concernDetail[i].date,
                  "document":this.concernDetail[i].document,
                  "invoiceNumber": this.concernDetail[i].invoice,
                  "verified": this.verified
              })
            }
            }
              console.log(this.productConcernsModel);
                
              this.db.fetchData({  "productConcernType":this.productConcernType, "concernStatus": status,"concernType": this.concern_form.claim_type, "raisedByNetworkId": this.userId, 
              "productConcernsModel": this.productConcernsModel},'concern/add').subscribe((response)=>{
                
                    console.log(response)
                    // this.message=response['status'];
                    this.loader=false;
                    if(response['status']=="Success")
                    {
                           this.toast.openSucess('Concern added successfully','');
                             this.router.navigate(['/concern-list']);
                        if(status == 1) {
                             localStorage.setItem('concernListType', 'Draft');
                        }
                        if(status == 2) {
                          localStorage.setItem('concernListType', 'Submit');
                     }
                     if(status == 3) {
                      localStorage.setItem('concernListType', 'Forward');
                 }
                    }
                    else
                    {
                        this.toast.openError('Something Went Wrong Please Try Again!!','');
                    };
              })
          
          } else {

               this.alrt.error("Please Select Some Product");
          }
     }
  }

}
