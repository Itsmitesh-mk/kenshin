import { Component, OnInit,Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material'
import { ConstantService } from '../../constant.service';
import { SnackBarOverview } from 'src/app/toast';
import { Router } from '@angular/router';
@Component({
  selector: 'app-update-network-address',
  templateUrl: './update-network-address.component.html',
  styleUrls: ['./update-network-address.component.scss']
})
export class UpdateNetworkAddressComponent implements OnInit {
  networkUserDetail:any;
  statelist:any;
  citylist:any;
  st:any;
  areas:any=[];
  statecode:any=[];
  networkUpdateActions:any=[];
  district1:any;
  cities:any;
  statemasterid:any;
  stateId:any;
  districtlist:any;
  districts1:any;
message:any;
loader:any;
  constructor( public toast: SnackBarOverview,public router:Router,public dialogRef: MatDialogRef<UpdateNetworkAddressComponent>,@Inject(MAT_DIALOG_DATA) public data:any,public db:ConstantService) {
    
    this.networkUserDetail=this.data;
    // this.networkUserDetail.state=this.data.state;
    // this.networkUserDetail.district=this.data.district;
    // this.networkUserDetail.city=this.data.city;
    // this.networkUserDetail.street=this.data.street;
    console.log(this.networkUserDetail);
    this.get_state();
    this.get_district();
    this.get_city();
   }

  ngOnInit() {
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
    console.log(this.networkUserDetail.state);
    this.st=Array(this.networkUserDetail.state)
    this.db.fetchData(this.st,'district/list/').subscribe((response)=>{
      console.log(response);
      this.districtlist=response['data'];
      this.district1=this.districtlist[0].distrcits;
    });
  this.get_city()
  }


  get_city(){
    console.log(this.networkUserDetail.state,this.networkUserDetail.district);
    console.log(this.networkUserDetail.district);
    this.db.fetchData(Array({"stateName":this.networkUserDetail.state,"distrcits":Array({"districtName":this.networkUserDetail.district})}),'city/list').subscribe((response)=>{
      console.log(response);
      this.citylist=response['data'];
      this.districts1=this.citylist[0].distrcits;
      this.cities=this.districts1[0].cities;
      console.log(this.cities);
      this.statecode= this.cities.filter(x => x.cityName==this.data.city);
      console.log(this.statecode);
      this.statemasterid=this.statecode[0].stateMasterId;
    });
    this.get_pincode();
  }


  get_pincode(){
    console.log("check function");
    let cityarray=[];
    if(this.stateId){
      console.log(this.stateId);
      cityarray[0]=this.stateId;
    }else{
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
  
  update_salesuser(){
    this.loader=true;
    console.log(this.data);
    this.networkUpdateActions={'basicInfoModified':true};
   this.db.fetchData({"networkUpdateActions":this.networkUpdateActions,
     "networkId": this.data.networkId,
   "street": this.networkUserDetail.street,
   "state": this.networkUserDetail.state,
   "district":this.networkUserDetail.district,
   "city":this.networkUserDetail.city,
   "pin": this.networkUserDetail.pin},'network/update').subscribe((response)=>{
     console.log(response)
     this.loader=false;
     this.message=response['message'];
    if(this.message=="Distributor Network Updated Successfully")
    {
      this.toast.openSucess('Address updated successfully','');
      this.router.navigate(['/distribution-detail/'+this.data.networkId]);
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
