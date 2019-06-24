import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { ConstantService } from '../../constant.service';
import { SnackBarOverview } from 'src/app/toast';
import { DialogComponent } from 'src/app/dialog';
import { sessionStorage }  from '../../local-storage.service';
@Component({
  selector: 'app-leave-rule-list',
  templateUrl: './leave-rule-list.component.html',
  animations: [slideToTop()]
})
export class LeaveRuleListComponent implements OnInit {
leavelist:any={};
leaves:any=[];
msg:any;
div:boolean=false;
role:any;
  userdata:any=[];

message:any;
loader:boolean;
constructor(public db:ConstantService,public user:sessionStorage,public toast:SnackBarOverview,public dialog:DialogComponent) {
  this.userdata=this.user['user']['data'];
  this.role=this.userdata['role'];
  this.leavelists() 
}
leavelists(){
   this.loader=true;
  this.db.fetchData({},'leave/list/').subscribe((response)=>{

        console.log(response);
        this.loader=false;
        if(response['status']=='Success')
        {
          this.leavelist=response;
          this.leaves=this.leavelist.data;
        }
        
        if(response['status']=='Failed')
        {
          this.div=true;
          this.leaves =[];
        }
        this.leavelist=response;
        this.leaves=this.leavelist.data;
        console.log(this.leaves);
  });
}
  ngOnInit() {
  }
  delete_leave(id){
    console.log(id);
    this.msg="Leave Rule"
    this.dialog.delete(this.msg).then((result) => {
      console.log(result);
      if(result)
      {
        this.db.fileData(id,'leave/delete/').subscribe((response)=>{
            console.log(response);
            this.message=response['message'];
            if(this.message="Leave Rules removed successfully")
            {
              this.toast.openSucess('LeaveRules removed successfully','');
            }
            else{
              this.toast.openError('Something Went Wrong Please Try Again!!','');
            }
            this.leavelists() 
          });
      }
    });
  }
 
}
