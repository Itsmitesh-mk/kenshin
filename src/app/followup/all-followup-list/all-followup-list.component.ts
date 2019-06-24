import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConstantService } from 'src/app/constant.service';
import { sessionStorage } from 'src/app/local-storage.service';
import * as moment from 'moment';
import { DialogComponent } from 'src/app/dialog';
import { SnackBarOverview } from 'src/app/toast';
@Component({
  selector: 'app-all-followup-list',
  templateUrl: './all-followup-list.component.html',
  styleUrls: ['./all-followup-list.component.scss']
})
export class AllFollowupListComponent implements OnInit {
  activityId:any;
  openfollowup:any=0;
  msg:any;
  activityDetail:any=[];
  loader:any=false;
  data:any={};
  followuphistory:any=[];
  lastfollowupid:any;
  userdata:any=[];
  // currentDate = moment();
  currentDate:any = new Date().toJSON().split('T')[0];
  constructor(public alrt:DialogComponent,public parms:ActivatedRoute,public toast:SnackBarOverview,public service:ConstantService,public user:sessionStorage,public router:Router) {
    this.userdata=this.user['user']['data'];
    this.parms.params.subscribe(params=>{
      console.log(params);
      this.activityId = params.id;
      console.log(this.activityId);
      if(this.activityId)
      {
        this.getActivityDetail();
      }
  });
   }

  ngOnInit() {
  }

  createactivity(){
    this.openfollowup=0;
    this.data.activityId=this.activityDetail.activityId;
    this.data.followUpId=this.lastfollowupid;
    this.data.isClosed=true;
    this.service.fetchData(this.data,"followup/update").subscribe((result)=>{
      console.log(result);
      this.loader=false;
      if(result['status']=='Success')
      {
        this.alrt.success();
      }
    })
    localStorage.setItem('activityId', JSON.stringify(this.activityId));
          this.router.navigate(['/add-activity']);
          console.log(localStorage);
  }

  getActivityDetail()
  {
    this.loader=true;
    this.service.fetchData({'followupId':this.activityId,'currentPage': 1,'pageSize': 50},"followup/list").subscribe((result)=>{
      console.log(result);
      setTimeout (() => {
        this.loader=false;
      }, 1000);
      if(result['status']=='Success')
      {
        this.activityDetail=result['data'][0];
        console.log(this.activityDetail);
        // this.service.fileData(this.activityDetail.activityId,"activity/detail/").subscribe((result)=>{
        //   console.log(result);
        //   console.log("check data avlok for follow-ups");
        //   this.followuphistory=result['data']['activityFollowUps'];
        //   console.log(this.followuphistory);
        //   for(var k=0;k<this.followuphistory.length;k++){
        //     this.lastfollowupid=this.followuphistory[k].followUpId;
        //   }
        //   console.log("this is the last follow-up");
        //   console.log(this.lastfollowupid);
        // })
      }
    })
  }






  creatNextFollowUp()
  {
    if(this.data.nextFollowUpType!=4){
    this.loader=true;
    console.log(this.activityDetail.networkId);
    console.log(this.activityDetail.referenceId);
    if(this.activityDetail.networkId!=""){
    this.data.networkId=this.activityDetail.networkId;
  }else{
      this.data.networkId=this.activityDetail.referenceId;
    }
    this.data.activityModule=this.activityDetail.activityModule;
    this.data.activityId=this.activityDetail.activityId;
    this.data.followUpType=this.data.nextFollowUpType;
    this.data.followUpDate=moment(this.data.nextFollowUpDate).format('YYYY-MM-DD ');
    this.data.status=1;
    this.data.userId=this.userdata['userId'];
    console.log(this.data);
    this.service.fetchData(this.data,"followup/add").subscribe((result)=>{
      console.log(result);
      this.loader=false;
      if(result['status']=='Success')
      {
        this.alrt.success();
          this.router.navigate(['/followup-list']);
      }
    })
  } else {
    this.openfollowup=0;
    this.data.networkId=this.activityDetail.networkId;
    this.data.activityId=this.activityDetail.activityId;
    this.data.followUpId=this.lastfollowupid;
    this.data.isClosed=true;
    this.service.fetchData(this.data,"followup/update").subscribe((result)=>{
      console.log(result);
      this.loader=false;
      if(result['status']=='Success')
      {
        this.alrt.success();
       this.router.navigate(['/add-task']);
      }
    })
  }
  }





  
  close_followup(){
    this.msg="Follow-Up"
    this.alrt.followup(this.msg).then((result) => {
      console.log(result);
      if(result)
      {
        this.openfollowup=1;
      }
      else{
        this.openfollowup=0;
        console.log(this.activityDetail.followUpId);
        this.data.activityId=this.activityDetail.activityId;
        this.data.followUpId=this.activityDetail.followUpId;
        this.data.isClosed=true;
        this.service.fileData(this.data.followUpId,"followup/close/").subscribe((result)=>{
          console.log(result);
          this.loader=false;
          if(result['status']=='Success')
          {
            this.alrt.success();  
            this.router.navigate(['/followup-list']);
          }
        })
      }
    });
  }
}
