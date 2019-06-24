import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { ConstantService } from '../../constant.service';
import { SnackBarOverview } from 'src/app/toast';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogComponent } from 'src/app/dialog';

@Component({
  selector: 'app-system-user-list',
  templateUrl: './system-user-list.component.html',
  animations: [slideToTop()]
})
export class SystemUserListComponent implements OnInit {
  userlist:any=[];
  users:any=[];
  active:any = {};
  type:any;
  rolelists:any=[];
  div:boolean=false;
  rolelistsystem1:any=[];
  loader:boolean;
  message:any;
  filter:any={};
  constructor(public db:ConstantService, public router:Router,public toast: SnackBarOverview,public dialog:DialogComponent) { 
    this.userList();
   
}

  ngOnInit() {
   
  }
  clearfilter(){
    this.filter={};
    this.userList();
  }
  rolelist(){
    this.loader=true;
    this.db.fileData('','usertype/list').subscribe((response)=>{
      console.log(response);
      this.loader=false;
      this.rolelists=response['data'];
      let filterrolesystem= this.rolelists.filter(x => x.userTypeId==1);
      this.rolelistsystem1=filterrolesystem[0].roles;
      console.log(this.rolelistsystem1);
      for(let i=0;i<this.users.length;i++){
        let systemIndex=  this.rolelistsystem1.findIndex(x => x.roleId==this.users[i].role);
        console.log(systemIndex);
        if(systemIndex!=-1){
        this.users[i].role_name=this.rolelistsystem1[systemIndex].roleName;
        console.log(this.users[i].role_name);
        }
      }
    });
  }
 isactive(isActive,index){
   if(isActive==true)
   {
     this.users[index].isActive=true;
     console.log(this.users);
   }
   if(isActive==false)
   {
     this.users[index].isActive=false;
     console.log(this.users);
   }
   console.log(isActive);
   this.db.fetchData({
    "userId": this.users[index].userId,
    "userName":this.users[index].userName ,
    "password": "xyz",
    "email": this.users[index].email,
    "mobile":this.users[index].mobile,
    "landline": "string",
    "userType": this.users[index].userType,
    "role": this.users[index].role,
    "street": this.users[index].street,
    "state": this.users[index].state,
    "district": "string",
    "city": this.users[index].city,
    "country": "string",
    "pin": this.users[index].pin,
    "targetType": this.users[index].targetType,
    "duration": this.users[index].duration,
    "amount": this.users[index].amount,
    "userTerritories": [
     
    ],
    "userSegments": [
   
    ],
    "token": "string",
    "isActive": this.users[index].isActive,
    "createBy": 0,
    "createdOn": "2019-02-11T04:19:25.435Z",
    "modifiedBy": 0,
    "modifiedOn": "2019-02-11T04:19:25.435Z",
    "documents": [
       
    ]
  },'user/update').subscribe((response)=>{
     console.log(response);
     this.message=response['message'];
     console.log(this.message);
     if(this.message=="User updated successfully")
     {
       this.toast.openSucess('User Updated successfully','');
     }
     else
     {
       this.toast.openError('Something Went Wrong Please Try Again!!','');
     }
   });
  
 }
  toggleterritory(key,action,index)
  {    
    if(action == 'open')
    { this.type="password"; 
      this.users[index].active = true;
    }
    if(action == 'close')
    {
      this.type="text"; 
      this.users[index].active = false; 
    }
  }

  userList()
  {
    this.loader=true;

    const selectedObject = {'userType': 1, 'currentPage': 1,
    'pageSize': 200};

    if(this.filter.name) {
        selectedObject['userName'] = this.filter.name;
    }

    if(this.filter.mobileno) {
      selectedObject['mobile'] = this.filter.mobileno;
    }

    if(this.filter.email) {
       selectedObject['email'] = this.filter.email;
    }

    if(this.filter.role) {
      selectedObject['role'] = this.filter.role;
    }


    this.db.fetchData(selectedObject, 'user/list').subscribe((response)=>{
    console.log(response);
    this.loader=false;
    if(response['status']=='Success')
    {
     this.rolelist();
     this.userlist = response;
     this.users=this.userlist.data;
    } else {
     this.div=true;
      this.userlist = [];
      this.users = [];
    }
    // this.userlist = response;
    // this.users=this.userlist.data
    // console.log(this.users);
    // this.rolelist();  
    // console.log(this.users);
  }); 
  }

  deleteUser(id, event)
  {
        this.loader = true;
        this.db.fileData("","user/delete/"+id+'/'+event.checked).subscribe((result)=>{
          
              console.log(result);

              this.loader = false;

              this.toast.openSucess('Account Updated Successfully!','');
              
        })
  }


}
