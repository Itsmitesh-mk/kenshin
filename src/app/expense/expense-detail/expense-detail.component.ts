import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConstantService } from 'src/app/constant.service';

@Component({
  selector: 'app-expense-detail',
  templateUrl: './expense-detail.component.html',
  styleUrls: ['./expense-detail.component.scss']
})
export class ExpenseDetailComponent implements OnInit {

  userId:any;
  expenseList:any=[];
  userName:any;
  loader:any=false;
  div:any=false
  user:any={};
  userType:any;
  // userId:any;
  userRole:any;
  constructor(public route:ActivatedRoute,public service:ConstantService) {
    this.user = JSON.parse(localStorage.getItem('user')) || [];
    console.log(this.user);
    this.userType = this.user.data.userType;
    this.userId = this.user.data.userId;
    this.userRole=this.user.data.role;
    console.log(this.userType ,"&" , this.userId, "&" ,this.userRole);
    this.route.params.subscribe( params => {
      console.log(params);
      this.userId = params.id;
      console.log(this.userId);
      if(this.userId)
      {
        this.getExpenseList();
      }
      });
   }

  ngOnInit() {
  }

  getExpenseList()
  {
    this.div=false;
      this.loader=true;
      this.service.fetchData({"userId": this.userId,"currentPage": 1,"pageSize": 50},"expense/list").subscribe((result)=>{
        console.log(result);
        this.loader=false;
        if(result['status']=='Success')
        {
          this.expenseList=result['data'];
          this.userName=this.expenseList[0]['userName'];
        }
        if(result['status']=='Failed')
        {
          this.div=true;
        }
      })
  }

}
