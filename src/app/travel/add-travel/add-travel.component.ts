import { Component, OnInit } from '@angular/core';
import { ConstantService } from 'src/app/constant.service';
import { Router } from '@angular/router';
import { SnackBarOverview } from 'src/app/toast';
import * as moment from 'moment';
import { DialogComponent } from 'src/app/dialog';
@Component({
  selector: 'app-add-travel',
  templateUrl: './add-travel.component.html'
})
export class AddTravelComponent implements OnInit {

  tmp_month:any=[];
  data:any={};
    user:any={};
    userType:any;
  userId:any;
  userRole:any;
  loader:any=false;
  shippingState:any=[];
  shippingDistrict:any=[];
  shippingCity:any=[];
  day:any={};
  state:any=[];
monthArray:any=["January",
 "February",
 "March",
 "April",
 "May",
 "June",
 "July",
 "August",
 "September",
 "October",
 "November",
 "December"];

 tmpArray=[]=this.monthArray;
 dropdownSettings:any={}
 dropdownSettings1:any={}
 dropdownSettings2:any={}
 tmpDistrictArray:any=[];
 seniors:any=[];

  constructor(public service:ConstantService,public rout:Router,public toast:SnackBarOverview,public alrt:DialogComponent) {

    this.data.travelBudget=0;
    this.data.salesBudget=0;
    this.data.budget=0;

    this.user = JSON.parse(localStorage.getItem('user')) || [];
    console.log(this.user);
    this.userType = this.user.data.userType;
    this.userId = this.user.data.userId;
    this.userRole=this.user.data.role;
    console.log(this.userType ,"&" , this.userId, "&" ,this.userRole);
    // if(this.user)
    // {
    //   if(this.userType==2)
    //   {
    //     // this.loader=true;
    //     // this.categoryList()
    //     // this.userTypeList();
    //     // this.getSegmentList();
    //     // this.getOemList();
    //   }

    // }
    let month=moment().format('M');
    for(let i=parseInt(month)-1;i<this.monthArray.length;i++)
    {
     this.tmp_month.push(this.monthArray[i]); 
    }

   }

   yearArray:any=[];
  ngOnInit() {
    this.getSenior();

    let currentyear=moment().format('YYYY');
     
    this.yearArray.push(currentyear);
    this.yearArray.push(parseInt(currentyear)+1);
    this.yearArray.push(parseInt(currentyear)+2);
    console.log(this.yearArray);
    this.getshippingState();
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'state',
      textField: 'state',
      closeDropDownOnSelection:true,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
      maxHeight: 197
};
this.dropdownSettings1 = {
  singleSelection: false,
  idField: 'districtName',
  textField: 'districtName',
  selectAllText: 'Select All',
  unSelectAllText: 'UnSelect All',
  allowSearchFilter: true,
  maxHeight: 197
}; 

this.dropdownSettings2 = {
  singleSelection: false,
  idField: 'city',
  textField: 'city',
  selectAllText: 'Select All',
  unSelectAllText: 'UnSelect All',
  allowSearchFilter: true,
  maxHeight: 197
};
  }

getSenior()
{
  this.service.fileData(" ",'getseniors/list').subscribe((response)=>{
    this.loader=false;
    console.log(response);
    if(response['status']=='Success')
      {
        this.seniors=response['data'];
        console.log(this.seniors);
        
      }
  });
}
  // day:any={};
  planArray:any=[];
  onClick()
  {
    for(let i=0;i<this.dayArray.length;i++)
    {
      if(this.dayArray[i].details.length!=0)
      {
        for(let j=0;j<this.dayArray[i].details.length;j++)
        {
         console.log(this.dayArray[i].details);
         
          if(this.dayArray[i].details[j].isSalesActivity=='Yes')
          {
            console.log(this.dayArray[i].details[j].activityType);
            
            this.planArray.push({planDate:moment(this.dayArray[i].planDate).format('YYYY-MM-DD'),state:this.dayArray[i].details[j].state,district:this.dayArray[i].details[j].district,city:this.dayArray[i].details[j].city,isSalesActivity:true,salesBudget:this.dayArray[i].details[j].salesBudget,activityType:this.dayArray[i].details[j].activityType});
          }
          else{
            this.planArray.push({planDate:moment(this.dayArray[i].planDate).format('YYYY-MM-DD'),state:this.dayArray[i].details[j].state,district:this.dayArray[i].details[j].district,city:this.dayArray[i].details[j].city,isSalesActivity:false});
          }
        }
      }
    }
    

    console.log(this.planArray);
    
    this.loader=true;
    console.log(this.dayArray);
    this.data.month=this.numberofMonth;
    this.data.userId=this.userId;
    this.data.travelDetails=this.planArray;
    if(this.seniors.length==0)
    {
      this.data.travelApprover=1;
    }
    console.log(this.data);
    this.service.fetchData(this.data,"travelplan/add").subscribe((result)=>{
      console.log(result);
      this.loader=false
      if(result['status']=='Success')
      {
          this.rout.navigate(['list-travel']);
          this.toast.openSucess(result['message'],"Success");
      }
      else{
        this.toast.openError(result['message'],"Error");
      }
    })
  }

  travelStatus(status)
  {
    this.data.status=status;
  }
 
  // files: FileList; 
  //   filestring: string; 
  //   uploadFile(event) { 
  //       this.files = event.target.files; 
  //       var reader = new FileReader(); 
  //       reader.onload = this._handleReaderLoaded.bind(this); 
  //       reader.readAsBinaryString(this.files[0]); 
  //   } 
 
  //   _handleReaderLoaded(readerEvt) { 
  //       var binaryString = readerEvt.target.result; 
  //       this.filestring = btoa(binaryString);
  //       this.data.excelFile=this.filestring;
        
  //       console.log(this.data);
            
  //  } 

   monthDiv:any=false;
   divmonth(year)
   {
    console.log(year);
     if(year==moment().format('YYYY'))
     {
       this.monthArray=[];
       this.monthArray=this.tmp_month;
       console.log("true");
     }
     else{
      this.monthArray=this.tmpArray;
     }

      this.monthDiv=true;
   }
 
   numberofMonth:any;
   dayArray:any=[];
   planDetail:any=[];
   addTravel(month)
   {
     this.loader=true;
     console.log(month);
    
    //  let currentmonth=moment().format('M');
     this.numberofMonth=moment().month(month).format("M");
     this.dayArray=[];
    
        if(month=='January' || month=='March' || month=='May' || month=='July'|| month=='August' || month=='October' || month=='December')
        {
         for(let i=1;i<=31;i++)
         {
           let planDate=month+"/"+i+"/"+this.data.year;
           let date=moment(planDate).format('YYYY-MM-DD hh:mm:ss a Z');
           this.planDetail.push({state:'',district:'',city:''});
           this.dayArray.push({planDate:date, details: [],salesactivity:'No'});
         } 
        }
        else if(month=='February')
        {
          let days;
          if(parseInt(this.data.year)%4==0)
          {
            days=29;
          }
          else{
            days=28;
          }
         for(let j=1;j<=days;j++)
         {
   
           let planDate=month+"/"+j+"/"+this.data.year;
           let date=moment(planDate).format('YYYY-MM-DD hh:mm:ss a Z');
           this.planDetail.push({state:'',district:'',city:''});
           this.dayArray.push({planDate:date, details: [],salesactivity:'No'});
   
         } 
        }
        else{
         for(let k=1;k<=30;k++)
         {
           let planDate=month+"/"+k+"/"+this.data.year;
           let date=moment(planDate).format('YYYY-MM-DD hh:mm:ss a Z');
           this.planDetail.push({state:'sdfd',district:'sdfdf',city:'sfdsf'});
           this.dayArray.push({planDate:date, details: [],salesactivity:'No'});
   
         }
        }
        this.loader=false;
      }
     
      getshippingState()
      {
        this.loader=true;
        this.service.fileData('','state/list/').subscribe((response)=>{
          console.log(response);
          this.loader=false;
          this.shippingState=response['data'];
        });
      }
    getShippingDistrict(state,i)
    {
      console.log(state);
      
      // this.planDetail[i].state=state;
      // console.log(state);
      // let statename=state[state.length-1];
      //  console.log(statename);

      // console.log(this.planDetail[i]);
      this.state=state;
        
      this.loader=true;
      this.service.fetchData({states:state},'districtinstate/list').subscribe((response)=>{
        this.loader=false;
        console.log(response);
        this.shippingDistrict=response['data']

        const districtArray = [];
        for( let i=0;i<this.shippingDistrict.length;i++)
        {
          let index=districtArray.findIndex(row=>row.districtName===this.shippingDistrict[i].districtName);
          if(index==-1)
          {
            districtArray.push(this.shippingDistrict[i]);
          }
        }

        this.tmpDistrictArray = districtArray;

        console.log(this.tmpDistrictArray);
        
        // console.log(this.shippingDistrict);
        
        // console.log(this.district1);
      });
      
    }
    
    selectedDistrictArray:any=[];
    finalCityArray:any=[];
    getShippingCity(district,i)
    {
      console.log(district);
      
      console.log(this.tmpDistrictArray);
      
      console.log(this.selectedDistrictArray);
      this.planDetail[i].district=district
      console.log(this.planDetail[i].district);
      
      this.loader=true;
      this.service.fetchData({districts:district},'citiesindistrict/list').subscribe((response)=>{
        console.log(response);
        this.loader=false
        this.shippingCity=response['data'];
        console.log(this.shippingCity);
      });
    }

    traveldetail:any=[];
    selectedcity:any=[];
    finaldetail:any=[];

    travelcity(city,i)
    {
      console.log(city);
      this.selectedcity=city;
      this.planDetail[i].city=city
    }

    calculateBudget(budget)
    {
      console.log(budget);
      this.data.salesBudget=parseInt(this.data.salesBudget)+parseInt(budget);
      this.data.budget=parseInt(this.data.travelBudget)+parseInt(this.data.salesBudget);
      
    }
   original_data=[];
   
    travelList(index)
    {
     
      for(let i=0;i<this.selectedcity.length;i++)
      {
        for(let j=0;j<this.shippingCity.length;j++)
        {
        if(this.selectedcity[i]==this.shippingCity[j].city)
        {
          this.traveldetail.push({district:this.shippingCity[j].districtName,city:this.selectedcity[i]})
        }
        }
      }
      console.log(this.traveldetail);
      
      for(let i=0;i<this.traveldetail.length;i++)
      {
        for(let j=0;j<this.tmpDistrictArray.length;j++)
        {
        if(this.traveldetail[i].district==this.tmpDistrictArray[j].districtName)
        {
          this.dayArray[index].details.push({state:this.tmpDistrictArray[j].stateName,district:this.traveldetail[i].district,city:this.traveldetail[i].city,isSalesActivity:'No',activityType:'',salesBudget:0});
          // this.data.budget=parseInt(this.data.travelBudget)+parseInt(this.dayArray[index].details.salesBudget);
        }
        }
      }
      console.log(this.finaldetail);

      // console.log(this.planDetail);
      // this.dayArray[index].details.push(this.finaldetail);
      this.finaldetail=[];
      console.log(this.dayArray[index]);
      console.log(this.dayArray);
      // console.log(this.planDetail[index].state);
      
      // this.shippingDistrict=[]
      // this.shippingCity=[];
     
      this.dayArray[index].state='';
      this.dayArray[index].district='';
      this.dayArray[index].city='';

      // console.log(this.planDetail[index].state);

      
    }   
    removePlan(i,index) {
      this.data.budget=parseInt(this.data.travelBudget)-parseInt(this.dayArray[i].details.salesBudget)
      this.dayArray[i].details.splice(index,1);

    } 

}
