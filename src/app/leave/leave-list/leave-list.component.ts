import { Component, OnInit } from '@angular/core';
import { ConstantService } from 'src/app/constant.service';
import * as moment from 'moment';
import { MatDialog } from '@angular/material';
import { RemainingLeaveComponent } from '../remaining-leave/remaining-leave.component';
// import { log } from 'util';

@Component({
  selector: 'app-leave-list',
  templateUrl: './leave-list.component.html'
})
export class LeaveListComponent implements OnInit {
  // leaveType:string = "today" 
  // leaveType:string= "today";
  form:any={};
  user:any={};   
  userType:any;
  userId:any;
  userRole:any;
  username:any;
  mobile:any;
  superAdmin:any;
  userRole_name;any;
  data:any={}
  currentDate:any;
  
  loader:boolean=false;
  div:boolean=false;
  url:any;
  
  public show:boolean = false;
  public buttonName:any = 'Show';
  designationData:any=[];
  constructor(public db:ConstantService, public dialog: MatDialog) {
    this.designationData = [ 
      
      {  designationName: 'Vice President', designation: 1}, 
      {  designationName: 'Deputy General Manager', designation: 2}, 
      {  designationName: 'General Manager', designation: 3}, 
      {  designationName: 'Assistant General Manager', designation: 4}, 
      {  designationName: 'Sr Manager', designation: 5}, 
      {  designationName: 'Manager', designation: 6}, 
      {  designationName: 'Deputy Manager', designation: 7}, 
      {  designationName: 'Sr Executive', designation: 8}, 
      {  designationName: 'Executive', designation: 9}, 
      {  designationName: 'Assistant Manager', designation: 10}, 
      {  designationName: 'Assistant', designation: 11}, 
      {  designationName: 'Trainee', designation: 12}, 
      {  designationName: 'Others', designation: 13} 
    ]; 
    this.data.approvalStatus=0;
    
  }
  //  loader:any=false;
  ngOnInit() {
    
    this.user = JSON.parse(localStorage.getItem('user')) || [];
    console.log(this.user);
    this.userType = this.user.data.userType;
    this.userId = this.user.data.userId;
    this.userRole=this.user.data.role;
    this.userRole_name=this.user.data.roleName;
    this.username= this.user.data.userName;
    this.superAdmin=this.user.data.superAdmin;
    this.userType=this.user.data.userType;
    if(this.userRole!=10)
    {
    this.leaveFilter.leave=2;
    }
    else
    {
      this.leaveFilter.leave=1;

    }
    
    if(this.userId)
    {
      this.getUserLeave(this.leaveFilter.leave,this.data.approvalStatus)
    }
    
  }
  
  leaveFilter:any={}
  leaveList:any=[];
  getUserLeave(leaveType,leaveStatus)
  {
    if(this.data.startDate)
    {
      this.data.startDate=moment(this.data.startDate).format('YYYY-MM-DD');
      this.data.endDate=moment(this.data.startDate).format('YYYY-MM-DD');
    } 
    else{
      this.data.startDate=undefined
    }
    if(this.data.endDate)
    {
      this.data.endDate=moment(this.data.endDate).format('YYYY-MM-DD');
    }
    else{
      this.data.endDate=undefined;
    }
     this.div=false;
    this.leaveList=[]
    this.loader=true;
    this.data.approvalStatus=leaveStatus;
    if(leaveType==1)
    {
      this.url="getAllLeaves";
      this.currentDate=undefined;
      this.data.userID=this.userId;
    }
    else if(leaveType==2)
    {
      this.currentDate=1;
      this.url="GetAllAssignedLeaveRequests";
      this.data.userID=this.userId;
      
    }
    this.db.fetchData(this.data,this.url).subscribe((result)=>{
      console.log(result);
      this.loader=false
      if(result['message']=='Success')
      {
        this.leaveList=result['data'];
        for(let i=0;i<this.leaveList.length; i++)
        {
          console.log("test");  
          this.leaveList[i].allLeave=(moment(this.leaveList[i].endDate).diff(moment(this.leaveList[i].startDate),"days"))+1;
        }
      }
      if(this.leaveList.length==0)
      {
        this.div=true;
      }
    })
  }
  
  // currentDate:any;
  getTodayFilter(dateType)
  {    
    if(dateType==1)
    {
      this.data.startDate =undefined;
      this.data.endDate =undefined;
    }
    else{
      this.data.startDate = moment().format('YYYY-MM-DD');
      this.data.endDate=moment().format('YYYY-MM-DD');
      
    }
    this.getUserLeave(this.leaveFilter.leave,this.data.approvalStatus)
  }
  
  clearfilter()
  {
    this.data.userName=undefined;
    this.data.designation=undefined;
    this.data.startDate=undefined;
    this.data.endDate=undefined;
    this.getUserLeave(this.leaveFilter.leave,this.data.approvalStatus);
  }
  
  deleteLeaveRequest(id)
  {
    this.loader=true;
    this.db.fetchData({leaveApplicationId:id},"deleteLeaveRequest").subscribe((result)=>{
      console.log(result);
      this.loader=false;
      if(result['message']=='Success')
      {
        this.getUserLeave(this.leaveFilter.leave,this.data.approvalStatus);
      }
      
    })
  }

  getRemainingLeave()
  {
        const dialogRef = this.dialog.open(RemainingLeaveComponent, {
          width: '500px',
          data:{
          userId:this.userId
          }});
          dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            console.log('The dialog was closed');
          });
  }
  
  //   getAllDATAFROMADMINSIDE()
  //   {
  //     this.loader=true;
  //     this.db.fetchData( {'approvalStatus':3,},'getAllLeaves').subscribe((rep)=>{
  //       console.log("thias is for admin");
  //       console.log(rep);
  //       // this.loader=false
  //       this.allList=rep['data'];
  //       this.forGettingDatsFunction();
  //       this.loader=false
  //       console.log("thias is for admin");
  //     });
  //   }
  //   // 3= for all, 0=pending, 1= approved , 2= reject
  //   // {'approvalStatus':3,'leaveApplicationId':0,'designation':0,'userID':this.userId
  //   getUserLeaves1()
  //   {
  //     // this.loader=true;
  //     this.db.fetchData( {'userId':this.userId, 'approvalStatus':0,},'getAllLeaves').subscribe((rep)=>{
  
  //       console.log(rep);
  //       // this.loader=false
  //       this.allList=rep['data'];
  //       console.log(this.allList); 
  //       this.forGettingDatsFunction();
  
  //     });    
  //   }
  //   rolelist()
  //   {
  //     // this.loader=true
  //     this.db.fileData('','usertype/list').subscribe((response)=>{
  //       console.log(response);
  //       // this.loader=false;
  //       this.rolelists=response['data'];
  //       let filterrolesystem= this.rolelists.filter(x => x.userTypeId==2);
  //       this.rolelistsales1=filterrolesystem[0].roles;
  //       console.log(this.rolelistsales1);
  //       for(let i=0;i<this.users.length;i++){
  //         let systemIndex=  this.rolelistsales1.findIndex(x => x.roleId==this.users[i].role);
  //         console.log(systemIndex);
  //         if(systemIndex!=-1){
  //           this.users[i].role_name=this.rolelistsales1[systemIndex].roleName;
  //           console.log(this.users[i].role_name);
  //         }
  //       }
  //     });
  
  //   }
  
  //   deleteLeaveRequest(id,i)
  //   {
  //     // +id  {'leaveApplicationId':id}    
  //     this.db.fetchData({'leaveApplicationId':id},'deleteLeaveRequest').subscribe((r)=>{console.log(r);
  //       this.allList.splice(i);
  //     });
  //   }
  
  
  //   // ***********************   TODAY FILTER FUNCTION ***************************
  
  //   getTodayLeave()
  //   {
  
  
  //     console.log(this.form);
  //     this.loader= true;
  
  
  //     this.db.fetchData({'approvalStatus':3, 'startdate':this.currentDate},'getAllLeaves').subscribe((r)=>{
  //       console.log(r);
  //       this.allList= r['data'];
  
  //       this.forGettingDatsFunction();
  //       this.loader=false;
  //     });
  
  //   }
  //   // ***********************   ALL DATES FILTER FUNCTION ***************************
  //   getAllLeaves()
  //   {
  //     // this.getAllDATAFROMADMINSIDE();
  //     // avtrat sir
  //     // this.allList.approvalStatus = 0;
  //     console.log(this.allList.approvalStatus);
  //     this.pendingTask();
  //     // avtrat sir
  //   }  
  
  //   forGettingDatsFunction()
  //   {
  //     for(let i=0;i<this.allList.length; i++)
  //     {
  //       console.log("test");  
  //       this.allList[i].allLeave=(moment(this.allList[i].endDate).diff(moment(this.allList[i].startDate),"days"))+1;
  //     }
  //     this.loader=false;    
  //   }
  
  //   pendingActive=false;
  //   ap1_url:any;
  //   pendingTask()
  //   {
  
  //     this.loader= true;
  //     this.leaveStatus= 0 ;
  
  //     if(this.userId == 1  &&  this.superAdmin == true)
  //     {
  //       this.ap1_url = {'approvalStatus':0};
  //     }
  //     else{
  //       this.ap1_url = {'approvalStatus':0, 'userId': this.userId };
  
  //     }  
  //     this.allList= [];
  //       this.db.fetchData(this.ap1_url,'getAllLeaves').subscribe((r)=>{
  //         console.log(r);
  //         this.allList=r['data'];
  //         // this.loader= false;
  //         // alert(this.allList.approvalStatus);
  //         this.forGettingDatsFunction();
  //         this.loader= false;
  //       });
  
  //   }
  
  
  
  
  //   approvedTask()
  //   { 
  //     this.loader=true; 
  //     // this.allList= [];
  
  //     if(this.userId == 1  &&  this.superAdmin == true)
  //     {
  //       this.ap1_url = {'approvalStatus':1};
  //     }
  //     else{
  //       this.ap1_url = {'approvalStatus':1, 'userId': this.userId };
  
  //     }  
  
  
  //     this.db.fetchData(this.ap1_url,'getAllLeaves').subscribe((r)=>{
  //       console.log(r);
  //       this.allList=r['data'];
  //       // alert(this.allList.approvalStatus);
  //       this.forGettingDatsFunction();
  //       this.loader=false;
  //     });
  //   }
  
  
  //   RejectTask()
  //   { 
  //     if(this.userId == 1  &&  this.superAdmin == true)
  //     {
  //       this.ap1_url = {'approvalStatus':2};
  //     }
  //     else{
  //       this.ap1_url = {'approvalStatus':2, 'userId': this.userId };
  //     }  
  //     this.loader= true; 
  //     // this.allList= [];
  //     this.db.fetchData(this.ap1_url,'getAllLeaves').subscribe((r)=>{
  //       console.log(r);
  //       this.allList=r['data'];
  //       // alert(this.allList.approvalStatus);
  //       this.forGettingDatsFunction();
  //       this.loader=false;
  //     });
  //   }
  
  
  //   MiddelDateLeaves()
  //   {
  //       this.loader=true;
  //       // this.allList= [];
  //       this.db.fetchData( {'approvalStatus':1,'onDate': this.currentDate},'getAllLeaves').subscribe((rep)=>{
  //         console.log("this is date");
  //       console.log(rep);
  //       console.log("this is date");
  //       this.allList=rep['data'];
  //       this.forGettingDatsFunction();
  //       // this.forGettingDatsFunction();
  //       this.loader=false
  //     });
  //   }
  
  
  //   search:any={}
  //   deginationFilter(status)
  
  //     {
  //       console.log(this.search);     
  //     this.db.fetchData({'approvalStatus':status,'leaveType':this.search.leaveType,'userName':this.search.name,'designation':this.search.designation},"getAllLeaves").subscribe((r)=>{
  //      console.log("this is search function");
  //       console.log(r);
  //       this.allList= r['data'];
  //       console.log("this is search function");
  //     })
  //   }
  
  
  
  //   newArrayList:any=[];
  //   leaveTypeFunction()
  // {
  // this.loader=true
  //   this.db.fetchData({},'leave/list').subscribe((r)=>{
  //     this.loader=false
  //     console.log(r);
  //     this.newArrayList=r['data'];
  //     console.log(this.newArrayList);
  //   });
  // }
  
  // clearfilter()
  // {
  
  // }
  
  // GetAllAssignedLeaveRequests(userId){
  //   // alert(userId);
  //   if(this.leaveStatus == 0)
  //   {
  //     this.ap1_url = {'approvalStatus':0};
  //   }
  //   else if(this.leaveStatus == 1)
  //   {
  //     this.ap1_url = {'approvalStatus':1};
  //   }
  //   else if(this.leaveStatus == 2)
  //   {
  //     this.ap1_url = {'approvalStatus':2};
  //   }
  //   this.db.fetchData({'userID':userId ,'approvalStatus':3},"GetAllAssignedLeaveRequests").subscribe((r)=>{
  //     console.log("GetAllAssignedLeaveRequests");
  //     console.log(r);
  //     this.allList= r['data'];
  
  //     // this.forGettingDatsFunction();
  //     console.log("GetAllAssignedLeaveRequests");
  //   });
  // }
  
  
  
}
