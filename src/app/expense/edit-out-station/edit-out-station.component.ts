import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConstantService } from 'src/app/constant.service';
import { DialogComponent } from 'src/app/dialog';
import { SnackBarOverview } from 'src/app/toast';
// import moment = require('moment');

@Component({
  selector: 'app-edit-out-station',
  templateUrl: './edit-out-station.component.html',
  styleUrls: ['./edit-out-station.component.scss']
})
export class EditOutStationComponent implements OnInit {
  
  userId:any;
  expenseList:any=[];
  userName:any;
  loader:any=false;
  div:any=false
  user:any={};
  userType:any;
  OutStationExpense:any={}
  expenseId:any;
  userRole:any;
  miscExpenselist:any={};
  journyExpense:any={}
  outStationHotelExp:any={}
  outStationFoodExp:any={}
  outStationLocalExp:any={}
  outStationMiscExp:any={};
  tmpJournyExpense:any=[]
  tmpoutStationHotelExp:any=[]
  tmpoutStationFoodExp:any=[]
  tmpoutStationLocalExp:any=[]
  tmpOutTravelMiscExp:any=[];
  currentDate:any = new Date().toJSON().split('T')[0];
  constructor(public route:ActivatedRoute,public service:ConstantService,public dialog:DialogComponent,public toast:SnackBarOverview,public router:Router) {
    this.user = JSON.parse(localStorage.getItem('user')) || [];
    console.log(this.user);
    this.userType = this.user.data.userType;
    this.userId = this.user.data.userId;
    this.userRole=this.user.data.role;
    console.log(this.userType ,"&" , this.userId, "&" ,this.userRole);
    this.route.params.subscribe( params => {
      console.log(params);
      this.expenseId = params.id;
      console.log(this.expenseId);
      if(this.expenseId)
      {
        this.getExpenseList(this.expenseId);
        // this.getDocument(this.expenseId) 
      }
    });
  }
  
  ngOnInit() {
  }
  url:any;
  requestfn:any;
  api:any;
  totalExpenseList:any=[];
  getExpenseList(expenseId)
  {
    this.loader=true;
    this.service.fileData("","expense/detail/"+expenseId).subscribe((result)=>{
      console.log(result);
      this.loader=false
      if(result['status']=='Success')
      {
        this.OutStationExpense=result['data'];
        this.tmpJournyExpense=this.OutStationExpense.outStationExpense.outStationTravelExp;
        this.tmpoutStationHotelExp=this.OutStationExpense.outStationExpense.outStationHotelExp;
        this.tmpoutStationFoodExp=this.OutStationExpense.outStationExpense.foodExpenses;
        this.tmpoutStationLocalExp=this.OutStationExpense.outStationExpense.outStationLocalExp;
        this.tmpOutTravelMiscExp=this.OutStationExpense.outStationExpense.miscExpenses;
        this.url = this.service.dburl;
        this.requestfn = 'download/document/';
        this.api = this.url+this.requestfn;
        if(this.tmpJournyExpense.length)
        {
          this.calculateOutTravelExpese(this.tmpJournyExpense)
        }
        if(this.tmpoutStationHotelExp.length)
        {
          this.calculateOutHotelExp(this.tmpoutStationHotelExp)
        }
        if(this.tmpoutStationFoodExp.length)
        {
          this.calculateOutStationFood(this.tmpoutStationFoodExp)
        }
        if(this.tmpoutStationLocalExp.length)
        {
          this.calculateOutStationLocalExp(this.tmpoutStationLocalExp)
        }
        if(this.tmpOutTravelMiscExp.length)
        {
          this.calculateOutMiscExp(this.tmpOutTravelMiscExp)
        }
      }
    })
  }
  myoutstationexpense(status)
  {
    this.OutStationExpense.status=status;
  }

  outTravelExpense()
  {
    this.OutStationExpense.outStationExpense={outStationHotelExp:this.tmpoutStationHotelExp,outStationLocalExp:this.tmpoutStationLocalExp,outStationTravelExp:this.tmpJournyExpense,foodExpenses:this.tmpoutStationFoodExp,miscExpenses:this.tmpOutTravelMiscExp};
    this.OutStationExpense.userId=this.userId;
    this.OutStationExpense.claimAmount=this.TotalClaimAmount;
    this.OutStationExpense.actualExpenseAmount=this.totalOutStationExp;
    this.loader=true
    this.service.fetchData(this.OutStationExpense,"expense/update").subscribe((result)=>{
      console.log(result);
      this.loader=false
      if(result['status']=='Success')
      {
        this.toast.openSucess("Expense","Update SuccessFully");
        this.router.navigate(['/expense-list']);
      }
    }) 
  }

  allowanceList:any=[]
  getAllowanceList(designation)
  {
    this.loader=true
    this.service.fetchData({designation:designation},"allowance/list").subscribe((result)=>{
      console.log(result);
      this.loader=false
      if(result['status']=='Success')
      {
        this.allowanceList=result['data'][0];
      }
      
    })
  }
  
  
  
  
  cityListArray:any=[]
  Arraycity:any={}
  cityList(city)
  {
    // this.loader=true;
    console.log(city);
    this.service.fileData("","city/list/"+city).subscribe((result)=>{
      console.log(result);
      if(result['status']=='Success')
      {
        this.cityListArray=result['data'];
      }
    })
    
  }
  picdata:any={}
  picvalue:any=[];
  deleteimg(picid,filename)
  {
    console.log(picid,filename);
    this.picdata.documentId=picid;
    this.picdata.action=2;
    this.picdata.fileName=filename;
    this.picdata.documentType=4;
    this.picdata.referenceId=this.expenseId;
    this.picvalue.push(this.picdata);
    console.log(this.picvalue);
    this.dialog.delete("Document").then((result) => {
      console.log(result);
      if(result)
      {
        this.loader=true;
        this.service.fetchData(this.picvalue,"document/update").subscribe((resp)=>
        { 
          console.log(resp);
          if(resp['status']=='Success')
          {
            this.toast.openSucess('Image Deleted Sucessfully','');
            this.loader=false;
            this.getExpenseList(this.expenseId);
            this.picvalue=[];
          }
          
        });
      }
    });
  }
  
  totalOutMiscExp:any=0
  calculateOutMiscExp(miscExp:any=[])
  {
    this.totalOutMiscExp=0;
    for(let i=0;i<miscExp.length;i++)
    {
      this.totalOutMiscExp=parseInt(this.totalOutMiscExp)+parseInt(miscExp[i].amount);
    }
    console.log(this.totalOutMiscExp);
    
  }
  
  
  totalOutStationExp:any=0;
  TotalClaimAmount:any=0;
  calculateTotalOutStationExp()
  {
    
    this.totalOutStationExp=parseInt(this.totalOutTravelExp)+parseInt(this.totalOutHotelExp)+parseInt(this.totalOutLocalExp)+parseInt(this.totalOutStationFoodExp)+parseInt(this.totalOutMiscExp);
    if(parseInt(this.totalOutStationExp)>parseInt(this.OutStationExpense.advanceAmount))
    {
      
      this.TotalClaimAmount=parseInt(this.totalOutStationExp)-parseInt(this.OutStationExpense.advanceAmount);
    }
    
  }
  
  totalOutStationFoodExp:any=0
  calculateOutStationFood(foodExpense)
  {
    this.totalOutStationFoodExp=0;
    for(let i=0;i<foodExpense.length;i++)
    {
      this.totalOutStationFoodExp=parseInt(this.totalOutStationFoodExp)+parseInt(foodExpense[i].billAmount)
    }
    console.log(this.totalOutStationFoodExp);
    
    this.calculateTotalOutStationExp();
    
  }
  
  totalOutTravelExp:any=0;
  calculateOutTravelExpese(outTravelExpenseArray)
  {
    this.totalOutTravelExp=0;
    for(let i=0;i<outTravelExpenseArray.length;i++)
    {
      this.totalOutTravelExp=parseInt(this.totalOutTravelExp)+parseInt(outTravelExpenseArray[i].amount)
    }
    this.calculateTotalOutStationExp();
  }
  
  totalOutHotelExp:any=0;
  calculateOutHotelExp(outHotelExpArray)
  {
    this.totalOutHotelExp=0;
    for(let i=0;i<outHotelExpArray.length;i++)
    {
      this.totalOutHotelExp=parseInt(this.totalOutHotelExp)+parseInt(outHotelExpArray[i].billAmount);
    }
    this.calculateTotalOutStationExp();
  }
  
  totalOutLocalExp:any=0;
  calculateOutStationLocalExp(OutstationTravelExpArray)
  {
    console.log(OutstationTravelExpArray);
    
    this.totalOutLocalExp=0;
    for(let i=0;i<OutstationTravelExpArray.length;i++)
    {
      this.totalOutLocalExp=parseInt(this.totalOutLocalExp)+parseInt(OutstationTravelExpArray[i].fare);
    }
    this.calculateTotalOutStationExp();
  }


  addToOutTravelExpense()
  {
    console.log(this.journyExpense);
    this.tmpJournyExpense.push(this.journyExpense)
    console.log(this.tmpJournyExpense);
    this.calculateOutTravelExpese(this.tmpJournyExpense);
    this.journyExpense={};
  }

  // tmpoutStationHotelExp:any=[];
  outStationHotelExpList()
  {
    console.log(this.outStationHotelExp);
    this.tmpoutStationHotelExp.push(this.outStationHotelExp);
    console.log(this.tmpoutStationHotelExp);
    this.calculateOutHotelExp(this.tmpoutStationHotelExp)
    this.outStationHotelExp={};
    this.Arraycity.city='';
    
  }

  outStationFoodExpList()
  {
    console.log(this.outStationFoodExp);
    this.tmpoutStationFoodExp.push(this.outStationFoodExp);
    this.calculateOutStationFood(this.tmpoutStationFoodExp);
    this.outStationFoodExp={};
    this.Arraycity.city='';
  }

  outStationLocalExpList()
  {
    console.log(this.outStationLocalExp);
    this.tmpoutStationLocalExp.push(this.outStationLocalExp);
    console.log(this.tmpoutStationLocalExp);
    this.calculateOutStationLocalExp(this.tmpoutStationLocalExp)
    this.outStationLocalExp={};
  }
  
  addOutMiscExpenseList()
  {
    this.tmpOutTravelMiscExp.push(this.outStationMiscExp);
    this.outStationMiscExp={};
    this.calculateOutMiscExp(this.tmpOutTravelMiscExp);
  }

  removeOutStationMiscExp(index)
  {
    this.tmpOutTravelMiscExp.splice(index,1);
  }
  
  removeOutLocalExps(index)
  {
    this.tmpoutStationLocalExp.splice(index,1);
  }
  removeOutFoodExpnse(index)
  {
    this.tmpoutStationFoodExp.splice(index,1)
  }
  
  removeOutHotelExps(index)
  {
    this.tmpoutStationHotelExp.splice(index,1);
  }
  removeOutTravelExps(index)
  {
    this.tmpJournyExpense.splice(index,1)
  }
  
  selectedFile:any=[];
  documentUrl:any=[];
  insertImage(data)
  {
    this.selectedFile=[];
    let files = data.target.files;
    if (files) {
      for (let file of files) {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.documentUrl.push(e.target.result);
        }
        reader.readAsDataURL(file);
      }
    }
    console.log(this.documentUrl);
    console.log(data.target.files.length);
    for(var i=0; i<data.target.files.length; i++)
    {
      this.selectedFile.push(data.target.files[i]);
    }
    
    setTimeout(() => {
      this.Insert_Image();
    }, 500);
  }
  misc_Expense_Document;
  Insert_Image()
  {
    this.misc_Expense_Document=new FormData;
    this.misc_Expense_Document.action=1;
    this.misc_Expense_Document.binaryData=this.documentUrl[this.documentUrl.length - 1];
    this.misc_Expense_Document.documentType=4;
    this.misc_Expense_Document['documentName'] = this.selectedFile[0].name;
    this.misc_Expense_Document.referenceId=this.expenseId;
    this.loader=true;
    for(var i=0; i<this.selectedFile.length; i++)
    {
      this.misc_Expense_Document.fileName = "image"+i+".jpg",this.selectedFile[i];
    }
    console.log(this.misc_Expense_Document);
    let value=[];
    value[0]=this.misc_Expense_Document;
    console.log(value);
    
    this.service.fetchData(value,"document/update").subscribe((resp)=>
    {
      console.log(resp);
      if(resp)
      {
        this.loader=false;
        this.getExpenseList(this.expenseId);
        this.toast.openSucess('Image Added Sucessfully','');
        
      }
    });
  }

  hotelCity:any={}
  selectedCity(city)
  {
    this.hotelCity=city;
    this.outStationHotelExp.city=city.city+'/'+city.stateName+'/'+city.districtName;
    this.outStationHotelExp.stateMasterId=city.stateMasterId;
    
    console.log(this.outStationHotelExp.city);
  }
  
  selectedFoodExpenseCity(city)
  {
    this.hotelCity=city;
    let value={stateMasterId:city.stateMasterId,city:city.city+'/'+city.stateName+'/'+city.districtName};
    console.log(value);
    this.outStationFoodExp.city=city.city+'/'+city.stateName+'/'+city.districtName;
    this.outStationFoodExp.stateMasterId=city.stateMasterId;
  }
  
  hotelcitydiv:any=false;
  hotelCityError:any=0;
  checkValidAmount(amount)
  {
    this.hotelCityError=0;
    this.hotelcitydiv=true;
    
    if(this.hotelCity.category=='A')
    {
      if(parseInt(amount)>parseInt(this.allowanceList.lodgingAllowanceA))
      {
        this.hotelCityError=1;
        this.hotelcitydiv=true;
        
      }
    }
    if(this.hotelCity.category=='B')
    {
      if(parseInt(amount)>parseInt(this.allowanceList.lodgingAllowanceB))
      {
        this.hotelcitydiv=true;
        this.hotelCityError=1
      }
    }
    if(this.hotelCity.category=='C')
    {
      if(parseInt(amount)>parseInt(this.allowanceList.lodgingAllowanceC))
      {
        this.hotelcitydiv=true;
        this.hotelCityError=1
      }
    }
    if(this.hotelCity.category=='A+')
    {
      if(parseInt(amount)>parseInt(this.allowanceList.lodgingAllowanceAPlus))
      {
        this.hotelcitydiv=true;
        this.hotelCityError=1
      }
    }
    console.log(this.hotelCityError);
    
  }
  
  foodCityError:any=0;
  checkValidFoodAmount(amount)
  {
    this.foodCityError=0;
    console.log("food");
    
    if(this.hotelCity.category=='A')
    {
      if(parseInt(amount)>parseInt(this.allowanceList.foodAllowanceA))
      {
        this.foodCityError=1
      }
    }
    if(this.hotelCity.category=='B')
    {
      if(parseInt(amount)>parseInt(this.allowanceList.foodAllowanceA))
      {
        this.foodCityError=1
      }
    }
    if(this.hotelCity.category=='C')
    {
      if(parseInt(amount)>parseInt(this.allowanceList.foodAllowanceA))
      {
        this.foodCityError=1
      }
    }
    if(this.hotelCity.category=='A+')
    {
      if(parseInt(amount)>parseInt(this.allowanceList.foodAllowanceAPlus))
      {
        this.foodCityError=1
      }
    }
    console.log(this.foodCityError);
  }
  
  modeError:any=0;
  checkValid(modeType)
  {
    console.log(modeType);
    this.modeError=0;
    if(modeType=='AC Buses')
    {
      if(this.allowanceList.travelBusAC==false)
      {
        this.modeError=1;
      }
    }
    if(modeType=='Non - AC Buses')
    {
      if(this.allowanceList.travelBusNonAC==false)
      {
        this.modeError=1;
      }
    }
    if(modeType=='2A')
    {
      if(this.allowanceList.travelTrain2A==false)
      {
        this.modeError=1;
      }
    }
    if(modeType=='3A')
    {
      if(this.allowanceList.travelTrain3A==false)
      {
        this.modeError=1;
      }
    }
    if(modeType=='SL')
    {
      if(this.allowanceList.travelTrainSL==false)
      {
        this.modeError=1;
      }
    }
    if(modeType=='Private')
    {
      if(this.allowanceList.travelTaxiPrivate==false)
      {
        this.modeError=1;
      }
    }
    if(modeType=='Economy Class')
    {
      if(this.allowanceList.travelTaxiShared==false)
      {
        this.modeError=1;
      }
    }
    if(modeType=='Shared')
    {
      if(this.allowanceList.flightEconomyClass==false)
      {
        this.modeError=1;
      }
      console.log(this.modeError);
    }
    
  }
  
  localFareError:any=0;
  checkValidLocalFare(modeType)
  {
    this.localFareError=0;
    if(modeType=='1')
    {
      if(this.allowanceList.localAuto!=true)
      {
        this.localFareError=1
      }
    }
    if(modeType=='2')
    {
      if(this.allowanceList.localBus!=true)
      {
        this.localFareError=1
      }
    }
    if(modeType=='3')
    {
      if(this.allowanceList.localTaxiAC!=true)
      {
        this.localFareError=1
      }
    }
    if(modeType=='4')
    {
      if(this.allowanceList.localTaxiNonAC!=true)
      {
        this.localFareError=1
      }
    }
    if(modeType=='5')
    {
      if(this.allowanceList.localTwoWheeler!=true)
      {
        this.localFareError=1
      }
    }
    
  }
}
