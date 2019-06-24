import { Component, OnInit } from '@angular/core';
import { ConstantService } from 'src/app/constant.service';
import { Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog';
import * as moment from 'moment';
// import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-list-travel',
  templateUrl: './list-travel.component.html'
})
export class ListTravelComponent implements OnInit {
  filter:any={};
  forApprovel:any='1';
  user:any={};
  userType:any;
  userId:any;
  userRole:any;
  trvelPlanLIst:any=[];
  loader:any=false;
  div:any=false;
  travelStatus:any=2;

  // travelStatus:any=2;
  monthArray:any=["January",
 "February",
 "March",
 "April",
 "May",
 "June",
 "July",
 "August",
 "September",
 "October",
 "November",
 "December"];

 designationData = [

  { designationName: 'Vice President', designation: 1},
  { designationName: 'Deputy General Manager', designation: 2},
  { designationName: 'General Manager', designation: 3},
  { designationName: 'Assistant General Manager', designation: 4},
  { designationName: 'Sr Manager', designation: 5},
  { designationName: 'Manager', designation: 6},
  { designationName: 'Deputy Manager', designation: 7},
  { designationName: 'Sr Executive', designation: 8},
  { designationName: 'Executive', designation: 9},
  { designationName: 'Assistant Manager', designation: 10},
  { designationName: 'Assistant', designation: 11},
  { designationName: 'Trainee', designation: 12},
  { designationName: 'Others', designation: 13}
];
  constructor( public service:ConstantService,public route:Router,public dialog:DialogComponent) {

    this.user = JSON.parse(localStorage.getItem('user')) || [];
    console.log(this.user);
    this.userType = this.user.data.userType;
    this.userId = this.user.data.userId;
    this.userRole=this.user.data.role;
    // this.filter.createdOn='';
    this.forApprovel=2;
      this.travelStatus==2;
    if(this.userId)
    {
        this.getTravelList(this.forApprovel,this.travelStatus);
    }
    console.log(this.userType ,"&" , this.userId, "&" ,this.userRole);
   }

  ngOnInit() {
  }
  // creaatedDate:any;
 
  filterData:any={}
  getTravelList(planList,filterStatus)
  {
    console.log(planList,filterStatus);
    this.forApprovel=planList;
    
    this.travelStatus=filterStatus;
    if(this.filterData.createdOn)
    {
      this.filterData.createdOn=moment(this.filterData.createdOn).format('YYYY-MM-DD');
    }
      this.trvelPlanLIst=[];
      if(this.forApprovel==1)
      {
        this.filterData.currentPage=1;
        this.filterData.pageSize=50;
        this.filterData.createdById=this.userId;
        this.filterData.status=filterStatus;

      }
      else if(this.forApprovel==2)
      {
        this.filterData.currentPage=1;
        this.filterData.pageSize=50;
        this.filterData.createdById=undefined;
        if(this.userRole==17 && filterStatus==2)
        {
          this.filterData.status=3;
        }
        else{
          this.filterData.status=filterStatus;
        }
      }
      this.loader=true;
    this.service.fetchData(this.filterData,"travelplan/list").subscribe((result)=>{
      console.log(result);
      this.loader=false;
      if(result['status']=='Success')
      {
        this.trvelPlanLIst=result['data'];
        if(this.forApprovel==2)
        {
          const travelArray=this.trvelPlanLIst.filter(row=>row.createBy!=this.userId);
          this.trvelPlanLIst=travelArray;
        }
      }
      if(this.forApprovel==1)
      {
        if(filterStatus==2)
        {
          this.getTravelApproverList(3)
        }
        if(filterStatus==6)
        {
          this.getTravelApproverList(4)
        }
      }
      if(result['status']=='Failed')
      {
        this.div=true;
        this.trvelPlanLIst=[];
      }

    })
  }

  tmpTravelList:any=[];
  getTravelApproverList(status)
  {
    this.loader=true;
    this.filterData.status=status;
    this.filterData.createdById=this.userId;
    this.service.fetchData(this.filterData,"travelplan/list").subscribe((result)=>{
      console.log(result);
      this.loader=false;
      if(result['status']=='Success')
      {
        this.tmpTravelList=result['data'];
        this.trvelPlanLIst=this.trvelPlanLIst.concat(this.tmpTravelList);
      }
    })
  }
  clearfilter(){
    this.filterData={};
    this.filterData.createdOn=undefined;
    this.getTravelList(this.forApprovel,this.travelStatus);
  }

  detailPlan(id)
  {
    console.log("hello");
    
    this.route.navigate(['/detail-travel/'+id]);
  }

  deletePlan(id)
  {
    this.dialog.delete('Travel Plan !').then((result) => {

      if(result)
      {
        this.service.fileData("","travel/delete/"+id).subscribe((result)=>{
          console.log(result);
          if(result['status']=="Success")
          {
            // this.getTravelList('2');
          }
        })
      }
    

  })
  }
  
}
