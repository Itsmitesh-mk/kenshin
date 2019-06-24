import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { ConstantService } from '../../constant.service';
import { DialogComponent } from 'src/app/dialog';
import { SnackBarOverview } from 'src/app/toast';

@Component({
  selector: 'app-sale-user-list',
  templateUrl: './sale-user-list.component.html',
  animations: [slideToTop()]

})
export class SaleUserListComponent implements OnInit {
  userlist:any=[];
  users:any=[];
  loader:boolean;
  rolelists:any=[];
  rolelistsales1:any=[];
  filter:any={};
  div:boolean=false;
  constructor(public db:ConstantService,public dialog:DialogComponent, public toast:SnackBarOverview) {
   
     this.userList();

   }

  ngOnInit() {

  }

  clearfilter(){
 
    this.filter={};
    this.userList();
  }


  deleteUser(id)
  {
        this.dialog.delete('Sales User  !').then((result) => {
          if(result)
          {
              console.log(id);
              this.db.fileData("","user/delete/"+id).subscribe((result)=>{

                  console.log(result);
                  if(result['status']=="Success")
                  {
                    this.userList();
                  }
            
              })
          }
        })
  }



  rolelist(){
    this.loader=true;
    this.db.fileData('','usertype/list').subscribe((response)=>{
      console.log(response);
      this.loader=false;
      this.rolelists=response['data'];
      let filterrolesystem= this.rolelists.filter(x => x.userTypeId==2);
      this.rolelistsales1=filterrolesystem[0].roles;
      console.log(this.rolelistsales1);
      for(let i=0;i<this.users.length;i++){
        let systemIndex=  this.rolelistsales1.findIndex(x => x.roleId==this.users[i].role);
        console.log(systemIndex);
        if(systemIndex!=-1){
        this.users[i].role_name=this.rolelistsales1[systemIndex].roleName;
        console.log(this.users[i].role_name);
        }
      }
    });
  }

  userList()
  {

        this.loader=true;

        const selectedObject = {'userType': 2, 'currentPage': 1,
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

        this.db.fetchData(selectedObject,'user/list').subscribe((response)=>{

              console.log(response);
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

              this.loader=false;
              
          // console.log(this.users[25].userTerritories[0]);
        });
  }


  accountHandler(userId, event) {

         this.loader = true;

         console.log(event.checked);

         this.db.fileData("","user/delete/"+userId+'/'+event.checked).subscribe((result)=>{

              console.log(result);
              this.loader = false;

              this.toast.openSucess('Account Updated Successfully!','');
    
         })
  }

}
