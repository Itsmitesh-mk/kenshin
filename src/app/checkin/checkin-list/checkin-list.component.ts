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
  data:any={};
  dropdownSettings:any={};
  currentDate:any = new Date().toJSON().split('T')[0];
  constructor(public db:ConstantService,public user:sessionStorage) { 
    this.userdata=this.user['user']['data'];
    this.userType=this.userdata['userType'];
    this.userId=this.userdata['userId'];
    this.userRole=this.userdata['role']
    console.log(this.userdata);
    this.checkList=1;
    if(this.userdata)
    {
      this.getUserList();
      this.checkin_list();
    }
  }
  
  
  ngOnInit() {

    this.dropdownSettings = {
      
      idField: 'userId',
      textField: 'userName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
      maxHeight: 197
    };
  }

userList:any=[];
  getUserList()
  {
    this.loader=true;
    this.db.fetchData({currentPage:1,pageSize:500,userType:2},"user/list").subscribe((result)=>{
      console.log(result);
      this.loader=false;
      if(result['status']=='Success')
      {
        this.userList=result['data'];
      }
    })
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
    this.data={};
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
          this.convertXLSXArray();
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

  dvrMaxDate
  maxDate()
  {

    let diffrence;
    diffrence=(moment(this.currentDate).diff(moment(this.data.fromCheckInDate),"days"))+1;
    console.log(diffrence);
    if(diffrence<30)
    {
      this.dvrMaxDate=this.currentDate;
    }
    else{
      var myDate= moment(this.data.fromCheckInDate, "YYYY-MM-DD").add(30, 'days');
      this.dvrMaxDate=moment(myDate["_d"]).format('YYYY-MM-DD');
    }
    console.log(this.dvrMaxDate);
  }

  getMultiUserArray()
  {
    this.div=false;
    this.checkInList=[];
    console.log(this.data);
    this.loader=true;
    const filterArray={userNames:[],toCheckInDate:moment(this.data.toCheckInDate).format('YYYY-MM-DD'),fromCheckInDate:moment(this.data.fromCheckInDate).format('YYYY-MM-DD'),currentPage:1,pageSize:500};
    for(let i=0;i<this.data.userNames.length;i++)
    {
      filterArray.userNames.push(this.data.userNames[i].userName);
    }
    this.db.fetchData(filterArray,'activity/grouplist').subscribe((result)=>{
      console.log(result);
      this.loader=false
      if(result['status']=='Success')
      {
        this.checkInList=result['data'];
        this.convertXLSXArray();
      }
      if(result['status']=='Failed')
        {
          this.checkInList=[];
          this.div=true;
        }
    })
    
  }

   xLXSArray:any=[];
  convertXLSXArray()
  {

    let userName = '';
    let p=0
    for(let j=0;j<this.checkInList.length;j++)
    {
      
      for(let i=0;i<this.checkInList[j].activity.length;i++)
      {

          let visibleName = ''
          if(userName != this.checkInList[j].activity[i].userName) {
              visibleName = this.checkInList[j].activity[i].userName;
              userName = this.checkInList[j].activity[i].userName;
          } 

          this.xLXSArray.push({
          'Person Name':visibleName,
          'Created Date':moment(this.checkInList[j].activity[i].createdOn).format('DD-MM-YYYY'),
          'Check-In Date':moment(this.checkInList[j].activity[i].checkInTime).format('DD-MM-YYYY'),
          'Check In Time':moment(this.checkInList[j].activity[i].checkInTime).format('HH:mm'),
          'Check Out Time':moment(this.checkInList[j].activity[i].checkOutTime).format('HH:mm'),
          'Check-In Duration':moment.utc(moment.duration(moment(this.checkInList[j].activity[i].checkOutTime).diff(moment(this.checkInList[j].activity[i].checkInTime))).asMilliseconds()).format('HH:mm'),
          'Activity Type':this.checkInList[j].activity[i].activityModuleName,
          'Company Name':this.checkInList[j].activity[i].establishment,
          'Visit Objective':this.checkInList[j].activity[i].objectivesOfVisitName,
          'Location':this.checkInList[j].activity[i].location,
          'Remarks':this.checkInList[j].activity[i].isFollowUp==true?'YES':'NO'
        })
        if(this.checkInList[j].activity[i].isFollowUp==true)
        {
          this.xLXSArray[p]['FollowUp Date']=moment(this.checkInList[j].activity[i].activityFollowUps[0].followUpDate).format('DD-MM-YYYY'),
          this.xLXSArray[p]['FollowUp Type']=this.checkInList[j].activity[i].activityFollowUps[0].followUpTypeName,
          this.xLXSArray[p]['FollowUp Remarks']=this.checkInList[j].activity[i].activityFollowUps[0].remarks,
          this.xLXSArray[p]['FollowUp Status']=(this.checkInList[j].activity[i].activityFollowUps[0].isClosed==true?'Close':'Open')
        }
        p++;
      }
    }
  }
  exportAsXLSX():void {
    console.log(this.xLXSArray);
    this.db.exportAsExcelFile(this.xLXSArray, 'DVR SHEET');
  }
}
  
