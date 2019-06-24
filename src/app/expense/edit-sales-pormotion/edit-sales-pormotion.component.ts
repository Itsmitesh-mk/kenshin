import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConstantService } from 'src/app/constant.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { SnackBarOverview } from 'src/app/toast';

@Component({
  selector: 'app-edit-sales-pormotion',
  templateUrl: './edit-sales-pormotion.component.html',
  styleUrls: ['./edit-sales-pormotion.component.scss']
})
export class EditSalesPormotionComponent implements OnInit {

  userId:any;
  expenseList:any=[];
  userName:any;
  loader:any=false;
  div:any=false
  user:any={};
  userType:any;
  salesExpense:any={}
  expenseId:any;
  userRole:any;
  promation_Expense:any={};
  totalrentalExp:any=0;
  totalfoodExpense:any=0;
  totalavAidsExpense:any=0;
  totalgiftsExpense:any=0;
  totalotherExpense:any=0;
  totalPromationalExp:any=0;
  currentDate:any = new Date().toJSON().split('T')[0];

  constructor(public route:ActivatedRoute,public service:ConstantService,public router:Router,public toast:SnackBarOverview) {
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
      }
      });
   }

  ngOnInit() {
  }
  url:any;
  requestfn:any;
  api:any;
  SalesExpenseList:any=[];
  getExpenseList(expenseId)
  {
    this.loader=true
    this.service.fileData("","expense/detail/"+expenseId).subscribe((result)=>{
      console.log(result);
      this.loader=false
      if(result['status']=='Success')
      {
        this.salesExpense=result['data'];
        console.log(this.salesExpense);
        console.log(this.salesExpense.salesPromotionExpense.salesPromotionExps);
        this.SalesExpenseList=this.salesExpense.salesPromotionExpense.salesPromotionExps;
        this.url = this.service.dburl;
        this.requestfn = 'download/document/';
        this.api = this.url+this.requestfn;
        this.calculatePromationalExpense(this.SalesExpenseList)
      }
    })
  }

  addToPromationList()
  {  
    this.promation_Expense.total=parseInt(this.promation_Expense.rentalExpenses)+parseInt(this.promation_Expense.foodExpense)+parseInt(this.promation_Expense.avAidsExpense)+parseInt(this.promation_Expense.giftsExpense)+parseInt(this.promation_Expense.miscExpense);
    this.SalesExpenseList.push(this.promation_Expense)
    this.calculatePromationalExpense(this.SalesExpenseList);
    this.promation_Expense={};

  }

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
  }
  removeExpense(index)
  {
    this.SalesExpenseList.splice(index,1);
  }

  promotionexpense()
  {
    this.loader=true;
    console.log(this.SalesExpenseList);
    this.salesExpense.actualExpenseAmount=this.totalPromationalExp;
    this.salesExpense.salesPromotionExpense={"salesPromotionExps":this.SalesExpenseList};
    console.log(this.salesExpense);
    this.service.fetchData(this.salesExpense,"expense/update").subscribe((result)=>{
      console.log(result);
      this.loader=false;
      if(result['status']=='Success')
      {
        this.toast.openSucess("Expense","Update SuccessFully");
        this.router.navigate(['/expense-list']);
      }
    })
  }

}
