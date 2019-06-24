import { Component, OnInit } from '@angular/core';
import { ConstantService } from '../../constant.service';
import { Router, ActivatedRoute } from '@angular/router';
import { sessionStorage } from 'src/app/local-storage.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { RemarkModalComponent } from '../remark-modal/remark-modal.component';
import * as moment from 'moment';
import { DialogComponent } from 'src/app/dialog';
import { IfStmt } from '@angular/compiler';
@Component({
  selector: 'app-checkin-detail',
  templateUrl: './checkin-detail.component.html',
})
export class CheckinDetailComponent implements OnInit {
checkin_id:any;
loader:boolean=false;
checkin_detail:any=[];
rolelists:any=[];
sales:any=[];
followupdetail:any=[];
checkin_date:any;
userdata:any=[];
userId:any;
checkInUser:any;
  constructor(public db:ConstantService,public router:Router,public user:sessionStorage, public route:ActivatedRoute, public dialog: MatDialog,public confirm:DialogComponent) { 
    this.route.params.subscribe(params=>{
      this.userdata=this.user['user']['data'];
      this.userId=this.userdata['userid'];
      console.log(this.userId);


      console.log(params);
      this.checkin_id = params.id;
      this.checkin_date = params.date;
      console.log(this.checkin_id);
      console.log(this.checkin_date);
      if(params)
      {

        this.checkInDetail();
      }
     });
  }
  ngOnInit() {
  }


  openDialog(check){
    console.log(check);
    let checkin_data:any=[];
    checkin_data={'id':this.checkin_id,'type':check};
    const dialogRef = this.dialog.open(RemarkModalComponent,{width : '500px' ,data:checkin_data});
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.checkInDetail();
    });
  }

  checkInDetail(){
    if(this.checkin_date){
      console.log("check activity by date");
      console.log(this.checkin_date);
      console.log(this.checkin_id);
      this.loader=true;
      let value={'userId':this.checkin_id,'checkInDate':this.checkin_date,'currentPage':1,'pageSize':500};
      console.log(value);
      
      this.db.fetchData(value,'activity/list').subscribe((response)=>{
        console.log(response);
        if(response['status']=="Success"){
        this.loader=false;
      this.checkin_detail=response["data"];
      for(let i=0;i<this.checkin_detail.length;i++)
      {
        this.checkin_detail[i].checkinDuration=moment.utc(moment.duration(moment(this.checkin_detail[i].checkOutTime).diff(moment(this.checkin_detail[i].checkInTime))).asMilliseconds()).format('HH:mm')
      }
      this.checkInUser=this.checkin_detail[0].userName;
      this.convertXLSXArray();
    }else{
      this.checkin_detail=[];
    }
      this.rolelist();
    });

    }else{
      console.log("check activity by only id");
      console.log(this.checkin_id);
     this.loader=true;
    this.db.fileData(this.checkin_id,'activity/detail/').subscribe((response)=>{
      console.log(response);
      if(response['status']=="Success")
      {
      this.loader=false;
       this.checkin_detail[0]=response["data"];

       this.checkin_detail[0].checkinDuration=moment.utc(moment.duration(moment(this.checkin_detail[0].checkOutTime).diff(moment(this.checkin_detail[0].checkInTime))).asMilliseconds()).format('HH:mm')
      //  for(let i=0;i<this.checkin_detail.length;i++)
      //  {
      //  }
      }
      else
      {
        this.checkin_detail=[];
      }
    this.rolelist();
  });
    }
  }
  rolelist()
  {
  this.db.fileData('','usertype/list').subscribe((response)=>{
  console.log(response);
  this.rolelists=response['data'];
  let salespersons= this.rolelists.filter(x => x.userTypeId==2);
  this.sales=salespersons[0].roles;
  console.log(this.sales);
    // let index=this.sales.findIndex(x=>x.roleId==this.checkin_detail.userRole);
    // this.checkin_detail.roleName=this.sales[index].roleName;

  });
  }

  xLXSArray:any=[];
  convertXLSXArray()
  {
    for(let i=0;i<this.checkin_detail.length;i++)
    {
        this.xLXSArray.push({
        'Created Date':moment(this.checkin_detail[i].createdOn).format('DD-MM-YYYY'),
        'Check-In Date':moment(this.checkin_detail[i].checkInTime).format('DD-MM-YYYY'),
        'Check In Time':moment(this.checkin_detail[i].checkInTime).format('HH:mm'),
        'Check Out Time':moment(this.checkin_detail[i].checkOutTime).format('HH:mm'),
        'Check-In Duration':moment.utc(moment.duration(moment(this.checkin_detail[i].checkOutTime).diff(moment(this.checkin_detail[i].checkInTime))).asMilliseconds()).format('HH:mm'),
        'Activity Type':this.checkin_detail[i].activityModuleName,
        'User Name':this.checkin_detail[i].userName,
        'Company Name':this.checkin_detail[i].establishment,
        'Visit Objective':this.checkin_detail[i].objectivesOfVisitName,
        'Location':this.checkin_detail[i].location,
        'Remarks':this.checkin_detail[i].remarks,
        'FollowUp':(this.checkin_detail[i].isFollowUp==true?'YES':'NO'),
      })
      if(this.checkin_detail[i].isFollowUp==true)
      {
        this.xLXSArray[i]['FollowUp Date']=moment(this.checkin_detail[i].activityFollowUps[0].followUpDate).format('DD-MM-YYYY'),
        this.xLXSArray[i]['FollowUp Type']=this.checkin_detail[i].activityFollowUps[0].followUpTypeName,
        this.xLXSArray[i]['FollowUp Remarks']=this.checkin_detail[i].activityFollowUps[0].remarks,
        this.xLXSArray[i]['FollowUp Status']=(this.checkin_detail[i].activityFollowUps[0].isClosed==true?'Close':'Open')
      }




    }
  }
  exportAsXLSX():void {
    console.log(this.xLXSArray);
    this.db.exportAsExcelFile(this.xLXSArray, 'DVR SHEET');
  }
}
