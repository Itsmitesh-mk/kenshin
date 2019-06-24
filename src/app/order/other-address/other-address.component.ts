import { Component, OnInit, Inject } from '@angular/core';
import { ConstantService } from 'src/app/constant.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-other-address',
  templateUrl: './other-address.component.html',
  styleUrls: ['./other-address.component.scss']
})
export class OtherAddressComponent implements OnInit {

  shippingState:any=[];
  shippingDistrict:any=[];
  shippingCity:any=[];
  shippingPin:any=[];
  loader:any=false;
  networkShippings:any={};
  networkId:any;
  constructor(@Inject(MAT_DIALOG_DATA)public data,public db:ConstantService,public dialog:MatDialog) { 

    console.log(data);
    this.networkShippings.networkId=data.id;
    console.log(this.networkShippings.networkId);
    
    this.getshippingState();
  }

  ngOnInit() {
  }

  saveAddress()
  {
    this.loader=true;
    console.log("SAve");
    console.log(this.networkShippings);
    
    this.db.fetchData(this.networkShippings,"shippingaddress/update").subscribe((result)=>{
      console.log(result);
      this.loader=false;
    })
    this.dialog.closeAll();
  }

  getshippingState()
  {
    this.loader=true;
    this.db.fileData('','state/list/').subscribe((response)=>{
      console.log(response);
      this.loader=false;
      this.shippingState=response['data'];
    });
  }
getShippingDistrict(state)
{
  this.loader=true;
  this.db.fetchData(Array(state),'district/list/').subscribe((response)=>{
    this.loader=false;
    console.log(response);
    this.shippingDistrict=response['data'][0].distrcits;
    // console.log(this.district1);
  });
}

getShippingCity(state,district)
{
  this.loader=true;
  this.db.fetchData(Array({"stateName":state,"distrcits":Array({'districtName':district})}),'city/list').subscribe((response)=>{
    console.log(response);
    this.loader=false
    this.shippingCity=response['data'][0].distrcits[0].cities;
    console.log(this.shippingCity);
  });
}

MobileNumber(event: any)
{
  const pattern = /[0-9\+\-\ ]/;
  let inputChar = String.fromCharCode(event.charCode);if (event.keyCode != 8 && !pattern.test(inputChar))
  {event.preventDefault();}
}


citylist:any=[];
districts2:any=[];
cities1:any=[];
masterId:any=[];
getShippingPin(masterId)
{
  console.log(masterId);
  this.masterId.push(masterId)
  this.loader=true;
  this.db.fetchData({"stateMasterIds":this.masterId},'city/pincodes').subscribe((response)=>{
    console.log(response);
    this.loader=false
    this.shippingPin=response['data'][0]['pinCodes'];
    console.log(this.shippingPin);
    
    // this.districts2=this.citylist[0].distrcits;
    // this.cities1=this.districts2[0].cities;
    // let filterpincode= this.cities1.filter(x => x.cityName==this.networkShippings.city);
    // this.shippingPin=filterpincode[0].pinCodes;
  });
}
}
