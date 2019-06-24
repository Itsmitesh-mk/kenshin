import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { ConstantService } from 'src/app/constant.service';
import { Router } from '@angular/router';
import { SnackBarOverview } from 'src/app/toast';
import { ListOrderComponent } from '../list-order/list-order.component';
import { MatDialog } from '@angular/material';
import { DialogComponent } from 'src/app/dialog';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { OtherAddressComponent } from '../other-address/other-address.component';
import * as moment from 'moment';
import * as $ from 'jquery';
import { saveAs } from 'file-saver';
import * as XLSX from 'ts-xlsx';
import { SchemepopupComponent } from '../schemepopup/schemepopup.component';
import { PendingOrderComponent } from '../pending-order/pending-order.component';
// import {ExcelService} from './services/excel.service';
// import * as FileSaver from 'file-saver';
// import * as XLSX from 'xlsx';
@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  animations: [slideToTop()]
  
})
export class AddOrderComponent implements OnInit {
  
  user:any={}
  userType:any;
  userId:any;
  userRole:any;
  distributor_list:any=[];
  category_list:any=[];
  segmentList:any=[];
  oemList:any=[];
  data:any={};
  subSegment_List:any=[];
  ProductName_list:any=[];
  loader=false;
  itemTotel:any=0
  subTotal:any=0
  grandTotal:any=0;
  gstTotal:any=0;
  tmp_categoryList:any=[];
  tmp_segmentList:any=[];
  tmp_subsegmentList:any=[];
  tmp_oemList:any=[];
  cartProductList:any=[];
  networkId:any;
  orderDiv:any=false;
  currentMonth:any= moment().format('M');
  current_month:any=moment().format('MMMM');
  dropdownSettings:any = {};
  dropdownSettings1:any = {};
  dropdownSettings2:any = {};
  dropdownSettings3:any = {};
  dropdownSettings4:any = {};
  constructor( public alrt:DialogComponent,public service:ConstantService,public rout:Router,public toast:SnackBarOverview,public dialog: MatDialog) { 
    
    this.user = JSON.parse(localStorage.getItem('user')) || [];
    console.log(this.user);
    this.userType = this.user.data.userType;
    this.userId = this.user.data.userId;
    this.userRole=this.user.data.role;
    if(this.userType==3)
    {
      this.networkId=this.user.data.distributerNetwork.networkId;
      this.data.distributor=this.networkId;
      console.log(this.networkId);
      if(this.networkId)
      {
        this.openOrderDiv(this.networkId,0);
      }
      this.orderDiv=true;
    }
    console.log(this.currentMonth);
    
    
    
    console.log(this.userType ,"&" , this.userId, "&" ,this.userRole);
    // if(this.user)
    // {
    //   if(this.userType==2)
    //   {
    //     this.loader=true;
    //     this.categoryList()
    //     this.userTypeList();
    //     this.getSegmentList();
    //     this.getOemList();
    //     //  this.distributorList()
    //   }
    
    // }
    this.loader=true;
    this.userTypeList();
    
  }
  
  ngOnInit() {
    this.dropdownSettings = {
      singleSelection: true,
      closeDropDownOnSelection:true,
      idField: 'networkId',
      textField: 'establishment',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
      maxHeight: 197
    };
    this.dropdownSettings1 = {
      singleSelection: true,
      closeDropDownOnSelection:true,
      idField: 'value',
      textField: 'text',
      
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
      maxHeight: 197
    };
    this.dropdownSettings2 = {
      singleSelection: true,
      closeDropDownOnSelection:true,
      idField: 'value',
      textField: 'text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
      maxHeight: 197
    };
    this.dropdownSettings3 = {
      singleSelection: true,
      closeDropDownOnSelection:true,
      idField: 'productName',
      textField: 'productName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
      maxHeight: 197
    };  
    this.dropdownSettings4 = {
      singleSelection: true,
      closeDropDownOnSelection:true,
      idField: 'shippingAddressId',
      textField: 'shipping',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
      maxHeight: 197
    };  
  }
  
  active:any = {};
  toggleterritory(key,action)
  {
    console.log(action);
    console.log(key);
    
    if(action == 'open')
    { this.active[key] = true;
      $('#'+key).focus();
    }
    if(action == 'close')
    { this.active[key] = false;}
    
    console.log(this.active);
  }
  adrs:any={};
  tmpShipping:any=[];
  tmpShippingAddress:any=[];
  distributorDetail:any={}
  monthleyTarget:any=[]
  
  
  openOrderDiv(id,val:any)
  {
    console.log(id);
    console.log(val);
    
    this.categoryList()
    this.getSegmentList();
    // this.getcat
    let networkId
    if(id!='')
    {
      this.tmpShippingAddress=[];
      this.orderDiv=true;
      if(this.userType!=3)
      {
        this.data.distributor=id[0].networkId;
        console.log(this.data.distributor);
        networkId=this.data.distributor;
      }
      else{
        networkId=id;
      }
      this.loader=true;
      this.service.fetchData({'networkId': networkId},"network/list").subscribe((result=>{
        this.loader=false;
        console.log(result);
        if(result['status']=='Success')
        {
          this.distributorDetail=result['data'][0];
          this.tmpShipping=this.distributorDetail.shippingAddresses;
          if(this.distributorDetail.networkLimits)
          this.monthleyTarget=this.distributorDetail.networkLimits[0];
          
        }
        console.log(this.tmpShipping);
        
        const shippingData = [];
        for(let j=0;j<this.tmpShipping.length;j++)
        {
          shippingData.push({"shipping":this.tmpShipping[j]['city']+','+this.tmpShipping[j]['district']+','+this.tmpShipping[j]['state']+','+this.tmpShipping[j]['pin'],"shippingAddressId":this.tmpShipping[j]['shippingAddressId']});
        }
        
        shippingData.push({"shipping":'Other Adrress',"shippingAddressId": 'Other'});
        
        this.adrs.shipping = [];
        this.tmpShippingAddress = shippingData;
        console.log(this.tmpShippingAddress);
        
        if(shippingData.length > 1 && val==0) {
          this.adrs.shipping.push(shippingData[0]);
          this.data.shippingAddressId=shippingData[0].shippingAddressId;
        }
        if(val==1)
        {
          this.adrs.shipping.push(shippingData[shippingData.length-2]);
          this.data.shippingAddressId=shippingData[shippingData.length-2].shippingAddressId;
          
        }
        console.log(this.tmpShippingAddress);
        
        console.log(this.distributorDetail);
        
      }))
    }
    else{
      this.tmpShippingAddress=[];
      this.orderDiv=false;
    }
  }
  
  otherAddress(id)
  {
    console.log(id);
    
    const dialogRef = this.dialog.open(OtherAddressComponent, {
      width: '800px',
      data:{
        id
        
      }});
      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
        if(result==false)
        {
          console.log('false');
          if(this.userType==3)
          {
            this.openOrderDiv(this.networkId,0)
            
          }
          else{
            
            this.openOrderDiv(this.data.networkId,0)
          }
        }
        else
        {
          console.log('true');
          if(this.userType==3)
          {
            this.openOrderDiv(this.networkId,1)
            
          }
          else{
            
            this.openOrderDiv(this.data.networkId,1)
          }
        }
        console.log('The dialog was closed');
      });
    }
    shippingAddress:any=[];
    tmpDistributor_list:any=[];
    alldistributorList()
    {
      this.loader=true;
      console.log("this.distribotur_roleId");
      
      this.service.fetchData({"role":this.distribotur_roleId,"currentPage":1,"pageSize":100},"network/list").subscribe((result)=>{
        console.log(result);
        
        if(result['status']=="Success")
        {
          this.loader=false;
          this.tmpDistributor_list=result['data'];
          
          const distArr = [];
          for(let i=0;i<this.tmpDistributor_list.length;i++)
          {
            distArr.push({'networkId':this.tmpDistributor_list[i].networkId,'establishment':this.tmpDistributor_list[i].establishment+'/'+this.tmpDistributor_list[i].networkCode})
          }
          this.distributor_list=distArr;
          console.log(this.distributor_list);
          
        }
        else{
          this.loader=false;
        }
        // this.categoryList()
        // this.getSegmentList();
        // this.getOemList();
      })
    }
    deselectProduct:any=[];
    onDeSelect(segment,category,event)
    {
      console.log(segment,category,event);
      this.service.fetchData({"networkId":this.data.distributor,"segmentCode":segment[0],"categoryCode":category[0],"productName":event,"currentPage": 1,"pageSize": 500},"product/list").subscribe((result)=>{
        console.log(result);
        this.loader=false;
        if(result['status']=='Success')
        {
          this.deselectProduct=result['data'];
          console.log(this.deselectProduct);
          
          for(let i=0;i<this.deselectProduct.length;i++)
          {
            this.productlist=this.productlist.filter(row=>row.productId!=this.deselectProduct[i].productId);
            console.log(this.productlist);
            
          }
          
        }
      }) 
    }
    distributorList()
    {
      this.loader=true;
      this.service.fetchData({"role":this.distribotur_roleId,"salesUserId":this.userId},"mynetwork/detail").subscribe((result)=>{
        console.log(result);
        if(result['status']=="Success")
        {
          
          this.loader=false;
          this.tmpDistributor_list=result['data'];
          
          const distArr = [];
          for(let i=0;i<this.tmpDistributor_list.length;i++)
          {
            distArr.push({'networkId':this.tmpDistributor_list[i].networkId,'establishment':this.tmpDistributor_list[i].establishment+'/'+this.tmpDistributor_list[i].networkCode})
          }
          this.distributor_list=distArr;
          console.log(this.distributor_list);
        }
        else{
          this.loader=false;
        }
        // this.categoryList()
        // this.getSegmentList();
        // this.getOemList();
      })
    }
    categoryList()
    {
      this.loader=true;
      this.service.fileData("","category/list").subscribe((result)=>{
        console.log(result);
        setTimeout (() => {
          this.loader=false;
          
        }, 700);
        if(result['status']=="Success")
        {
          this.category_list=result['data'];
          this.tmp_categoryList=this.category_list;
        }
      })
    }
    
    getSegmentList()
    {
      this.service.fileData('',"segment/list").subscribe((result=>{
        console.log(result['data']);
        if(result['status']=="Success")
        {
          this.segmentList=result['data'];
          this.tmp_segmentList=this.segmentList;
        }
      }))
    }
    
    getSubSegmentList(segment)
    {
      console.log(segment);
      this.service.fetchData({"segmentCode":segment},"subsegment/list").subscribe((result)=>{
        console.log(result);
        if(result['status']="Success")
        {
          this.subSegment_List=result['data'];
          this.tmp_subsegmentList=this.subSegment_List;
        }
      })
    }
    pendingOrder(id)
    {
      console.log(id);
      
      this.loader=true;
      this.service.fileData('',"order/pending/"+this.data.distributor+'/'+id).subscribe((result)=>{
        console.log(result);
        this.loader=false
        if(result['status']=='Success')
        {
          const dialogRef = this.dialog.open(PendingOrderComponent, {
            width: '868px',
            data: result['data']     
            
          });
          dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            console.log('The dialog was closed');
          });
        }
        
      })
    }
    // getOemList()
    // {
    //   this.service.fileData("","oem/list").subscribe((result)=>{
    //     console.log(result);
    //     if(result['status']=="Success")
    //     {
    //       this.oemList=result['data'];
    //       this.tmp_oemList=this.oemList;
    //     }
    //   })
    // }
    tmpproduct_list:any=[];
    tmpcat:any;
    tmpseg:any;
    selectedSegment:any;
    productList(segment:any=[],category:any=[])
    {
      this.productdiv=true;
      this.data.product=[];
      this.ProductName_list=[];
      let selectedCategory;
      this.productlist=[]
      // let selectedSegment;
      
      if(segment.length!=0 || category.length!=0)
      {
        if(category.length!=0)
        {
          this.tmpcat=category;
          if(this.tmpcat!=selectedCategory)
          {
            selectedCategory=category[0];
            this.productlist=[];
          }
          else{
            selectedCategory=category[0];
          }
          console.log("Not Null");
        }
        if(segment.length!=0)
        {
          this.tmpseg=segment[0];
          if(this.tmpseg!=this.selectedSegment)
          {
            console.log(this.tmpseg);
            console.log(this.selectedSegment);
            
            this.selectedSegment=segment[0];
            this.productlist=[];
            this.data.category=[];
          }
          else{
            
            this.selectedSegment=segment[0];
          }
          console.log("Not Null");
        } 
        
        
        this.loader=true;
        console.log(this.data.category);
        
        
        this.service.fetchData({"networkId":this.data.distributor,"segmentCode": this.selectedSegment,"categoryCode": selectedCategory ,"currentPage": 1,"pageSize": 500},"product/list").subscribe((result)=>{
          console.log(result);
          setTimeout (() => {
            this.loader=false;
            
          }, 700);
          if(result)
          {
            this.ProductName_list=[];
            
            this.cartProductList=result['data'];
            for(let i=0;i<this.cartProductList.length;i++)
            {
              this.cartProductList[i].quantity=0;
              // this.cartProductList[i].priceSupport=0;
              this.cartProductList[i].ifcheck=false;
              
              this.cartProductList[i].itemValue=parseFloat(this.cartProductList[i].discountedListPrice)-parseFloat(this.cartProductList[i].priceSupport);
              this.cartProductList[i].amount=parseFloat(this.cartProductList[i].quantity)*parseFloat(this.cartProductList[i].itemValue);
              this.cartProductList[i].gstamount=(parseFloat(this.cartProductList[i]['discountedListPrice'])*parseFloat(this.cartProductList[i]['gstPercentage'])/100)*parseFloat(this.cartProductList[i]['quantity']);
            }
            
            const productTempArr =this.cartProductList;
            
            this.productlist=JSON.parse(JSON.stringify(this.cartProductList));
            this.tmpProductList=JSON.parse(JSON.stringify(this.cartProductList));
            console.log(this.tmpproduct_list);
            
            // JSON.parse(JSON.stringify(productTempArr))
            console.log(this.productlist);
            
            for (let index = 0; index < productTempArr.length; index++) {
              const itemIndex =  this.ProductName_list.findIndex(row => row.productName == productTempArr[index].productName);
              
              if(itemIndex == -1) {
                this.ProductName_list.push(JSON.parse(JSON.stringify(productTempArr[index])));
              }
            }
            
            // this.tmpproduct_list=this.productlist;
          }
        })
      }
      else{
        this.productlist=[];
        this.ProductName_list=[];
        this.cartProductList=[];
      }
    }
    productlist:any=[];
    tmpProductList:any=[];
    productdiv:any=false;
    getCartProductList(segment,category,productname)
    {
      this.productdiv=true;
      let selectedCategory;
      let selectedSegment;
      let selectedproduct;
      this.productlist=[];
      this.cartProductList=[];
      this.tmpProductList=[];
      console.log(productname);
      
      if(segment!=null || category!=null||productname!=null)
      {
        if(segment!=null)
        {
          selectedSegment=segment[0]
        }
        if(category!=null)
        {
          selectedCategory=category[0]
        }
        if(productname!=null)
        {
          selectedproduct=productname[productname.length-1]
        }  
        
      }
      // {
      console.log(category,segment,productname);
      
      this.loader=true;
      console.log(segment,category,productname);
      this.service.fetchData({"networkId":this.data.distributor,"segmentCode":selectedSegment,"categoryCode":selectedCategory,"productName":selectedproduct,"currentPage": 1,"pageSize": 500},"product/list").subscribe((result)=>{
        console.log(result);
        this.loader=false;
        if(result['status']=='Success')
        {
          this.cartProductList=result['data'];
          
          
          
          
          for(let i=0;i<this.cartProductList.length;i++)
          {
            this.cartProductList[i].quantity=0;
            // this.cartProductList[i].priceSupport=0;
            this.cartProductList[i].ifcheck=false;
            
            this.cartProductList[i].itemValue=parseFloat(this.cartProductList[i].discountedListPrice)-parseFloat(this.cartProductList[i].priceSupport);
            this.cartProductList[i].amount=parseFloat(this.cartProductList[i].quantity)*parseFloat(this.cartProductList[i].itemValue);
            this.cartProductList[i].gstamount=(parseFloat(this.cartProductList[i]['discountedListPrice'])*parseFloat(this.cartProductList[i]['gstPercentage'])/100)*parseFloat(this.cartProductList[i]['quantity']);
          }
          this.productlist=this.productlist.concat(this.cartProductList);
          this.tmpProductList=JSON.parse(JSON.stringify(this.productlist));
          
          // console.log(this.tmpproduct_list);
          
          // this.tmpProductList=this.productlist;
        }
      })
      
      // else{
      //   for(let i=0;i<this.productlist.length;i++)
      //   {
      //     if(productname===this.productlist[i]['productName'])
      //     {
      //       this.productlist.splice(i,1);
      //     }
      //   }
      // }
      
    }
    
    segment:any=[];
    category:any=[];
    productNameList:any=[];
    
    selectedItem(segment,category,productName)
    {
      console.log(segment,category,productName);
      
      if(segment!='')
      {
        this.segment=[];
        this.segment.push(segment);
        
      }
      if(category!='')
      {
        this.category=[];
        this.category.push(category);
        
      }
      if(productName!=null)
      {
        this.productNameList=productName;
        console.log(this.productNameList);
      }
      
      
    }
    downloadFile()
    {
      this.loader=true;
      console.log("function");
      this.service.excelFileData({"segments": this.data.segment,"categories":this.data.category,"productNames":this.data.product},'order/excel').subscribe(result=> {  saveAs(result, 'OrderProductSheet.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      this.loader=false;
    });
  }
  
  arrayBuffer:any;
  file:File;
  incomingfile(id,event) 
  {
    this.file= event.target.files[0]; 
    this.Upload();
    $('#'+id).val('');
  }
  ExcelArray:any=[];
  tmpExcelOrderArray:any=[];
  partNumberArray:any=[];
  notUploadPartNumber:any=[];
  Upload() {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, {type:"binary"});
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      console.log(XLSX.utils.sheet_to_json(worksheet,{raw:true}));
      this.ExcelArray=XLSX.utils.sheet_to_json(worksheet,{raw:true});
      for(let j=0;j<this.ExcelArray.length;j++)
      {
        this.partNumberArray.push(this.ExcelArray[j]['Part #']);
      }
      console.log(this.partNumberArray);
      
      this.service.fetchData({"networkId":this.data.distributor,"partNumbers":this.partNumberArray,"currentPage": 1,"pageSize": 500},"product/list").subscribe((result)=>{
        this.ExcelUploadOrder=result['data'];
        console.log(this.ExcelUploadOrder);
        
        for(let k=0;k<this.ExcelUploadOrder.length;k++)
        {
          for(let i=0;i<this.ExcelArray.length;i++)
          {
            if(this.ExcelArray[i]['Part #']==this.ExcelUploadOrder[k]['partNumber'])
            {
              this.ExcelUploadOrder[k].quantity=this.ExcelArray[i]['Order QTY'];
            }
          }
        }
        console.log(this.ExcelUploadOrder);
        for(let i=0;i<this.ExcelUploadOrder.length;i++)
        {
          console.log(parseFloat(this.ExcelUploadOrder[i].quantity),parseFloat(this.ExcelUploadOrder[i].moq));
          this.ExcelUploadOrder[i].gstamount=(parseFloat(this.ExcelUploadOrder[i]['discountedListPrice'])*parseFloat(this.ExcelUploadOrder[i]['gstPercentage'])/100)*parseFloat(this.ExcelUploadOrder[i]['quantity']);
          
          
          if(parseFloat(this.ExcelUploadOrder[i].quantity) % parseFloat(this.ExcelUploadOrder[i].moq)!=0 || parseFloat(this.ExcelUploadOrder[i].quantity)<parseFloat(this.ExcelUploadOrder[i].moq))
          { 
            console.log( this.notUploadPartNumber);
            this.notUploadPartNumber.push(this.ExcelArray[i]);
            
          }
          else
          {
            this.cartArray.push({
              "gstPercentage":this.ExcelUploadOrder[i]['gstPercentage'],
              "productId":this.ExcelUploadOrder[i]['productId'],
              "partNumber":this.ExcelUploadOrder[i]['partNumber'],
              "category":this.ExcelUploadOrder[i]['category'],
              "segment":this.ExcelUploadOrder[i]['segment'],
              "model":this.ExcelUploadOrder[i]['model'],
              "oem":this.ExcelUploadOrder[i]['oem'],
              "moq":this.ExcelUploadOrder[i]['moq'],
              "quantity":parseFloat(this.ExcelUploadOrder[i]['quantity']),
              "discountedListPrice":this.ExcelUploadOrder[i]['discountedListPrice'],
              "priceSupport":this.ExcelUploadOrder[i]['priceSupport'],
              "itemValue":parseFloat(this.ExcelUploadOrder[i]['discountedListPrice'])-parseFloat(this.ExcelUploadOrder[i]['priceSupport']),
              "amount":parseFloat(this.ExcelUploadOrder[i]['quantity'])*(parseFloat(this.ExcelUploadOrder[i]['discountedListPrice'])-parseFloat(this.ExcelUploadOrder[i]['priceSupport'])),
              "gstamount":this.ExcelUploadOrder[i]['gstamount']
            });
            
          }
          if(i==this.ExcelUploadOrder.length-1)
          {
            this.toast.openSucess("Product Sheet","Upload SuccessFully");
            console.log(this.notUploadPartNumber);
            if(this.notUploadPartNumber.length!=0)
            {
              this.service.exportAsExcelFile(this.notUploadPartNumber, 'Product Error Sheet');
              this.alrt.alertWarning("Item Quantity multiple of MOQ ");
            }
            this.showInCart(this.cartArray);
          }
          
        }
      })
      
    }
    fileReader.readAsArrayBuffer(this.file);
  }
  
  
  // const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  // const EXCEL_EXTENSION = '.xlsx';
  
  //   public exportAsExcelFile(json: any[], excelFileName: string): void {
  //     const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheeet(json);
  //     const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
  //     const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  //     this.saveAsExcelFile(excelBuffer, excelFileName);
  //   }
  //   private saveAsExcelFile(buffer: any, fileName: string): void {
  //      const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
  //      FileSaver.saveAs(data, fileName + '_export_' + new  Date().getTime() + EXCEL_EXTENSION);
  //   }
  
  selectProduct(index)
  {
    this.productlist[index].ifcheck=true;
    this.productlist[index].datacheck=true;
  }
  
  addToMyCart(index)
  {
    // this.tmp_orderDetail=[];
    console.log(this.productlist[index]);
    if(parseFloat(this.productlist[index].quantity) % parseFloat(this.productlist[index].moq)==0 && parseFloat(this.productlist[index].quantity) >=parseFloat(this.productlist[index].moq))
    {
      
      this.tmp_orderDetail.push({
        "gstPercentage":this.productlist[index]['gstPercentage'],
        "productId":this.productlist[index]['productId'],
        "partNumber":this.productlist[index]['partNumber'],
        "category":this.productlist[index]['category'],
        "segment":this.productlist[index]['segment'],
        "model":this.productlist[index]['model'],
        "oem":this.productlist[index]['oem'],
        "moq":this.productlist[index]['moq'],
        "quantity":parseFloat(this.productlist[index]['quantity']),
        "discountedListPrice":this.productlist[index]['discountedListPrice'],
        "priceSupport":this.productlist[index]['priceSupport'],
        "itemValue":this.productlist[index]['itemValue'],
        "amount":parseFloat(this.productlist[index]['itemValue'])*parseFloat(this.productlist[index]['quantity']),
        "gstamount":this.productlist[index]['gstamount']
      });
      this.toast.openSucess("Add to cart SuccessFully",'');
      
      this.showInCart(this.tmp_orderDetail);
    }
    else{
      console.log("enter");
      this.alrt.alertWarning("Order Quantity should be multiple of "+this.productlist[index].moq);
      this.productlist[index].datacheck=false;
      this.productlist[index].ifcheck=false;
      this.productlist[index].add=false;
      
    }
  }
  
  
  calculatePriceSupport(index,discount)
  {
    console.log(index , discount);
    if(discount<1)
    {
      console.log("hello");
      this.productlist[index].itemValue=this.productlist[index].itemValue;
      this.productlist[index].amount=this.productlist[index].amount;
    }
    if(discount>0)
    {
      this.productlist[index].itemValue=parseFloat(this.productlist[index].itemValue)-parseFloat(this.productlist[index].priceSupport);
      this.productlist[index].amount=parseFloat(this.productlist[index]['itemValue'])*parseFloat(this.productlist[index]['quantity']);
      console.log(this.productlist);
      console.log(this.tmp_orderDetail);
      let tmpindex=this.tmp_orderDetail.findIndex(row=>row.productId===this.productlist[index].productId)
      if(tmpindex != -1)
      {
        console.log("id");
        
        this.tmp_orderDetail[tmpindex].itemValue=this.productlist[index].itemValue;
        this.tmp_orderDetail[tmpindex].amount=this.productlist[index].amount;
        this.tmp_orderDetail[tmpindex].priceSupport=discount;
      }
      
    }
  }
  
  checkValidate(index)
  {
    console.log(this.productlist[index].quantity);
    console.log(this.productlist[index].moq);
    
    if(parseFloat(this.productlist[index].quantity) % parseFloat(this.productlist[index].moq)==0 )
    {
      console.log("inchangIf");
      this.productlist[index].add=true;
      this.tmp_orderDetail.push({
        "gstPercentage":this.productlist[index]['gstPercentage'],
        "productId":this.productlist[index]['productId'],
        "partNumber":this.productlist[index]['partNumber'],
        "category":this.productlist[index]['category'],
        "segment":this.productlist[index]['segment'],
        "model":this.productlist[index]['model'],
        "oem":this.productlist[index]['oem'],
        "moq":this.productlist[index]['moq'],
        "quantity":parseFloat(this.productlist[index]['quantity']),
        "discountedListPrice":this.productlist[index]['discountedListPrice'],
        "priceSupport":this.productlist[index]['priceSupport'],
        "itemValue":this.productlist[index]['itemValue'],
        "amount":parseFloat(this.productlist[index]['itemValue'])*parseFloat(this.productlist[index]['quantity']),
        "gstamount":this.productlist[index]['gstamount']
      });
    }
    else{
      console.log("change");
      
      this.productlist[index].datacheck=false;
      this.productlist[index].ifcheck=false;
      this.alrt.alertWarning("Order Quantity should be multiple of "+this.productlist[index].moq);
    }
  }
  schemeList:any=[];
  schemeString:string
  schemeString2:string='';
  
  SchemeDetail(partNumber,index)
  {
    if(this.productlist[index].schemeCount==0)
    {
      console.log("hello");
      
    }
    else
    {
      this.loader=true;
      this.service.fetchData({"partNumberCode":partNumber},"/getschemeonproduct").subscribe((result)=>{
        console.log(result);
        this.loader=false;
        if(result['message']=='Success')
        {
          this.schemeList=result['data'];
          // for(let i=0;i<this.schemeList.length;i++)
          // {
          
          //   this.schemeString=this.schemeList[i].offerDescription;
          //   this.schemeString2=this.schemeString2+this.schemeString+'<br>';
          //   this.schemeString='';
          // }
          // console.log(this.schemeString2);
          // this.alrt.alertWarning(this.schemeString2);
          const dialogRef = this.dialog.open(SchemepopupComponent, {
            width: '600px',
            data: this.schemeList     
            
          });
          dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            console.log('The dialog was closed');
          });
          
        }
      })
    }
  }
  cartArray:any=[];
  addCart(product,index,event)
  {
    console.log(event);
    
    if(event.checked)
    {
      // this.cartArray.push(product);
    }
    else{
      const idIndex=this.tmp_orderDetail.findIndex(row => row.productId==product.productId);
      console.log(idIndex);
      this.tmp_orderDetail.splice(idIndex,1);
      this.productlist[index].ifcheck=false;
      this.productlist[index].quantity=this.productlist[index].moq;
    }
    
    console.log(this.cartArray);
  }
  // datacheck:Boolean;
  tmp:any=false;
  finel_Array:any=[];
  tmp_array:any=[];
  orderDetail:any=[];
  tmpSubTotal:any=0;
  tmp_orderDetail:any=[];
  addToCart()
  {
    console.log(this.tmp_orderDetail);
    
    for(let i=0;i<this.tmp_orderDetail.length;i++)
    {
      if(this.tmp_orderDetail[i].quantity<parseFloat(this.productlist[i].moq))
      {
        this.alrt.alertWarning("Order Quantity Minimum"+this.productlist[i].moq);
        break;
      }
      else
      {
        this.cartArray.push({
          "gstPercentage":this.tmp_orderDetail[i]['gstPercentage'],
          "productId":this.tmp_orderDetail[i]['productId'],
          "partNumber":this.tmp_orderDetail[i]['partNumber'],
          "category":this.tmp_orderDetail[i]['category'],
          "segment":this.tmp_orderDetail[i]['segment'],
          "model":this.tmp_orderDetail[i]['model'],
          "oem":this.tmp_orderDetail[i]['oem'],
          "moq":this.tmp_orderDetail[i]['moq'],
          "quantity":parseFloat(this.tmp_orderDetail[i]['quantity']),
          "discountedListPrice":this.tmp_orderDetail[i]['discountedListPrice'],
          "priceSupport":this.tmp_orderDetail[i]['priceSupport'],
          "itemValue":this.tmp_orderDetail[i]['itemValue'],
          "amount":parseFloat(this.tmp_orderDetail[i]['itemValue'])*parseFloat(this.tmp_orderDetail[i]['quantity']),
          "gstamount":this.tmp_orderDetail[i]['gstamount']
        });
        if(i==this.tmp_orderDetail.length-1)
        {
          this.toast.openSucess("Add to cart SuccessFully",'');
          
          this.showInCart(this.cartArray);
        }
      }
      
    }
  }
  tmporderArray:any=[];
  showInCart(orderArray:any=[])
  {
    // this.toast.openSucess("Add to cart SuccessFully",'');
    console.log(orderArray);
    for(let i=0;i<orderArray.length;i++)
    {
      if(this.tmp_array.length==0)
      {
        this.finel_Array.push(orderArray[i]);
        this.tmp_array.push({category: orderArray[i]['category'],quantity:orderArray[i]['quantity'],amount:orderArray[i]['amount'],gstamount:orderArray[i]['gstamount']});
        this.tmporderArray.push(orderArray[i]);
        this.orderDetail.push({category: orderArray[i]['category'],"productId":orderArray[i].productId,"quantity":orderArray[i].quantity,"price":orderArray[i].itemValue,"gstPercentage":orderArray[i].gstPercentage});
        console.log(this.tmporderArray);
      }
      
      else
      {
        const idIndex=this.orderDetail.findIndex(row => row.productId==orderArray[i].productId)
        let tmpval=false;  
        if(idIndex != -1)
        {
          console.log(idIndex);
          console.log(this.tmporderArray);
          console.log(this.finel_Array);
          
          this.tmporderArray.splice(idIndex,1);
          this.orderDetail.splice(idIndex,1);
          this.tmporderArray.push(orderArray[i]);
          this.orderDetail.push({category: orderArray[i]['category'],"productId":orderArray[i].productId,"quantity":orderArray[i].quantity,"price":orderArray[i].itemValue,"gstPercentage":orderArray[i].gstPercentage});
          const itemIndex = this.tmp_array.findIndex(row => row.category == orderArray[i]['category']);
          if(itemIndex != -1)
          {
            console.log(this.tmporderArray);
            
            this.tmp_array[itemIndex].quantity=parseFloat(this.tmp_array[itemIndex].quantity)-parseFloat(this.finel_Array[idIndex].quantity)
            this.tmp_array[itemIndex].amount=parseFloat(this.tmp_array[itemIndex].amount)-parseFloat(this.finel_Array[idIndex].amount)
            this.tmp_array[itemIndex].gstamount=parseFloat(this.tmp_array[itemIndex].gstamount)-parseFloat(this.finel_Array[idIndex].gstamount)
            this.finel_Array.splice(idIndex,1);
            tmpval=true;
            if(tmpval)
            {
              console.log(this.tmporderArray);
              this.tmp_array[itemIndex].quantity=parseFloat(this.tmp_array[itemIndex].quantity)+parseFloat(orderArray[i].quantity)
              this.tmp_array[itemIndex].amount=parseFloat(this.tmp_array[itemIndex].amount)+parseFloat(orderArray[i].amount)
              this.tmp_array[itemIndex].gstamount=parseFloat(this.tmp_array[itemIndex].gstamount)+parseFloat(orderArray[i].gstamount);
              this.finel_Array.push(orderArray[i]);
            }
            
          }
          
        }
        if(idIndex === -1)
        {
          // this.tmp_orderDetail.push({"productId":orderArray[i].productId,"quantity":orderArray[i].quantity,"amount":orderArray[i].amount,"gstamount":orderArray[i].gstamount});
          this.orderDetail.push({category: orderArray[i]['category'],"productId":orderArray[i].productId,"quantity":orderArray[i].quantity,"price":orderArray[i].itemValue,"gstPercentage":orderArray[i].gstPercentage});
          this.finel_Array.push(orderArray[i]);
          this.tmporderArray.push(this.tmporderArray[i]);
          const itemIndex = this.tmp_array.findIndex(row => row.category == orderArray[i]['category']);
          
          if(itemIndex === -1) {
            this.tmp_array.push({category: orderArray[i]['category'],quantity:orderArray[i]['quantity'],amount:orderArray[i]['amount'],gstamount:orderArray[i]['gstamount']});
          } else {
            this.tmp_array[itemIndex].quantity=parseFloat(orderArray[i]['quantity'])+parseFloat(this.tmp_array[itemIndex].quantity);
            this.tmp_array[itemIndex].amount=parseFloat(orderArray[i]['amount'])+parseFloat(this.tmp_array[itemIndex].amount);
            this.tmp_array[itemIndex].gstamount=parseFloat(orderArray[i]['gstamount'])+parseFloat(this.tmp_array[itemIndex].gstamount);
          }
        }
      }
      if(i==orderArray.length-1)
      {
        this.tmp=true;
      }
    }
    if(this.tmp)
    {
      this.cartArray=[];
      this.tmp_orderDetail=[];
      console.log(this.finel_Array);
      this.calculate(this.finel_Array);
      console.log(this.tmp_array);
      // this.productlist=this.tmpProductList;
      for (let index = 0; index < this.productlist.length; index++) {
        this.productlist[index].datacheck = false;
        this.productlist[index].ifcheck = false;
        // this.productlist[index].quantity=0;
      }
    }
    
  }
  
  calculate(order_array)
  {
    console.log(order_array);
    
    this.itemTotel=0;
    this.subTotal=0;
    this.gstTotal=0;
    this.grandTotal=0;
    for(let i=0;i<order_array.length;i++)
    {
      console.log("process");
      
      this.itemTotel=parseFloat(this.itemTotel)+parseFloat(order_array[i].quantity);
      this.subTotal=parseFloat(this.subTotal)+parseFloat(order_array[i].amount);
      this.gstTotal=parseFloat(this.gstTotal)+parseFloat(order_array[i].gstamount);
      console.log(this.gstTotal );
      
      if(i==order_array.length-1)
      {
        this.grandTotal=parseFloat(this.grandTotal)+(parseFloat(this.gstTotal)+parseFloat(this.subTotal));
      }
    }
    
  }
  productDetail(category)
  {
    const dialogRef = this.dialog.open(ListOrderComponent, {
      width: '1600px',
      data:{
        product:this.finel_Array,
        category
      }});
      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
        console.log('The dialog was closed');
        let tmpCartArray=this.service.getData();
        if(tmpCartArray)
        {
          this.tmp_array=[];
          this.finel_Array=[];
          this.orderDetail=[];
          this.showInCart(tmpCartArray);
        }
      });
    }
    
    ExcelUploadOrder:any=[];
    attachment:any={};
    files: FileList; 
    filestring: string; 
    
    selectAddress(id)
    {
      
      console.log(id);
      if(id!='')
      {
        if(id.shippingAddressId=='Other')
        {
          console.log(this.data.networkId);
          if(this.userType==3)
          {
            this.otherAddress(this.networkId);
          }
          else{
            
            this.otherAddress(this.data.networkId[0].networkId)
          }
        }
        else{
          
          this.data.shippingAddressId=id.shippingAddressId;
        }
      }
      else
      {
        this.data.shippingAddressId=null;
      }
      console.log(this.data.shippingAddressId);
    }
    
    orderStatus:any;
    SaveOrder()
    {
      
      if(this.userRole==1)
      {
        this.companyStatus=1;
      }
      else{
        this.companyStatus=2;
      }
      this.orderStatus=1;
      this.OrderPlaced();
    }
    
    value:any={};
    companyStatus:any;
    SubbmitOrder()
    {
      console.log(this.userRole);
      
      if(this.userRole==12)
      {
        this.orderStatus=3;
        this.companyStatus=1;
        this.OrderPlaced();
      }
      else if(this.userRole==1)
      {
        this.orderStatus=2;
        this.companyStatus=1;
        this.OrderPlaced();
      }
      else{
        this.orderStatus=2;
        this.companyStatus=1;
        this.OrderPlaced();
      }
    }
    
    OrderPlaced()
    {
      this.loader=true;
      console.log(this.data.distributor);
      console.log(this.data);
      if(this.userRole==12)
      {
        this.value={'shippingAddressId':this.data.shippingAddressId,"remarks":this.data.remarks,"dealerStatus": this.orderStatus,"companyStatus": this.companyStatus,"networkId":this.networkId,"orderDetail":this.orderDetail,"createBy":this.userId,"amount":this.subTotal,"quantity":this.itemTotel,"gstAmount":this.gstTotal,"totalAmount":this.grandTotal};
      }
      else{
        this.value={'shippingAddressId':this.data.shippingAddressId,"remarks":this.data.remarks,"dealerStatus": this.orderStatus,"companyStatus": this.companyStatus,"networkId":this.data.distributor,"orderDetail":this.orderDetail,"createBy":this.userId,"amount":this.subTotal,"quantity":this.itemTotel,"gstAmount":this.gstTotal,"totalAmount":this.grandTotal};
      }
      console.log(this.value);
      this.service.fetchData(this.value,"order/add").subscribe((result)=>{
        console.log(result);
        this.loader=false;
        if(result['status']=='Success')
        {
          this.rout.navigate(['/order-list']);
          if(this.orderStatus==1)
          {
            this.toast.openSucess("Order Save In Draft","SuccessFully");
          }
          else{
            this.toast.openSucess("Order Placed","SuccessFully");
            
          }
          {
            
          }
        }
      })
    }
    temp:any=false;
    ordlength:any=[];
    removeFromCart(index)
    {
      this.temp=false;
      
      this.alrt.delete("Product").then((result)=>{
        if(result)
        {
          this.ordlength=this.finel_Array;
          console.log(this.tmp_array[index].quantity ,"&",this.tmp_array[index].amount,"&",this.tmp_array[index].gstamount);
          this.itemTotel=parseFloat(this.itemTotel)-parseFloat(this.tmp_array[index].quantity);
          this.subTotal=parseFloat(this.subTotal)-parseFloat(this.tmp_array[index].amount);
          this.gstTotal=parseFloat(this.gstTotal)-parseFloat(this.tmp_array[index].gstamount);
          this.grandTotal=parseFloat(this.grandTotal)-(parseFloat(this.tmp_array[index].amount)+parseFloat(this.tmp_array[index].gstamount));
          console.log(this.tmp_array[index]['category']);
          this.finel_Array = this.finel_Array.filter(row => row.category != this.tmp_array[index]['category']);
          this.orderDetail = this.orderDetail.filter(row => row.category != this.tmp_array[index]['category']);
          console.log(this.finel_Array);
          this.temp=true;
        }
        if(this.temp)
        {
          this.tmp_array.splice(index,1);
          
        }
      })
    }
    
    calculateAmount(quantity,qty,i)
    {
      if(qty<1)
      {
        this.productlist[i].amount=0;
      }
      if(qty>0){
        this.productlist[i].amount=parseFloat(this.productlist[i]['itemValue'])*parseFloat(qty);
        this.productlist[i].gstamount=(parseFloat(this.productlist[i]['itemValue'])*parseFloat(this.productlist[i]['gstPercentage'])/100)*this.productlist[i]['quantity'];
      }
    }
    
    
    tmp_userList:any=[];
    distribotur_roleId:any;
    userTypeList()
    {
      this.service.fileData('',"usertype/list").subscribe((result)=>{
        console.log(result['data'][2]['roles']);
        this.tmp_userList=result['data'][2]['roles'];
        
        for(let i=0;i<this.tmp_userList.length;i++)
        {
          console.log("hello");
          
          if(this.tmp_userList[i]['roleName']=='Distributor')
          {
            this.distribotur_roleId=this.tmp_userList[i]['roleId'];
            console.log(this.distribotur_roleId);
            if(this.distribotur_roleId)
            {
              if(this.userType==2)
              {
                console.log(this.userType);
                
                this.distributorList();
              }
              if(this.userType==1)
              {
                console.log(this.userType);
                
                this.alldistributorList();
              }
            }
            
          }
        }
        
      })
    }
    catsearch:any=[];
    tmp_cat:any=[];
    categorySearch()
    {
      this.category_list=[];
      for(var i=0;i<this.tmp_categoryList.length; i++)
      {
        this.catsearch.search=this.catsearch.search.toLowerCase();
        this.tmp_cat=this.tmp_categoryList[i]['text'].toLowerCase();
        if(this.tmp_cat.includes(this.catsearch.search))
        {
          this.category_list.push(this.tmp_categoryList[i]);
        }     
      }    
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
    
    oemsearch:any=[];
    tmp_oem:any=[];
    oemSearch()
    {
      this.oemList=[];
      for(var i=0;i<this.tmp_oemList.length; i++)
      {
        this.oemsearch.search=this.oemsearch.search.toLowerCase();
        this.tmp_oem=this.tmp_oemList[i]['text'].toLowerCase();
        if(this.tmp_oem.includes(this.oemsearch.search))
        {
          this.oemList.push(this.tmp_oemList[i]);
        }     
      }    
    }
    
    // subsegsearch:any=[];
    // tmp_subseg:any=[];
    // subSegmentSearch()
    // {
    //   this.product_list=[];
    //   for(var i=0;i<this.tmpproduct_list.length; i++)
    //   {
    //     this.subsegsearch.search=this.subsegsearch.search.toLowerCase();
    //     this.tmp_subseg=this.tmpproduct_list[i]['productName'].toLowerCase();
    //     if(this.tmp_subseg.includes(this.subsegsearch.search))
    //     {
    //       this.product_list.push(this.tmpproduct_list[i]);
    //     }     
    //   }    
    // }
    
    productName:any=[];
    tmp_pro:any=[];
    modelName:any=[];
    tmpModel:any=[];
    productSearchByNumber(partNumber,model)
    {
      
      this.productlist=[];
      for(var i=0;i<this.tmpProductList.length; i++)
      {
        if(partNumber!=null)
        { 
          partNumber=partNumber.toLowerCase();
          this.tmp_pro=this.tmpProductList[i]['partNumber'].toLowerCase();
        }
        else
        {
          partNumber="";
        }
        
        if(model!=null)
        { 
          model=model.toLowerCase();
          this.tmpModel=this.tmpProductList[i]['model'].toLowerCase();
        }
        else
        {
          model="";
        }

        if(this.tmp_pro.includes(partNumber) && this.tmpModel.includes(model))
        {
          this.productlist.push(this.tmpProductList[i]);
        }     
      }
      
    }
    // categoryName:any=[];
    // tmpcategory:any=[];
    // productSearchByCategory()
    // {
    //   this.productlist=[];
    //   for(var i=0;i<this.tmpProductList.length; i++)
    //   {
    //     this.categoryName.search=this.categoryName.search.toLowerCase();
    //     this.tmpcategory=this.tmpProductList[i]['category'].toLowerCase();
    //     if(this.tmpcategory.includes(this.categoryName.search))
    //     {
    //       this.productlist.push(this.tmpProductList[i]);
    //     }     
    //   }
    // }
    // segmentName:any=[];
    // tmpSegment:any=[];
    // productSearchBySegment()
    // {
    //   this.productlist=[];
    //   for(var i=0;i<this.tmpProductList.length; i++)
    //   {
    //     this.segmentName.search=this.segmentName.search.toLowerCase();
    //     this.tmpSegment=this.tmpProductList[i]['segment'].toLowerCase();
    //     if(this.tmpSegment.includes(this.segmentName.search))
    //     {
    //       this.productlist.push(this.tmpProductList[i]);
    //     }     
    //   }
    // }
    // // modelName:any=[];
    // // tmpModel:any=[];
    // productSearchByModel()
    // {
    //   this.productlist=[];
    //   for(var i=0;i<this.tmpProductList.length; i++)
    //   {
    //     this.modelName.search=this.modelName.search.toLowerCase();
    //     this.tmpModel=this.tmpProductList[i]['model'].toLowerCase();
    //     if(this.tmpModel.includes(this.modelName.search))
    //     {
    //       this.productlist.push(this.tmpProductList[i]);
    //     }     
    //   }
    // }
    // oemName:any=[];
    // tmpOem:any=[];
    // productSearchByOem()
    // {
    //   this.productlist=[];
    //   for(var i=0;i<this.tmpProductList.length; i++)
    //   {
    //     this.oemName.search=this.oemName.search.toLowerCase();
    //     this.tmpOem=this.tmpProductList[i]['oem'].toLowerCase();
    //     if(this.tmpOem.includes(this.oemName.search))
    //     {
    //       this.productlist.push(this.tmpProductList[i]);
    //     }     
    //   }
    // }
    
    // distributor_filter(distributor)
    // {
    //   let value=distributor.toUpperCase();
    //   this.distributor_list=[];
    //   for(var i=0; i<this.tmpDistributor_list.length; i++)
    //   {
    //     if(this.tmpDistributor_list[i]['establishment'].toUpperCase().search(value) !==-1)
    //     {
    //       this.distributor_list.push(this.tmpDistributor_list[i]);
    //     }
    //   }
    //   console.log(this.tmpDistributor_list);
    // }
    
    
  }
  