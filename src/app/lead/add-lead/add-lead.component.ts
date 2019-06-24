import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { ConstantService } from 'src/app/constant.service';
import { Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog';
import { SnackBarOverview } from 'src/app/toast';
import * as $ from 'jquery';
import { isPlatformBrowser } from '@angular/common';
import {NgForm} from '@angular/forms';


@Component({
  selector: 'app-add-lead',
  templateUrl: './add-lead.component.html',
  animations: [slideToTop()]

})

export class AddLeadComponent implements OnInit {
  staffSegments:any=[];
  data:any={};
  territoryId:any;
  contact_person:any={};
  contectpersondata:any=[];
  statelist:any=[];
  districtlist:any=[];
  citylist:any=[];
  areas:any=[];
  segmentlist:any=[];
  resmsg:any;
  rolelists:any;
  saleslist:any=[];
  client1:any=[];
  loader:any=false;
  user:any={}
  userType:any;
  userId:any;
  userRole:any;

  tmp_list:any=[];

  isSegmentSelected:any = false;
  constructor(public service:ConstantService,
    public route:Router,public msg:DialogComponent, @Inject(PLATFORM_ID) private platformId: Object, public toast: SnackBarOverview) { 
    this.user = JSON.parse(localStorage.getItem('user')) || [];
    console.log(this.user);
    this.userType = this.user.data.userType;
    this.userId = this.user.data.userId;
    this.userRole=this.user.data.role;

    this.get_state();
    this.segmentList();
    this.rolelist();
  }

  ngOnInit() {
    this.data.country='India';
   // this.data.leadType=12;
  }

  active={};
  rolelist()
  {
      this.service.fileData('','usertype/list').subscribe((response)=>{
          console.log(response);
          this.rolelists=response['data'];
          const clientIndex= this.rolelists.findIndex(x => x.userTypeId==3);

          this.client1 = this.rolelists[clientIndex]['roles'];
          this.data.leadType = 12;
          
           console.log(this.client1);
      });
  }


  setFocus(form, contactForm) {

      console.log(form.controls);
      console.log(contactForm);

      for (var key in form.controls)
      {
        
          if (form.controls.hasOwnProperty(key)) {
            if(form.controls[key].status=='INVALID')
            {
                if (isPlatformBrowser(this.platformId)) {

                        console.log(key);
                        $('#'+key).focus();
                        $(window).scrollTop(0);
                      
                }

                console.log(key);
                return true;
                
            }
              console.log(key + " -> " + form.controls[key].status);
          }
      }



      for (var key in contactForm.controls)
      {
        
          if (contactForm.controls.hasOwnProperty(key)) {
            if(contactForm.controls[key].status=='INVALID')
            {
                if (isPlatformBrowser(this.platformId)) {

                        console.log(key);
                        $('#'+key).focus();
                        $(window).scrollTop(0);
                      
                }

                console.log(key);
                return true;
            }
              console.log(key + " -> " + contactForm.controls[key].status);
          }
      }
  }


  toggleterritory(key,action)
  {
      console.log(action);
      console.log(key);
      if(action == 'open')
      { this.active[key] = true; }
      if(action == 'close')
      { this.active[key] = false;}
      console.log(this.active);
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

   territoryList:any=[];

   get_sales(pin) {

      this.loader=true;
      this.saleslist=[];
      console.log(pin);
      console.log('hello');
      if(pin && this.segment){
      this.service.fetchData({'pinCode':pin,'segments':this.segment},'/territory/list').subscribe((response)=>{
        console.log(response);
        this.loader=false;
        if(response['status']=='Success')
        {
          this.territoryId=response['data'];
          this.loader=false;
          console.log(this.territoryId);
        }
      })}
  }

  get_salesuserdata(tid){
    console.log(tid);
    this.service.fetchData({},'territory/salesusers?territoryIds='+tid).subscribe((response)=>{
      console.log(response);
      this.loader=false;
      if(response['status']=='Success')
      {
        this.saleslist=response['data'];
        console.log(this.saleslist);
        const role=this.saleslist.filter(x=>x.role==10)
        if(role.length!=0)
        {
          console.log(role);
          this.territoryList=role;
        }
        else{
          const role=this.saleslist.filter(x=>x.role==8)
          if(role.length!=0)
          {
            console.log(role);
            this.territoryList=role;
          }
          else
          {
              const role=this.saleslist.filter(x=>x.role==7)
              if(role.length!=0)
              {
                console.log(role);
                this.territoryList=role;
              }
              else{
                const role=this.saleslist.filter(x=>x.role==6)
              if(role.length!=0)
              {
                console.log(role);
                this.territoryList=role;
              }
              }
          }
        }
      }
      console.log(this.saleslist);
     })
   }
   cleardata(){
     this.data.assignTo='';
     this.data.tid='';
   }
  
   submitDetail(form: NgForm)
   {
          for(let i=0;i<this.segment.length;i++){
                this.staffSegments.push( {"segmentCode": this.segment[i], "segment": this.segment[i]});
          }

          console.log(this.staffSegments);
          if(!this.staffSegments || this.staffSegments.length == 0) {
              this.isSegmentSelected = false;
              $('#segment').focus();
              return;
          } else {
             this.isSegmentSelected = true;
          }

          console.log(this.staffSegments);
          this.data.leadSegments=this.staffSegments;

          if(this.contact_person.name) {

               if(!this.contact_person.mobile2){
                  this.contact_person.mobile2='';
               }
               this.tmp_list.push(this.contact_person);
          }

          if(this.tmp_list && this.tmp_list.length > 0) {
             this.data.leadContacts=this.tmp_list;
          } else {
             this.data.leadContacts=[];
          }

          console.log("hello");
          
          console.log(this.data);

          // if(this.data.leadType >13) {
          //      this.data.email = '';
          // }
          const activitydata2 = JSON.parse(JSON.stringify(this.data));
          if(activitydata2['assignTo']==''){
          delete activitydata2['assignTo'];
          delete activitydata2['tid'];}
          console.log(activitydata2);

          this.loader = true;
          this.service.fetchData(activitydata2,"lead/add/").subscribe((result)=>{
                console.log(result);
                this.staffSegments=[];
                if(result['message']!="Lead created successfully")
                {
                  // console.log("this. messages  is after result to be succe");
                      this.resmsg=result['message'];
                      this.msg.error(this.resmsg);
                      this.contact_person = {};
                }
                else {
                  // console.log("this. messages  is after result not to be succe");
                   if(this.userType == 2) {
                        this.msg.leadSaveSuccess();
                        this.data = {};
                        this.tmp_list=[];
                        this.contact_person = {};
                        // $('#mainForm').trigger('reset');
                        console.log(form);
                        form.resetForm();
                        setTimeout(() => {
                           this.data.leadType = 12;
                        }, 2000);
                        console.log("change the page here");
                        
                        this.route.navigate(['/lead-list']);

                   } else {

                    // console.log("this. messages  is after result not to be succe");
                        this.toast.openSucess('Lead Saved successfully','');
                        this.route.navigate(['/lead-list']);
                   }
                }
                this.loader = false;
          })
   }



   segmentList()
   {
     this.loader=true;
    this.service.fileData('','segment/list/').subscribe((response)=>{
      console.log(response);
      this.loader=false
      this.segmentlist=response['data'];
      console.log(this.segmentlist);
    });
   }


   addContactPerson()
   {
        console.log("hello");
        if(!this.contact_person.mobile2){
            this.contact_person.mobile2='';
        }
        this.tmp_list.push(this.contact_person);
        this.contact_person={};
        console.log(this.tmp_list);
   }


   removeContact(index)
   {
      this.tmp_list.splice(index,1);
   }

   tmpstateList:any=[];
   get_state()
   {
     this.loader=true;
    this.service.fileData('','state/list/').subscribe((response)=>{
      console.log(response);
      this.loader=false;
      this.statelist=response['data'];
      this.tmpstateList=this.statelist;
    });

  }
  tmpdistrictList:any=[];
  get_district()
  {
    this.loader=true
    this.data.district='';
    this.data.pin='';
    this.data.city='';
    let state_list=Array(this.data.state)
    this.service.fetchData(state_list,'district/list/').subscribe((response)=>{
      this.loader=false;
      console.log(response);
      this.districtlist=response['data'][0]['distrcits'];
      this.tmpdistrictList=this.districtlist;
      console.log(this.districtlist);
    });
  }

  tmpcityList:any=[];
  get_city()
  {
    this.loader=true;
    this.data.city='';
    this.data.pin='';
    this.service.fetchData(Array({"stateName":this.data.state,"distrcits":Array({"districtName":this.data.district})}),'city/list').subscribe((response)=>{
      console.log(response);
      this.loader=false;
      this.citylist=response['data'][0]['distrcits'][0]['cities'];
      this.tmpcityList=this.citylist;
      console.log(this.citylist);
    });
  }

  tmpPinList:any=[];
  get_pincode(stateMasterIds)
  {
    console.log(stateMasterIds);
    let cityarray=[];
    cityarray[0]=stateMasterIds;
    this.service.fetchData({'stateMasterIds':cityarray},'city/pincodes').subscribe((res)=>{
      console.log(res);
      this.areas=res['data'][0]['pinCodes'];
    });
  }

  segment:any=[];
  select_segment(value,index,event)
  {
        if(event.checked)
        {
          this.segment.push(value);
          console.log(this.segment);
          this.get_sales(this.data.pin);
          this.isSegmentSelected = true;
        }
        else
        {
          console.log(index);
          console.log(this.segment[0]);
              for( var j=0;j<this.segmentlist.length;j++)
              {
                if(this.segmentlist[index]['value']==this.segment[j])
                {
                  this.segment.splice(j,1);
                }
              }
            console.log(this.segment);
        }
  }



  state_array_filter(state)
  {
    this.tmpstateList=[];
    let value=state.toUpperCase();
    this.tmpstateList=[];
      for(var i=0; i<this.statelist.length; i++)
      {
        if(this.statelist[i].toUpperCase().search(value) !==-1)
        {
          this.tmpstateList.push(this.statelist[i]);
        }
      }
      console.log(this.tmpstateList);
  }

  district_array_filter(district)
  {
    this.districtlist=[];
    let value=district.toUpperCase();
      for(var i=0; i<this.tmpdistrictList.length; i++)
      {
        if(this.tmpdistrictList[i]['districtName'].toUpperCase().search(value) !==-1)
        {
          this.districtlist.push(this.tmpdistrictList[i]);
        }
      }
  }



  city_array_filter(city)
  {
    console.log(city);
    console.log(this.tmpcityList);
    this.citylist=[];
    let value=city.toUpperCase();
      for(var i=0; i<this.tmpcityList.length; i++)
      {
        if(this.tmpcityList[i]['cityName'].toUpperCase().search(value) !==-1)
        {
          this.citylist.push(this.tmpcityList[i]);
        }
      }
  }



  pin_array_filter(pin)
  {
    this.areas=[];
    console.log(this.tmpPinList);
    let value=pin;
    console.log(value);
      for(var i=0; i<this.tmpPinList.length; i++)
      {
        if(this.tmpPinList[i].toString().search(value) !==-1)
        {
          this.areas.push(this.tmpPinList[i]);
        }
      }
  }
}
