import { Component, OnInit } from '@angular/core';
import { ConstantService } from '../../constant.service';
import { SnackBarOverview } from 'src/app/toast';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogComponent } from 'src/app/dialog';
import { sessionStorage }  from '../../local-storage.service';
import * as moment from 'moment';
@Component({
  selector: 'app-add-followup',
  templateUrl: './add-followup.component.html'
})
export class AddFollowupComponent implements OnInit {
  currentDate:any = new Date();
  constructor(public db:ConstantService,public toast:SnackBarOverview,public ses: sessionStorage,  public router:Router, 
    public route:ActivatedRoute,public dialog:DialogComponent) { }
id:any;
userdata:any=[];
rolelists:any=[];
userType:any;
distributionList:any;
lead_data:any={};
client1:any;
senddata:any; 
activitydata:any={}; 
loader:any=false;
    ngOnInit() {
      this.userdata=this.ses['user']['data'];
  this.userType=this.userdata['userType'];
  this.activitydata.userId=this.userdata['userId'];
  this.activitydata.role=this.userdata['role'];
  console.log(this.activitydata.userId);
      // this.route.params.subscribe(params=>{
      //   this.id = params.id;
      //   this.db.fetchData({"leadId":this.id},'lead/list').subscribe((response)=>{
      //   console.log(response)
      //   this.lead_data=response['data'][0];
      //   this.activitydata.referenceId=this.lead_data.leadId;
      //   console.log("check session");
      //   this.activitydata.userId=this.ses.user.data.userId;
        
      // });
      // });
      this.rolelist();
    }
    onSubmit(){
      this.loader=true;
      console.log(this.activitydata);
      console.log(this.activitydata.followUpDate);
      let nextFollowUpDate=moment(this.activitydata.followUpDate).format('YYYY-MM-DD ');
      this.activitydata.followUpDate=nextFollowUpDate;
      console.log(this.activitydata.followUpDate);


        const activitydata2 = JSON.parse(JSON.stringify(this.activitydata));
        if(activitydata2['networkId']=='OtherCustomerType'){
        delete activitydata2['networkId'];}
        console.log(activitydata2);


      this.db.fetchData(activitydata2,'followup/add').subscribe((response)=>{
        console.log(response)
        this.loader=false
        if(response['message']=="FollowUp added Successfully")
        {
          this.toast.openSucess('User added successfully','');
            this.router.navigate(['//followup-list'])
        }else{
        this.toast.openSucess(response['message'],'');}
      });
    }


    rolelist()
    {
      
    this.db.fileData('','usertype/list').subscribe((response)=>{
    console.log(response);
    this.rolelists=response['data'];
    let cllient= this.rolelists.filter(x => x.userTypeId==3);
    this.client1=cllient[0].roles;
    console.log(this.client1);
    });
    }


    getnetworklist(role){
      if(role==11){
        this.activitydata.activityModule=2
      }
      else if(role==12){
        this.activitydata.activityModule=1
      }
      else if(role==13){
        this.activitydata.activityModule=3
      }
      else if(role==14){
        this.activitydata.activityModule=4
      }
      else if(role==15){
        this.activitydata.activityModule=5
      }
    this.loader=true;
      if(this.userdata['userType']==2){
        this.senddata={"role":this.activitydata.role,"salesUserId":this.userdata['userId']};
        console.log(this.senddata);
      this.db.fetchData(this.senddata,'mynetwork/detail').subscribe((response)=>
      {
        console.log(response)
        this.loader=false;
        this.distributionList=response['data'];
        console.log(this.distributionList);
      });
      }else{
        this.senddata={"role":this.activitydata.role,};
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
}
