import { Component, OnInit,Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material'
import { ConstantService } from '../../constant.service';
import { SnackBarOverview } from 'src/app/toast';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-update-lead',
  templateUrl: './update-lead.component.html'
})


export class UpdateLeadComponent implements OnInit {
  loader:any;
  message:any;
  pincode:any;
  rolelists:any;
   client1:any=[];
  territoryId:any;
  saleslist:any=[];
  statelist:any=[];
  st:any=[];
  citylist:any=[];
  district1:any=[];
  statecode:any=[];
  stateId:any;
  statemasterid:any;
  districtlist:any=[];
  districts1:any=[];
  contact_person:any={};
  cities:any=[];
  cities1:any=[];
  districts2:any=[];
  areas:any=[];
  leadType:any;
  tmp_list:any=[];
  constructor(public toast:SnackBarOverview,public router:Router,public dialogRef: MatDialogRef<UpdateLeadComponent>,@Inject(MAT_DIALOG_DATA) public data:any,public db:ConstantService)
  {
    console.log(data);
    console.log(data.pin);
    this.update_data=data;
    console.log(this.update_data.leadContacts);
    this.tmp_list=this.update_data.leadContacts;
    this.leadType=data.leadType;
    this.pincode=data.pin;
    this.get_state();
    this.get_district();
    this.get_city();
    this.rolelist();
  }



  ngOnInit() {
    console.log(this.contact_person);
  }
  addContactPerson(form: NgForm)
  {
    console.log("hello");
    if(!this.contact_person.mobile2){
      this.contact_person.mobile2='';
    }
    this.tmp_list.push(this.contact_person);
    this.contact_person={};
    console.log(this.tmp_list);
    form.resetForm();
    
  }

  removeContact(index)
  {
     this.tmp_list.splice(index,1);
  }

  namecheck(event: any) 
  {
    const pattern = /[A-Z\+\a-z\ ]/;
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
      console.log(this.data.state);
      this.st=Array(this.data.state)
      this.db.fetchData(this.st,'district/list/').subscribe((response)=>{
        console.log(response);
        this.districtlist=response['data'];
        this.district1=this.districtlist[0].distrcits;
      });

      this.get_city();
  }





  get_city(){
    console.log(this.data.state,this.data.district);
    console.log(this.data.district);
    this.db.fetchData(Array({"stateName":this.data.state,"distrcits":Array({"districtName":this.data.district})}),'city/list').subscribe((response)=>{

        console.log(response);
        this.citylist=response['data'];
        this.districts1=this.citylist[0].distrcits;
        this.cities=this.districts1[0].cities;
        console.log(this.cities);
        this.statecode= this.cities.filter(x => x.cityName==this.data.city);
        console.log(this.statecode);
        this.statemasterid=this.statecode[0].stateMasterId;

        this.get_pincode();
    });
    
  }



  get_pincode() {

        console.log("check function");

        let cityarray=[];

        if(this.stateId) {
            console.log(this.stateId);
            cityarray[0]=this.stateId;
        } else {
            console.log(this.statemasterid);
            cityarray[0]=this.statemasterid;
        }

        console.log(cityarray);

        this.db.fetchData({'stateMasterIds':cityarray},'city/pincodes').subscribe((response)=>{
            console.log(response);
            this.areas=response['data'][0]['pinCodes'];
            console.log( this.areas);
        });
  }




  rolelist(){
    this.db.fileData('','usertype/list').subscribe((response)=>{
      console.log(response);
      this.rolelists=response['data'];
      let cllient= this.rolelists.filter(x => x.userTypeId==3);
      this.client1=cllient[0].roles;
      console.log(this.client1);
    });
  }




  MobileNumber(event: any) 
  {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) 
    {event.preventDefault(); }
   }



  update_data:any={};
  updateassign(){
    if(this.data.type=='email'){
      this.update_data.email=this.data.email;
      this.update_data.leadId=this.data.leadId;
      console.log(this.update_data);
    }
    else if(this.data.type=='landline'){
      this.update_data.landline=this.data.landline;
      this.update_data.leadId=this.data.leadId;
      console.log(this.update_data);
    }

    else if(this.data.type=='mobile'){
      this.update_data.mobile=this.data.mobile;
      this.update_data.leadId=this.data.leadId;
      console.log(this.update_data);
    }
    else if(this.data.type=='changelead'){
      this.update_data.leadType=this.data.leadType;
      this.update_data.leadId=this.data.leadId;
      console.log(this.update_data);
    }
    else if(this.data.type=='gst'){
      this.update_data.gst=this.data.gst;
      this.update_data.leadId=this.data.leadId;
      console.log(this.update_data);
    }
    else if(this.data.type=='address'){
      this.update_data.state=this.data.state;
      this.update_data.city=this.data.city;
      this.update_data.street=this.data.street;
      this.update_data.district=this.data.district;
      this.update_data.pin=this.data.pin;
      this.update_data.leadId=this.data.leadId;
      console.log(this.update_data);
    }
    else if(this.data.type=='contact'){
      console.log(this.update_data);
      console.log(this.tmp_list);
      this.update_data.leadContacts=this.tmp_list;
    }
      console.log(this.data);
      this.update_data.leadtype=this.leadType;

      this.loader = true;
      this.db.fetchData(this.update_data,'lead/update').subscribe((response)=>{
        console.log(response);
        this.loader=false;
        this.message=response['message'];
        if(this.message=="Lead Updated successfully")
        {
          this.toast.openSucess('Updated successfully','');
          this.dialogRef.close();
        }
        else
        {
          this.toast.openError('Something went wrong Please Try Again!!','');
        }
      });
  }



  onNoClick(): void {
    this.dialogRef.close();
  }
}