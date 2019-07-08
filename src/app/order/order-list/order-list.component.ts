import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { ConstantService } from '../../constant.service';
import { sessionStorage }  from '../../local-storage.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { esLocale } from 'ngx-bootstrap';


@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  animations: [slideToTop()]
  
})
export class OrderListComponent implements OnInit {
  loader:any=false;
  orderlist:any=[];
  userdata:any=[];
  senddata:any;
  div:any=false
  orderDiv:any
  userData:any={}
  userType:any;
  userId:any;
  userRole:any;
  cartActive:boolean=false
  orderActive:boolean=false
  pendingActive:boolean=false
  holdActive:boolean=false
  approvedActive:boolean=false
  pendingOrderQty:any=[];
  approvedOrderQty:any=[];
  holdOrderQty:any=[];
  draftOrderQty:any=[];
  constructor(public db:ConstantService,public user:sessionStorage,public router: Router) {
    this.userData = JSON.parse(localStorage.getItem('user')) || [];
    console.log(this.user);
    this.userType = this.userData.data.userType;
    this.userId = this.userData.data.userId;
    this.userRole=this.userData.data.role;
    this.pendingActive=true
  }
  
  ngOnInit() {
    this.userdata=this.user['user']['data'];
    if(this.userdata['userType']==3){
      console.log(this.userdata['distributerNetwork']['networkId']);
    }
    this.order_list(0,1);
    this.getPendingOrderCount();
    this.getApprovedOrderCount();
    this.getHoldOrderCount();
    this.getDraftOrderCount();
    this.getAllOrderCount();
  }
  data:any={}
  createdaDate:any;
  order_list(dealerStatus,companyStatus)
  {
    this.orderlist=[];
    this.finalOrderList=[];
    this.div=false
    let date;
    if(this.createdaDate)
    {
      console.log(this.createdaDate);
      
      date=moment(this.createdaDate).format('YYYY-MM-DD');
      this.data.createdOn=date;
    }
    this.loader=true;
    // this.data.createdOn=moment(this.data.createdOn).format('YYYY-MM-DD')
    console.log(dealerStatus,companyStatus);
    
    this.data.dealerStatus=dealerStatus;
    this.data.companyStatus=companyStatus;
    if(this.data.dealerStatus==0 && this.data.companyStatus==0)
    {
      this.orderActive=true;
      this.cartActive=false;
      this.pendingActive=false;
      this.holdActive=false;
      this.approvedActive=false;
    }
    if(this.data.dealerStatus==1 && this.data.companyStatus==0)
    {
      this.orderActive=false;
      this.cartActive=true;
      this.pendingActive=false;
      this.holdActive=false;
      this.approvedActive=false;
    }
    if(this.data.dealerStatus==0 && this.data.companyStatus==1)
    {
      // this.data.dealerStatus=2;
      this.getpendingorderList(2)
      
      this.orderActive=false;
      this.cartActive=false;
      this.pendingActive=true;
      this.holdActive=false;
      this.approvedActive=false;
    }
    if(this.data.dealerStatus==3 && this.data.companyStatus==2)
    {
      this.orderActive=false;
      this.cartActive=false;
      this.pendingActive=false;
      this.holdActive=false;
      this.approvedActive=true;
    }
    if(this.data.dealerStatus==0 && this.data.companyStatus==3)
    {
      this.orderActive=false;
      this.cartActive=false;
      this.pendingActive=false;
      this.holdActive=true;
      this.approvedActive=false;
    }
    this.data.currentPage=1;
    this.data.pageSize=50;
    console.log(this.userdata['userType']);
    if(this.userdata['userType']==3)
    {
      this.data.networkId=this.userdata['distributerNetwork']['networkId'];
      this.data.userId=undefined
      this.data.currentPage=1;
      this.data.pageSize=50;
    }
    if(this.userdata['userType']==2)
    {
      this.data.userId=this.userdata['userId'];
      this.data.networkId=undefined
      this.data.currentPage=1;
      this.data.pageSize=50;
    }
    else{
      this.data.currentPage=1;
      this.data.pageSize=50;
    }
    this.db.fetchData(this.data,'order/list').subscribe((response)=>{
      console.log(response);
      // this.orderActive=true;
      if(response['status']=='Success')
      {
        
        this.orderlist = response['data'];
        this.finalOrderList=this.orderlist;
        this.convertArrayToExcel();
      }
      if(response['status']=='Failed')
      {
        this.div=true;
      }
      this.loader=false;
    });
  }
  
  getpendingorderList(status)
  {
    // let value={dealerStatus:status,companyStatus:0, currentPage:1,pageSize:200,networkId:'',userId:''}
    // if(this.userdata['userType']==3)
    // {
    //   value.networkId=this.userdata['distributerNetwork']['networkId'];
    //   value.userId=undefined
    
    // }
    // else
    // {
    //   value.userId=this.userdata['userId'];
    //   value.networkId=undefined
    // }
    // this.db.fetchData(value,"order/list").subscribe((result)=>{
    //   console.log(result);
    //   if(result['status']=='Success')
    //   {
    
    //     for(let i=0;i<result['data'].length;i++)
    //     {
    //       const orderArray=this.orderlist.filter(row=>row.orderId!=result['data'][i]['orderId']);
    
    //     }
    
    //        this.finalOrderList=this.finalOrderList.concat(orderArray);
    
    //     // this.pendingOrderQty=this.pendingOrderQty.concat(result['data']);
    //   }
    
    // })
  }
  
  
  finalOrderList:any=[];
  
  orderDetail(index)
  {
    if(this.finalOrderList[index].dealerStatus==1)
    {
      console.log("router work");
      this.router.navigate(['edit-order/'+this.finalOrderList[index].orderId])
    }
    if(this.finalOrderList[index].dealerStatus==2 || this.finalOrderList[index].dealerStatus==3)
    {
      this.router.navigate(['order-detail/'+this.finalOrderList[index].orderId])
    }
  }
  
  getPendingOrderCount()
  {
    
    let value={dealerStatus:0,companyStatus:1,currentPage:1,pageSize:1000,networkId:'',userId:''}
    if(this.userdata['userType']==3)
    {
      value.networkId=this.userdata['distributerNetwork']['networkId'];
      value.userId=undefined
      
    }
    else
    {
      value.userId=this.userdata['userId'];
      value.networkId=undefined
    }
    
    this.db.fetchData(value,"order/list").subscribe((result)=>{
      console.log(result);
      if(result['status']=='Success')
      {
        this.pendingOrderQty=result['data'];
        this.getpendingorderList(2);
      }
    })
  }
  
  getApprovedOrderCount()
  {
    let value={dealerStatus:3,companyStatus:2,currentPage:1,pageSize:1000,networkId:'',userId:''}
    if(this.userdata['userType']==3)
    {
      value.networkId=this.userdata['distributerNetwork']['networkId'];
      value.userId=undefined
      
    }
    else
    {
      value.userId=this.userdata['userId'];
      value.networkId=undefined
    }
    this.db.fetchData(value,"order/list").subscribe((result)=>{
      console.log(result);
      if(result['status']=='Success')
      {
        this.approvedOrderQty=result['data'];
      }
    })
  }
  
  
  getDraftOrderCount()
  {
    let value={dealerStatus:1,companyStatus:0,currentPage:1,pageSize:1000,networkId:'',userId:''}
    if(this.userdata['userType']==3)
    {
      value.networkId=this.userdata['distributerNetwork']['networkId'];
      value.userId=undefined
      
    }
    else
    {
      value.userId=this.userdata['userId'];
      value.networkId=undefined
    }
    this.db.fetchData(value,"order/list").subscribe((result)=>{
      console.log(result);
      if(result['status']=='Success')
      {
        this.draftOrderQty=result['data'];
      }
    })
  }
  
  allOredrQty:any=[]
  getAllOrderCount()
  {
    let value={dealerStatus:0,companyStatus:0,currentPage:1,pageSize:1000,networkId:'',userId:''}
    if(this.userdata['userType']==3)
    {
      value.networkId=this.userdata['distributerNetwork']['networkId'];
      value.userId=undefined
      
    }
    else
    {
      value.userId=this.userdata['userId'];
      value.networkId=undefined
    }
    this.db.fetchData(value,"order/list").subscribe((result)=>{
      console.log(result);
      if(result['status']=='Success')
      {
        this.allOredrQty=result['data'];
      }
    })
  }
  
  getHoldOrderCount()
  {
    let value={dealerStatus:0,companyStatus:3,currentPage:1,pageSize:1000,networkId:'',userId:''}
    if(this.userdata['userType']==3)
    {
      value.networkId=this.userdata['distributerNetwork']['networkId'];
      value.userId=undefined
      
    }
    else
    {
      value.userId=this.userdata['userId'];
      value.networkId=undefined
    }
    this.db.fetchData(value,"order/list").subscribe((result)=>{
      console.log(result);
      if(result['status']=='Success')
      {
        this.holdOrderQty=result['data'];
      }
    })
  }
  
  clearfilter(){
    let data;
    this.data={};
    this.data.currentPage=1;
    this.data.pageSize=50;
    console.log(this.userdata['userType']);
    if(this.userdata['userType']==3)
    {
      this.data.networkId=this.userdata['distributerNetwork']['networkId']
    }
    else if(this.userdata['userType']==2)
    {
      this.data.userId=this.userdata['userId']
    }
    else
    {
      this.senddata={"currentPage": 1,"pageSize": 50};
    }
    this.createdaDate='';
    this.data.createdOn=undefined
    this.order_list(0,1);
  }
  
  dealerDetail:any={}
  // orderDetail:any={}
  xLXSArray:any=[];
  convertArrayToExcel()
  {
   this.xLXSArray=[]; 
    for(let i=0;i<this.orderlist.length;i++)
    {
      
      for(let j=0;j<this.orderlist[i].orderDetail.length;j++)
      {
        this.xLXSArray.push({
          
          'Dist Name':(j==0?this.orderlist[i].establishment:''),
          'Dist Code':(j==0?this.orderlist[i].networkCode:''),
          'Created By':(j==0?this.orderlist[i].createdByName:''),
          'Order date':(j==0?this.orderlist[i].createdOn:''),
          'Order No.':(j==0?this.orderlist[i].orderNumber:''),
          'Part Number':this.orderlist[i].orderDetail[j].partNumberCode,
          'Product Name':this.orderlist[i].orderDetail[j].productName,
          'OEM Code':this.orderlist[i].orderDetail[j].oem,
          'Quantity':this.orderlist[i].orderDetail[j].quantity,
          'Unit Price':this.orderlist[i].orderDetail[j].price,
          'GST %':this.orderlist[i].orderDetail[j].gstPercentage,
          'Amount':(j==0?this.orderlist[i].amount:''),
          'Total Order Amount':(j==0?this.orderlist[i].totalAmount:''),
          'Company Status':(this.orderlist[i].companyStatus==1?'Pending':(this.orderlist[i].companyStatus==2?'Approved':'Hold')),
          'Distributor Status':(this.orderlist[i].dealerStatus==2?'Pending':(this.orderlist[i].dealerStatus==3?'Approved':'Reject'))
        })
      }
    }
  }
  
  exportAsXLSX():void {
    console.log(this.xLXSArray);
    this.db.exportAsExcelFile(this.xLXSArray, 'ORDER SHEET');
  }
  
}
