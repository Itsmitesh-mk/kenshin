import { Component, OnInit, Renderer2 ,PLATFORM_ID, Inject} from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { ConstantService } from 'src/app/constant.service';
import { SnackBarOverview } from 'src/app/toast';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogComponent } from 'src/app/dialog';
import * as $ from 'jquery';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-add-distribution',
  templateUrl: './add-distribution.component.html',
  animations: [slideToTop()]
})
export class AddDistributionComponent implements OnInit {
distribution_form:any={};
leadstatemasteroid:any;
networkContacts:any=[];
statelist:any=[];
st:any=[];
salesUser:any=[];
message:any=[];
districtlist:any=[];
saleslist:any=[];
territoryId:any;
district1:any=[];
citylist:any=[];
districts1:any=[];
cities:any=[];
districts2:any=[];
cities1:any=[];
areas:any=[];
loader:any=false;
rolelists:any;
client1:any=[];
segmentlist:any=[];
checked:any;
networkSegments:any=[];
networkShippings:any={};
shippingState:any=[];
shippingDistrict:any=[];
shippingCity:any=[];
shippingPin:any=[];
leadId:any={};
leaddetail:any={};

birthMinDate:any;
birthMaxDate:any;
currentDate:any;

isShippingAddressSame:any = '';
  constructor(public db:ConstantService,
              public toast:SnackBarOverview,
              public router:Router,
              private renderer: Renderer2,
              public msg:DialogComponent,@Inject(PLATFORM_ID) private platformId: Object) {
                this.networkShippings.country='India';
                this.get_state();
                this.getshippingState();
                this.renderer.removeClass(document.body, 'nav-active');
                this.leadId= JSON.parse(localStorage.getItem('leadId')) || [];
                localStorage.setItem('leadId', JSON.stringify(''));
                console.log(this.leadId);
                this.distribution_form.networkContacts = [];
                this.currentDate = new Date();
  }



  ngOnInit() {
    this.distribution_form.role=12;
    this.rolelist();
    this.segment_list();
    console.log(this.leadId.referenceId);
    if(this.leadId.referenceId){
      this.show_details();
    }
  }

  leadsegment:any=[];
  show_details(){
    this.loader=true;
    this.db.fileData(this.leadId.referenceId,'lead/detail/').subscribe((response)=>{
    console.log(response);
    this.leaddetail=response['data'];
    console.log(this.leaddetail);
    this.distribution_form.establishment=this.leaddetail.establishment;
    this.distribution_form.street=this.leaddetail.street;
    this.distribution_form.mobile=this.leaddetail.mobile;
    this.distribution_form.email=this.leaddetail.email;
    this.distribution_form.landline=this.leaddetail.landline;
    this.distribution_form.networkContacts=this.leaddetail.leadContacts;
    this.distribution_form.state=this.leaddetail.state;
    this.distribution_form.city=this.leaddetail.city;
    this.distribution_form.district=this.leaddetail.district;
    this.distribution_form.pin=this.leaddetail.pin;
    this.distribution_form.source=this.leaddetail.source;
  console.log(this.leaddetail.leadSegments);
    for(var t=0;t<this.leaddetail.leadSegments.length;t++){
      console.log(this.leaddetail.leadSegments[t].segment)
      this.leadsegment.push(this.leaddetail.leadSegments[t].segment);
      }
      console.log(this.leadsegment);
      this.distribution_form.segment=this.leadsegment;
      console.log(this.distribution_form.sgment);
    setTimeout(() => {
      this.get_district();
    this.get_city();
    }, 1000);
    setTimeout(() => {
      this.get_sales_terrtory(this.distribution_form.pin)
    }, 900);
    
    });
  }



  setFocus(form, contactForm) {
      for (var key in form.controls)
      {
          if (form.controls.hasOwnProperty(key)) {
              if(form.controls[key].status=='INVALID')
              {
                if (isPlatformBrowser(this.platformId)) {
                          $('#'+key).focus();
                        }
                        return true;
              }
              console.log(key + " -> " + form.controls[key].status);
          }
      }
      
      console.log(contactForm.controls);
      for (var key in contactForm.controls)
      {
          if (contactForm.controls.hasOwnProperty(key)) {
            if(contactForm.controls[key].status=='INVALID')
            {
                if (isPlatformBrowser(this.platformId)) {
                        console.log(key);
                        $('#'+key).focus();
                        $(window).scrollTop(150);
                }
                console.log(key);
                return true;
            }
              console.log(key + " -> " + contactForm.controls[key].status);
          }
      }
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



  segment_list(){
    this.db.fileData('','segment/list/').subscribe((response)=>{
      console.log(response);
      this.segmentlist=response['data'];

    });
  }


  shipping:any=[];
  onSubmit() {
      this.loader=true;
      if(this.distribution_form.salesUsers) {
            for(var i=0;i < this.distribution_form.salesUsers.length;i++) {
                for(var j=0;j < this.sales_user_data.length;j++) {
                    if(this.distribution_form.salesUsers[i]==this.sales_user_data[j].userId){
                        this.salesUser.push({'salesUserId':this.sales_user_data[i].userId,'territoryId':this.sales_user_data[i].territoryId,'salesUserName':this.sales_user_data[i].userName,'salesUserRole':this.sales_user_data[i].role});
                    }
                }
            }
      }

      console.log(this.salesUser);
      console.log('hello');

      for(let i=0;i<this.distribution_form.segment.length;i++) {

           this.networkSegments.push( {"segmentCode": this.distribution_form.segment[i],
          "segment": this.distribution_form.segment[i]});
      }


        if(this.distribution_form.name) {

            if(!this.distribution_form.mobile2 || this.distribution_form.mobile2 == null) {
               this.distribution_form.mobile2 = '';
            }

            this.distribution_form.networkContacts.push({name:this.distribution_form.name,mobile1:this.distribution_form.mobile1,mobile2:this.distribution_form.mobile2});
        }


      this.shipping.push(this.networkShippings);
      this.distribution_form.salesUsers=this.salesUser;
      this.distribution_form.networkSegments=this.networkSegments;
      this.distribution_form.country="India";
      this.distribution_form.networkShippings=this.shipping;
      console.log(this.distribution_form);
      console.log(this.distribution_form.salesUsers);

      const distributionData = JSON.parse(JSON.stringify(this.distribution_form));
      delete distributionData['financialYear'];
      delete distributionData['targetLimit'];

     this.db.fetchData(distributionData,'network/add').subscribe((response)=>
     {
            console.log(response)
            this.networkSegments=[];
            if(response['status']=="Success")
            {
                if(response['data']) {
                      let sanddata={'financialYear':this.distribution_form.financialYear,'networkId':response['data'],'targetLimit':this.distribution_form.targetLimit};
                      console.log(sanddata);
                      this.db.fetchData(sanddata,'network/limit/add').subscribe((resp)=>{
                           console.log(resp);
                           this.loader=false;
                           this.toast.openSucess('Distributor Network added successfully','');
                           this.router.navigate(['/distribution-list']);
                      })
                }
                console.log(this.leadId.taskId);
                if(this.leadId.taskId){
                  this.leadId.leadConverted=true;
                  let value={"taskId":this.leadId.taskId,"userId":this.leadId.userId,"taskStatus":2,"leadConverted":this.leadId.leadConverted,"referenceId":this.leadId.referenceId,'taskType':this.leadId.taskType};
                  this.db.fetchData(value,"task/update").subscribe((result)=>{
                 console.log(result);
                 if(result['status']=='Success')
                  {
                    setTimeout(() => {
                      this.toast.openSucess('Task Closed Successfully','');
                    }, 1000);
                    
                    }
                  })
             }
            }
            else
            {
                  this.loader=false;
                  this.distribution_form.name="";
                  this.distribution_form.mobile1="";
                  this.distribution_form.mobile2="";
                  this.msg.error(response['message']);
            };
     })
}



removeContact(index)
{
  this.distribution_form.networkContacts.splice(index,1);
}



add_contact(){

      if(this.distribution_form.mobile2==null)
      {
          this.distribution_form.mobile2=0;
      }

      this.distribution_form.networkContacts.push({name:this.distribution_form.name,mobile1:this.distribution_form.mobile1,mobile2:this.distribution_form.mobile2});

      console.log(this.distribution_form.networkContacts);

      this.distribution_form.country="India";
      this.distribution_form.name="";
      this.distribution_form.mobile1="";
      this.distribution_form.mobile2="";
}



territoryList:any=[];
get_sales(pin){
  this.loader=true;
  console.log(pin);
  console.log('hello');
  this.db.fileData(pin,'territorybypin/').subscribe((response)=>{
    console.log(response);
    this.loader=false
    if(response['status']=='Success')
    {
      this.territoryId=response['data'];
      console.log(this.territoryId);
      const territoryIDs = [];
      for (let index = 0; index < this.territoryId.length; index++){
           territoryIDs.push(this.territoryId[index].territoryId);
      }
      console.log(territoryIDs);
      this.loader=true;
    }
  })
}






sales_user_data:any=[];
get_sales_user(data,event,index){
  this.sales_user_data=[];
  console.log(data);
  console.log(event);
  console.log(index);
 console.log(this.distribution_form.salesuserrole);
  this.db.fetchData({},'territory/salesusers?territoryIds='+data).subscribe((response)=>{
        console.log(response);
        let tempuserdata=response['data'];

        const role=tempuserdata.filter(x=>x.role==this.distribution_form.salesuserrole)
        if(role.length!=0)
        {
          console.log(role);
          this.sales_user_data=role;
        }
        // else{
        //   const role=tempuserdata.filter(x=>x.role==8)
        //   if(role.length!=0)
        //   {
        //     console.log(role);
        //     this.sales_user_data=role;
        //   }
        //   else
        //   {
        //       const role=tempuserdata.filter(x=>x.role==7)
        //       if(role.length!=0)
        //       {
        //         console.log(role);
        //         this.sales_user_data=role;
        //       }
        //       else{
        //         const role=tempuserdata.filter(x=>x.role==6)
        //       if(role.length!=0)
        //       {
        //         console.log(role);
        //         this.sales_user_data=role;
        //       }
        //       }
        //   }
        // }
      })
    console.log(this.sales_user_data);
}


rolelists1:any=[];
AllUserList:any=[]
rolelist1() {
  this.loader=true;
  this.db.fileData('','usertype/list').subscribe((response)=>{
        console.log(response);
        this.rolelists1=response['data'];
        this.loader=false;
        let filterrolelead= this.rolelists1.filter(x => x.userTypeId==2);
          this.AllUserList=filterrolelead[0].roles;
          console.log(this.AllUserList);
      });
    }

    // userList(role){
    //   console.log(role);
    //   const rolee=this.saleslist.filter(x=>x.role==role);
    //             this.territoryList = [];
    //             if(role.length != 0)
    //             {
    //                 console.log(rolee);
    //                 this.territoryList = rolee;
    //             }
    //   }



  get_sales_terrtory(pin){
    if(!pin){
      pin=this.distribution_form.pin;
    }
    console.log(this.distribution_form.segment);
    this.db.fetchData({'pinCode':pin,"segments":this.distribution_form.segment },'territory/list').subscribe((response)=>{
        console.log(response);
        this.loader=false;
        this.saleslist =response['data'];
        // this.saleslist=response['data'][0]['salesUsers'];
        console.log(this.saleslist);
 })
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




get_state(){
  console.log("stats runnning.....");
  this.loader=true;
  this.db.fileData('','state/list/').subscribe((response)=>{
    console.log(response);
    this.loader=false;
    this.statelist=response['data'];
    this.shippingState=response['data'];
  });
}




get_district(){
  this.loader=true;
  console.log("district running....");
  
  //  this.distribution_form.district='';
  //  this.distribution_form.pin='';
  //  this.distribution_form.city='';
  console.log(this.distribution_form.state);
  this.st=Array(this.distribution_form.state)
  this.db.fetchData(this.st,'district/list/').subscribe((response)=>{
    this.loader=false;
    console.log(response);
    this.districtlist=response['data'];
    this.district1=this.districtlist[0].distrcits;
    this.shippingDistrict=response['data'][0].distrcits;
    console.log(this.district1);
  });
}



get_city() {
  this.loader=true;
  console.log(this.distribution_form.state);
  console.log(this.distribution_form.district);
  console.log("city runniyng..");
  this.db.fetchData(Array({"stateName":this.distribution_form.state,"distrcits":Array({"districtName":this.distribution_form.district})}),'city/list').subscribe((response)=>{
    console.log(response);
    this.loader=false
    this.citylist=response['data'];
    this.districts1=this.citylist[0].distrcits;
    // this.shippingCity=response['data'][0].cities;
    this.cities=this.districts1[0].cities;
    this.shippingCity= JSON.parse(JSON.stringify(this.cities)); 
    console.log(this.cities);
    let statemasterdata=[];
    statemasterdata=this.cities.filter(x => x.cityName==this.distribution_form.city);
    console.log(statemasterdata);
    this.leadstatemasteroid=statemasterdata[0]['stateMasterId'];
    console.log(this.leadstatemasteroid);
      this.get_pincode(this.leadstatemasteroid);
  });
}



get_pincode(stateMasterId){
  this.loader=true;
  console.log(stateMasterId);
  let cityarray=[];
    cityarray[0]=stateMasterId;
  // this.loader=true;
  // this.distribution_form.pin='';
  // console.log(this.distribution_form.state,this.distribution_form.district,this.distribution_form.city);
  this.db.fetchData({'stateMasterIds':cityarray,},'city/pincodes').subscribe((response)=>{
    console.log(response);
    this.loader=false
    this.citylist=response['data'];
    // this.districts2=this.citylist[0].distrcits;
    // this.cities1=this.districts2[0].cities;
    // let filterpincode= this.cities1.filter(x => x.cityName==this.distribution_form.city);
    this.areas=response['data'][0].pinCodes;
    this.shippingPin=this.areas;
    console.log( this.areas);
    console.log(this.cities1);
  });
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
  this.st=Array(state)
  this.db.fetchData(this.st,'district/list/').subscribe((response)=>{
    this.loader=false;
    console.log(response);
    this.shippingDistrict=response['data'][0].distrcits;
    console.log(this.district1);
  });
}



getShippingCity(state,district)
{
  this.db.fetchData(Array({"stateName":state,"distrcits":Array({'districtName':district})}),'city/list').subscribe((response)=>{
    console.log(response);
    this.loader=false
    this.shippingCity=response['data'][0].distrcits[0].cities;
    console.log(this.shippingCity);
  });
}



getShippingPin(stateMasterId)
{
  this.loader=true;
  console.log(stateMasterId);
  let cityarray=[];
    cityarray[0]=stateMasterId;
  this.db.fetchData({'stateMasterIds':cityarray},'city/pincodes').subscribe((response)=>{
    console.log(response);
    this.loader=false
    this.shippingPin=response['data'][0]['pinCodes'];
    // this.districts2=this.citylist[0].distrcits;
    // this.cities1=this.districts2[0].cities;
    // let filterpincode= this.cities1.filter(x => x.cityName==this.networkShippings.city);
    // this.shippingPin=filterpincode[0].pinCodes;
  });
}



sameAsAddress(event)
{
    console.log(event);
    if(event.checked)
    {
        this.isShippingAddressSame = 'Yes';
        this.networkShippings.state=this.distribution_form.state;
        this.networkShippings.district=this.distribution_form.district;
        this.networkShippings.pin=this.distribution_form.pin;
        console.log(this.distribution_form.city);
        console.log("check city of address");
        this.networkShippings.city=this.distribution_form.city;
        this.networkShippings.street=this.distribution_form.street;
    } else {
        this.isShippingAddressSame = 'No';
        this.networkShippings.state=''
        this.networkShippings.district=''
        this.networkShippings.pin=''
        this.networkShippings.city=''
        this.networkShippings.street=''
    }
}


}
