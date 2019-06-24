import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { ConstantService } from 'src/app/constant.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SnackBarOverview } from 'src/app/toast';
import { DialogComponent } from 'src/app/dialog';
import { sessionStorage }  from '../../local-storage.service';

@Component({
  selector: 'app-vendor-list',
  templateUrl: './vendor-list.component.html'
})
export class VendorListComponent implements OnInit {
vendorList:any=[];
loader:boolean;
msg:any=[];
filter:any={};
div:any=false;
userdata:any=[];
role:any;

constructor(public db:ConstantService,public user:sessionStorage, public route:ActivatedRoute, public toast:SnackBarOverview,public dialog:DialogComponent) {
  this.userdata=this.user['user']['data'];
  this.role=this.userdata['role'];
  this.filter.resultVendorStatus=2;
 }


  ngOnInit() {
    this.filter.resultVendorStatus=2;
    this.vendor_list();
  }
  vendor_list(){
    this.loader=true;
    this.db.fetchData({'vendorName':this.filter.vendorName,'vendorCode':this.filter.vendorCode,'contactPersonName':this.filter.contactPersonName,'mobile':this.filter.mobile,'resultVendorStatus':this.filter.resultVendorStatus},'/getallvendors').subscribe((response)=>
    {
          console.log(response)
          if(response['data']!='')
          {
            this.loader=false;
            this.div=false;
            this.vendorList=response['data'];
            console.log(this.vendorList);
          }
          else
          {
            console.log("no data found");
            this.div=true;
            this.loader=false;
            this.vendorList=[];
            
          }
          console.log(this.vendorList);
          console.log(this.div);
    });
  }

refreshlist(){
    this.vendor_list();
    this.toast.openSucess('Refreshed successfully!','');
  }
}
