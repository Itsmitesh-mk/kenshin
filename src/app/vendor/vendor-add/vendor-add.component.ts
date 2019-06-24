import { Component, OnInit, Renderer2 ,PLATFORM_ID, Inject} from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { ConstantService } from 'src/app/constant.service';
import { SnackBarOverview } from 'src/app/toast';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogComponent } from 'src/app/dialog';
import * as $ from 'jquery';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-vendor-add',
  templateUrl: './vendor-add.component.html'
})
export class VendorAddComponent implements OnInit {
  vendor_form:any={};
  loader:any=false;
  st:any=[];
  statelist:any=[];
  district1:any=[];
  districts1:any=[];
districtlist:any=[];
citylist:any=[];
cities:any=[];
areas:any=[];
statemasteroid:any;
  constructor(public db:ConstantService,
    public toast:SnackBarOverview,
    public router:Router,
    private renderer: Renderer2,
    public msg:DialogComponent,@Inject(PLATFORM_ID) private platformId: Object) {
      this.get_state();
      this.renderer.removeClass(document.body, 'nav-active');
      localStorage.setItem('leadId', JSON.stringify(''));
}

  ngOnInit() {
  }

  get_state(){
    console.log("stats runnning.....");
    this.loader=true;
    this.db.fileData('','state/list/').subscribe((response)=>{
      console.log(response);
      this.loader=false;
      this.statelist=response['data'];
    });
  }
  get_district(){
    this.loader=true;
    console.log("district running....");
    console.log(this.vendor_form.vendorState);
    this.st=Array(this.vendor_form.vendorState)
    this.db.fetchData(this.st,'district/list/').subscribe((response)=>{
      this.loader=false;
      console.log(response);
      this.districtlist=response['data'];
      this.district1=this.districtlist[0].distrcits;
      console.log(this.district1);
    });
  }
  get_city() {
    this.loader=true;
    console.log(this.vendor_form.vendorState);
    console.log(this.vendor_form.district);
    console.log("city runniyng..");
    this.db.fetchData(Array({"stateName":this.vendor_form.vendorState,"distrcits":Array({"districtName":this.vendor_form.district})}),'city/list').subscribe((response)=>{
      console.log(response);
      this.loader=false
      this.citylist=response['data'];
      this.districts1=this.citylist[0].distrcits;
      this.cities=this.districts1[0].cities;
      console.log(this.cities);
      let statemasterdata=[];
      statemasterdata=this.cities.filter(x => x.cityName==this.vendor_form.city);
      console.log(statemasterdata);
      this.statemasteroid=statemasterdata[0]['stateMasterId'];
      
    });
  }
  get_pincode(stateMasterId){
    this.loader=true;
    console.log(stateMasterId);
    let cityarray=[];
      cityarray[0]=stateMasterId;
    this.db.fetchData({'stateMasterIds':cityarray,},'city/pincodes').subscribe((response)=>{
      console.log(response);
      this.loader=false
      this.citylist=response['data'];
      this.areas=response['data'][0].pinCodes;
      console.log( this.areas);
    });
  }
  MobileNumber(event: any) 
  {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) 
    {event.preventDefault(); }
   }
   namecheck(event: any) 
  {
    const pattern = /[A-Z\+\a-z\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) 
    {event.preventDefault(); }
   }


  onSubmit(){
    console.log(this.vendor_form);
    this.db.fetchData(this.vendor_form,'createvendor').subscribe((response)=>
     {
            console.log(response)
            if(response['message']=="Success")
            {
              this.toast.openSucess('Vendor added successfully','');
              this.router.navigate(['/vendor-list']);
     } else if(response['message']=="The vendor already exists."){
      this.msg.error('The vendor already exists..');
     }
     else {
      this.msg.error('Vendor is not added..');
     }
    })
}
}
