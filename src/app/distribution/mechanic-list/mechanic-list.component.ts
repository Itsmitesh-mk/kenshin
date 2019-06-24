import { Component, OnInit } from '@angular/core';
import { ConstantService } from 'src/app/constant.service';
import { slideToTop } from '../../router-animation/router-animation.component';
import { sessionStorage }  from '../../local-storage.service';
import { SnackBarOverview } from 'src/app/toast';
import { DialogComponent } from 'src/app/dialog';
@Component({
  selector: 'app-mechanic-list',
  templateUrl: './mechanic-list.component.html',
  animations: [slideToTop()]
})
export class MechanicListComponent implements OnInit {
  senddata:any;
  userdata:any=[];
  wholeSalerList:any=[];
  tmp_wholesalerlist:any=[];
  loader:boolean;
  msg:any;
  message:any;
  role:any;
  nameOfApplicant:any;
  segmentlist:any=[];
  name:any;
filter:any={};
div:any=false;
mobile:any;
  constructor(public user:sessionStorage,public toast:SnackBarOverview,public db:ConstantService,public dialog:DialogComponent) { 
    this.userdata=this.user['user']['data'];
    this.role=this.userdata['role'];
  }

  ngOnInit() {
    this.Whole_saler_list();
    this.segment_list();
  }
  refreshlist(){
    this.Whole_saler_list();
    this.toast.openSucess('Refreshed successfully!','');
  }
  segment_list(){
    this.db.fileData('','segment/list/').subscribe((response)=>{
      console.log(response);
      this.segmentlist=response['data'];
    });
  }

  delete_network(id){
    console.log(id);
    this.msg="Network"
    this.dialog.delete(this.msg).then((result) => {
      console.log(result);
      if(result)
      {
        this.db.fileData(id,'network/delete/').subscribe((response)=>{
            console.log(response);
            this.message=response['message'];
            if(this.message="Network removed successfully")
            {
              this.toast.openSucess('Network removed successfully','');
            }
            else{
              this.toast.openError('Something Went Wrong Please Try Again!!','');
            }
            this.Whole_saler_list() 
          });
      }
    });
  }

  clearfilter() {

    this.filter = {};

    this. Whole_saler_list();
}

  Whole_saler_list(){
    this.div=false;
    this.name=this.filter.companyname;
  this.mobile=this.filter.mobile;
  this.nameOfApplicant=this.filter.nameOfApplicant;
    this.loader=true;
    if(this.userdata['userType']!=1){
      this.senddata={ "isActive":true,"segments":this.filter.segment,"nameOfApplicant":this.nameOfApplicant,"contactName":this.filter.contact,"mobile":this.mobile,"establishment":this.name,"salesUserId":this.userdata['userId'],"role":'15'};
      this.db.fetchData(this.senddata,'mynetwork/detail').subscribe((response)=>
    {
      console.log(response)
      if(response['status']=="Success")
      {
        this.wholeSalerList=response['data'];
      }
      if(response['status']=="Failed")
      {
        this.div=true
      }
      console.log(this.wholeSalerList);
      this.loader=false;
    });
    }else{
      this.senddata={ "isActive":true,"segments":this.filter.segment,"nameOfApplicant":this.nameOfApplicant,"contactName":this.filter.contact,"mobile":this.mobile,"establishment":this.name,"role":'15'};
      this.db.fetchData(this.senddata,'network/list').subscribe((response)=>
    {
      console.log(response)
      if(response['status']=="Success")
      {
        this.wholeSalerList=response['data'];
      }
      if(response['status']=="Failed")
      {
        this.div=true
      }
      console.log(this.wholeSalerList);
      this.loader=false;
    });
    }
    
  }
}
