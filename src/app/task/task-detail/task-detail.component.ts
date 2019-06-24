import { Component, OnInit, Input } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { ConstantService } from '../../constant.service';
import { Router, ActivatedRoute } from '@angular/router';
import {MatDialog} from '@angular/material';
import { SnackBarOverview } from 'src/app/toast';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { DialogComponent } from 'src/app/dialog';
import { UpdateNetworkComponent } from '../../distribution/update-network/update-network.component';
// import { NavigationComponent } from '../../navigation/navigation.component';
// import { Navigation } from 'selenium-webdriver';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
})
export class TaskDetailComponent implements OnInit {
  task_id:any;
  loader:any=false;
  taskdetail:any={};
  data:any={};
  user:any={};
  userType:any;
  taskdata:any={};
  userId:any;
  userRole:any;
  // @Input NavigationComponent
  constructor( public alrt:DialogComponent,public db:ConstantService,public router:Router, public route:ActivatedRoute, public dialog: MatDialog,public toast:SnackBarOverview) {
    // this.loader=true;
    this.route.params.subscribe(params=>{
    console.log(params);
    this.task_id = params.id;
    console.log(this.task_id);
   });
    this.user = JSON.parse(localStorage.getItem('user')) || [];
    console.log(this.user);
    this.userType = this.user.data.userType;
    this.userId = this.user.data.userId;
    this.userRole=this.user.data.role;
    console.log(this.userType ,"&" , this.userId, "&" ,this.userRole);
    this.rolelist();
  }



  ngOnInit(){
  }



  roleName:any;
  task_detail(){
    this.loader=true;
    this.db.fileData('','task/detail/'+this.task_id).subscribe((response)=>{
      console.log(response);
      setTimeout (() => {
        this.loader=false;
    }, 700);
      if(response['status']=="Success")
      {
        this.taskdetail=response['data'];
        console.log(this.taskdetail);
        for(let i=0;i<this.rolelistsales1.length;i++)
        {
          if(this.taskdetail['role']==this.rolelistsales1[i]['roleId'])
          {
            this.roleName=this.rolelistsales1[i]['roleName'];
          }
        }
        console.log(this.roleName);
      }
    });
  }



  


  UpdateRemark(uid)
  {
    let value={"taskId":uid,"remarks": this.data['remarks'],"taskStatus":1,"userId":this.userId}
    this.data.taskId=uid;
    this.data.userId=this.userId;
    console.log(this.data);
    this.db.fetchData(value,"taskdetail/add").subscribe((result)=>{
      console.log(result);
      if(result['status']=='Success')
      {
        this.data={};
        this.toast.openSucess("Remark Update","SuccessFully");
        this.task_detail();
        this.taskaction.action=null;
      }
    })
  }



  tasklist:any=[];
  rolelists:any=[];
  rolelistsales1:any=[];
  rolelist(){
    this.db.fileData('','usertype/list').subscribe((response)=>{
      console.log(response);
      if(response['status']=='Success')
      {
        this.rolelists=response['data'];

      }
      this.task_detail();
      let filterrolesales= this.rolelists.filter(x => x.userTypeId==2);
      this.rolelistsales1=filterrolesales[0].roles;
      console.log(this.rolelistsales1);
    });
  }




msg:any
  delete_remarks(id){
    console.log(id);
    this.msg="remark"
    this.alrt.delete(this.msg).then((result) => {
      console.log(result);
      if(result)
      {
        this.db.fetchData({},'taskdetail/delete/'+id).subscribe((response)=>{
          console.log(response);
          if(response['status']=='Success')
          {
            this.task_detail();
          }
          })
          }else{
            this.msg.error('Remark Not Deleted !!');
          }
          })
     }


     taskremarks:any=[];
     edit_remarks(index){
      console.log(index)
      this.taskremarks=this.taskdetail.taskDetails[index];
      this.taskremarks['type']='taskremarks';
      console.log(this.taskremarks);
      const dialogRef = this.dialog.open(UpdateNetworkComponent,{width : '1000px' ,data:this.taskremarks});
      dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.taskremarks=[];
      this.task_detail();
    });

       }
      



  openleaddetail(id){
    // window.open(`/lead-detail/`+id);
    window.open('./lead-detail/'+id);
  }


  taskaction:any={};
  actionOnTask(value)
  {
    console.log(value);
  }

  
  closetask(taskId)
  {
    let value={"taskId":taskId,"userId":this.userId,"taskStatus":2,'taskType':this.taskdetail.taskType,"remarks": this.data.remarks};
    console.log(value);
    
    this.db.fetchData(value,"task/update").subscribe((result)=>{
      console.log(result);
      if(result['status']=='Success')
      {
        this.data={};
        this.toast.openSucess("Task Close ","SuccessFully");
        this.task_detail();
        this.taskdetail={};
        this.taskaction.action=null;
      }
    })
  }



  closeLead(taskId)
  {
    console.log(taskId);
    this.taskdetail.task_id=this.task_id;
    console.log(this.data);
    console.log(this.taskdetail.referenceId)
    console.log(this.data.leadConverted);
    let value={"taskId":taskId,"userId":this.userId,"taskStatus":2,"leadConverted":this.data.leadConverted,"referenceId":this.taskdetail.referenceId,'taskType':this.taskdetail.taskType};
    this.db.fetchData(value,"task/update").subscribe((result)=>{
      console.log(result);
      if(result['status']=='Success')
      {
        if(this.data.leadConverted=='false'){
        console.log("heelllo");
        this.router.navigate(['/lead-list'])}else{ 
          localStorage.setItem('leadId', JSON.stringify(this.taskdetail));
          this.router.navigate(['/add-distribution']);
          console.log(localStorage);
          // this.navPage.count_list();
        }
      }
    })
  }




  reOpenTask(taskId)
  {
    console.log("reopen Function call");
    let value={"taskId":taskId,"userId":this.userId,"remarks":'ReopenTask',"taskStatus":3};
    this.db.fetchData(value,"taskdetail/add").subscribe((result)=>{
      console.log(result);
      if(result['status']='Success')
      {
        this.task_detail();
      }
    })
  }




  reopenDiv:any=false
  reOpenDiv()
  {
    this.reopenDiv=true;
  }

}
