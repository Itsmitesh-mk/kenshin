import { Component, OnInit, Renderer2 } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { ConstantService } from '../../constant.service';
import { SnackBarOverview } from 'src/app/toast';
import { sessionStorage }  from '../../local-storage.service';
import { saveAs } from 'file-saver';
import * as XLSX from 'ts-xlsx';
import { DialogComponent } from 'src/app/dialog';

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    animations: [slideToTop()]
})


export class ProductListComponent implements OnInit {
productlist:any=[];
segmentlist:any=[];
subsegmentlist:any=[];
categorylist:any=[];
prodlist:any=[];
modellist:any=[];
oemlist:any=[];
data:any=[];
div:boolean=false;
removesegment:boolean=false;
removesubsegment:boolean=false;
removecategory:boolean=false;
removeproductname:boolean=false;
removemodel:boolean=false;
removeoem:boolean=false;
filter:any={};
enableFilter:boolean;
disableFilter:boolean;
currentPage:any=1;
pageSize:any=200;
loader:boolean;
userdata:any=[];
senddata:any=[];
sgmnts:any=[];
totalrecord:any;
userRole:any;

partNumberList:any;
removepartnumber:any = false;

constructor(public db:ConstantService, public user:sessionStorage, public toast:SnackBarOverview, private renderer: Renderer2, public confirm:DialogComponent) {


      this.userdata=this.user['user']['data'];
      if(this.userdata['userType']==3){

        for(var i=0;i < this.userdata['distributerNetwork']['networkSegments'].length;i++){
          this.sgmnts.push(this.userdata['distributerNetwork']['networkSegments'][i]['segment']);}
        this.senddata={"segments":this.sgmnts,"currentPage": this.currentPage,"pageSize": this.pageSize};

      }  else if(this.userdata['userType']==2) {
        
          for(var i=0;i < this.userdata['salesUser']['staffSegments'].length;i++) {
             this.sgmnts.push(this.userdata['salesUser']['staffSegments'][i]['segment']);
          }

          this.senddata={"segments":this.sgmnts,"currentPage": this.currentPage,"pageSize": this.pageSize};
      } else {
        
           this.senddata={"currentPage": this.currentPage,"pageSize": this.pageSize};
      }

      this.productList(this.senddata);
      this.userRole=this.userdata['role'];
      console.log(this.userRole);
}

  ngOnInit() {
    this.disableFilter=true;
   this.enableFilter=false;

   this.segment_list();
  }
  filterbutton(){
    this.enableFilter=true;
    if(this.enableFilter==true)
    {
      this.disableFilter=false;
    }
    else{
      this.disableFilter=true;
    }

  }
closefilter(){
  this.enableFilter  = false;
  this.disableFilter=true;
  this.productList({ "currentPage": this.currentPage,
  "pageSize": this.pageSize});
  this.filter='';
}
 
  refresh(){
    this.productList({ "currentPage": this.currentPage,
      "pageSize": this.pageSize});
        this.toast.openSucess('List Refreshed Sucessfully','');
      
  }


  downloadFile()
  {
    console.log("productlist");
    
    this.confirm.downloadConfirm("Product Data").then((result) => {
      console.log(result);
      if(result)
      {
        console.log("function");
        this.db.downloadProductData({},'pwnload').subscribe(result=> { saveAs(result, 'Product Data.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
  
        });
      }
    });
     
  }

  
  downloadPriceList(){
    console.log("pricelist");
    
    this.confirm.downloadConfirm("Price List").then((result) => {
      console.log(result);
      if(result)
      {
        console.log("function");
        this.db.downloadProductData({},'price/list').subscribe(result=> {  saveAs(result, 'Price List.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
  
        });
      }
    });
  }

  segment_list(){
   console.log('hello');
   console.log(this.filter.segment);
    this.db.fileData('','segment/list/').subscribe((response)=>{
      console.log(response);
      this.segmentlist=response['data'];
      console.log(this.segmentlist);
    });
  }  


  getAllFilterData() {


    const apiFilterObject = {};

    apiFilterObject['currentPage'] = this.currentPage;
    apiFilterObject['pageSize'] = this.pageSize;

      for (const property in this.filter) {


        console.log(this.filter[property]);

          if (this.filter.hasOwnProperty(property) && this.filter[property]) {

                if(property == 'segment') {
                    apiFilterObject['segmentCode'] = this.filter[property];
                }
                
                if(property == 'subsegment') {
                  apiFilterObject['subSegmentCode'] = this.filter[property];
                }

                if(property == 'category') {
                  apiFilterObject['categoryCode'] = this.filter[property];
                }

                if(property == 'prod') {
                  apiFilterObject['productName'] = this.filter[property];
                }

                if(property == 'oem') {
                  apiFilterObject['oemCode'] = this.filter[property];
                }

                if(property == 'model') {
                  apiFilterObject['modelCode'] = this.filter[property];
                }

                if(property == 'partNumber') {
                  apiFilterObject['partNumberContains'] = this.filter[property];
                }

                if(property == 'partNumber') {
                  apiFilterObject['partNumberContains'] = this.filter[property];
                }

                if(property == 'live') {
                  apiFilterObject['isLive'] = this.filter[property];
                }
          }
      }

      return apiFilterObject;
        
  }



  filterChangeHandler(target) {

         const apiURLData = this.getAllFilterData();

         console.log(apiURLData);

          setTimeout(() => {

              this.productList(apiURLData);
          
          }, 1000);

          if(target == 'subsegment') {
            this.removesubsegment=true;
          }

          if(target == 'category') {
              this.removecategory=true;
          }

          if(target == 'productName') {
              this.removeproductname=true;
          }

          if(target == 'oem') {

              this.removeoem=true;
          }

          if(target == 'model') {
              this.removemodel=true;
          }

          if(target == 'partNumber') {
              this.removepartnumber=true;
          }
  }


  partNumberFilter() {

    console.log(this.filter.partNumber);
  
    this.db.fetchData({ "currentPage": this.currentPage,
    "pageSize": this.pageSize,"partNumberContains":this.filter.partNumber},'product/list').subscribe((response)=>{
         this.partNumberList=response['data'];
         console.log(this.partNumberList);
     });
  }


  segmentFilter(){
    console.log(this.filter.segment);
    this.productList({ "currentPage": this.currentPage,
      "pageSize": this.pageSize,"segmentCode":this.filter.segment});
      this.removesegment=true;
  }


  removesegmentfilter() {

        this.filter.segment='';
        this.productList({ "currentPage": this.currentPage,
        "pageSize": this.pageSize,"segmentCode":this.filter.segment,"subSegmentCode":this.filter.subsegment,"categoryCode":this.filter.category,"productName":this.filter.prod,"modelCode":this.filter.model,"oemCode":this.filter.oem});
        this.removesegment = false;
  }

  subsegment_list(){

    console.log(this.filter);       
    this.db.fetchData({"subSegment":this.filter.subsegment},'subsegment/list').subscribe((response)=>{
      this.subsegmentlist=response['data'];
      console.log(this.subsegmentlist);
    });
  }


  removesubsegmentfilter(){
      this.filter.subsegment='';
      this.removesubsegment=false;

      this.filterChangeHandler('subsegment');
  }

  removecategoryfilter(){

      this.filter.category='';
      this.removecategory=false;
      this.filterChangeHandler('category');
  }

  removeproductnamefilter(){
    this.filter.prod='';
    this.removeproductname=false;
    this.filterChangeHandler('productName');
    
  }

  removeoemfilter() {

      this.filter.oem='';
      this.removeoem=false;
      this.filterChangeHandler('oem');
  }

  removemodelfilter() {

      this.filter.model='';
      this.removemodel=false;
      this.filterChangeHandler('model');
  }


  removePartNumberFilter() {

      this.filter.partNumber='';
      this.filterChangeHandler('partNumber');
      this.removepartnumber = false;
  }

  clearfilter() {

    this.filter={};
    console.log(this.filter);

    this.removesegment=false;
    this.removesubsegment=false;
    this.removecategory=false;
    this.removeproductname=false;
    this.removemodel=false;
    this.removeoem=false;

    this.filterChangeHandler('all');
}

  productList(val)
  {
      this.loader=true;
      this.db.fetchData(val,'product/list').subscribe((response)=>{
        console.log(response);
        this.loader=false;
        if(response['status']=='Success')
        {
          this.productlist = response;
          this.data=this.productlist.data
          this.totalrecord=this.productlist.recordsFound;
        }
        else{
          this.div=true;
          this.data=[];
          this.productlist = response;
          this.totalrecord=this.productlist.recordsFound;

        }
      });
  }

  category_list(){
    this.db.fileData(this.filter.category,'category/list/').subscribe((response)=>{
      this.categorylist=response['data'];
      console.log(response);
    });
  } 


  productname_list(){

     this.db.fetchData({ "currentPage": this.currentPage,
    "pageSize": this.pageSize,"productName":this.filter.prod},'product/list').subscribe((response)=>{

         console.log(response);
         const distinctProductNameArr = [];

         if(response['data']) {

              for (let index = 0; index < response['data'].length; index++) {

                  const indexExist =  distinctProductNameArr.findIndex(row => row.productName == response['data'][index].productName);

                  if(indexExist == -1) {
                      distinctProductNameArr.push({productName: response['data'][index].productName});
                  }
              }
         }

         this.prodlist = distinctProductNameArr;

     });
  } 


  model_list(){
    this.db.fileData(this.filter.model,'model/list/').subscribe((response)=>{
      this.modellist=response['data'];
      console.log(response);

      console.log(this.modellist);
    });
  }  


  oem_list(){
    this.db.fileData(this.filter.oem,'oem/list/').subscribe((response)=>{
      this.oemlist=response['data'];
      console.log(response);
    });
  }
 

}
