import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { WalletDetailModalComponent } from '../wallet-detail-modal/wallet-detail-modal.component';
import { DialogComponent } from 'src/app/dialog';
import { ConstantService } from '../../constant.service';
import { SnackBarOverview } from 'src/app/toast';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
      selector: 'app-pop-and-gift-distributor-add',
      templateUrl: './pop-and-gift-distributor-add.component.html'
})
export class PopAndGiftDistributorAddComponent implements OnInit {
      
      loader:boolean;
      giftlist:any = [];
      url:any;
      request:any;
      api:any;
      
      cartData:any = [];
      loginData:any = {};
      walletBalance:any;
      totalPointsRedeemed:any;
      user:any={}
      userType:any;
      userId:any;
      userRole:any;
      constructor(public dialog: MatDialog, public db:ConstantService,public rout:Router, public toast:SnackBarOverview) {
            
            this.user = JSON.parse(localStorage.getItem('user')) || [];
            console.log(this.user);
            this.userType = this.user.data.userType;
            this.userId = this.user.data.userId;

            if(this.userType!=3)
            {
                  this.getDistributorList();
            }
      }
      
      ngOnInit() {
            
            
            this.loginData = JSON.parse(localStorage.getItem('user')) || [];
            console.log(this.loginData);
            
            if(this.loginData.data.userType==3) {
                  
                  this.getNetworkRedeemPointData();
            }
            
            this.getPopGiftList();
      }
      
      distributorList:any=[]
      getDistributorList(){
            this.loader=true;
            let url;
            let data;
            if(this.userType!=1)
            {
                  url='mynetwork/detail';
                  data={salesUserId:this.userId};
            }
            else
            {
                  url='network/list';
                  data={};
            }
            this.db.fetchData(data,url).subscribe((result)=>{
                  console.log(result);
                  if(result['status']=='Success')
                  {
                        this.distributorList=result['data'];
                  }
            })
      }
      openDialog(): void {
            
            const dialogRef = this.dialog.open(WalletDetailModalComponent, {
                  width: '768px',
                  data: this.cartData
            });
            
            dialogRef.afterClosed().subscribe(result => {
                  
                  console.log('The dialog was closed');
            });
      }
      
      distributorId:any={}
      getNetworkRedeemPointData() {
            
            this.loader = true;
            
            if(this.userType==3)
            {
                  this.distributorId.networkId=this.loginData['data']['distributerNetwork']['networkId'];
            }
            console.log(this.distributorId.networkId);
            this.db.fetchData({networkId: this.distributorId.networkId},'network/list').subscribe((response)=>{
                  
                  console.log(response);
                  
                  this.walletBalance = response['data'][0]['wallet'];
                  
                  console.log(this.walletBalance);
                  
                  this.loader = false;
                  
            });
            
      }
      
      
      
      getPopGiftList() {
            
            
            this.loader = true;
            
            this.db.fetchData({},'pop/list').subscribe((response)=>{
                  
                  console.log(response);
                  
                  this.loader = false;
                  this.giftlist = response['data'];
                  // this.gifts=this.giftlist.data;
                  this.url=this.db.dburl;
                  this.request='download/document/';
                  this.api=this.url+this.request;
                  
                  console.log(this.request);
                  console.log(this.url);
                  console.log(this.api);
                  
            });
      }
      
      
      qtyChangeHandler(popId) {
            
            const index = this.giftlist.findIndex(row=> row.popId == popId);
            
            if(index != -1) {
                  
                  if(this.giftlist[index].qty < 0) {
                        this.giftlist[index].qty = 0;    
                  }
            }
            
      }
      
      addToCartHandler() {
            
            for (let index = 0; index < this.giftlist.length; index++) {
                  
                  if(this.giftlist[index].qty > 0) {
                        
                        const indexExist = this.cartData.findIndex(row=> row.popId == this.giftlist[index].popId);
                        
                        if(indexExist == -1) {
                              
                              const totalRedeemPoint = this.giftlist[index].redeem *  this.giftlist[index].qty;
                              
                              this.cartData.push({popId:this.giftlist[index].popId, name: this.giftlist[index].name, quantity: this.giftlist[index].qty, redeemPointsPerUnit: this.giftlist[index].redeem, totalPointsRedeemed: totalRedeemPoint});
                              
                        } else {
                              
                              this.cartData[indexExist].name = this.giftlist[index].name;
                              this.cartData[indexExist].quantity = this.giftlist[index].qty;
                              this.cartData[indexExist].redeemPointsPerUnit = this.giftlist[index].redeem;
                              
                              const totalRedeemPoint = this.giftlist[index].qty * this.giftlist[index].redeem;
                              
                              this.cartData[indexExist].totalPointsRedeemed = totalRedeemPoint;
                        }
                        
                  } else if(this.giftlist[index].qty == 0) {
                        
                        const indexExist = this.cartData.findIndex(row => row.popId == this.giftlist[index].popId);
                        
                        if (indexExist != -1) {
                              this.cartData.splice(indexExist, 1);
                        } 
                  }
            }
            
            console.log(this.cartData);
            
            this.totalPointsRedeemed = 0;
            
            for (let index = 0; index < this.cartData.length; index++) {
                  this.totalPointsRedeemed += this.cartData[index].totalPointsRedeemed;
            }
            
            for (let index = 0; index < this.giftlist.length; index++) {
                  
                  const isItemExist = this.cartData.findIndex(row => row.popId == this.giftlist[index].popId);
                  
                  if(isItemExist != -1) {
                        
                        this.giftlist[index].itemSelected = true;
                  } else {
                        
                        this.giftlist[index].itemSelected = false;
                  }
                  
            }
            
            this.toast.openSucess('Cart Updated Successfully','');
      }
      
      
      placeOrder() {
            
            let totalPointsRedeemed = 0;
            
            for (let index = 0; index < this.cartData.length; index++) {
                  
                  totalPointsRedeemed += this.cartData[index].totalPointsRedeemed;
            }
            
            console.log(totalPointsRedeemed);
            
            const loginUser = JSON.parse(localStorage.getItem('user')) || [];
            console.log(loginUser);
            
            const currentDate = moment().format('YYYY-MM-DD');
            
            console.log(currentDate);
            
            const apiData = {
                  
                  'popOrderId': 0,
                  'networkId': this.loginData['data']['distributerNetwork']['networkId'],
                  'totalPointsRedeemed': totalPointsRedeemed,
                  'createdBy': loginUser.data.userId,
                  'createdOn': currentDate,
                  'status': 0,
                  'statusUpdatedBy': 0,
                  'statusUpdatedOn': currentDate,
                  'orderedItems': this.cartData
            }
            
            this.loader = true;
            
            this.db.fetchData(apiData,'poporder/add').subscribe((response)=>{
                  
                  console.log(response);
                  
                  this.loader = false;
                  this.toast.openSucess('Gift Order Placed Successfully','');
                  
                  this.rout.navigate(['/order-list']);
                  
            });
            
      }
      
      
}
