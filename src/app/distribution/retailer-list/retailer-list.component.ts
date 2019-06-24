import { Component, OnInit } from '@angular/core';
import { ConstantService } from 'src/app/constant.service';
import { slideToTop } from '../../router-animation/router-animation.component';
import { sessionStorage }  from '../../local-storage.service';
import { SnackBarOverview } from 'src/app/toast';
import { DialogComponent } from 'src/app/dialog';

@Component({
  selector: 'app-retailer-list',
  templateUrl: './retailer-list.component.html',
  animations: [slideToTop()]
  // styleUrls: ['./retailer-list.component.scss']
})
export class RetailerListComponent implements OnInit {
  senddata:any;
  userdata:any=[];
  retaileList:any=[];
  tmp_retailer_list:any=[];
loader:boolean;
msg:any;
  message:any;
segmentlist:any=[];
nameOfApplicant:any;
role:any
name:any;
filter:any={};
div:any=false;
mobile:any;
  constructor(public user:sessionStorage,public toast:SnackBarOverview,public db:ConstantService,public dialog:DialogComponent) { 
    this.userdata=this.user['user']['data'];
    this.role=this.userdata['role'];
  }

  ngOnInit() {
    this.retailer_list();
    this.segment_list();
  }
  refreshlist(){
    this.retailer_list();
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
            this.retailer_list() 
          });
      }
    });
  }

  clearfilter() {

    this.filter = {};

    this. retailer_list();
}


  retailer_list(){
    this.div=false;
    this.loader=true;
    this.name=this.filter.companyname;
    this.nameOfApplicant=this.filter.nameOfApplicant;
    this.mobile=this.filter.mobile;
    if(this.userdata['userType']!=1){
      this.senddata={"isActive":true,"segments":this.filter.segment,"nameOfApplicant":this.nameOfApplicant,"contactName":this.filter.contact,"mobile":this.mobile,"establishment":this.name,"salesUserId":this.userdata['userId'],"role": 13};
      this.db.fetchData(this.senddata,'mynetwork/detail').subscribe((response)=>
    {
      console.log(response)
      if(response['status']=='Success')
      {
        this.retaileList=response['data'];
      }
      else
      {
        this.retaileList=[];
        this.div=true;
      }
      console.log(this.retaileList);
      this.loader=false;
    });
    }else{
      this.senddata={"isActive":true,"segments":this.filter.segment,"nameOfApplicant":this.nameOfApplicant,"contactName":this.filter.contact,"mobile":this.mobile,"establishment":this.name,"role": 13};
      this.db.fetchData(this.senddata,'network/list').subscribe((response)=>
    {
      console.log(response)
      if(response['status']=='Success')
      {
        this.retaileList=response['data'];

      }
      else
      {
        this.retaileList=[];
        this.div=true;
      }
      console.log(this.retaileList);
      this.loader=false;
    });
    }
    
  }
}
