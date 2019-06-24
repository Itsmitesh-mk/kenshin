import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ConstantService } from 'src/app/constant.service';
import { SnackBarOverview } from 'src/app/toast';


@Component({
  selector: 'app-update-travel',
  templateUrl: './update-travel.component.html',
  styleUrls: ['./update-travel.component.scss']
})
export class UpdateTravelComponent implements OnInit {

  travelData:any={};
  planData:any={};
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  dropdownSettings1 = {};
  dropdownSettings2 = {};
  sendData:any={};
  loader:any=false;
  constructor(@Inject(MAT_DIALOG_DATA)public data,public service:ConstantService,public dialog:MatDialog,public toast:SnackBarOverview) {
    console.log(data);
    this.travelData=data['value'];
    if(data!=null)
    {
      this.planData=data['value']
      console.log(this.planData);
      
      this.planData.state=[this.travelData.state];
      this.planData.districtName=[this.travelData.district];
      console.log(this.planData.districtName); 
      this.planData.cityName=[this.travelData.city];
      // this.sendData.state=this.planData.state;
      // this.sendData.city=this.planData.cityName;
      // this.sendData.district=this.planData.districtNames;
      // this.sendData.salesActivity=this.travelData.salesActivity;
      this.sendData.salesBudget=this.travelData.salesBudget;
      this.sendData.travelDetailId=this.travelData.travelDetailId;
      this.sendData.travelPlanID=data['id']; 
      this.sendData.isSalesActivity=this.travelData.salesActivity;
      this.sendData.activityType=this.travelData.activityType;
     
      console.log(this.sendData);
      this.getStateList();
    }
    
    

    console.log(this.planData);
    

   }

  ngOnInit() {

    // this.dropdownList = [
    //   { item_id: 1, item_text: 'Mumbai' },
    //   { item_id: 2, item_text: 'Bangaluru' },
    //   { item_id: 3, item_text: 'Pune' },
    //   { item_id: 4, item_text: 'Navsari' },
    //   { item_id: 5, item_text: 'New Delhi' }
    // ];
    // this.selectedItems = [
    //   { item_id: 3, item_text: 'Pune' },
    //   { item_id: 4, item_text: 'Navsari' }
    // ];
    this.dropdownSettings = {
      singleSelection: true,
      idField: 'state',
      textField: 'state',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      
      allowSearchFilter: true
    };
    this.dropdownSettings1 = {
      singleSelection: true,
      idField: 'districtName',
      textField: 'districtName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      
      allowSearchFilter: true
    };
    this.dropdownSettings2 = {
      singleSelection: true,
      idField: 'cityName',
      textField: 'cityName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
     
      allowSearchFilter: true
    };
  }
  onItemSelect(item: any) {
    this.sendData.city=item[0];
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
    

  update_travel()
  {
    console.log(this.sendData);
    this.service.fetchData(this.sendData,"traveldetail/update").subscribe((result)=>{
      console.log(result);
      if(result['status']=="Success")
      {
        this.toast.openSucess("Travel Plan Update","SuccessFully");
        this.dialog.closeAll();
      }
    })
    
  }
  travelStateList:any=[];
  getStateList()
  {
    
    this.loader=true;
    this.service.fileData('','state/list/').subscribe((response)=>{
      console.log(response);
      this.loader=false;
      if(response['status']=='Success')
      {
        this.travelStateList=response['data'];
        this.getDistrictList(this.planData.state);
      }
    });
  }
  travelDistrictList:any=[];
getDistrictList(state)
{  
  console.log(state);
  this.sendData.state=state[0];
  this.travelDistrictList=[];
  // console.log(state);
  
  this.loader=true;
  this.service.fetchData(this.planData.state,'district/list/').subscribe((response)=>{
    this.loader=false;
    console.log(response);
    if(response['status']=='Success')
    {
      this.travelDistrictList=response['data'][0].distrcits;
      this.getCityList(this.planData.city)
    }
    // console.log(this.district1);
  });
}
travelCityList:any=[];
getCityList(district)
{
  this.travelCityList=[];
  this.sendData.district=district;
  console.log(district);
  // this.planDetail[i].district=district
  this.loader=true;
  this.service.fetchData(Array({"stateName":this.planData.state[0],"distrcits":Array({'districtName':this.planData.districtName[0]})}),'city/list').subscribe((response)=>{
    console.log(response);
    this.loader=false
    if(response['status']=='Success')
    {this.travelCityList=response['data'][0].distrcits[0].cities;}
    // console.log(this.shippingCity);
  });
}
travelcity(city,i)
{
  // this.planDetail[i].city=city
}

}
