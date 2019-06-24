import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConstantService } from 'src/app/constant.service';
import {MatDialog} from '@angular/material';
import { SnackBarOverview } from 'src/app/toast';
import { sessionStorage }  from '../../local-storage.service';
import { Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog';
import { VendorUpdateComponent } from '../vendor-update/vendor-update.component';
@Component({
  selector: 'app-vendor-detail',
  templateUrl: './vendor-detail.component.html'
})
export class VendorDetailComponent implements OnInit {
  loader:any=false;
  vendorcode:any;
  userdata:any={};
  role:any;
  vendordetail:any={};
  resultVendorStatus:any;
  userType:any;
  constructor(public router:Router,public toast:SnackBarOverview,public user:sessionStorage,public route:ActivatedRoute,public service:ConstantService,public dialog: MatDialog,public dia:DialogComponent) {
    this.route.params.subscribe(params=>{
      console.log(params);
      console.log(user);
      this.vendorcode = params.id;
      this.resultVendorStatus=2;
      console.log(this.vendorcode);
      this.userdata=this.user['user']['data'];
      this.role=this.userdata['role'];
      this.userType = this.userdata['userType'];
      console.log("this is the uer type = "+this.userType)
    });
   }



  ngOnInit() {
    this.get_detail();
    console.log(this.role);
    console.log("this is the uer type = "+this.userType)
  }




  get_detail(){
    this.loader=true;
    console.log(this.vendorcode);
    this.service.fetchData({'resultVendorStatus':this.resultVendorStatus,'vendorCode':this.vendorcode},'/getallvendors').subscribe((response)=>
    {
          console.log(response)
          if(response['message']=="Success")
          {
            this.loader=false;
            this.vendordetail=response['data'][0];
            console.log(this.vendordetail);
          }
          else
          {
            this.loader=false;
            this.vendordetail={};
          }
          console.log(this.vendordetail);
    });
  }


  openEmail(check) {
    console.log(check);
    this.vendordetail['typeofupdate']=check;
    console.log("chech assign user update");
    const dialogRef = this.dialog.open(VendorUpdateComponent,{width : '1000px' ,data:this.vendordetail});
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.get_detail();
    });
  }


  checkstatus(status){
    console.log(status)
    this.loader = true;
    this.service.fetchData({'vendorStatus':status,'vendorCode':this.vendorcode},'changevendorstatus').subscribe((response)=>{
      console.log(response);
      this.loader=false;
      if( response['message']=="Success")
      {
        this.toast.openSucess('Updated successfully','');
      }
      else
      {
        this.toast.openError('Something went wrong Please Try Again!!','');
      }
  });
    
  }

}
