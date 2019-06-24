import { Component, OnInit } from '@angular/core';
import { ConstantService } from '../../constant.service';
import { SnackBarOverview } from 'src/app/toast';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogComponent } from 'src/app/dialog';
// import moment = require('moment');
import * as moment from 'moment';
@Component({
  selector: 'app-assigntask',
  templateUrl: './assigntask.component.html',
  styleUrls: ['./assigntask.component.scss']
})
export class AssigntaskComponent implements OnInit {
  rolelists:any=[];
  rolename:any;
  loader:boolean;
  taskForm:any={};
  salesid:any=[];
  rolelisttask:any=[];
  distributorList:any=[];
  segments:any=[];
  salesList:any=[];
  networklist:any=[];
  segdata:any=[];
  distlist:any=[];
  message:any;
  id:any;
  currentDate=new Date();
  constructor(public db:ConstantService,public toast:SnackBarOverview,  public router:Router, 
    public route:ActivatedRoute,public dialog:DialogComponent) { }
    ngOnInit() {
        this.route.params.subscribe(params=>{
              console.log(params);
              this.id = params.id;
              console.log(this.id);
              this.db.fetchData({"leadId":this.id},'lead/list').subscribe((response)=>{
                    console.log(response)
                    this.networklist=response['data'][0];
                    console.log(this.networklist);
                    this.taskForm.distributor=this.networklist.establishment;
                    console.log(this.taskForm.distributor);
                    this.getDistributorList(this.id);
              });
        });
    }

  
    getDistributorList(id) {

        console.log(id);
        this.loader=true;
        this.db.fetchData({"leadId":id},'lead/list').subscribe((response)=>{
              console.log(response);
              this.loader=false;
              this.distributorList=response['data'];
              this.distlist=response['data'][0];
              this.segments=response['data'][0]['leadSegments'];
              console.log(this.distributorList);
              console.log(this.segments)
           
              for( var j=0;j<this.segments.length;j++){
                this.segdata.push(this.segments[j].segmentCode);
              }
              console.log(this.segdata);
              this.getSalesList( this.distlist.pin);
        });
    }




    getSalesList(pin) {
          this.loader=true;
          console.log(pin);
          console.log(this.segdata);
          this.db.fetchData({'pinCode':pin,'segments':this.segdata},'territory/list').subscribe((response)=>{
                console.log(response);
                this.loader=false;
                this.salesid=response['data'];
                console.log(this.salesid);
          });
          
    }




    sale() {
        this.loader=true;
        console.log(this.taskForm.tid);
          this.db.fetchData({},'territory/salesusers?territoryIds='+this.taskForm.tid).subscribe((response)=>{
                console.log(response);
                this.loader=false;
                this.salesList=response['data'];
                console.log("check data");
                console.log("check htis"+this.salesList);
                
                
          });
        this.taskForm.salesid=this.salesid;
    }




    onSubmit()  {
          this.loader=true;
          console.log(this.taskForm);
          this.db.fetchData(
            {
                "leadId": this.id,
                "userId": this.taskForm.sales,
                "remarks": this.taskForm.remarks,
                "deadline":moment(this.taskForm.deadline).format('YYYY-MM-DD'),
                "taskPriority":this.taskForm.taskPriority
            }, 'lead/assign').subscribe((response) => {
                    console.log(response);
                    this.loader=false;
                    if(response['status']=='Success')
                    {
                      this.toast.openSucess('Task assign successfully','');
                      this.router.navigate(['/task-list'])
                    }
                    this.message=response['message'];
           });
    }
}
