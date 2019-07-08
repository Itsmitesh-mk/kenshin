import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ConstantService } from '../../constant.service';
import {MatDialog} from '@angular/material';
import { SystemModalComponent } from '../system-modal/system-modal.component';
import { SnackBarOverview } from 'src/app/toast';
import { sessionStorage }  from '../../local-storage.service';
@Component({
  selector: 'app-system-user-detail',
  templateUrl: './system-user-detail.component.html',
  animations: [slideToTop()]
})
export class SystemUserDetailComponent implements OnInit {
  
  id:any;
  account_form:any={};
  type:any=[];
  system_detail:any=[];
  active:any = {};
  systemdata:any=[];
  rolelists:any=[];
  rolelistsystem1:any=[];
  userdata:any=[];
  role:any;
  loader:any;
  message:any;
  userId:any;
  
  isModuleSelected:any=false;
  dbModuleData:any = [];
  
  step:any = 0;
  
  moduleAssignedEdit:any = false;
  
  moduleData = [{ moduleId: '1', moduleName: 'Lead', isSelectAllChecked: false, view: false, moduleRights: [
    {name: 'Add', checked: false},
    {name: 'Edit', checked: false},
    {name: 'Delete', checked: false}]
  },
  
  { moduleId: '2', moduleName: 'Distribution Network', isSelectAllChecked: false, view: false, moduleRights: [
    {name: 'Add', checked: false},
    {name: 'Edit', checked: false},
    {name: 'Delete', checked: false}]
  },
  
  { moduleId: '3',moduleName: 'Task', isSelectAllChecked: false, view: false,  moduleRights: [
    {name: 'Add', checked: false},
    {name: 'Edit', checked: false},
    {name: 'Delete', checked: false}]
  },
  
  { moduleId: '4', moduleName: 'Order', isSelectAllChecked: false, view: false, moduleRights: [
    {name: 'Add', checked: false},
    {name: 'Edit', checked: false},
    {name: 'Delete', checked: false}]
  },
  
  
  { moduleId: '5', moduleName: 'Travel Plan', isSelectAllChecked: false, view: false, moduleRights: [
    {name: 'Add', checked: false},
    {name: 'Edit', checked: false},
    {name: 'Delete', checked: false}]
  },
  
  { moduleId: '6', moduleName: 'Expense', isSelectAllChecked: false, view: false, moduleRights: [
    {name: 'Add', checked: false},
    {name: 'Edit', checked: false},
    {name: 'Delete', checked: false}]
  },
  
  { moduleId: '7', moduleName: 'Customer Concern', isSelectAllChecked: false, view: false, moduleRights: [
    {name: 'Add', checked: false},
    {name: 'Edit', checked: false},
    {name: 'Delete', checked: false}]
  },
  
  
  { moduleId: '8', moduleName: 'DVR', isSelectAllChecked: false, view: false, moduleRights: [
    {name: 'Add', checked: false},
    {name: 'Edit', checked: false},
    {name: 'Delete', checked: false}]
  },
  
  { moduleId: '9', moduleName: 'Followup', isSelectAllChecked: false, view: false, moduleRights: [ 
    {name: 'Add', checked: false},
    {name: 'Edit', checked: false},
    {name: 'Delete', checked: false}]
  },
  { moduleId: '11', moduleName: 'Sales Leave', view: false, moduleRights: [ 
    {name: 'Add', checked: false},
    {name: 'Edit', checked: false},
    {name: 'Delete', checked: false}]
  },
  { moduleId: '12', moduleName: 'Pop & Gift Order', view: false, moduleRights: [ 
    {name: 'Add', checked: false},
    {name: 'Edit', checked: false},
    {name: 'Delete', checked: false}]
  },
  { moduleId: '13', moduleName: 'Schemes', view: false, moduleRights: [ 
    {name: 'Add', checked: false},
    {name: 'Edit', checked: false},
    {name: 'Delete', checked: false}]
  },
  { moduleId: '14', moduleName: 'Vendors', view: false, moduleRights: [ 
    {name: 'Add', checked: false},
    {name: 'Edit', checked: false},
    {name: 'Delete', checked: false}]
  },
  { moduleId: '23', moduleName: 'Purchase Order', view: false, moduleRights: [
    {name: 'Add', checked: false},
    {name: 'Edit', checked: false},
    {name: 'Delete', checked: false}]
}
];

masterArray = [{ moduleId: '16', moduleName: 'Product', view: false, moduleRights: [
  {name: 'Add', checked: false},
  {name: 'Edit', checked: false},
  {name: 'Delete', checked: false}]
},

{ moduleId: '17', moduleName: 'User', view: false, moduleRights: [
  {name: 'Add', checked: false},
  {name: 'Edit', checked: false},
  {name: 'Delete', checked: false}]
},

{ moduleId: '18',moduleName: 'Territories', view: false,  moduleRights: [
  {name: 'Add', checked: false},
  {name: 'Edit', checked: false},
  {name: 'Delete', checked: false}]
},

{ moduleId: '19', moduleName: 'Marketing', view: false, moduleRights: [
  {name: 'Add', checked: false},
  {name: 'Edit', checked: false},
  {name: 'Delete', checked: false}]
},


{ moduleId: '20', moduleName: 'Leaves & Holiday', view: false, moduleRights: [
  {name: 'Add', checked: false},
  {name: 'Edit', checked: false},
  {name: 'Delete', checked: false}]
},

{ moduleId: '21', moduleName: 'Announcement', view: false, moduleRights: [
  {name: 'Add', checked: false},
  {name: 'Edit', checked: false},
  {name: 'Delete', checked: false}]
},

{ moduleId: '22', moduleName: 'Allowance', view: false, moduleRights: [
  {name: 'Add', checked: false},
  {name: 'Edit', checked: false},
  {name: 'Delete', checked: false}]
}
];


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



constructor(public toast:SnackBarOverview,public user:sessionStorage,public db:ConstantService,public router:Router, public route:ActivatedRoute, public dialog: MatDialog) {
  this.route.params.subscribe(params=>{
    this.userdata=this.user['user']['data'];
    this.role=this.userdata['role'];
    this.userId=this.userdata['userId'];
    console.log(params);
    this.id = params.id;
    console.log(this.id);
    this.systemuserdetail(); 
  });
  
}

ngOnInit() {
}

setStep(index: number) {
  this.step = index;
}

nextStep() {
  this.step++;
}

prevStep() {
  this.step--;
}

selectAllHandler(event) 
{
    if(event.checked)
    {
        for (let index = 0; index< this.masterArray.length; index++)
        {
            this.masterArray[index].view=true;
        }
    }
    else
    {
        for (let index = 0; index< this.masterArray.length; index++)
        {
            this.masterArray[index].view=false;
        }
    }
    
}

systemuserdetail() {
  this.loader=true;
  this.db.fileData('','user/detail/'+this.id).subscribe((response)=>{
    console.log(response);
    this.system_detail = response;
    this.loader=false;
    this.systemdata=this.system_detail.data;
    
    
    for (let index = 0; index < this.designationData.length; index++) {
      
      
      if(this.designationData[index].designation == this.systemdata['designation']) {
        this.systemdata.designationName = this.designationData[index].designationName;
      }
      
    }
    this.rolelist(); 
    
    this.db.fileData('', 'admin/access/' + this.id).subscribe( ( responseData ) => {
      
      console.log(responseData);
      
      this.dbModuleData = responseData['data'];
      this.moduleAssignedEdit = false;
      
    }, error => {
      console.log(error);
    });
    
  },error=>{
    console.log(error);
  })
}


editModulesHandler() {
  
  
  for (let index = 0; index < this.moduleData.length; index++) {
    
    
    const indexExist = this.dbModuleData.moduleAccesses.findIndex(row=> row.moduleId == this.moduleData[index].moduleId && row.show);
    
    if(indexExist != -1) {
      
      this.moduleData[index].view = this.dbModuleData.moduleAccesses[indexExist].show;
      this.moduleData[index].moduleRights[0]['checked'] = this.dbModuleData.moduleAccesses[indexExist].add;
      
      this.moduleData[index].moduleRights[1]['checked'] = this.dbModuleData.moduleAccesses[indexExist].edit;
      
      this.moduleData[index].moduleRights[2]['checked'] = this.dbModuleData.moduleAccesses[indexExist].delete;
      
      if(this.dbModuleData.moduleAccesses[indexExist].add && this.dbModuleData.moduleAccesses[indexExist].edit && this.dbModuleData.moduleAccesses[indexExist].delete) {
        
        this.moduleData[index]['isSelectAllChecked'] = true;
      }
      
    }
  }

  for (let index = 0; index < this.masterArray.length; index++) {
    
    
    const indexExist = this.dbModuleData.moduleAccesses.findIndex(row=> row.moduleId == this.masterArray[index].moduleId && row.show);
    
    if(indexExist != -1) {
      
      this.masterArray[index].view = this.dbModuleData.moduleAccesses[indexExist].show;
      this.masterArray[index].moduleRights[0]['checked'] = this.dbModuleData.moduleAccesses[indexExist].add;
      
      this.masterArray[index].moduleRights[1]['checked'] = this.dbModuleData.moduleAccesses[indexExist].edit;
      
      this.masterArray[index].moduleRights[2]['checked'] = this.dbModuleData.moduleAccesses[indexExist].delete;
      
      if(this.dbModuleData.moduleAccesses[indexExist].add && this.dbModuleData.moduleAccesses[indexExist].edit && this.dbModuleData.moduleAccesses[indexExist].delete) {
        
        this.masterArray[index]['isSelectAllChecked'] = true;
      }
      
    }
  }
  
  console.log(this.moduleData);
  
  this.moduleAssignedEdit = true;
  this.isModuleSelected = true;
}


saveAccessHandler() {
  
  const moduleAccesses = [];
  
  for (let index = 0; index < this.moduleData.length; index++) {
    
    if(this.moduleData[index].view) {
      
      if(!this.moduleData[index].moduleRights[0].checked) {
        this.moduleData[index].moduleRights[0].checked = false;
      }
      
      if(!this.moduleData[index].moduleRights[1].checked) {
        this.moduleData[index].moduleRights[1].checked = false;
      }
      
      if(!this.moduleData[index].moduleRights[2].checked) {
        this.moduleData[index].moduleRights[2].checked = false;
      }
      
      moduleAccesses.push({
        'moduleId': this.moduleData[index].moduleId,
        'module': this.moduleData[index].moduleName,
        'show': true,
        'add': this.moduleData[index].moduleRights[0].checked,
        'edit': this.moduleData[index].moduleRights[1].checked,
        'delete': this.moduleData[index].moduleRights[2].checked,
      });
    }
  }

  for (let index = 0; index < this.masterArray.length; index++) {
    
    if(this.masterArray[index].view) {
      
      if(!this.masterArray[index].moduleRights[0].checked) {
        this.masterArray[index].moduleRights[0].checked = false;
      }
      
      if(!this.masterArray[index].moduleRights[1].checked) {
        this.masterArray[index].moduleRights[1].checked = false;
      }
      
      if(!this.masterArray[index].moduleRights[2].checked) {
        this.masterArray[index].moduleRights[2].checked = false;
      }
      
      moduleAccesses.push({
        'moduleId': this.masterArray[index].moduleId,
        'module': this.masterArray[index].moduleName,
        'show': true,
        'add': this.masterArray[index].moduleRights[0].checked,
        'edit': this.masterArray[index].moduleRights[1].checked,
        'delete': this.masterArray[index].moduleRights[2].checked,
      });
    }
  }
  
  console.log(moduleAccesses);
  
  
  if(moduleAccesses.length == 0) {
    
    this.isModuleSelected = false;
    return false;
    
  } else {
    
    this.isModuleSelected = true;;
  }
  
  console.log(moduleAccesses);
  
  const accessData = {};
  
  accessData['userId'] = this.systemdata.userId;
  accessData['moduleAccesses'] = moduleAccesses;
  
  this.loader = true;
  this.db.fetchData(accessData,'admin/saveaccess').subscribe((responseData)=>{
    
    console.log(responseData);
    this.loader=false;
    this.toast.openSucess('User Updated successfully','');
    this.systemuserdetail();
  });
}


rolelist(){
  this.db.fileData('','usertype/list').subscribe((response)=>{
    console.log(response);
    this.rolelists=response['data'];
    let filterrolesystem= this.rolelists.filter(x => x.userTypeId==1);
    this.rolelistsystem1=filterrolesystem[0].roles;
    let filterrolesalesdetail= this.rolelistsystem1.filter(x => x.roleId==this.systemdata.role);
    this.systemdata.role_name=filterrolesalesdetail[0].roleName;
    console.log(this.systemdata);
  });
}

// selectAllHandler(index) {
  
//   console.log(this.moduleData[index]);
//   console.log(index);
  
//   for (let index1 = 0; index1 < this.moduleData[index]['moduleRights'].length; index1++) {
    
//     this.moduleData[index]['moduleRights'][index1]['checked'] = this.moduleData[index]['isSelectAllChecked'];
//   }
// }


openDialog(check1) {
  const dialogRef = this.dialog.open(SystemModalComponent,{ data: this.systemdata});
  this.systemdata.type=check1;
  console.log( this.systemdata.type);
  dialogRef.afterClosed().subscribe(result => {
    console.log(result);
  });
}


openEmail(check) {
  this.systemdata.type=check;
  console.log(check);
  const dialogRef = this.dialog.open(SystemModalComponent,{ data:this.systemdata});
  
  dialogRef.afterClosed().subscribe(result => {
  });
}
toggleterritory(key,action)
{    
  if(action == 'open')
  { this.type="password"; 
  this.systemdata.active = true;
}
if(action == 'close')
{
  this.type="text"; 
  this.systemdata.active = false; 
}
}
isactive(isActive){
  if(isActive==true)
  {
    this.systemdata.isActive=true;
    console.log(this.systemdata);
  }
  if(isActive==false)
  {
    this.systemdata.isActive=false;
    console.log(this.systemdata);
  }
  console.log(isActive);
  this.db.fetchData({
    "userId": this.systemdata.userId,
    "userName":this.systemdata.userName ,
    "password": "xyz",
    "email": this.systemdata.email,
    "mobile":this.systemdata.mobile,
    "landline": "string",
    "userType": this.systemdata.userType,
    "role": this.systemdata.role,
    "street": this.systemdata.street,
    "state": this.systemdata.state,
    "district": "string",
    "city": this.systemdata.city,
    "country": "string",
    "pin": this.systemdata.pin,
    "targetType": this.systemdata.targetType,
    "duration": this.systemdata.duration,
    "amount": this.systemdata.amount,
    "userTerritories": [
      
    ],
    "userSegments": [
      
    ],
    "token": "string",
    "isActive": this.systemdata.isActive,
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
updatepassword(){
  console.log('pass');
  this.db.fetchData({"userId": this.id,"password":this.account_form.password},'account/changepassword')
  .subscribe((response)=>{ console.log(response)
    this.message=response['message'];
    console.log(this.message);
    if(this.message=="Your password has been changed successfully!")
    {
      this.toast.openSucess('Your password has been changed successfully!','');
    }
    else
    {
      this.toast.openError('Something Went Wrong Please Try Again!!','');
    }
  });
}
}
