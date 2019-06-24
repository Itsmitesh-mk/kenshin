import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { ConstantService } from 'src/app/constant.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SnackBarOverview } from 'src/app/toast';
import { DialogComponent } from 'src/app/dialog';
import {MatDialog} from '@angular/material';
import { UpdateLeadComponent } from '../update-lead/update-lead.component';
import { sessionStorage }  from '../../local-storage.service';
@Component({
  selector: 'app-lead-list',
  templateUrl: './lead-list.component.html',
  animations: [slideToTop()]
})

export class LeadListComponent implements OnInit {
  
   leadlist:any=[];
   lead:any={};
   contact:any=[];
   msg:any=[];
   string:any=[];
   filter:any={};
   message:any=[];
   datarole:any={};
   statelist:any=[];
   loader:any=false;
   senddata:any;
   rejected :any= false;
   userdata:any=[];
   rolelists:any;
   client1:any=[];
   div:any=false;
  constructor(public dialog1:DialogComponent,public db: ConstantService,public router:Router,public user:sessionStorage, public route:ActivatedRoute,public toast:SnackBarOverview,public dialog:DialogComponent,public dia:MatDialog) {
    this.userdata=this.user['user']['data'];
    console.log(this.userdata.role)
    console.log("avlok role check")
    if(this.userdata.role==1){
      this.filter.status=1;
    }else{
      this.filter.status=2;
    }
   console.log(this.filter.status)
   this.filter.assignedToMe=true;
   }


  ngOnInit() {
    // this.filter.status=1;
    setTimeout(() => {
      this.leadList();
    this.rolelist();
    this.get_state();
    }, 500);
    this.string=[];
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

  rolelist(){
    this.db.fileData('','usertype/list').subscribe((response)=>{
      console.log(response);
      this.rolelists=response['data'];
      let cllient= this.rolelists.filter(x => x.userTypeId==3);
      this.client1=cllient[0].roles;
      console.log(this.client1);
    });
  }




  convert() {

    console.log("avlok");
    this.loader=true;
    this.msg="Lead"
    this.dialog1.convert(this.msg).then((result) => {
      if(result)
      {

        for(var j=0;j<this.leadlist.length;j++){
            this.string.push(this.leadlist[j].leadId);
        }

        console.log(this.string);
        this.db.fetchData({"leadIds":this.string},'lead/convert').subscribe((response)=>{

            console.log(response);
            // this.loader=false;
            this.string=[];
            this.message=response['message'];

            if(response['status']=='Success')
            {
                  this.toast.openSucess('Lead converted successfully','');
                  console.log(this.datarole.role);
                  if( this.datarole.role==11)
                  {
                    this.router.navigate(['/wholesaler-list/']);
                  }
                  else if(this.datarole.role==12)
                  {
                    this.router.navigate(['/distribution-list/']);
                  }
                  else if(this.datarole.role==13)
                  {
                    this.router.navigate(['/retailer-list/']);
                  }
                  else if(this.datarole.role==14)
                  {
                    this.router.navigate(['/engine-list/']);
                  }
                  else
                  {
                    this.router.navigate(['/mechanic-list/']);
                  }

            } else if(response['status']=='Failed') {
                //  this.toast.openError(response['message'],'');
                this.dialog.alertWarning("Email or Mobile No is Already Exist");
            }
      });
    }
    });this.loader=false;
  }
  


  
  leadList()
  {
        this.leadlist=[];
        this.div=false;
        this.loader=true;
        console.log(this.datarole.role);
        if(!this.datarole.role && this.datarole.role!=0)
        { 
            this.datarole.role=12;
            console.log(this.datarole.role);
        }
        console.log(this.filter.status);
        console.log(this.filter);
        // if(!this.filter || !this.filter.status) {
        //     this.filter.status = 1;
        // }
        if(this.userdata['userType'] != 1) {
              setTimeout(() => {
                  console.log(this.datarole.role);
                  if(this.filter.createdbyme==true)
                  {
                  this.senddata = {'createdBy':this.userdata['userId'],'filterOnAssignTo':false,'establishment':this.filter.establishment,'mobile':this.filter.mobile,"currentPage": 1,'state':this.filter.state,"pageSize": 500};
                  }else
                  {
                    this.senddata = {'userId':this.userdata['userId'],'establishment':this.filter.establishment,'mobile':this.filter.mobile,"currentPage": 1,'state':this.filter.state,'status':this.filter.status,"pageSize": 500,'leadType':this.datarole.role,'rejected':this.rejected,'filterOnAssignTo':true,'isActive':1};
                  }
                  this.db.fetchData(this.senddata,'lead/list').subscribe((response)=>{
                          console.log(response);
                          this.loader=false;
                          if(response['status']=='Success')
                          {
                              this.leadlist=response['data'];
                              console.log(this.leadlist);
                          }
                          if(response['status']=='Failed')
                          {
                              this.div=true;
                          }
                  });
              }, 500);
        } else {
          setTimeout(() => {
                console.log(this.filter.status);
                if(this.filter.status==4){
                  this.rejected=true;
                }
                this.senddata={'establishment':this.filter.establishment,'mobile':this.filter.mobile,"currentPage": 1,"pageSize": 500,'state':this.filter.state,'status':this.filter.status,'leadType':this.datarole.role,'rejected':this.rejected,'isActive':1};
                this.db.fetchData(this.senddata,'lead/list').subscribe((response)=>{
                      console.log(response);
                      this.loader=false;
                      if(response['status']=='Success')
                      {
                        this.leadlist=response['data'];
                        console.log(this.leadlist);
                      }
                      if(response['status']=='Failed')
                      {
                        this.div=true;
                      }
                });
          }, 500);
        }
  }


  clearfilter() {
         this.filter.establishment = '';
         this.filter.mobile = '';
         this.filter.state = '';
         this.leadList();
  }



  delete_lead(id){
    console.log(id);
    this.msg="Lead"
    this.dialog.delete(this.msg).then((result) => {
      console.log(result);
      if(result)
      {
        this.db.fileData(id,'lead/delete/').subscribe((response)=>{
            console.log(response);
            this.message=response['message'];
            if(this.message="Lead removed successfully")
            {
              this.toast.openSucess('Lead removed successfully','');
            }
            else{
              this.toast.openError('Something Went Wrong Please Try Again!!','');
            }
            this.leadList();
          });
      }
    });
  }
 


  openEmail(check,leadid){
    this.lead.type=check;
    this.lead.leadId=leadid;
    console.log(this.lead);
    const dialogRef = this.dia.open(UpdateLeadComponent,{ data:this.lead});
    dialogRef.afterClosed().subscribe(result => {
      this.leadList();
    });
    this.leadList();
  }

  isLeadRead(leadId)
  {
    if(this.userdata['userType']==1)
    {
      this.db.fileData("","lead/read/"+leadId).subscribe((result)=>{
        console.log(result);
        if(result['status']=='Success')
        {
          this.leadList();
        }
      })
    }
  }
}
