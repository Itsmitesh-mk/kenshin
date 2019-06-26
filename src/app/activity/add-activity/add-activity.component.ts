import { Component, OnInit, Inject, ElementRef, PLATFORM_ID  } from '@angular/core';
import { ConstantService } from '../../constant.service';
import { Router, ActivatedRoute } from '@angular/router';
import { slideToTop } from '../../router-animation/router-animation.component';
import {MatDialog} from '@angular/material';
import { SnackBarOverview } from 'src/app/toast';
import { sessionStorage }  from '../../local-storage.service';
import * as moment from 'moment';
import { isPlatformBrowser } from '@angular/common';
import * as $ from 'jquery';

@Component({
  selector: 'app-add-activity',
  templateUrl: './add-activity.component.html', 
  animations: [slideToTop()]
})
export class AddActivityComponent implements OnInit {
  userdata:any=[];
  loader:boolean;
  senddata:any;  
  message:any;
  userType:any;
  datenotvalid:any=false;
  dateoutnotvalid:any=false;
  leadlist:any;
  distributionList:any;
  rolelists:any;
  client1:any;
  activityData:any={};
  clientrole:any;
  timecheckinfirst:any='6:00';
  timecheckinlast:any='22:00';
  timecheckoutfirst:any='7:00';
  timecheckoutlast:any='23:00';
  other:any=false;
  currentDate:any = new Date().toJSON().split('T')[0];
  constructor(public db:ConstantService,public router:Router,public user:sessionStorage,public route:ActivatedRoute, public dialog: MatDialog,public toast:SnackBarOverview,@Inject(PLATFORM_ID) private platformId: Object) {
  }
  
  ngOnInit(){
    this.rolelist();
    this.userdata=this.user['user']['data'];
    this.userType=this.userdata['userType'];
    this.activityData.userId=this.userdata['userId'];
    console.log(this.activityData.userId);
  }
  
  
  
  rolelist()
  {
    this.other=false;
    this.db.fileData('','usertype/list').subscribe((response)=>{
      console.log(response);
      this.rolelists=response['data'];
      let cllient= this.rolelists.filter(x => x.userTypeId==3);
      this.client1=cllient[0].roles;
      console.log(this.client1);
    });
  }
  
  
  
  get_data(roleId){
    console.log(roleId);
    console.log(this.activityData);
    this.clientrole=roleId;
    this.activityData.role=this.clientrole;
    this.activityData.activityModule=1;
    console.log("get network based on role"+this.activityData.role);
  }
  
  getleadlist(){
    this.loader=true;
    if(this.userdata['userType']==2){
      this.senddata={"leadrole":this.activityData.leadrole,"userId":this.userdata['userId'],"currentPage": 1,"pageSize": 50};
    }else{
      this.senddata={"leadrole":this.activityData.leadrole,"currentPage": 1,"pageSize": 50};
    }
    this.db.fetchData(this.senddata,'lead/list').subscribe((response)=>{
      console.log(response);
      this.loader=false;
      this.leadlist=response['data'];
      console.log(this.leadlist);
    });
  }
  
  
  
  
  
  
  networkLeadList:any=[]
  getnetworklist(role){
    this.distributionList=[];
    this.networkLeadList=[]
    if(role==11){
      this.activityData.activityModule=2
    }
    else if(role==12){
      this.activityData.activityModule=1
    }
    else if(role==13){
      this.activityData.activityModule=3
    }
    else if(role==14){
      this.activityData.activityModule=4
    }
    else if(role==15){
      this.activityData.activityModule=5
    }
    else{
      this.activityData.activityModule=6

    }
    this.loader=true;
    if(role==12)
    {
      console.log(role);
      
      if(this.userdata['userType']==2){
        this.senddata={"role":this.activityData.role,"salesUserId":this.userdata['userId']};
        console.log(this.senddata);
        this.db.fetchData(this.senddata,'mynetwork/detail').subscribe((response)=>
        {
          console.log(response)
          this.loader=false;
          this.distributionList=response['data'];
          console.log(this.distributionList);
        });
      }else{
        this.senddata={"role":this.activityData.role,};
        console.log(this.senddata);
        this.db.fetchData(this.senddata,'network/list').subscribe((response)=>
        {
          console.log(response)
          this.loader=false;
          this.distributionList=response['data'];
          console.log(this.distributionList);
        });
      }
    }
    else{
      console.log(role);
      if(this.userdata['usreType']==2)
      {
        
        this.db.fetchData({'createdBy':this.userdata['userId'],'filterOnAssignTo': false,"currentPage": 1,"pageSize": 500,'leadType':role,'isActive':1},"lead/list").subscribe((result)=>{
          console.log(result);
          if(result['status']=='Success')
          {
            this.networkLeadList=result['data'];
          }
          
        })
      }
      else{
        this.db.fetchData({"currentPage": 1,'filterOnAssignTo': false,"pageSize": 500,'leadType':role,'isActive':1},"lead/list").subscribe((result)=>{
          console.log(result);
          if(result['status']=='Success')
          {
            this.networkLeadList=result['data'];
          }
          
        })
      }
    }
    this.loader=false
  }
  
  
  
  
  
  locationlist:any=[];
  getlocation(){
    this.activityData.activityDate==moment(this.activityData.activitydate).format('YYYY-MM-DD');
    console.log(this.activityData.activitydate);
    this.db.fetchData({'visitDate':this.activityData.activitydate},'location/list').subscribe((response)=>
    {
      console.log(response)
      this.loader=false;
      this.locationlist=response['data'];
      console.log(this.locationlist);
    });
  }
  
  
  
  
  check1(time){
    console.log("check in time validation");
    console.log(this.activityData.activitydate)
    const activityDate = moment(this.activityData.activitydate).format('Y-MM-D');
    console.log(activityDate);
    
    this.activityData.activityInTime = moment(this.activityData.activityInTime).format('HH:mm');
    var checkinTimeSelected = new Date(activityDate + ' ' + this.activityData.activityInTime+':00').getTime();
    
    console.log(checkinTimeSelected); 
    
    console.log('Checkin Validate Start Time');
    
    const checkinTime1 = moment(activityDate+ ' 06:00:00').format('Y-MM-D H:mm:ss');
    var checkinMinimumTime = new Date(checkinTime1).getTime();
    
    const checkinTime2 = moment(activityDate+ ' 23:00:00').format('Y-MM-D H:mm:ss');
    var checkinMaximumTime = new Date(checkinTime2).getTime();
    
    console.log(checkinMinimumTime);
    console.log(checkinMaximumTime);
    
    if (checkinMinimumTime > checkinTimeSelected || checkinTimeSelected  > checkinMaximumTime) {
      this.datenotvalid=true;
      console.log(this.activityData.activityInTime);
    } else{
      this.datenotvalid=false;
      this.activityData.activityInTime=time;
      console.log(this.activityData.activityInTime);
    }
    
  }
  
  check2(time2){
    console.log("check out time validation")
    console.log(this.activityData.activityOutTime)
    console.log(moment(this.activityData.activityOutTime).format('hh:mm'));
    const activityDate = moment(this.activityData.activityOutTime).format('Y-MM-D');
    console.log(activityDate);
    
    
    this.activityData.activityOutTime = moment(this.activityData.activityOutTime).format('HH:mm');
    var checkoutTimeSelected = new Date(activityDate + ' ' + this.activityData.activityOutTime+':00').getTime();
    
    console.log(checkoutTimeSelected); 
    
    console.log('Checkin Validate Start Time');
    
    const checkinTime1 = moment(activityDate+ ' 07:00:00').format('Y-MM-D H:mm:ss');
    var checkinMinimumTime = new Date(checkinTime1).getTime();
    
    const checkinTime2 = moment(activityDate+ ' 23:00:00').format('Y-MM-D H:mm:ss');
    var checkinMaximumTime = new Date(checkinTime2).getTime();
    
    console.log(checkinMinimumTime);
    console.log(checkinMaximumTime);
    
    if (checkinMinimumTime > checkoutTimeSelected || checkoutTimeSelected  > checkinMaximumTime) {
      this.dateoutnotvalid=true;
      console.log(this.activityData.activityOutTime);
    } else{
      this.dateoutnotvalid=false;
      this.activityData.activityOutTime=time2;
      console.log(this.activityData.activityOutTime);
    }
    
  }
  
  
  
  type:any;
  othercustomer:any;
  onSubmit(){
    
    console.log(this.activityData);
    let checkInTime=moment(this.activityData.activityInTime).format('HH:mm');
    console.log(checkInTime);
    let checkOutTime=moment(this.activityData.activityOutTime).format('HH:mm')
    console.log(checkOutTime);
    
    let inTime=moment(this.activityData.activitydate).format('YYYY-MM-DD')+' '+checkInTime;
    console.log(inTime);
    
    let outTime=moment(this.activityData.activitydate).format('YYYY-MM-DD')+' '+checkOutTime;
    console.log(outTime);
    
    this.activityData.networkId=this.activityData.referenceId;
    if(this.activityData.nextFollowUpType==4){
      this.type=this.activityData.nextFollowUpType;
      this.activityData.nextFollowUpType='';
    } 
    if(this.activityData.referenceId==10){
      this.othercustomer=this.activityData.referenceId;
      this.activityData.referenceId='';
    }
    if(this.activityData.activityInTime<this.activityData.activityOutTime){
      this.activityData.status=1;
      this.activityData.activityDate=moment(this.activityData.activityDate).format('YYYY-MM-DD');
    }
    
    
    console.log(this.activityData.activityInTime);
    // var date=this.activityData.activitydate;
    // var inTime=this.activityData.activityInTime;
    // var outTime=this.activityData.activityOutTime;
    // console.log(date,inTime);
    // var inDateTime=date+"T"+inTime;
    this.activityData.checkInTime=inTime;
    // var outDateTime=date+"T"+outTime;
    this.activityData.checkOutTime=outTime;
    // console.log(inDateTime,outDateTime);
    
    
    if(this.activityData.nextFollowUpDate){
      this.activityData.isFollowUp=true;
      this.activityData.nextFollowUpDate=moment(this.activityData.nextFollowUpDate).format('YYYY-MM-DD');
    }
    else{
      this.activityData.isFollowUp=false;
    }
    
    console.log(this.activityData);
    const activityTempArr = JSON.parse(JSON.stringify(this.activityData));
    if(this.type==4){
      delete activityTempArr['nextFollowUpType'];
    }
    console.log(this.othercustomer);
    if(this.othercustomer==10){
      delete activityTempArr['networkId'];
      delete activityTempArr['referenceId'];
    }
    console.log(activityTempArr);
    
    // return;
    this.db.fetchData(activityTempArr,'activity/add').subscribe((response)=>
    {
      console.log(response)
      this.loader=false;
      this.message=response['message'];
      if(response['status']=='Success')
      {
        if(this.type!=4){
          this.toast.openSucess('Activity added successfully','');
          this.router.navigate(['/checkin-list']);
        }else{
          this.toast.openSucess('Activity added successfully','');
          this.router.navigate(['/add-task']);
        }
      }
      else
      {
        this.toast.openError('Activity Not Added !!','');
      };
    });
    
  }
  
  
  
  
  
  setFocus(form) {
    console.log(form.controls);
    for (var key in form.controls)
    {
      if (form.controls.hasOwnProperty(key)) {
        if(form.controls[key].status=='INVALID')
        {
          if (isPlatformBrowser(this.platformId)) {
            console.log("hii");
            $('#'+key).focus();
          }
          console.log(key);
          return true;
        }
        console.log(key + " -> " + form.controls[key].status);
      }
    }
  }
  
  oherType()
  {
    this.other=true;
  }
}
