import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { ConstantService } from '../../constant.service';
import { Router, ActivatedRoute } from '@angular/router';
import {MatDialog} from '@angular/material';
import { SnackBarOverview } from 'src/app/toast';
import { sessionStorage }  from '../../local-storage.service';
import { ListOrderComponent } from '../list-order/list-order.component';
import { DetailorderlistComponent } from '../detailorderlist/detailorderlist.component';
import { DialogComponent } from 'src/app/dialog';
@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  animations: [slideToTop()]
})
export class OrderDetailComponent implements OnInit {
  order_id:any;
  loader:any=false;
  message:any;
  order_data:any={};
  order_status:any={};
  userdata:any=[];
  senddata:any;
  role:any;
  userType:any;
  netId:any;
  network_data:any={};
  constructor(public alrt:DialogComponent,public db:ConstantService,public router:Router,public user:sessionStorage, public route:ActivatedRoute, public dialog: MatDialog,public toast:SnackBarOverview) {
    
    this.loader=true;
    this.route.params.subscribe(params=>{
      console.log(params);
      this.order_id = params.id;
      console.log(this.order_id);
    });
  }
  ngOnInit() {
    this.userdata=this.user['user']['data'];
    console.log(this.userdata);
    this.userType=this.userdata['userType'];
    // console.log(this.userdata['userId']);
    this.role=this.userdata['role'];
    console.log(this.role);
    
    if(this.userType==3){
      this.netId=this.userdata['distributerNetwork']['networkId'];
    }
    this.order_detail();
  }
  shipping:any={};
  order_detail(){
    this.loader=true;
    this.db.fetchData({'orderId':this.order_id},'order/list').subscribe((response)=>{
      console.log(response);  
      this.loader=false;
      if(response['status']=='Success')
      {
        this.order_data = response['data'][0];
        console.log(this.order_data);
        this.order_status.dealerStatus=this.order_data.dealerStatus;
        this.order_status.companyStatus=this.order_data.companyStatus;
        this.showInCart(this.order_data)
      }
      this.db.fetchData({'networkId':this.order_data.networkId},'network/list').subscribe((response)=>{
        console.log(response);
        this.loader=false;
        if(response['status']=='Success')
        {
          this.network_data = response['data'][0];
          console.log(this.network_data);
          let shippingAddrss=this.network_data.shippingAddresses.filter(row=>row.shippingAddressId==this.order_data.shippingAddressId)
          console.log(shippingAddrss[0]);
          this.shipping=shippingAddrss[0];  
        }
        this.convertArrayToExcel();
      });
    });
    
  }
  updatecompanyStatus()
  {
    this.alrt.confirmation('Order Status  !').then((result) => {
      if(result)
      {
        console.log(this.order_status);
        this.db.fetchData({ "orderId": this.order_id,
        "companyStatus": this.order_status.companyStatus,
        "statusFor": 1},'order/updatestatus').subscribe((response)=>{
          console.log(response);
          this.message=response['message'];
          if(response['status']=='Success')
          {
            this.toast.openSucess('Status updated successfully','');
            this.router.navigate(['/order-list'])
          }
          else
          {
            this.toast.openError('Something Went Wrong Please Try Again!!','');
          }
        });
      }})
      
    }
    updatedealerStatus(){
      
      this.alrt.confirmation('Order Status  !').then((result) => {
        if(result)
        {
          console.log(this.order_status);
          this.db.fetchData({  "orderId": this.order_id,
          "dealerStatus": this.order_status.dealerStatus,
          "statusFor":2},'order/updatestatus').subscribe((response)=>{
            console.log(response);
            this.message=response['message'];
            if(response['status']=='Success')
            {
              this.toast.openSucess('Status updated successfully','');
              this.router.navigate(['/order-list'])
            }
            else
            {
              this.toast.openError('Something Went Wrong Please Try Again!!','');
            }
          });
        }})
        
      }
      tmp_array:any=[];
      finel_Array:any=[];
      orderItem:any;
      showInCart(orderArray)
      {
        console.log(orderArray);
        let ord=false;
        for(let i=0;i<orderArray.orderDetail.length;i++)
        {
          if(this.tmp_array.length==0)
          {
            this.finel_Array.push(orderArray.orderDetail[i]);
            this.tmp_array.push({category: orderArray.orderDetail[i]['category'],quantity:orderArray.orderDetail[i]['quantity'],amount:orderArray['amount'],gstamount:orderArray['gstAmount']});
            
          }
          else
          {
            this.finel_Array.push(orderArray.orderDetail[i]);
            const itemIndex = this.tmp_array.findIndex(row => row.category == orderArray.orderDetail[i]['category']);
            
            if(itemIndex === -1) {
              this.tmp_array.push({category: orderArray.orderDetail[i]['category'],quantity:orderArray.orderDetail[i]['quantity'],amount:orderArray['amount'],gstamount:orderArray['gstAmount']});
              
              
            } else {
              this.tmp_array[itemIndex].quantity=parseInt(orderArray.orderDetail[i]['quantity'])+parseInt(this.tmp_array[itemIndex].quantity);
            }
            
          }
          
          if(i==orderArray.orderDetail.length-1)
          {
            for(let j=0;j<this.tmp_array.length;j++)
            {
              const item=this.finel_Array.filter(row=>row.category==this.tmp_array[j].category)
              if(item.length!=0)
              {
                this.tmp_array[j].item=item.length;
              }
            }
          }
          
        }
        
      }
      
      productDetail(category)
      {
        console.log(this.finel_Array,category);
        
        const dialogRef = this.dialog.open(DetailorderlistComponent, {
          width: '1600px',
          data:{
            product:this.finel_Array,
            category
          }});
          dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            console.log('The dialog was closed');
          });
        }
 
        dealerDetail:any={}
        orderDetail:any={}
        xLXSArray:any=[];
        convertArrayToExcel()
        {

          this.xLXSArray.push({
            'Company Name':this.network_data.establishment,
            'Dealer Code':this.network_data.networkCode,
            'Contact Person Name':this.network_data.networkContacts[0].name,
            'Contact Person Mobile no':this.network_data.networkContacts[0].mobile1})

          this.xLXSArray.push({
            
            'Order date':this.order_data.createdOn,
            'Created By':this.order_data.userName,
            'Order No.':this.order_data.orderNumber,
            'Order Quantity':this.order_data.quantity,
            'GST Amount':this.order_data.gstAmount,
            'Order Amount':this.order_data.amount,
            'Total Order Amount':this.order_data.totalAmount,
            'Company Status':(this.order_data.companyStatus==1?'Pending':(this.order_data.companyStatus==2?'Approved':'Hold')),
            'Distributor Status':(this.order_data.dealerStatus==2?'Pending':(this.order_data.dealerStatus==3?'Approved':'Reject')),
          })

          this.xLXSArray.push({});
          this.xLXSArray.push({});
          this.xLXSArray.push({});

          for(let i=0;i<this.order_data.orderDetail.length;i++)
          {
            this.xLXSArray.push({
              'Part Number':this.order_data.orderDetail[i].partNumberCode,
              'Product Name':this.order_data.orderDetail[i].productName,
              'OEM Code':this.order_data.orderDetail[i].oem,
              'Quantity':this.order_data.orderDetail[i].quantity,
              'Unit Price':this.order_data.orderDetail[i].price,
              'Amount':parseInt(this.order_data.orderDetail[i].price)*parseInt(this.order_data.orderDetail[i].quantity),
              'GST %':this.order_data.orderDetail[i].gstPercentage
            })
          }

        }

        exportAsXLSX():void {
          console.log(this.xLXSArray);
          this.db.exportAsExcelFile(this.xLXSArray, 'ORDER SHEET');
        }
 }
      