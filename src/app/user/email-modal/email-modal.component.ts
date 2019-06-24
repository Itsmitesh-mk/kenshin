import { Component, OnInit,Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material'
import { ConstantService } from '../../constant.service';
import { Router } from '@angular/router';
import { SnackBarOverview } from 'src/app/toast';
@Component({
  selector: 'app-email-modal',
  templateUrl: './email-modal.component.html',
})
export class EmailModalComponent implements OnInit {
  message:any;
  loader:any;
  id:any;
  juniordata:any={}
  role:any;
  junior:any=[];
  segmentlist:any=[];
  staffSegments:any=[];
  territories:any=[];
  territorylist:any=[];
  saleHierarchies:any=[];
  designationData:any = [];
  roleData:any = [];

  constructor(public toast:SnackBarOverview,public router:Router,public dialogRef: MatDialogRef<EmailModalComponent>,@Inject(MAT_DIALOG_DATA) public data:any,public db:ConstantService)
   { 
     console.log(data);

     this.designationData = [

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
     
   }
  
  ngOnInit() {
    this.rolelist();
    this.get_territory();
    this.segment_list();
    this.get_juniors();
  }

  segment_list(){

   
    this.db.fileData('','segment/list/').subscribe((response)=>{
      console.log(response);
      this.segmentlist=response['data'];
    });
  }

  get_juniors(){
    if(this.data.role==8){
      this.role=parseInt(this.data.role)+2;}else
      {this.role=parseInt(this.data.role)+1;}
      this.db.fetchData({'role':this.role,'currentPage': 1,
      'pageSize': 50,},'user/list').subscribe((response)=>{
        console.log(response);
      this.junior=response['data'];
      console.log(this.junior);
     });
  }

  get_territory() {
    this.db.fetchData({},'territory/detail').subscribe((response)=>{
      console.log(response);
      this.territorylist = response['data'];
      console.log(this.territorylist);
    });
  }

  

  MobileNumber(event: any) 
  {
      const pattern = /[0-9\+\-\ ]/;
      let inputChar = String.fromCharCode(event.charCode);
      if (event.keyCode != 8 && !pattern.test(inputChar)) 
      {event.preventDefault(); }
  }

  rolelist() {

    this.db.fileData('','usertype/list').subscribe((response)=>{

          console.log(response);

          const roleArr = response['data'].filter(x => x.userTypeId==2);
          this.roleData = roleArr[0].roles;
          console.log(this.roleData);
      });
  }


  updateMobileEmail() {

        console.log(this.data);
        if(this.data.type=='territory') {

            for(let i=0;i<this.data.territory.length;i++){
                this.territories.push(this.data.territory[i]);
                console.log(this.territories);
            }
            this.data.territories=this.territories;
            this.data.landline="9050801272";
            this.data.country="string";

            this.db.fetchData(this.data,'user/update').subscribe((response)=>{

                  console.log(response);
                  this.loader=false;
                  this.message=response['message'];
                  if(this.message=="User updated successfully")
                  {
                    this.toast.openSucess('Updated successfully','');
                    this.router.navigate(['/sales-user-detail/'+this.data.userId]) 
                
                  }
                  else
                  {
                    this.toast.openError('Something went wrong Please Try Again!!','');
                  }
                  this.dialogRef.close();

            });
      }

      if(this.data.type=='email') {

            console.log('email');
            console.log(this.data)
            for(let i=0;i<this.data.userTerritories.length;i++){
              this.territories.push(this.data.userTerritories[i].territoryId);
              console.log(this.territories);
            }
              this.data.territories=this.territories;
            console.log(this.data);
            
            this.loader=true;
            console.log(this.data);
            this.data.landline="9050801272";
            this.data.country="string";
            this.db.fetchData(this.data,'user/update').subscribe((response)=>{
              console.log(response);
              this.loader=false;
              this.message=response['message'];
              if(this.message=="User updated successfully")
              {
                this.toast.openSucess('Updated successfully','');
                this.router.navigate(['/sales-user-detail/'+this.data.userId]) 
            
              }
              else
              {
                this.toast.openError('Something went wrong Please Try Again!!','');
              }
              this.dialogRef.close();
            });
      }


      if(this.data.type=='target') {

            this.loader=true;

            this.db.fetchData(this.data,'user/update').subscribe((response)=>{

                  console.log(response);
                  this.loader=false;
                  this.message=response['message'];
                  this.dialogRef.close();

            });
      }


      if(this.data.type=='mobile') {

            console.log('mobile');
            for(let i=0;i<this.data.userTerritories.length;i++) {

                  this.territories.push(this.data.userTerritories[i].territoryId);
                  console.log(this.territories);
            }

            this.data.territories=this.territories;  
            this.loader=true;
            console.log(this.data);
            this.data.landline="9050801272";
            this.data.country="string";
            this.db.fetchData(this.data,'user/update').subscribe((response)=>{

                  console.log(response);
                  this.loader=false;
                  this.message=response['message'];
                  if(this.message=="User updated successfully")
                  {
                    this.toast.openSucess('Updated successfully','');
                    this.router.navigate(['/sales-user-detail/'+this.data.userId]) 
                
                  }
                  else
                  {
                    this.toast.openError('Something went wrong Please Try Again!!','');
                  }
                  this.dialogRef.close();

            });
      }


      if(this.data.type=='segment') {

            console.log(this.data.segment);
            for(let j=0;j<this.data.segment.length;j++){
              this.staffSegments.push({"userId": this.data.userId,
              "segmentCode":this.data.segment[j],
              "segment": this.data.segment[j]})
            }
            console.log(this.staffSegments);
            this.data.staffSegments=this.staffSegments;
            for(let i=0;i<this.data.userTerritories.length;i++){
              this.territories.push(this.data.userTerritories[i].territoryId);
              console.log(this.territories);
              }
            this.data.territories=this.territories;    
            this.loader=true;
            console.log(this.data);
            this.data.landline="9050801272";
            this.data.country="string";
            this.db.fetchData(this.data,'user/update').subscribe((response)=>{
              console.log(response);
              this.loader=false;
              this.message=response['message'];
              if(this.message=="User updated successfully")
              {
                this.toast.openSucess('Updated successfully','');
                this.router.navigate(['/sales-user-detail/'+this.data.userId]) 
            
              }
              else
              {
                this.toast.openError('Something went wrong Please Try Again!!','');
              }
              this.dialogRef.close();
            });
      }


      if(this.data.type=='assign')  {

              console.log("array junior");
              console.log(this.data.Juniors);
              for (let index = 0; index < this.data.Juniors.length; index++) {
                  this.saleHierarchies.push( {"juniorUserID":this.data.Juniors[index]} );
              }

              console.log(this.saleHierarchies);
              this.data.saleHierarchies=this.saleHierarchies;
              
              this.db.fetchData(this.data,'user/update').subscribe((response)=>{

                  console.log(response);
                  this.loader=false;
                  this.message=response['message'];
                  if(this.message=="User updated successfully")
                  {
                    this.toast.openSucess('Updated successfully','');
                  }
                  else
                  {
                      this.toast.openError('Something went wrong Please Try Again!!','');
                  }
                  this.dialogRef.close();
            });
      }


      if(this.data.type=='concern_approval')  {

            console.log(this.data.concernApprovalAccess);

            this.loader=true;
            this.db.fetchData({userId: this.data.userId, concernApprovalAccess: this.data.concernApprovalAccess},'user/update').subscribe((response)=>{

                console.log(response);
                this.loader=false;
                this.message=response['message'];

                this.toast.openSucess('Updated successfully','');
                this.dialogRef.close();
          });
      }


      if(this.data.type=='designationName')  {

        console.log(this.data.designation);

        this.loader=true;
        this.db.fetchData({userId: this.data.userId, designation: this.data.designation},'user/update').subscribe((response)=>{

            console.log(response);
            this.loader=false;
            this.message=response['message'];

            this.toast.openSucess('Updated successfully','');
            this.dialogRef.close();
      });
     }


     if(this.data.type=='userName')  {

          console.log(this.data.userName);

          if(!this.data.userName.trim()) {
                this.data.userName = '';
                return;
          }

          this.loader=true;
          this.db.fetchData({userId: this.data.userId, userName: this.data.userName},'user/update').subscribe((response)=>{
              console.log(response);

                this.db.fetchData({
                  'userId': this.data.userId,
                  'role': this.data.role
                },'userrole/update').subscribe((responseData)=>{

                    console.log(responseData);
                    this.loader=false;

                    this.toast.openSucess('Updated successfully','');
                    this.dialogRef.close();
              });
          });
      }


  }


  onNoClick(): void {
    this.dialogRef.close();
  }

}
