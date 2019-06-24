import { Component, OnInit,Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material'
import { ConstantService } from '../../constant.service';
import { SnackBarOverview } from 'src/app/toast';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-vendor-update',
  templateUrl: './vendor-update.component.html',
})
export class VendorUpdateComponent implements OnInit {
  vendordetail:any={};
  loader:any=false;
  message:any;
  districtlist:any[];
  district1:any=[];
  statelist:any=[];
  districts1:any[];
  citylist:any=[];
  cities:any=[];
  statemasteroid:any;
  areas:any=[];
  stateId:any;
  
  constructor(public toast:SnackBarOverview,public router:Router,public dialogRef: MatDialogRef<VendorUpdateComponent>,@Inject(MAT_DIALOG_DATA) public data:any,public db:ConstantService)
  {
        console.log(data);
        this.vendordetail=this.data;
        console.log(this.vendordetail);
        console.log(this.vendordetail.typeofupdate);
  }

  ngOnInit() {
    this.get_state();
  }



  get_state(){
    console.log("stats runnning.....");
    this.loader=true;
    this.db.fileData('','state/list/').subscribe((response)=>{
      console.log(response);
      this.loader=false;
      this.statelist=response['data'];
    });
    this.get_district();
  }




  st:any;
  get_district(){
    this.loader=true;
    console.log("district running....");
    console.log(this.vendordetail.vendorState);
    this.st=Array(this.vendordetail.vendorState)
    this.db.fetchData(this.st,'district/list/').subscribe((response)=>{
      this.loader=false;
      console.log(response);
      this.districtlist=response['data'];
      this.district1=this.districtlist[0].distrcits;
      console.log(this.district1);
    });
    this.get_city();
  }



  get_city() {
    this.loader=true;
    console.log(this.vendordetail.vendorState);
    console.log(this.vendordetail.district);
    console.log("city runniyng..");
    this.db.fetchData(Array({"stateName":this.vendordetail.vendorState,"distrcits":Array({"districtName":this.vendordetail.district})}),'city/list').subscribe((response)=>{
      console.log(response);
      this.loader=false
      this.citylist=response['data'];
      this.districts1=this.citylist[0].distrcits;
      this.cities=this.districts1[0].cities;
      console.log(this.cities);
      let statemasterdata=[];
      statemasterdata=this.cities.filter(x => x.cityName==this.vendordetail.city);
      console.log(statemasterdata);
      this.statemasteroid=statemasterdata[0]['stateMasterId'];
      console.log(this.statemasteroid);
      setTimeout(() => {
        this.get_pincode(this.statemasteroid);
      }, 500);
    });
   
  }




  get_pincode(stateMasterId){
    this.loader=true;
    console.log(stateMasterId);
    let cityarray=[];
      cityarray[0]=stateMasterId;
      console.log(cityarray);
    this.db.fetchData({'stateMasterIds':cityarray,},'city/pincodes').subscribe((response)=>{
      console.log(response);
      this.loader=false
      this.citylist=response['data'];
      this.areas=response['data'][0].pinCodes;
      console.log( this.areas);
    });
  }





  namecheck(event: any) 
  {
    const pattern = /[A-Z\+\a-z\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) 
    {event.preventDefault(); }
   }





  MobileNumber(event: any) 
  {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) 
    {event.preventDefault(); }
   }
   




  update_data:any={};
  updateMobileEmail(){
    if(this.vendordetail.typeofupdate=='email'){
      this.update_data.emailid=this.vendordetail.emailid;
      this.update_data.vendorCode=this.vendordetail.vendorCode;
      console.log(this.update_data);
    }else if(this.vendordetail.typeofupdate=='mobile'){
      this.update_data.mobile1=this.vendordetail.mobile1;
      this.update_data.vendorCode=this.vendordetail.vendorCode;
      console.log(this.update_data);
    }else if(this.vendordetail.typeofupdate=='mobile2'){
      this.update_data.mobile2=this.vendordetail.mobile2;
      this.update_data.vendorCode=this.vendordetail.vendorCode;
      console.log(this.update_data);
    }
    else if(this.vendordetail.typeofupdate=='gstNo'){
      this.update_data.gstNo=this.vendordetail.gstNo;
      this.update_data.vendorCode=this.vendordetail.vendorCode;
      console.log(this.update_data);
    }else if(this.vendordetail.typeofupdate=='contact_person'){
      this.update_data.contactPersonName=this.vendordetail.contactPersonName;
      this.update_data.vendorCode=this.vendordetail.vendorCode;
      console.log(this.update_data);
    }else if(this.vendordetail.typeofupdate=='landline'){
      this.update_data.landline=this.vendordetail.landline;
      this.update_data.vendorCode=this.vendordetail.vendorCode;
      console.log(this.update_data);
    }else if(this.vendordetail.typeofupdate=='address'){
      this.update_data.vendorState=this.vendordetail.vendorState;
      this.update_data.city=this.vendordetail.city;
      this.update_data.district=this.vendordetail.district;
      this.update_data.pincode=this.vendordetail.pincode;
      this.update_data.street=this.vendordetail.street;
      this.update_data.vendorCode=this.vendordetail.vendorCode;
      console.log(this.update_data);
    }
    console.log(this.update_data);
    this.loader = true;
    this.db.fetchData(this.update_data,'modifyvendor').subscribe((response)=>{
      console.log(response);
      this.loader=false;
      this.message=response['message'];
      if(this.message=="Success")
      {
        this.toast.openSucess('Updated successfully','');
        this.router.navigate(['/vendor-detail/'+this.update_data.vendorCode]) 
      }
      else
      {
        this.toast.openError('Something went wrong Please Try Again!!','');
      }
      this.dialogRef.close();
  });







}



  onNoClick(): void {
    this.dialogRef.close();
  }

}
