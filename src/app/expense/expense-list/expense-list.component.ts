import { Component, OnInit } from '@angular/core';
import {formatDate } from '@angular/common';
import { ConstantService } from 'src/app/constant.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ThrowStmt } from '@angular/compiler';
import * as moment from 'moment';
// import moment = require('moment');

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.scss']
})
export class ExpenseListComponent implements OnInit {
  user:any={};
  userType:any;
  userId:any;
  userRole:any;
  salesUserList:any=[];
  date= new Date();
  today = '';
  loader:any=false;
  div:any=false;
  expenseList:any=[]
  userName:any;
  expenseStatus:any=2;
  data:any={};
  currentPage:any=1;
  pageSize:any=50;
  constructor(public service:ConstantService,public router:Router) {
    this.today = formatDate(this.date, 'dd-MM-yyyy hh:mm:ss a','en-US','+0530');
    console.log(this.today);
    this.user = JSON.parse(localStorage.getItem('user')) || [];
    console.log(this.user);
    this.userType = this.user.data.userType;
    this.userId = this.user.data.userId;
    this.userRole=this.user.data.role;
    this.expenseStatus=2;
    console.log(this.userType ,"&" , this.userId, "&" ,this.userRole);
    if(this.userId)
    {
      this.filter.expense=1;
      this.getExpenseList(this.filter.expense,this.expenseStatus);
      
    }
    
    
  }
  
  ngOnInit() {
  }
  
  filterData:any={}
  filter:any={}
  tmpExpenseList:any=[];
  
  getExpenseList(status,expenseStatus)
  {
    if(this.filterData.createdOn)
    {
      this.filterData.createdOn=moment(this.filterData.createdOn).format('YYYY-MM-DD')
    }
    this.expenseList=[];
    this.expenseStatus=expenseStatus;
    
    console.log(status);
    if(this.userRole!=17)
    { 
      if(status==1)
      {
        
        this.filterData.createById=this.userId;
        this.filterData.currentPage=1
        this.filterData.pageSize=this.pageSize
        this.filterData.status=expenseStatus;
        
      }
      else{
        this.filterData.currentPage=1
        this.filterData.pageSize=this.pageSize
        this.filterData.createById=undefined;
        this.filterData.status=expenseStatus
      }
    }
    else{
      this.filterData.currentPage=1
      this.filterData.pageSize=this.pageSize
      this.filterData.status=3
    }
    
    this.div=false;
    this.loader=true;
    this.service.fetchData(this.filterData,"expense/list").subscribe((result)=>{
      console.log(result);
      this.loader=false;
      if(this.userRole!=17)
      {
        if(status==1)
        {
          if(expenseStatus==2)
          {
            this.getSenctionerPendingList(3)
          }
          if(expenseStatus==6)
          {
            this.getSenctionerPendingList(4)
          }
        }
        if(result['status']=='Success')
        {
          this.expenseList=result['data'];
          this.tmpExpenseList=result['data'];
          // this.userName=this.expenseList[0]['userName'];
          if(status==2)
          {
            const expenseArray=this.tmpExpenseList.filter(row=>row.createdBy!=this.userId && row.status!=1);
            
            console.log(expenseArray);
            
            this.expenseList=expenseArray;
          }
          
        }
      }
      else if(result['status']=='Success')
      {
        this.expenseList=result['data'];
      }
      if(result['status']=='Failed')
      {
        this.div=true;
      }
    })
  }
  
  pendingExpenseList:any;
  getSenctionerPendingList(status)
  {
        this.filterData.createById=this.userId;
        this.filterData.currentPage=1
        this.filterData.pageSize=this.pageSize
        this.filterData.status=status;
    this.loader=true;
    this.service.fetchData(this.filterData,"expense/list").subscribe((result)=>{
      console.log(result);
      this.loader=false
      if(result['status']=='Success')
      {
        this.pendingExpenseList=result['data'];
        this.expenseList=this.expenseList.concat(this.pendingExpenseList);
        console.log(this.expenseList);
        
      }
    })
  }
  
  clearfilter()
  {
    this.filterData.createdByName=undefined;
    this.filterData.createdOn=undefined;
    this.filterData.expenseType=undefined;
    this.getExpenseList(this.filter.expense,this.expenseStatus)
    // filterData.expenseType|| filterData.createdOn||filterData.createdByName
  }
  editExpense(id,type)
  {
    console.log(id,type);
    if(type==1)
    {
      this.localExpensePage(id);
    }
    if(type==2)
    {
      this.outStationExpensePage(id)
    }
    if(type==3)
    {
      this.salesPromotionPage(id)
    }
    if(type==4)
    {
      this.miscExpensePage(id)
    }
  }
  
  outStationExpensePage(id)
  {
    this.router.navigate(['/edit-out-station/'+id])
  }
  miscExpensePage(id)
  {
    this.router.navigate(['/editmisc/'+id])
    
  }
  localExpensePage(id)
  {
    this.router.navigate(['/edit-local-expense/'+id])
    
  }
  salesPromotionPage(id)
  {
    this.router.navigate(['/edit-sales-pormotion/'+id])
    
  }
  
  // onScrollDown(event) {
  
  //   console.log('down down down to the bottom of the sea',event);
  //   var next = parseInt(this.currentPage) + parseInt(this.pageSize);
  //   console.log(next);
  
  //   this.getExpenseList(this.filter.expense,this.expenseStatus);
  
  // }
  
}
