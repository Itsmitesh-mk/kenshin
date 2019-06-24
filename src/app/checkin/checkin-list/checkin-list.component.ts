import { Component, OnInit } from '@angular/core';
import { ConstantService } from 'src/app/constant.service';
// import * as moment from 'moment';
import { slideToTop } from '../../router-animation/router-animation.component';
import { sessionStorage } from 'src/app/local-storage.service';
import * as moment from 'moment';
@Component({
  selector: 'app-checkin-list',
  templateUrl: './checkin-list.component.html',
})
export class CheckinComponent implements OnInit {
  checkInList:any=[];
  loader:boolean;
  name:any;
  filter:any={};
  date:any;
  userType:any;
  removename:boolean=false;
  userId;
  rolelists:any=[];
  module:any;
  role:any;
  sales:any=[];
  userdata:any[];
  div:any=false;
  checkList:any;
  userRole:any;
  constructor(public db:ConstantService,public user:sessionStorage) { 
    this.userdata=this.user['user']['data'];
    this.userType=this.userdata['userType'];
    this.userId=this.userdata['userId'];
    this.userRole=this.userdata['role']
    console.log(this.userdata);
    this.checkList=1;
    if(this.userdata)
    {

      this.checkin_list();
    }
  }
  
  
  ngOnInit() {
  }
  
  requesData:any={};
  rolelist()
  {
    this.db.fileData('','usertype/list').subscribe((response)=>{
      console.log(response);
      this.rolelists=response['data'];
      let salespersons= this.rolelists.filter(x => x.userTypeId==2);
      this.sales=salespersons[0].roles;
      console.log(this.sales);
      console.log(this.checkInList.length);
      for(let i=0;i<this.checkInList.length;i++){
        let index=this.sales.findIndex(x=>x.roleId==this.checkInList[i].userRole);  
        console.log(index);
        if(index==-1){
          this.checkInList[i].roleName="";   
        }
        else{
          this.checkInList[i].roleName=this.sales[index].roleName;
        }
      }
    });
  }
  
  clearfilter(){
    this.filter={};
    this.filter.date=undefined;
    this.createddate=undefined;
    this.checkin_list();
  }
  removenamefilter(){
    console.log("hii");
    this.filter.companyname="";
    this.checkin_list();
  }
  datechangedbyadmin:any;
  createddate:any;
  checkin_list()
  {
    
    this.div=false;
    if(this.filter.date) 
    {
      this.createddate=moment(this.filter.date).format('YYYY-MM-DD');
    }
    else
    {
      this.createddate=undefined
    } 
    console.log(this.filter.date,this.createddate);
    this.name=this.filter.companyname;
    this.role=this.filter.role;
    this.module=this.filter.module;
    if(this.name){
      this.removename=true
    }
    else{
      this.removename=false;
    }
    this.loader=true;
    if(this.userType==1)
    {
      this.requesData={'checkInDate':this.createddate,'userName':this.filter.userName,"userRole":this.role,"networkEstablishment":this.name,"activityModule":this.module, "currentPage": 1,
      "pageSize": 500}
      this.db.fetchData(this.requesData,'activity/grouplist').subscribe((response)=>{
        console.log(response);
        this.loader=false;
        
        if(response['status']=='Success')
        {
          this.div=false;
          this.checkInList=response['data'];
        }
        if(response['status']=='Failed')
        {
          this.checkInList=[];
          this.div=true;
        }
      });
    }
    else{
      this.requesData={'createdOn':this.createddate,"userRole":this.role,"networkEstablishment":this.name,"activityModule":this.module, "currentPage": 1,
      "pageSize": 500}
      if(this.checkList==1)
      {
        this.requesData.userId=this.userId
      }
      this.db.fetchData(this.requesData,'activity/list').subscribe((response)=>{
        console.log(response)
        this.loader=false
        if(response['status']=='Success')
        {
          this.checkInList=response['data'];

          if(this.checkList==2)
          {
            const checkinArray=this.checkInList.filter(row=>row.userId!=this.userId)
            this.checkInList=checkinArray;
          }
          this.div=false;
        }
        if(response['status']=='Failed')
        {
          this.checkInList=[];
          this.div=true;
        }
      });
    }
    
  }
  
}