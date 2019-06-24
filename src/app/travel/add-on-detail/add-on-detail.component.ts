import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ConstantService } from 'src/app/constant.service';
import { SnackBarOverview } from 'src/app/toast';
import { Router } from '@angular/router';
import * as moment from 'moment';


@Component({
  selector: 'app-add-on-detail',
  templateUrl: './add-on-detail.component.html',
  styleUrls: ['./add-on-detail.component.scss']
})
export class AddOnDetailComponent implements OnInit {
  loader:any=false;
 dropdownSettings:any={}
 dropdownSettings1:any={}
 dropdownSettings2:any={}
 tmpDistrictArray:any=[];
 selectedState:any={};
 selectedDistrict:any={};
 myselectedcity:any={};
 planDate:any;
 travelPlanID:any;
 userId:any;
 month:any;
 status:any;
 oldTravelDetail:any=[];
travelData:any={};
dayArray:any=[];
year:any
tmpdate:any;
  constructor(@Inject(MAT_DIALOG_DATA)public data,public service:ConstantService,public dialog:MatDialog,public toast:SnackBarOverview,public rout:Router) { 
    this.travelData=data.olddata
    // this.getStateList();
    console.log(data);
    this.oldTravelDetail=data.olddata.travelDetails;
    this.travelPlanID=data['id'];
    this.planDate=data['date'];
    this.tmpdate=this.planDate;
    this.userId=data['userId'];
    this.status=data['status'];
    this.month=data['olddata']['month'];
    this.year=data['olddata']['year'];
    console.log(this.month);    
    console.log( this.year);
    // if()
    console.log(this.planDate);
    
        
  }

  ngOnInit()
  {
    this.getState();
  this.seletDate(this.month)
  

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'state',
      textField: 'state',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      
      allowSearchFilter: true
    };
    this.dropdownSettings1 = {
      singleSelection: false,
      idField: 'districtName',
      textField: 'districtName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      
      allowSearchFilter: true
    };

    this.dropdownSettings2 = {
      singleSelection: false,
      idField: 'city',
      textField: 'city',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true
    };
  }
gState:any=[];
gDistrict:any=[];
gCity:any=[];

seletDate(month)
{ 
   
  if(month=='January' || month=='March' || month=='May' || month=='July'|| month=='August' || month=='October' || month=='December')
  {
     for(let i=1;i<=31;i++)
   {
    let planDate=month+"/"+i+"/"+this.year;
    let date=moment(planDate).format('YYYY-MM-DD hh:mm:ss');
    this.dayArray.push(date);
  
   } 
  }
  else if(month=='February')
  {
   let days;
   if(parseInt(this.data.year)%4==0)
   {
     days=29;
   }
   else
   {
     days=28;
   }
   for(let j=1;j<=days;j++)
   {

    let planDate=month+"/"+j+"/"+this.year;
    let date=moment(planDate).format('YYYY-MM-DD hh:mm:ss');
    this.dayArray.push(date);

   } 
 } 
else
{
  for(let k=1;k<=30;k++)
  {
   let planDate=month+"/"+k+"/"+this.year;
   let date=moment(planDate).format('YYYY-MM-DD hh:mm:ss ');
   this.dayArray.push(date);

 }
}
this.loader=false;
}


getState()
{
      this.loader=true;
      this.service.fileData('','state/list/').subscribe((response)=>{
      this.loader=false;
      console.log(response);
      this.gState=response['data'];
      console.log(this.gState);
      
      });
}

getDistrict(state)
{
  this.tmpDistrictArray=[];
  this.loader=true;
  this.service.fetchData({states:state},'districtinstate/list').subscribe((response)=>{
    this.loader=false;
    console.log(response);
    this.gDistrict=response['data']
    const districtArray = [];
        for( let i=0;i<this.gDistrict.length;i++)
        {
          let index=districtArray.findIndex(row=>row.districtName===this.gDistrict[i].districtName);
          if(index==-1)
          {
            districtArray.push(this.gDistrict[i]);
          }
        }

        this.tmpDistrictArray = districtArray;

        console.log(this.tmpDistrictArray);
  });
}
getCity(district)
{
  this.gCity=[];
  this.loader=true;
  this.service.fetchData({districts:district},'citiesindistrict/list').subscribe((response)=>{
    console.log(response);
    this.loader=false
    this.gCity=response['data'];
    console.log(this.gCity);
  });
}

selectedcity:any=[];
traveldetail:any=[];
newTravelonDate:any=[];
onCitySelect(cityName)
{
  console.log(cityName);
  this.selectedcity=cityName;
}

// calculateBudget(budget)
// {
//   console.log(budget);
//   this.data.salesBudget=parseInt(this.data.salesBudget)+parseInt(budget);
// }

addTravelOnDetail()
{ 
  console.log(this.planDate);
  
  console.log(this.selectedcity);

  for(let i=0;i<this.selectedcity.length;i++)
    {
        for(let j=0;j<this.gCity.length;j++)
        {
        if(this.selectedcity[i]==this.gCity[j].city)
        {
          this.traveldetail.push({district:this.gCity[j].districtName,city:this.selectedcity[i]})
        }
        }
    }
  
      for(let i=0;i<this.traveldetail.length;i++)
      {
        for(let j=0;j<this.tmpDistrictArray.length;j++)
        {
        if(this.traveldetail[i].district==this.tmpDistrictArray[j].districtName)
        {
          this.newTravelonDate.push({planDate:this.planDate,state:this.tmpDistrictArray[j].stateName,district:this.traveldetail[i].district,city:this.traveldetail[i].city,isSalesActivity:false,activityType:0,salesBudget:0})
        }
      }
    }
    console.log(this.newTravelonDate);
    this.selectedDistrict.districtName=[]
    this.myselectedcity.city=[]
    this.selectedState.state=[]
    
}
onClick()
{
  this.loader=true;

  console.log(this.newTravelonDate);
  for(let i=0;i<this.newTravelonDate.length;i++)
  {
    this.oldTravelDetail.push(this.newTravelonDate[i]);
    if(this.newTravelonDate[i].isSalesActivity!=null)
    {
      this.travelData.budget=parseInt(this.travelData.budget)+parseInt(this.newTravelonDate[i].salesBudget)
      this.travelData.salesBudget=parseInt(this.travelData.salesBudget)+parseInt(this.newTravelonDate[i].salesBudget)
    }
  }
  console.log(this.travelData);
  

//   let value={'travelPlanID':this.travelPlanID,'userId':this.userId,'status':this.status,'month':this.month,'travelDetails':this.newTravelonDate}
// console.log(value);

this.service.fetchData(this.travelData,"travelplan/update").subscribe((result)=>{
  console.log(result);
  this.loader=false

  if(result['status']=='Success')
      {
          // this.rout.navigate(['detail-travel']);
          this.toast.openSucess(result['message'],"Success");
      }
      else{
        this.toast.openError(result['message'],"Error");
      }
  
});
    
}

removePlan(index) {
  // this.data.budget=parseInt(this.data.travelBudget)-parseInt(this.dayArray[i].details.salesBudget)
  this.newTravelonDate.splice(index,1);

} 

}  

