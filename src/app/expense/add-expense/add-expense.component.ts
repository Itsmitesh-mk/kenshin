import { Component, OnInit, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { ConstantService } from 'src/app/constant.service';
import { Router } from '@angular/router';
import { iif } from 'rxjs';
import * as moment from 'moment';
import { IfStmt } from '@angular/compiler';
import { SnackBarOverview } from 'src/app/toast';
import { isPlatformBrowser } from '@angular/common';
import * as $ from 'jquery';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.scss']
})
export class AddExpenseComponent implements OnInit {
  @ViewChild('vehicleNumber') vehicleNumber: ElementRef;
  data:any={};
  user:any={};
  userType:any;
  userId:any;
  userRole:any;
  expenseForm:any={};
  localConvense:any={};
  localHQExpense:any={};
  localConveyances:any=[];
  userInformation:any={};
  allPromationExpense:any={};
  promation_Expense:any={};
  pExpenseArray:any=[];
  misc_Expense:any={};
  miscExpenselist:any={};
  msExpArray:any=[];
  OutStationExpense:any={};
  journyExpense:any={};
  outStationHotelExp:any={};
  outStationLocalExp:any={}
  designation:any;
  allowanceList:any=[];
  loader:any=false;
  outStationMiscExp:any={};
  currentDate:any = new Date().toJSON().split('T')[0];
  constructor(private el: ElementRef,public service:ConstantService,public route:Router,public toast:SnackBarOverview,@Inject(PLATFORM_ID) private platformId: Object) { 
    
    this.user = JSON.parse(localStorage.getItem('user')) || [];
    console.log(this.user);
    this.userType = this.user.data.userType;
    this.userId = this.user.data.userId;
    this.userRole=this.user.data.role;
    console.log(this.userType ,"&" , this.userId, "&" ,this.userRole);
    
    this.journyExpense.mode=2;
    this.OutStationExpense.claimAmount=0;
    this.OutStationExpense.advanceAmount=0
    if(this.userRole!=1)
    {
      this.designation=this.user.data.salesUser.designation;
    }
    console.log(this.designation);
    this.misc_Expense.claimAmount=0;
    this.misc_Expense.advanceAmount=0;
    this.localHQExpense.otherExpense=0;
    this.promation_Expense.rentalExpenses=0
    this.promation_Expense.foodExpense=0
    this.promation_Expense.avAidsExpense=0
    this.promation_Expense.giftsExpense=0
    this.promation_Expense.miscExpense=0
    this.promation_Expense.approvedAmount=0;
    this.allPromationExpense.advanceAmount=0;
    
    if(this.designation!=0 && this.userRole!=1)
    {
      this.getAllowanceList(this.designation);
    }
    
    this.getSeniorList();
    
  }
  
  ngOnInit() {
  }
  seniorList:any=[]
  getSeniorList()
  {
    this.loader=true;
    this.service.fileData("","getseniors/list").subscribe((result)=>{
      console.log(result);
      this.loader=false
      if(result['status']=='Success')
      {
        this.seniorList=result['data'];
      }
    })
  }
  
  urls:any=[];
  selectedFile:any=[];
  insertImage(data)
  {
    console.log(data);
    
    let files = data.target.files;
    if (files) {
      for (let file of files) {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.urls.push(e.target.result);
        }
        reader.readAsDataURL(file);
      }
    }
    console.log(this.urls);
    console.log(data.target.files.length);
    for(var i=0; i<data.target.files.length; i++)
    {
      this.selectedFile.push(data.target.files[i]);
    }
    
    console.log(this.selectedFile);
    
  }
  
  deleteimg(index)
  {
    this.urls.splice(index, 1);
    this.selectedFile.splice(index, 1);
  }
  setFocus(form) {
    for (var key in form.controls)
    {
      if (form.controls.hasOwnProperty(key)) {
        if(form.controls[key].status=='INVALID')
        {
          if (isPlatformBrowser(this.platformId)) {
            $('#'+key).focus();
          }
          break;
        }
        console.log(key + " -> " + form.controls[key].status);
      }
    }
    
  }
  
  
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
    console.log(city);
    this.service.fileData("","city/list/"+city).subscribe((result)=>{
      console.log(result);
      if(result['status']=='Success')
      {
        this.cityListArray=result['data'];
      }
    })
    
  }
  
  hotelCity:any={}
  selectedCity(city)
  {
    this.hotelCity=city;
    // let value={stateMasterId:city.stateMasterId,city:city.city+'/'+city.stateName+'/'+city.districtName};
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
  
  mylocalexpense(status)
  {
    this.localConvense.status=status;
  }
  myoutstationexpense(status)
  {
    console.log(status);
    
    this.OutStationExpense.status=status;
  }
  promotionexpense(status)
  {
    this.allPromationExpense.status=status;
  }
  allmiscexpense(status)
  {
    this.misc_Expense.status=status;
  }
  
  outTravelExpense()
  {
    this.OutStationExpense.outStationExpense={outStationHotelExp:this.tmpoutStationHotelExp,outStationLocalExp:this.tmpoutStationLocalExp,outStationTravelExp:this.tmpJournyExpense,foodExpenses:this.tmpoutStationFoodExp,miscExpenses:this.tmpOutTravelMiscExp};
    this.OutStationExpense.userId=this.userId;
    this.OutStationExpense.department=this.userInformation.userType;
    this.OutStationExpense.expenseType=this.expenseForm.form;
    // this.OutStationExpense.expenseSanctioner=this.expenseForm.expenseSanctioner;
    this.OutStationExpense.claimAmount=this.TotalClaimAmount;
    this.OutStationExpense.actualExpenseAmount=this.totalOutStationExp;
    console.log(this.OutStationExpense);
    
    this.loader=true
    this.service.fetchData(this.OutStationExpense,"expense/add").subscribe((result)=>{
      console.log(result);
      this.loader=false
      if(result['status']=='Success')
      {
        this.uploadBillAttechment(result['data']);
        this.toast.openSucess("Expense","Added SuccessFully");
        this.route.navigate(['/expense-list']);
      }
    }) 
  }
  uploadBillAttechment(id)
  {
    let documentData = {};
    console.log(this.urls);
    
    let value:any = [];

    for(let j=0;j<this.urls.length;j++)
    {  
      documentData = new FormData;
      documentData['action']=1;
      documentData['binaryData']=this.urls[j];
      documentData['documentType']=4;
      documentData['documentName'] = this.selectedFile[0].name;
      documentData['referenceId']=id;
      this.loader=true;
      
      for(var i=0; i<this.selectedFile.length; i++)
      {
        
        if(this.selectedFile[i].type == 'application/pdf') {
          documentData['fileName'] = "document"+i+".pdf",this.selectedFile[i];
        } else {
          documentData['fileName'] = "document"+i+".jpg",this.selectedFile[i];
        }
      }

      value.push(documentData);
    }
    console.log(documentData);

    console.log(value);
    
    this.service.fetchData(value,"document/update").subscribe((resp)=>
    {
      console.log(resp);
      if(resp)
      {
        this.loader=false;
        this.toast.openSucess('Document Added Sucessfully','');
      }
    });
    
  }

  tmpOutTravelMiscExp:any=[];
  addOutMiscExpenseList()
  {
    this.tmpOutTravelMiscExp.push(this.outStationMiscExp);
    this.outStationMiscExp={};
    this.calculateOutMiscExp(this.tmpOutTravelMiscExp);
  }

  removeOutStationMiscExp(index)
  {
    this.tmpOutTravelMiscExp.splice(index,1);
    this.calculateOutMiscExp(this.tmpOutTravelMiscExp);
  }

  calculateOutMiscExp(miscExp:any=[])
  {
    this.totalOutMiscExp=0;
    for(let i=0;i<miscExp.length;i++)
    {
      this.totalOutMiscExp=parseInt(this.totalOutMiscExp)+parseInt(miscExp[i].amount);
    }
    console.log(this.totalOutMiscExp);
    
  } 
  
  totalOutMiscExp:any=0
  tmpJournyExpense:any=[];
  addToOutTravelExpense()
  {
    console.log(this.journyExpense);
    this.tmpJournyExpense.push(this.journyExpense)
    console.log(this.tmpJournyExpense);
    this.calculateOutTravelExpese(this.tmpJournyExpense);
    this.journyExpense={};
  }

  removeOutTravelExpense(index)
  {
    this.tmpJournyExpense.splice(index,1);
    this.calculateOutTravelExpese(this.tmpJournyExpense);
  }

   
  tmpoutStationHotelExp:any=[];
  outStationHotelExpList()
  {
    this.tmpoutStationHotelExp.push(this.outStationHotelExp);
    this.calculateOutHotelExp(this.tmpoutStationHotelExp)
    this.outStationHotelExp={};
    this.Arraycity.city='';
    this.hotelcitydiv=false;
    
  }

  removeOutStationHotelExpense(index)
  {
    this.tmpoutStationHotelExp.splice(index,1);
    this.calculateOutHotelExp(this.tmpoutStationHotelExp);
  }
  
  tmpoutStationLocalExp:any=[];
  outStationLocalExpList()
  {
    console.log(this.outStationLocalExp);
    this.tmpoutStationLocalExp.push(this.outStationLocalExp);
    console.log(this.tmpoutStationLocalExp);
    this.calculateOutStationLocalExp(this.tmpoutStationLocalExp)
    this.outStationLocalExp={};
  }

  removeOutStatonLocalExp(index)
  {
    this.tmpoutStationLocalExp.splice(index,1);
    this.calculateOutStationLocalExp(this.tmpoutStationLocalExp);

  }
  
  outStationFoodExp:any={};
  tmpoutStationFoodExp:any=[];
  outStationFoodExpList()
  {
    console.log(this.outStationFoodExp);
    this.tmpoutStationFoodExp.push(this.outStationFoodExp);
    this.calculateOutStationFood(this.tmpoutStationFoodExp);
    this.outStationFoodExp={};
    this.Arraycity.city='';
  }

  removeOutStationFoodExp(index)
  {
    this.tmpoutStationFoodExp.splice(index,1);
    this.calculateOutStationFood(this.tmpoutStationFoodExp);
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
    this.totalOutLocalExp=0;
    for(let i=0;i<OutstationTravelExpArray.length;i++)
    {
      this.totalOutLocalExp=parseInt(this.totalOutLocalExp)+parseInt(OutstationTravelExpArray[i].fare);
    }
    this.calculateTotalOutStationExp();
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
  LocalConvenseExpense()
  {
    this.localConvense.localHQExpense={"localConveyances":this.localConveyances};
    this.localConvense.userId=this.userId;
    this.localConvense.department=this.userInformation.userType;
    this.localConvense.expenseType=this.expenseForm.form;
    this.localConvense.claimAmount=this.totalLocalExp;
    this.localConvense.actualExpenseAmount=this.totalLocalExp;
    console.log(this.localConvense);
    this.loader=true;
    this.service.fetchData(this.localConvense,"expense/add").subscribe((result)=>{
      console.log(result);
      this.loader=false
      if(result['status']=='Success')
      {
        this.uploadBillAttechment(result['data']);
        this.route.navigate(['/expense-list']);
        this.toast.openSucess("Expense","Added SuccessFully");
      }
    })
  }

  calculateAmount(mode:any,km:any)
  {
    console.log(this.allowanceList);
    if(mode==9)
    {
      this.localHQExpense.amount=parseFloat(this.allowanceList.selfCarPerKM)*parseFloat(km);
    }
    if(mode==8)
    {
      this.localHQExpense.amount=parseFloat(this.allowanceList.selfBikePerKM)*parseFloat(km);

    }
    console.log(this.localHQExpense.amount);
    
  }
  readonlyArea=false;
  readonlyValue(value)
  {
    if(value==1)
    {
      this.readonlyArea=true
    }
    if(value==2)
    {
      this.readonlyArea=false;
    }
    
  }
  addToLocalConvenseList()
  {
    console.log(this.localHQExpense);
    this.localConveyances.push(this.localHQExpense)
    this.localHQExpense={};
    this.calculateLocalExpense(this.localConveyances);
    console.log(this.localConveyances);
  }
  
  removeLocalConvenseList(index)
  {
    this.localConveyances.splice(index,1);
    this.calculateLocalExpense(this.localConveyances);
  }
  otherLocalExp:any=0;
  localExp:any=0;
  totalLocalExp:any=0;
  calculateLocalExpense(localExpArray)
  {
    this.otherLocalExp=0;
    this.localExp=0;
    this.totalLocalExp=0;
    for(let i=0;i<localExpArray.length;i++)
    {
      this.otherLocalExp=parseInt(this.otherLocalExp)+parseInt(localExpArray[i].otherExpense);
      this.localExp=parseInt(this.localExp)+parseInt(localExpArray[i].amount);
    }
    this.totalLocalExp=parseInt(this.otherLocalExp)+parseInt(this.localExp);
  }
  
  promationExpense()
  {
    this.allPromationExpense.salesPromotionExpense={"salesPromotionExps":this.pExpenseArray};
    this.allPromationExpense.department=this.userInformation.userType;
    this.allPromationExpense.userId=this.userId;
    this.allPromationExpense.expenseType=this.expenseForm.form;
    this.allPromationExpense.actualExpenseAmount=this.totalPromationalExp;
    console.log(this.allPromationExpense);
    this.loader=true
    this.service.fetchData(this.allPromationExpense,"expense/add").subscribe((result)=>{
      console.log(result);
      this.loader=false
      if(result['status']=='Success')
      {
        this.uploadBillAttechment(result['data']);
        this.route.navigate(['/expense-list']);
        this.toast.openSucess("Expense","Added SuccessFully");
        
      }
    })
    
  }
  addToPromationList()
  {
    this.promation_Expense.total=parseInt(this.promation_Expense.rentalExpenses)+parseInt(this.promation_Expense.foodExpense)+parseInt(this.promation_Expense.avAidsExpense)+parseInt(this.promation_Expense.giftsExpense)+parseInt(this.promation_Expense.miscExpense)+parseInt(this.promation_Expense.approvedAmount);
    this.pExpenseArray.push(this.promation_Expense);
    console.log(this.pExpenseArray);
    this.calculatePromationalExpense(this.pExpenseArray);
    this.promation_Expense={};
    this.promation_Expense.rentalExpenses=0;
    this.promation_Expense.foodExpense=0;
    this.promation_Expense.avAidsExpense=0;
    this.promation_Expense.giftsExpense=0;
    this.promation_Expense.miscExpense=0;
    this.promation_Expense.approvedAmount=0;
  }

  removeSalesPromotionalList(index)
  {
    this.pExpenseArray.push(index,1);
    this.calculatePromationalExpense(this.pExpenseArray);
 
  }


  
  totalrentalExp:any=0;
  totalfoodExpense:any=0;
  totalavAidsExpense:any=0;
  totalgiftsExpense:any=0;
  totalotherExpense:any=0;
  totalPromationalExp:any=0;
  calculatePromationalExpense(promationalExpArray)
  {
    this.totalrentalExp=0
    this.totalfoodExpense=0
    this.totalavAidsExpense=0
    this.totalgiftsExpense=0
    this.totalotherExpense=0
    this.totalPromationalExp=0
    for(let i=0;i<promationalExpArray.length;i++)
    {
      this.totalrentalExp=parseInt(this.totalrentalExp)+parseInt(promationalExpArray[i].rentalExpenses);
      this.totalfoodExpense=parseInt(this.totalfoodExpense)+parseInt(promationalExpArray[i].foodExpense);
      this.totalavAidsExpense=parseInt(this.totalavAidsExpense)+parseInt(promationalExpArray[i].avAidsExpense);
      this.totalgiftsExpense=parseInt(this.totalgiftsExpense)+parseInt(promationalExpArray[i].giftsExpense);
      this.totalotherExpense=parseInt(this.totalotherExpense)+parseInt(promationalExpArray[i].miscExpense);
    }
    this.totalPromationalExp=parseInt(this.totalrentalExp)+parseInt(this.totalfoodExpense)+parseInt(this.totalavAidsExpense)+parseInt(this.totalgiftsExpense)+parseInt(this.totalotherExpense);
    if(parseInt(this.totalPromationalExp)>parseInt(this.allPromationExpense.advanceAmount))
    {this.allPromationExpense.claimAmount=parseInt(this.totalPromationalExp)-parseInt(this.allPromationExpense.advanceAmount)}
   
  }
  
  miscExpense()
  {
    this.misc_Expense.miscExpense={"miscExp":this.msExpArray};
    this.misc_Expense.department=this.userInformation.userType;
    this.misc_Expense.userId=this.userId;
    this.misc_Expense.expenseType=this.expenseForm.form;
    this.misc_Expense.actualExpenseAmount=this.totalMiscExp;
    console.log(this.misc_Expense);
    this.loader=true
    this.service.fetchData(this.misc_Expense,"expense/add").subscribe((result)=>{
      console.log(result);
      this.loader
      if(result['status']=='Success')
      {
        this.uploadBillAttechment(result['data']);
        this.route.navigate(['/expense-list']);
        this.toast.openSucess("Expense","Added SuccessFully");
        
      }
    })
  }
  
  addToMiscExpenseList()
  {
    this.msExpArray.push(this.miscExpenselist);
    this.miscExpenselist={};
    this.calculateMiscExp(this.msExpArray);
    console.log(this.msExpArray);
  }

  removeMiscExpenseList(index)
  {
    this.msExpArray.splice(index,1);
    this.calculateMiscExp(this.msExpArray);

  }
  
  totalMiscExp:any=0
  calculateMiscExp(miscExpenseArray)
  {
    this.totalMiscExp=0;
    this.misc_Expense.claimAmount=0
    for(let i=0;i<miscExpenseArray.length;i++)
    {
      this.totalMiscExp=parseInt(this.totalMiscExp)+parseInt(miscExpenseArray[i].amount);
    }
    if(parseInt(this.totalMiscExp)>parseInt(this.misc_Expense.advanceAmount))
    {
      this.misc_Expense.claimAmount=parseInt(this.totalMiscExp)-parseInt(this.misc_Expense.advanceAmount)
    }
  }
  
  openExpenseForm()
  {
    if(this.userType==1)
    {
      this.userInformation.userName=this.user.data.userName;
      this.userInformation.userType='System User'
      if(this.userRole==1)
      {
        this.userInformation.role='Admin'
      }
      else if(this.userRole==2)
      {
        this.userInformation.role='Human Resource'
      }
      else if(this.userRole==3)
      {
        this.userInformation.role='Accounts'
      }
      else if(this.userRole==4)
      {
        this.userInformation.role='Marketing Co-ordinator'
      }
      else if(this.userRole==5)
      {
        this.userInformation.role='Business Head'
      }
    }
    else if(this.userType==2)
    {
      this.userInformation.userName=this.user.data.userName;
      this.userInformation.userType='Sales User'
      if(this.userRole==6)
      {
        this.userInformation.role='National Manager'
      }
      else if(this.userRole==7)
      {
        this.userInformation.role='Regional Manager'
      }
      else if(this.userRole==8)
      {
        this.userInformation.role='Area Manager'
      }
      else if(this.userRole==9)
      {
        this.userInformation.role='Zonal Manger'
      }
      else if(this.userRole==10)
      {
        this.userInformation.role='Territory Incharge'
      }
    }
    else{
      
    }
    console.log("FormOpen");
    console.log(this.expenseForm);
    
    
  }
}
