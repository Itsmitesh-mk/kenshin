import { Component, OnInit } from '@angular/core';
import { ConstantService } from 'src/app/constant.service';
import { Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog';
import { ifStmt } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html'
})
export class TaskListComponent implements OnInit {

  user:any={};
  userType:any;
  userId:any;
  userRole:any;
  loader:any=false;
  filterarray:any=[];
  filter:any={};
  div:any=false;
  // assignedToMe:any=true;
  // name:any;
  // tasktype:any;
  // nettype:any;
  constructor(public db:ConstantService,public router:Router,public dialog:DialogComponent) {
    this.user = JSON.parse(localStorage.getItem('user')) || [];
    console.log(this.user);
    this.userType = this.user.data.userType;
    this.userId = this.user.data.userId;
    this.userRole=this.user.data.role;
    
    console.log(this.userType ,"&" , this.userId, "&" ,this.userRole);
    console.log(this.userRole);
    if(this.userRole==1){
          this.filter.assignedToMe=false;
          console.log(this.filter.assignedToMe);
        }else{
      this.filter.assignedToMe=true;
      console.log(this.filter.assignedToMe);
    }
    if(this.user)
    {
      if(this.userType)
      {
        setTimeout(() => {
          this.taskList();
        }, 500);
      }
    }
  }
  tasklist:any=[];
  rolelists:any=[];
  rolelistsales1:any=[];
  ngOnInit() {
  this.filter.status=1;
  }


  clearfilter(){
    const activitydata2 = JSON.parse(JSON.stringify(this.filter));
    delete activitydata2['role'];
        delete activitydata2['userName'];
        delete activitydata2['taskPriority'];
        console.log(activitydata2);
    this.filter=activitydata2;
    this.taskList();
  }
  rolelist(){
    this.db.fileData('','usertype/list').subscribe((response)=>{
      console.log(response);
      this.rolelists=response['data'];
      this.taskList();
      let filterrolesales= this.rolelists.filter(x => x.userTypeId==3);
      this.rolelistsales1=filterrolesales[0].roles;
      console.log(this.rolelistsales1);
    });
  }

  resquestData:any={};
  tmp_task:any=[];
  inprocess:any;
  completed:any;
  reopen:any;
taskList()
{
  console.log(this.filter.role);
  this.div=false;
  this.loader=true;
  let apiURL;
console.log(this.filter.assignedToMe);
  
  if(this.userRole==1)
  {
    console.log("admin task list");
    this.resquestData={'taskPriority':this.filter.taskPriority,'role':this.filter.role,'userName':this.filter.userName,'establishmentName':this.filter.companyname,'taskType':this.filter.tasktype,'currentPage': 1,'pageSize': 50}
    apiURL="admintask/list"
    
  }
 if(this.filter.assignedToMe==true){
    console.log("assigned to me working");
    this.resquestData={'taskPriority':this.filter.taskPriority,'role':this.filter.role,'userName':this.filter.userName,'establishmentName':this.filter.companyname,'taskType':this.filter.tasktype,'currentPage': 1,'pageSize': 50}
    apiURL="mytask/list"
  }
  if(this.filter.assignedByMe==true)
  {
    console.log("assigned by me");
    this.resquestData={'createdBy':this.userId,'taskPriority':this.filter.taskPriority,'role':this.filter.role,'userName':this.filter.userName,'establishmentName':this.filter.companyname,'taskType':this.filter.tasktype,'currentPage': 1,'pageSize': 50}
    apiURL="taskbyme/list"
  }
  if(this.filter.junoiourtask==true){
    console.log("juniour task working in esle loop");
    this.resquestData={'taskPriority':this.filter.taskPriority,'role':this.filter.role,'userName':this.filter.userName,'establishmentName':this.filter.companyname,'taskType':this.filter.tasktype,'currentPage': 1,'pageSize': 50}
    apiURL="juniourstask/list"
  }
  console.log(this.filter.status);
  this.db.fetchData(this.resquestData,apiURL).subscribe((response)=>{
      this.loader=false;
    console.log(response);
    if(response['status']=='Success'){
      this.tasklist=response['data'];
      this.filterarray=this.tasklist;
    }
    if(response['status']=='Failed')
    {
      this.tasklist=[];
      this.filterarray=[];
      this.div=true;
    }
    console.log(this.tasklist);
      let inprocesscount= this.tasklist.filter(x => x.taskStatus==1);
      this.inprocess=inprocesscount.length;
      console.log(this.inprocess);
      let inprocesscount2= this.tasklist.filter(x => x.taskStatus==2);
      this.completed=inprocesscount2.length;
      console.log(this.completed);
      let inprocesscount3= this.tasklist.filter(x => x.taskStatus==3);
      this.reopen=inprocesscount3.length;
      console.log(this.reopen);
    for(let i=0;i<this.tasklist.length;i++){   
       for(let j=0;j<this.rolelistsales1.length;j++){
         if(this.tasklist[i].role==this.rolelistsales1[j].roleId)
         {
          console.log(this.tasklist[i].role,this.rolelistsales1[j].roleId);
           this.tasklist[i].rolename=this.rolelistsales1[j].roleName;
           console.log(this.tasklist[i].rolename);
         }
       }
   }
   this.check(this.filter.status);
  })
// else{
//   this.loader=true;
//   this.db.fetchData({'taskStatus':this.filter.taskStatus,'establishmentName':this.filter.companyname,'role': this.filter.nettype,'taskType':this.filter.tasktype,'currentPage': 1,'pageSize': 50},'task/list').subscribe((response)=>{
//       this.loader=false;
//     console.log(response);
//     this.tasklist=response['data'];
//     for(let i=0;i<this.tasklist.length;i++){
//        for(let j=0;j<this.rolelistsales1.length;j++){
//         // console.log(this.tasklist[i].role,this.rolelistsales1[j].roleId);
//          if(this.tasklist[i].role==this.rolelistsales1[j].roleId)
//          {
//           console.log(this.tasklist[i].role,this.rolelistsales1[j].roleId);
//            this.tasklist[i].rolename=this.rolelistsales1[j].roleName;
//            console.log(this.tasklist[i].rolename);
//          }
//        }
//    }
//   })

// }
}

check(status){
console.log(status);
let inprocesscount2= this.filterarray.filter(x => x.taskStatus==status);
      this.tmp_task=inprocesscount2;
      console.log(this.tmp_task);
      this.tasklist=this.tmp_task;
}


goToDetail(id)
{
  console.log("hello");
  
  this.router.navigate(['/task-detail/'+id])
}

deleteTask(id)
{
  
  this.dialog.delete('Sales User  !').then((result) => {
    if(result)
    {
      this.db.fileData("","task/delete/"+id).subscribe((result)=>{
        console.log(result);
        if(result['status']=='Success')
        {
          this.taskList();
        }
      })
    }})
}

// usertaskList()
// {
// this.loader=true;
//   this.db.fetchData({"userId":this.userId},'task/list').subscribe((response)=>{
//     setTimeout (() => {
//       this.loader=false;
//   }, 700);
//     if(response['status']=="Success")
//     {
//       this.tasklist=response['data'];
//       for(let i=0;i<this.tasklist.length;i++){
//          for(let j=0;j<this.rolelistsales1.length;j++){
//           console.log(this.tasklist[i].role,this.rolelistsales1[j].roleId);
//            if(this.tasklist[i].role==this.rolelistsales1[j].roleId)
//            {
//             console.log(this.tasklist[i].role,this.rolelistsales1[j].roleId);
//              this.tasklist[i].rolename=this.rolelistsales1[j].roleName;
//              console.log(this.tasklist[i].rolename);
//            }
//          }
//      }
//     }
   
//   })
// }
}
