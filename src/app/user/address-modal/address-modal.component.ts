import { Component, OnInit,Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material'
import { ConstantService } from '../../constant.service';
import { SnackBarOverview } from 'src/app/toast';
import { Router } from '@angular/router';
@Component({
  selector: 'app-address-modal',
  templateUrl: './address-modal.component.html',
})
export class AddressModalComponent implements OnInit {
sales_data:any={};
statelist:any=[];
districtlist:any=[];
st:any=[];
district1:any=[];
citylist:any=[];
cities:any=[];
districts2:any=[];
cities1:any=[];
areas:any=[];
districts1:any=[];
message:any;
loader:any;
  constructor( public toast: SnackBarOverview,public router:Router,public dialogRef: MatDialogRef<AddressModalComponent>,@Inject(MAT_DIALOG_DATA) public data:any,public db:ConstantService) {
    
    this.sales_data=this.data;
    this.sales_data.district=this.data.district.charAt(0).toUpperCase()+ this.data.district.substr(1).toLowerCase();
    this.sales_data.city=this.data.city.charAt(0).toUpperCase()+ this.data.city.substr(1).toLowerCase();
    console.log(this.sales_data);
    this.get_state();
    this.get_district();
    this.get_city();
    this.get_pincode();
   }



  ngOnInit() { 
    
  }
  get_state(){
    // this.sales_data.state='';/
    this.db.fileData('','state/list/').subscribe((response)=>{
      console.log(response);
      this.statelist=response['data'];  
      console.log(this.statelist);
        this.get_district();
    });
  }
  get_district(){
    // this.sales_data.district='';
    console.log(this.sales_data.state);
    this.st=Array(this.sales_data.state)
    this.db.fetchData(this.st,'district/list/').subscribe((response)=>{
      console.log(response);
      this.districtlist=response['data'];
      this.district1=this.districtlist[0].distrcits;
    });
  this.get_city()
  }
  get_city(){
    // this.sales_data.city='';
    console.log(this.sales_data.state,this.sales_data.district);
    console.log(this.sales_data.district);
    this.db.fetchData(Array({"stateName":this.sales_data.state,"distrcits":Array({"districtName":this.sales_data.district})}),'city/list').subscribe((response)=>{
      console.log(response);
      if(response['status']=='Success')
      {
        this.citylist=response['data'];
        this.districts1=this.citylist[0].distrcits;
        this.cities=this.districts1[0].cities;
        // this. get_pincode();

      }
     
      console.log(this.cities);
    });
  }
  get_pincode(){
    // this.sales_data.pin='';/
    console.log(this.sales_data.state,this.sales_data.district,this.sales_data.city);
    this.db.fetchData(Array({"stateName":this.sales_data.state,"distrcits":Array({"districtName":this.sales_data.district})}),'city/list').subscribe((response)=>{
      console.log(response);
      if(response['status']=='Success')
      {
        this.cities1=response['data'][0]['distrcits'][0]['cities'];
        let filterpincode= this.cities1.filter(x => x.cityName.toLowerCase(x.cityName)===this.sales_data.city.toLowerCase(this.sales_data.city));
        this.areas=filterpincode[0].pinCodes;
      }
     
    });
  }
  update_salesuser(){
    this.loader=true;
    console.log(this.data);
   this.db.fetchData(this.sales_data,'user/update').subscribe((response)=>{
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
}
