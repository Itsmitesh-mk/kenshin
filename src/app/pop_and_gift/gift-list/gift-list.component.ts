import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { ConstantService } from '../../constant.service';
import { DialogComponent } from 'src/app/dialog';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { VideoModalComponent } from '../video-modal/video-modal.component';

import { saveAs } from 'file-saver';
import * as XLSX from 'ts-xlsx';

@Component({
  selector: 'app-gift-list',
  templateUrl: './gift-list.component.html',
  animations: [slideToTop()]

})

export class GiftListComponent implements OnInit {
giftlist:any={};
giftlist1:any=[];
gifts:any=[];
url:any;
removegift:boolean=false;
filter:any={};
request:any;
api:any;
div:boolean=false;
loader:boolean;
user:any={}
userType:any;
userId:any;
userRole:any;
userName:any;
isTabActive:any;
eversionList:any = [];


  constructor(public db:ConstantService, public dialog:DialogComponent, public dialogs: MatDialog) {

    this.user = JSON.parse(localStorage.getItem('user')) || [];
    console.log(this.user);
    this.userType = this.user.data.userType;
    this.userId = this.user.data.userId;
    this.userRole=this.user.data.role;
    this.userName=this.user.data.userName;
    this.loader=true;
   this.giftList({"currentPage": 1,"pageSize": 50})
   }

  ngOnInit() {

      this.isTabActive = 1;
  }

  eVersionList() {

    this.loader = true;
    this.db.fetchData({"currentPage": 1,
    "pageSize": 100,
    "totalRecords": 100},'eversion/list').subscribe((response)=>{
          console.log(response);
          this.loader=false;
          if(response['status']=='Success')
          {

            this.eversionList=response['data'];
          }

    });
  }




  openDialogone(): void {
    const dialogRef = this.dialogs.open(VideoModalComponent, {
      width: '850px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
         
    });
  }


  clearfilter(){
    this.filter={};
    this.giftList({"currentPage": 1,"pageSize": 50})
    this.removegift=false;
  }
  giftList(val){
    this.db.fetchData(val,'pop/list/').subscribe((response)=>{
      console.log(response);
      this.loader=false;
      this.giftlist=response;
      if(response['status']=='Success')
      {
        this.giftlist=response;
        this.gifts=this.giftlist.data;
      }
      if(response['status']=='Failed')
      {
        this.div=true;
        this.giftlist =[];
      }
      // this.gifts=this.giftlist.data;
      this.url=this.db.dburl;
      this.request='download/document/';
      this.api=this.url+this.request;
      console.log(this.api);
      console.log(this.gifts);
    });
  }
name_list(){
  console.log('hello');
  this.db.fetchData({"name": this.filter.gift,},'pop/list/').subscribe((response)=>{
    console.log(response);
    this.giftlist1=response['data'];});
}
giftFilter(){
  this.giftList({"name": this.filter.gift,})
    this.removegift=true;
}
removegiftfilter(){
  this.filter.gift='';
  this.giftList({ "currentPage":1,
  "pageSize": 50})
  this.removegift=false;
console.log(this.filter.gift);
}

deletePop(id)
   {
     this.dialog.delete('Pop & Gift !').then((result) => {
       if(result)
       {
       console.log(id);
       this.db.fileData("","pop/delete/"+id).subscribe((result)=>{
         console.log(result);
       if(result['status']=="Success")
       {
        this.giftList({"currentPage": 1,"pageSize": 50})
       }
       })
       }})
   }


   downloadPriceList() {

          console.log("pricelist");
          
          this.dialog.downloadConfirm("Price List").then((result) => {
            console.log(result);
            if(result)
            {
                console.log("function");

                this.loader = true;

                setTimeout(() => {

                    this.db.downloadProductData({},'price/list').subscribe(result=> {

                        this.loader = false;

                        saveAs(result, 'Price List.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});

                    });
            
                }, 1000);

              
            }
          });
    }

    salesPromotionData:any=[];
    salesPromotionList()
    {
      this.db.fetchData({currentPage:1,pageSize:500,status:5},"travelplan/list").subscribe((result)=>{
        console.log(result);
        if(result['status']=='Success')
        {
          this.salesPromotionData=result['data'];
        }
      })
    }


}
