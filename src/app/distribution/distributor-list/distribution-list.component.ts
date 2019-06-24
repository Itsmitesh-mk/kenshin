import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { ConstantService } from 'src/app/constant.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SnackBarOverview } from 'src/app/toast';
import { DialogComponent } from 'src/app/dialog';
import { sessionStorage }  from '../../local-storage.service';

@Component({
  selector: 'app-distribution-list',
  templateUrl: './distribution-list.component.html',
  animations: [slideToTop()]

})

export class DistributionListComponent implements OnInit {
// filter:any={};
tmp_distributorlist:any=[];
distributionList:any=[];
loader:boolean;
msg:any=[];
senddata:any;
userdata:any=[];
nameOfApplicant:any;
segmentlist:any=[];
message:any=[];
role:any;
name:any;
statelist:any=[];
filter:any={};
mobile:any;
div:boolean=false;
userType:any;

  constructor(public db:ConstantService,public user:sessionStorage, public route:ActivatedRoute, public toast:SnackBarOverview,public dialog:DialogComponent) {
    this.userdata=this.user['user']['data'];
    this.role=this.userdata['role'];
    this.userType=this.userdata['userType'];
   }

  ngOnInit() {
      this.distribution_list();
  }


  
  refreshlist(){
    this.distribution_list();
    this.toast.openSucess('Refreshed successfully!','');
  }


clearfilter() {

    this.filter = {};

    this.distribution_list();
}




distribution_list() {

        console.log(this.filter.segment);
        this.loader=true;
        this.name=this.filter.companyname;
        this.nameOfApplicant=this.filter.nameOfApplicant;
        this.mobile=this.filter.mobile;
        if(this.userdata['userType']!=1) {

              this.senddata = {"segments":this.filter.segment,'state':this.filter.state,"nameOfApplicant":this.nameOfApplicant,"isActive":true,"mobile":this.mobile,"contactName":this.filter.contact,"establishment":this.name,"salesUserId":this.userdata['userId'],"role":12,"currentPage": 1,"pageSize": 50};

              
              this.db.fetchData(this.senddata,'mynetwork/detail').subscribe((response)=>
              {
                    console.log(response)
                 
                    if(response['status']=="Success")
                    {
                      this.distributionList=response['data'];
                      console.log(this.distributionList);
                    }
                    else
                    {
                      this.distributionList=[];
                      this.div=true;
                    }
                    setTimeout(() => {
                      this.loader=false;

                      this.segment_list();
                      this.get_state();

                    }, 500);
                   

              });


        } else {


              this.senddata={"segments":this.filter.segment,"isActive":true,'state':this.filter.state,"nameOfApplicant":this.nameOfApplicant,"currentPage":1,
                "pageSize":100,"mobile":this.mobile,"establishment":this.name,"role":12,"contactName":this.filter.contact};

              this.db.fetchData(this.senddata,'network/list').subscribe((response)=>
              {
                    console.log(response)
                    if(response['status']=="Success")
                    {
                      this.distributionList=response['data'];
                      console.log(this.distributionList);
                    }
                    else
                    {
                      this.distributionList=[];
                      this.div=true;
                    }
                    console.log(this.distributionList);
                    setTimeout(() => {
                      this.loader=false;

                      this.segment_list();
                      this.get_state();

                    }, 500);

              });
        }
}


get_state(){
  this.loader=true;
  this.db.fileData('','state/list/').subscribe((response)=>{
    console.log(response);
    this.loader=false;
    this.statelist=response['data'];
    // this.shippingState=response['data'];
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
          if(this.message=="Network removed successfully")
          {
            this.toast.openSucess('Network removed successfully','');
          }
          else{
            this.toast.openError('Something Went Wrong Please Try Again!!','');
          }
          this.distribution_list() 
        });
    }
  });
}


segment_list(){
  this.db.fileData('','segment/list/').subscribe((response)=>{
    console.log(response);
    this.segmentlist=response['data'];
  });
}
}
