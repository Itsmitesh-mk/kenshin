import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConstantService } from 'src/app/constant.service';
import * as moment from 'moment';
@Component({
  selector: 'app-detail-by-date',
  templateUrl: './detail-by-date.component.html',
  styleUrls: ['./detail-by-date.component.scss']
})
export class DetailByDateComponent implements OnInit {

  expenseId:any;
  data:any={};
  date:any;
  user:any={};
  userType:any;
  userId:any;
  userRole:any;
  expenseDetailList:any=[];
  expenseDate:any;
  loader:any=false;
  reasonDiv:any=false;
  localConveyances:any=[];
  salesPromotionExpense:any=[];
  outStationExpense:any=[];
  miscExpense:any=[];
  statusValue=['Forward For Approval','Reject'];
  // today=moment().
  constructor(public route:ActivatedRoute,public service:ConstantService) { 
    this.route.params.subscribe( params => {
      console.log(params);
      this.expenseId=params.id;
      console.log(this.date ,"&" , this.expenseId);
      if(params)
      {
          this.getExpenseDetail();
        }
      });
      this.user = JSON.parse(localStorage.getItem('user')) || [];
    console.log(this.user);
    this.userType = this.user.data.userType;
    this.userId = this.user.data.userId;
    this.userRole=this.user.data.role;
    console.log(this.userType ,"&" , this.userId, "&" ,this.userRole);
   
  }

  ngOnInit() {
  }
  url:any;
  requestfn:any;
  api:any;
  getExpenseDetail()
  {
    this.loader=true;
    this.service.fileData("","expense/detail/"+this.expenseId).subscribe((result)=>{
      console.log(result);
      this.loader=false;
      this.getUserList();
      if(result['status']=='Success')
      {
        this.expenseDetailList=result['data'];
        console.log(this.expenseDetailList);
        this.localConveyances=this.expenseDetailList.localHQExpense.localConveyances;
        this.salesPromotionExpense=this.expenseDetailList.salesPromotionExpense.salesPromotionExps;
        this.outStationExpense=this.expenseDetailList.outStationExpense;
        this.miscExpense=this.expenseDetailList.miscExpense.miscExp;

        console.log( this.outStationExpense);
        this.url = this.service.dburl;
        this.requestfn = 'download/document/';
        this.api = this.url+this.requestfn;
       
      }
    })
  }

  financeUserList:any=[];
  getUserList()
  {
    this.loader=true;
    this.service.fetchData({role:17, "currentPage": 1,"pageSize": 50},"user/list").subscribe((result)=>{
      console.log(result);
      this.loader=false;
      if(result['status']=='Success')
      {
        this.financeUserList=result['data'];
      }
    })
  }

  // expenseId:any=[];
  // action(event,id,index)
  // {
  //   if(event.checked)
  //   {
  //     this.expenseId.push(id);
  //     console.log(this.expenseId);
  //   }
  //   else
  //   {
  //     this.expenseId.splice(index,1);
  //   }
  // }

  expenseIds:any=[];
  // updateStatus()
  // {
  //   console.log(this.data.status);
  //   this.expenseIds.push(this.expenseId);
  //   this.data.userId=this.userId;
  //   this.data.expenseIds=this.expenseIds;
  //   console.log(this.data);
  //   this.service.fetchData(this.data,"expense/updatestatus").subscribe((result)=>{
  //     console.log(result);
  //     if(result['status']=='Success')
  //     {
  //       this.data={};
  //       this.getExpenseDetail();
  //     }
      
  //   })
    
  // }

  changeStatus()
  {
    // this.data={};
    if(this.data.status==6)
    {
      this.data.expenseId=this.expenseId;
      this.data.expenseApprovedRejectedBy=this.userId;
      this.data.expenseApprovedRejectedOn=moment().format('YYYY-MM-DD')

    }
    else{
      this.data.expenseId=this.expenseId;
      this.data.expenseApprovedBy=this.userId;
      this.data.expenseApprovedOn=moment().format('YYYY-MM-DD')
    }
    this.service.fetchData(this.data,"expense/approve").subscribe((result)=>{
      console.log(result);
      if(result['status']=='Success')
      {
        this.getExpenseDetail();
      }
      
    })
  }

  statusUpdate()
  {

    if(this.data.status==4)
    {
      this.data.expenseSanctionRejectedBy=this.userId
    }
    this.data.expenseId=this.expenseId
    // this.data.expenseSanctionedBy=this.userId
    this.data.expenseSanctionedOn=moment().format('YYYY-MM-DD');
   console.log(this.data);
   this.service.fetchData(this.data,"expense/sanction").subscribe((result)=>{
     console.log(result);
     if(result['status']=='Success')
     {
       this.getExpenseDetail()
     }
     
   })
    
  }
}
