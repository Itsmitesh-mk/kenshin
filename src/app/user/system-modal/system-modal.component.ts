import { Component, OnInit,Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material'
import { ConstantService } from '../../constant.service';
import { SnackBarOverview } from 'src/app/toast';
import { Router } from '@angular/router';
@Component({
  selector: 'app-system-modal',
  templateUrl: './system-modal.component.html',
})
export class SystemModalComponent implements OnInit {
system_data:any={};
statelist:any=[];
districtlist:any=[];
st:any=[];
district1:any=[];
citylist:any=[];
cities:any=[];
districts1:any=[];
message:any;
loader:any;
  constructor( public toast: SnackBarOverview,public router:Router,public dialogRef: MatDialogRef<SystemModalComponent>,@Inject(MAT_DIALOG_DATA) public data:any,public db:ConstantService) {
    
    this.system_data=this.data;
    console.log(this.system_data);
    this.get_state();
    this.get_district();
    this.get_city();
   }



  ngOnInit() { 
    
  }
  MobileNumber(event: any) 
  {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) 
    {event.preventDefault(); }
   }
  get_state(){
    this.db.fileData('','state/list/').subscribe((response)=>{
      console.log(response);
      this.statelist=response['data'];  
      console.log(this.statelist);
        this.get_district();
    });
  }
  get_district(){
    console.log(this.system_data.state);
    this.st=Array(this.system_data.state)
    this.db.fetchData(this.st,'district/list/').subscribe((response)=>{
      console.log(response);
      this.districtlist=response['data'];
      this.district1=this.districtlist[0].distrcits;
    });
  this.get_city()
  }
  get_city(){
   
    console.log(this.system_data.state,this.system_data.district);
    console.log(this.system_data.district);
    this.db.fetchData(Array({"stateName":this.system_data.state,"distrcits":Array({"districtName":this.system_data.district})}),'city/list').subscribe((response)=>{
      console.log(response);
      this.citylist=response['data'];
      this.districts1=this.citylist[0].distrcits;
      this.cities=this.districts1[0].cities;
      console.log(this.cities);
    });
  }

  
  updateMobileEmail(){
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
      }
      else
      {
        this.toast.openError('Something went wrong Please Try Again!!','');
      }
      this.dialogRef.close();
    });
  }
  update_salesuser(){
    this.loader=true;
    console.log(this.data);
   this.db.fetchData(this.system_data,'user/update').subscribe((response)=>{
     console.log(response)
     this.loader=false;
     this.message=response['message'];
    if(this.message=="User updated successfully")
    {
      this.toast.openSucess('Address updated successfully','');
    }
    else
    {
      this.toast.openError('Something went wrong Please Try Again!!','');
    }
  });
    this.dialogRef.close();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
