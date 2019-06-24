import { Component, OnInit } from '@angular/core';
import { ConstantService } from '../../constant.service';
import { SnackBarOverview } from 'src/app/toast';
import { DialogComponent } from 'src/app/dialog';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { StatusModalComponent } from '../status-modal/status-modal.component';

@Component({
  selector: 'app-pop-and-gift-distributor-list',
  templateUrl: './pop-and-gift-distributor-list.component.html'
})
export class PopAndGiftDistributorListComponent implements OnInit {


  loader:boolean;
  popOrderData:any = [];

  loginData:any = {};
  filter:any = {};
  walletBalance:any;

  giftSearchData:any = [];
  showClearIcon:any = false;

  constructor(public db:ConstantService, public toast:SnackBarOverview, public alrt:DialogComponent, public dialog: MatDialog) { }

  ngOnInit() {

      this.loginData = JSON.parse(localStorage.getItem('user')) || [];
      console.log(this.loginData);

      if(this.loginData.data.userType==3) {

             this.getNetworkRedeemPointData();
      }

      this.popGiftOrderList();
  }


  openDialog(): void {
      const dialogRef = this.dialog.open(StatusModalComponent, {
        width: '500px',
        data: {}
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
    }


  getNetworkRedeemPointData() {

        this.loader = true;

        console.log(this.loginData['data']['distributerNetwork']['networkId']);

        this.db.fetchData({networkId: this.loginData['data']['distributerNetwork']['networkId']},'network/list').subscribe((response)=>{

              console.log(response);
              if(response['status']=='Success')
              {
                    this.walletBalance = response['data'][0]['wallet'];

              }


              console.log(this.popOrderData);
              
              this.loader = false;

        });
        
  }

  popGiftOrderList() {

        this.loader = true;

        this.db.fetchData({currentPage: 1, pageSize: 200, totalRecords: 200},'poporder/list').subscribe((response)=>{

              console.log(response);
              if(response['status']=='Success')
              {

                    this.popOrderData = response['data'];
              }


              console.log(this.popOrderData);
              
              this.loader = false;

        });
  }


  onGiftClickHandler() {

        // this.productList({ "currentPage": this.currentPage,
        // "pageSize": this.pageSize,"segmentCode":this.filter.segment,"subSegmentCode":this.filter.subsegment,"categoryCode":this.filter.category,"productName":this.filter.prod,"modelCode":this.filter.model});
        // this.removeproductname=true;
  }


  giftNameSearchList() {


       if(this.filter.name) {
           this.showClearIcon = true;
       } else {
          this.showClearIcon = false;
       }

      this.db.fetchData({ 'name':this.filter.name},'pop/list').subscribe((response)=>{

            console.log(response);
            if(response['status']=='Success')
            {
                  this.giftSearchData = response['data'];

            }

            console.log(this.giftSearchData);
      });
  }


  removeNameFilter() {

      this.filter.name = '';
      this.showClearIcon=false;

      setTimeout(() => {
        this.popGiftOrderList();
      }, 500);
  }

  cancelOrderHandler(giftOrderId) {


      this.alrt.confirmation('Cancel Gift Order!').then((result) => {

          if(result)
          {
                 
                  console.log(result);
                  console.log(giftOrderId);

                  this.loader = true;
                  this.db.fileData('','poporder/cancel/' + giftOrderId).subscribe((response)=>{ 

                       this.loader = false;
                        console.log(response);
                        this.popGiftOrderList();
                  })
          }

       })





  }


}
