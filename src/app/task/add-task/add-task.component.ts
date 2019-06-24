import { Component, OnInit } from '@angular/core';
import { ConstantService } from '../../constant.service';
import { SnackBarOverview } from 'src/app/toast';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogComponent } from 'src/app/dialog';
import {Validators,FormGroup,FormBuilder} from '@angular/forms';
import * as $ from 'jquery';
import * as moment from 'moment';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html'
})
export class AddTaskComponent implements OnInit {
  submitted = false; //for login button
  
  addTask: FormGroup;
  rolelists:any=[];
  taskForm:any={};
  rolelisttask:any=[];
  distributorList:any=[];
  saleslist:any=[];
  message:any;
  rolename:any;
  territory:any=[];
  loader:boolean;
  other:any=false;
  user:any={}
  userType:any;
  userId:any;
  userRole:any;
  dropdownSettings:any={};
  currentDate:any = new Date();
  
  constructor(public db:ConstantService,public toast:SnackBarOverview,  public router:Router, 
    public route:ActivatedRoute,public dialog:DialogComponent,private formBuilder: FormBuilder) {
      this.user = JSON.parse(localStorage.getItem('user')) || [];
      console.log(this.user);
      this.userType = this.user.data.userType;
      this.userId = this.user.data.userId;
      this.userRole=this.user.data.role;
    }
    
    ngOnInit() {
      this.dropdownSettings = {
        singleSelection: false,
        idField: 'userId',
        textField: 'userName',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        allowSearchFilter: true,
        maxHeight: 197
  };
      this.rolelist();
      this.addTask = this.formBuilder.group({
        role: [''],
        deadline:['', Validators.required],
        taskPriority:['', Validators.required],
        userId: [''],
        remarks: ['', Validators.required],
        other: ['']
      });
    }
    get e() { return this.addTask.controls; }
    active:any = {};
    toggleterritory(key,action)
    {
      console.log(action);
      console.log(key);
      
      if(action == 'open')
      { this.active[key] = true;
        $('#'+key).focus();
      }
      if(action == 'close')
      { this.active[key] = false;}
      console.log(this.active);
    }



    rolelisttask1:any=[];
    AllUserList:any=[];
    rolelist() {
      this.loader=true;
      this.db.fileData('','usertype/list').subscribe((response)=>{
            console.log(response);
            this.rolelists=response['data'];
            this.loader=false;
            let systemuser= this.rolelists.filter(x => x.userTypeId==1);
            this.rolelisttask1=systemuser[0].roles;
            let filterrolelead= this.rolelists.filter(x => x.userTypeId==2);
            this.rolelisttask=filterrolelead[0].roles;
              this.AllUserList=this.rolelisttask.concat(this.rolelisttask1);
              console.log(this.AllUserList);
            console.log(this.rolelisttask1);
            console.log(this.AllUserList);
            console.log(this.rolelisttask);
            if(this.userRole==1) {
              const filterArray=this.AllUserList.filter(row=>row.roleId !=1);
              console.log(filterArray);
              this.AllUserList=filterArray;
        }
            if(this.userRole==6) {
                  const filterArray=this.AllUserList.filter(row=>row.roleId !=6 && row.roleId !=1 && row.roleId !=2 && row.roleId !=3 && row.roleId !=4 && row.roleId !=5 && row.roleId !=16 && row.roleId !=17 );
                  console.log(filterArray);
                  this.AllUserList=filterArray;
            }
            if(this.userRole==7) {
                  const filterArray=this.AllUserList.filter(row=>row.roleId !=6 && row.roleId!=7 && row.roleId !=1 && row.roleId !=2 && row.roleId !=3 && row.roleId !=4 && row.roleId !=5 && row.roleId !=16 && row.roleId !=17 );
                  console.log(filterArray);
                  this.AllUserList=filterArray;
            }
            if(this.userRole==8) {
                  const filterArray=this.AllUserList.filter(row=>row.roleId !=6 && row.roleId!=7 && row.roleId!=8 && row.roleId !=1 && row.roleId !=2 && row.roleId !=3 && row.roleId !=4 && row.roleId !=5 && row.roleId !=16 && row.roleId !=17 );
                  console.log(filterArray);
                  this.AllUserList=filterArray;
            }
            console.log(this.AllUserList);
      });
    }
    saleuserdatalist:any=[];
    rsm:any=[];
    asm:any=[];
    ti:any=[];
    finalsalesuser:any=[];
    tmpUserList:any=[];
    userList(role)
    {
      this.saleslist=[];
      console.log(role);
      console.log(this.userType)
      if(this.userType==1){
      console.log(role);
      // console.log(id);
      this.other=false;
      this.loader=true;
      this.db.fetchData( {"role":role,"currentPage": 1,"pageSize": 50},"user/list").subscribe((result)=>{
        console.log(result);
        this.loader=false;
        if(result['status']=='Success')
        {
          this.saleslist=result['data'];
          console.log(this.saleslist);
          this.tmpUserList=this.saleslist;
        }
      })
    }else{

      this.saleuserdatalist=this.user.data.salesUser.staffWithJuniors.juniors;
      console.log(this.saleuserdatalist);
      console.log(role);
      if(this.userRole==6 && role==10) {

              for(var i=0;i < this.saleuserdatalist.length;i++)
              {           
                        this.rsm.push(this.saleuserdatalist[i]);
              }

              for(var k=0;k < this.rsm.length;k++)
                {
                    for(var q=0;q<this.rsm[k].juniors.length;q++)
                    {
                        this.asm.push(this.rsm[k].juniors[q]);
                    }
              }

              for(var j=0;j < this.asm.length;j++)
              { 
                  for(var z=0;z<this.asm[j].juniors.length;z++)
                  {
                      this.ti.push(this.asm[j].juniors[z]);
                  }
              }
        }
        if(this.userRole==6 && role==8) {

          for(var i=0;i < this.saleuserdatalist.length;i++)
          {           
                    this.rsm.push(this.saleuserdatalist[i]);
          }

          for(var k=0;k < this.rsm.length;k++)
            {
                for(var q=0;q<this.rsm[k].juniors.length;q++)
                {
                    this.asm.push(this.rsm[k].juniors[q]);
                }
          }
    }
    if(this.userRole==6 && role==7) {

            for(var i=0;i < this.saleuserdatalist.length;i++)
            {           
                      this.rsm.push(this.saleuserdatalist[i]);
            }
        }

        if(this.userRole==7 && role==10) {

          for(var i=0;i < this.saleuserdatalist.length;i++)
          {           
                    this.asm.push(this.saleuserdatalist[i]);
          }

          for(var k=0;k < this.asm.length;k++)
            {
                for(var q=0;q<this.asm[k].juniors.length;q++)
                {
                    this.ti.push(this.asm[k].juniors[q]);
                }
          }
    }
    if(this.userRole==7 && role==8) {

            for(var i=0;i < this.saleuserdatalist.length;i++)
            {           
                      this.asm.push(this.saleuserdatalist[i]);
            }
      }

      if(this.userRole==7 && role==10) {

        for(var i=0;i < this.saleuserdatalist.length;i++)
        {           
                  this.asm.push(this.saleuserdatalist[i]);
        }

        for(var k=0;k < this.asm.length;k++)
          {
              for(var q=0;q<this.asm[k].juniors.length;q++)
              {
                  this.ti.push(this.asm[k].juniors[q]);
              }
        }
  }
  if(this.userRole==8 && role==10) {

          for(var i=0;i < this.saleuserdatalist.length;i++)
          {           
                    this.ti.push(this.saleuserdatalist[i]);
          }
    }




      if(role==10) {

            for(var a=0;a< this.ti.length;a++) {

                 const indexExist = this.saleslist.findIndex(row => row.userId == this.ti[a].userId);

                 if(indexExist == -1) {
                    this.saleslist.push(this.ti[a]);
                 }
            }

      }  else if(role==8) {
        for(var a=0;a< this.asm.length;a++) {

          const indexExist = this.saleslist.findIndex(row => row.userId == this.asm[a].userId);
          
          if(indexExist == -1) {

             this.saleslist.push(this.asm[a]);
          }
     }
      }  else  {
        for(var a=0;a< this.rsm.length;a++) {

          const indexExist = this.saleslist.findIndex(row => row.userId == this.rsm[a].userId);
          
          if(indexExist == -1) {
    
             this.saleslist.push(this.rsm[a]);
          }
         }
      }
    }
    console.log(this.saleslist);
    }

  




    userSearch:any={};
    searchList:any=[];
    UserSearch()
    {
      this.saleslist=[];
      for(let i=0;i<this.tmpUserList.length;i++)
      {
        this.userSearch.search=this.userSearch.search.toLowerCase();
        this.searchList=this.tmpUserList[i]['userName'].toLowerCase();
        if(this.searchList.includes(this.userSearch.search))
        {
          this.saleslist.push(this.tmpUserList[i]);
        } 
      }
    }
    oherUserDiv()
    {
      this.other=true;
      // this.addTask.controls['userId'].setValue(null);
      // this.addTask.controls['role'].setValue(null);
    }
    getUserid(id)
    {
      console.log(id);
      this.addTask.controls['userId'].setValue(id);
    }
    taskValue:any={};
    userIds:any=[];
    roles:any=[];
    saveTask()
    {
      this.submitted = true;
      console.log(this.addTask.value);

      if (this.addTask.invalid) 
      {
        console.log("*****invalid data*****");
        console.log(this.addTask.value);
        return;
      }
      else
      {
        for(let i=0;i<this.addTask.value.userId.length;i++)
        {
          this.userIds.push(this.addTask.value.userId[i]['userId']);
          this.roles.push(parseInt(this.addTask.value.role));
        }

       if(this.addTask.value.other!='')
       {
         this.taskValue={"other":this.addTask.value.other,"deadline":moment(this.addTask.value.deadline).format('YYYY-MM-DD '),"remarks":this.addTask.value.remarks,"taskPriority":this.addTask.value.taskPriority}
       } 
       else{
         this.taskValue={"userIds":this.userIds,"roles":this.roles,"deadline":moment(this.addTask.value.deadline).format('YYYY-MM-DD '),"remarks":this.addTask.value.remarks,"taskPriority":parseInt(this.addTask.value.taskPriority)}
       }
        console.log(this.addTask.value);
        this.db.fetchData(this.taskValue,"task/add").subscribe((result)=>{
          console.log(result);
          if(result['status']=='Success')
          {
            this.dialog.success();
            this.router.navigate(['/task-list'])
          }
        })
      }
      
    }
   
    // getDistributorList(id){
    //   this.loader=true;
    //   console.log(id);
    //   this.taskForm.role=id;
    //   // console.log(this.rolelisttask);
    //   console.log(this.taskForm.role);
    //   for(let i=0;i<this.rolelisttask.length;i++){
    //     if(this.rolelisttask[i].roleId==this.taskForm.role)
    //     {
    //       this.rolename=this.rolelisttask[i].roleName;
    //     }
    //   }
    //   console.log(this.rolename);
    //   this.db.fetchData({"role":this.taskForm.role},'network/list').subscribe((response)=>{
    //     console.log(response);
    //     this.loader=false;
    //     this.distributorList=response['data'];
    //   });
    // }
    // getSalesList(pin){
    //   this.loader=true;
    //   this.db.fileData(pin,'territorybypin/').subscribe((response)=>{
    //     console.log(response);
    //     this.loader=false;
    //     this.territory=response['data'];
    //     console.log(this.territory);
    //     this.sale(this.territory);
    //   });
    // }
    // sale(salesid){
    //   console.log(salesid);
    //   this.db.fetchData({'territoryID':salesid},'territory/detail').subscribe((response)=>{
    //     console.log(response);
    //     this.salesList=response['data'][0]; 
    //     console.log(this.salesList);
    //   });
    // }
    // onSubmit(){
    //   this.loader=true;
    //   console.log(this.taskForm);
    
    //   this.db.fetchData({
    //     "userId": this.taskForm.sales,
    //   "taskType": this.taskForm.taskType,
    //   "role": this.taskForm.role,
    //   "networkId":this.taskForm.distributor,
    //   "remarks": this.taskForm.remarks,
    //     },'task/add').subscribe((response)=>{
    //     console.log(response);
    //     this.loader=false;
    //     this.message=response['message'];
    //     if(this.message=="Task created successfully")
    //     {
    //       this.toast.openSucess('Task created successfully','');
    //       this.router.navigate(['/task-list'])
    //     }
    //     else
    //     {
    //       this.dialog.error(this.message);
    //       // this.toast.openError('Email or Phone Can Not Be Duplicate or Invalid Please Try Again!!','');
    //     }
    //   });
    // }
    
    // territoryList:any=[];
    // getSalseUserList()
    // {
    
    //   this.db.fetchData({"userType": 2,"currentPage": 1,"pageSize": 50},'user/list').subscribe((result)=>{
    //     console.log(result);
    //     if(result['status']=='Success')
    //     {
    //       this.saleslist=result['data'];
    
    //       const role=this.saleslist.filter(x=>x.role==10)
    //           if(role.length!=0)
    //           {
    //             console.log(role);
    //             this.territoryList=role;
    
    //           }
    //           else{
    //             const role=this.saleslist.filter(x=>x.role==8)
    //             if(role.length!=0)
    //             {
    //               console.log(role);
    //               this.territoryList=role;
    //             }
    //             else
    //             {
    //                 const role=this.saleslist.filter(x=>x.role==7)
    //                 if(role.length!=0)
    //                 {
    //                   console.log(role);
    //                   this.territoryList=role;
    //                 }
    //                 else{
    //                   const role=this.saleslist.filter(x=>x.role==6)
    //                 if(role.length!=0)
    //                 {
    //                   console.log(role);
    //                   this.territoryList=role;
    //                 }
    //                 }
    //             }
    //           }
    //     }
    //   })
    // }
    
    // getDistributorList(id)
    // {
    //   this.loader=true
    //   this.territory=[];
    //   this.other=false;
    //   console.log(id);
    
    //   console.log(this.taskForm.sales);
    
    //   this.db.fetchData({salesUserId:this.taskForm.sales,"role":id},'mynetwork/detail').subscribe((result)=>{
    //     console.log(result);
    //     this.loader=false
    //     if(result['status']=='Success')
    //     {
    //       this.territory=result['data'];
    //       console.log(this.territory);
    
    //     }
    //   })
    
    // }
    
    // otherType(id)
    // {
    //   console.log(id);
    
    //   console.log(this.taskForm.sales);
    //   this.other=true;
    // }
    
    
  }
  