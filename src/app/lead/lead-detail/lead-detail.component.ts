import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { ConstantService } from '../../constant.service';
import { Router, ActivatedRoute } from '@angular/router';
import { sessionStorage }  from '../../local-storage.service';
import { UpdateLeadComponent } from '../update-lead/update-lead.component';
import {MatDialog} from '@angular/material';
import { DialogComponent } from 'src/app/dialog';
import { SnackBarOverview } from 'src/app/toast';
@Component({
  selector: 'app-lead-detail',
  templateUrl: './lead-detail.component.html',
  animations: [slideToTop()]
})

export class LeadDetailComponent implements OnInit {
  id:any;
  lead:any={};
  role:any;
  msg:any;
  salesUsersegment:any=[];
  segmentlist:any=[];
  salesUser:any=[];
  string:any=[];
  saleslist:any=[];
  call_logs:any={};
  message:any;
  userdata:any=[];
  rolelists:any=[];
  rolelistlead:any=[];
  loader:any=false;
  territoryId:any;
  assign:any={};

  isSegmentEditClicked:any = false;
  constructor(public db: ConstantService,public dialog1:DialogComponent,public toast:SnackBarOverview,public user:sessionStorage,public router:Router, public route:ActivatedRoute,public dialog: MatDialog) { }




ngOnInit() {

      this.route.params.subscribe(params=>{
          console.log(params);
          this.id = params.id;
          console.log(this.id);
          console.log(this.user);
          this.userdata=this.user['user']['data'];
          
          this.role=this.userdata['role'];
      });

      this.show_details();
  
}




show_details() {

      this.loader=true;
      this.db.fileData(this.id,'lead/detail/').subscribe((response)=>{

          console.log(response);
          this.lead = response['data'];
          console.log(this.lead);

          setTimeout(() => {
             this.loader=false;
          }, 1000);

          this.segment_list();
          this.rolelist(); 
          // this.get_sales();
      });

      console.log(this.id);
}





territoryList:any=[];
get_sales(){
  console.log('hello');
  this.db.fileData(this.lead.pin,'territorybypin/').subscribe((response)=>{
    console.log(response);
    if(response['status']=='Success')
    {
    this.territoryId=response['data'];
      console.log(this.territoryId);
    const territoryIDs = [];
      for (let index = 0; index < this.territoryId.length; index++) {
           territoryIDs.push({'territoryIds':this.territoryId[index].territoryId});
      }


      let territoryStr = '';
      for (let index = 0; index < territoryIDs.length; index++) {
          if(index == 0) {
            territoryStr += '?territoryIds='+territoryIDs[index]['territoryIds'];
          } else {
            territoryStr += '&territoryIds='+territoryIDs[index]['territoryIds'];
          }
      }
      console.log(territoryStr);
    this.db.fetchData({},'territory/salesusers'+territoryStr).subscribe((response)=>{

          console.log(response);
          this.saleslist=response['data'];
          const role=this.saleslist.filter(x=>x.role==10)

            if(role.length!=0)
            {
                console.log(role);
                this.territoryList=role;

            }  else {

                const role=this.saleslist.filter(x=>x.role==8)
                if(role.length!=0)
                {
                    console.log(role);
                    this.territoryList=role;

                } else {

                      const role=this.saleslist.filter(x=>x.role==7)
                      if(role.length!=0)
                      {
                        console.log(role);
                        this.territoryList=role;

                      } else {

                          const role=this.saleslist.filter(x=>x.role==6)
                          if(role.length!=0)
                          {
                            console.log(role);
                            this.territoryList=role;
                          }
                      }
                }
            }


            console.log(this.territoryList);
            for(let i=0;i<this.territoryList.length;i++) {

                console.log(this.lead.salesUserID);
                console.log(this.territoryList[i].userId);
                if(this.lead.salesUserID==this.territoryList[i].userId){
                  this.assign.assignTo=this.territoryList[i].userId;
                }
            }
       })

    }
 })
}




updateAssign(){
  console.log('hello');
  console.log(this.assign);
  this.loader=true;
  this.lead.assignTo=this.assign.assignTo;
  this.lead.leadAssignTo=this.assign.assignTo;
  this.db.fetchData(this.lead,'lead/update').subscribe((response)=>{
    console.log(response);
    this.loader=false;
    this.message=response['message'];
    if(this.message=="Lead Updated successfully")
    {
      this.toast.openSucess('Updated successfully','');
    }
    else
    {
      this.toast.openError('Something went wrong Please Try Again!!','');
    }
  });
}





openEmail(check) {
  this.lead.type=check;
  console.log(check);
  console.log(this.lead);
  const dialogRef = this.dialog.open(UpdateLeadComponent,  {width: '768px', data:this.lead});
  dialogRef.afterClosed().subscribe(result => {
    this.saleslist=[];
    this.show_details();
  });
}



segment_list() {

  this.db.fileData('','segment/list/').subscribe((response)=>{

      console.log(response);
      this.segmentlist=response['data'];

      console.log(this.lead);

      if(this.lead.leadSegments && this.lead.leadSegments.length > 0) {

            for(let i=0;i<this.segmentlist.length;i++)
            {
                for(let j=0;j<this.lead.leadSegments.length;j++)
                {
                    if(this.lead.leadSegments[j]['segmentCode']==this.segmentlist[i].value)
                    {
                        this.segmentlist[i].check=true;
                    }
                }
            }
      }

      

  });
}





select_segments(value,index,event) {

        if(event.checked){

           const isIndexExist = this.salesUsersegment.findIndex(row => row.segment == value);

           if(isIndexExist == -1) {
              this.salesUsersegment.push({'leadId':this.id,'segmentCode':value,'segment':value});
           }
           console.log(this.salesUsersegment);
          
        }else{
           this.salesUsersegment.splice(index,1);
           console.log(this.salesUsersegment);
        }
    }



updateSegment() {

    this.loader = true;


    const segmentSelectedData = [];

    console.log(this.segmentlist);
    for (let index = 0; index < this.segmentlist.length; index++) {

        if (this.segmentlist[index].check) {
              segmentSelectedData.push({'leadId':this.id,'segmentCode':this.segmentlist[index].value,'segment':this.segmentlist[index].text});
        }
    }

    const segmentData = {};

    segmentData['leadId'] = this.lead.leadId;
    segmentData['leadSegments'] = segmentSelectedData;
    segmentData['leadContacts'] = this.lead['leadContacts'];

    console.log(segmentData);



    this.db.fetchData(segmentData,'lead/update').subscribe((response)=>{

          console.log(response);
          this.loader=false;
          this.message=response['message'];

          if(this.message)
          {
              this.isSegmentEditClicked = false;
              this.toast.openSucess('Segment Updated successfully','');

              this.show_details();
              // this.router.navigate(['/lead-detail/'+this.id]) ;

          } else {
            
              this.toast.openError('Something went wrong Please Try Again!!','');
          }
      });
}

convert(){
  this.msg="Lead"
  this.dialog1.convert(this.msg).then((result) => {
    if(result)
    { this.loader=true;
      this.string.push(parseInt(this.lead.leadId));
      console.log(this.string);
      this.db.fetchData({"leadIds":this.string},'lead/convert').subscribe((response)=>{
        console.log(response);
        setTimeout (() => {
          this.loader=false;
      }, 300);
        this.message=response['message'];
        if(this.message=="Lead converted successfully")
        {
          this.toast.openSucess('Lead converted successfully','');
          if( this.lead.leadRole=='11')
          {
          console.log('hi');
          this.router.navigate(['/distribution-list/']);
          }
         else if( this.lead.leadRole=='12')
          {
            console.log('hii');
          this.router.navigate(['/distribution-list/']);
          }
          else if( this.lead.leadRole=='13')
          {
            console.log('hiii');
          this.router.navigate(['/retailer-list/']);
          }
          else if( this.lead.leadRole=='14')
          {
            console.log('hiiii');
          this.router.navigate(['/engine-list/']);
          }
          else
          {
            console.log('hiiiii');
          this.router.navigate(['/mechanic-list/']);
          }
        }
        else if(this.message=="Email is not available"){
          this.toast.openError('Email Already Exist Please Enter Another Email','');
        }
      });
    }
  });
}


  rolelist() {
    
        this.loader=true;
        this.db.fileData('','usertype/list').subscribe((response)=>{

              console.log(response);
              this.loader=false;
              this.rolelists=response['data'];

              let filterrolelead= this.rolelists.filter(x => x.userTypeId==3);
              console.log(filterrolelead);

              this.rolelistlead=filterrolelead[0].roles;

              console.log(this.rolelistlead);
              console.log(this.lead.leadType);

              let filterroleleaddetail= this.rolelistlead.filter(x => x.roleId==this.lead.leadType);

              console.log(filterroleleaddetail);

              if(filterroleleaddetail.length > 0) {

                  this.lead.role_name=filterroleleaddetail[0].roleName;
                  console.log(this.lead.role_name);

              }
        });
  }



}
