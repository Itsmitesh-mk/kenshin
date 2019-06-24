import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { ConstantService } from '../../constant.service';
import { SnackBarOverview } from 'src/app/toast';
import { DialogComponent } from 'src/app/dialog';
import { sessionStorage }  from '../../local-storage.service';
@Component({
  selector: 'app-holiday-list',
  templateUrl: './holiday-list.component.html',
  animations: [slideToTop()]
})
export class HolidayListComponent implements OnInit {
  holidaylist:any={};
  holidays:any=[];
  date:any=[];
  role:any;
  userdata:any=[];
  loader:boolean;
  message:any;
  msg:any;
  div:boolean=false;
  constructor(public db:ConstantService,public user:sessionStorage, public toast:SnackBarOverview,public dialog:DialogComponent) {
    this.userdata=this.user['user']['data'];
      this.role=this.userdata['role'];
    this.holidayList();
}
holidayList(){
  this.loader=true;
  this.db.fileData('','holiday/list/').subscribe((response)=>{
    console.log(response);
    this.loader=false;
    if(response['status']=='Success')
    {
      this.holidaylist=response;
      this.holidays=this.holidaylist.data;
    }
    if(response['status']=='Failed')
    {
      this.div=true;
      this.holidays =[];
    }
    this.holidaylist=response;
    this.holidays=this.holidaylist.data;
    console.log(this.holidays);
  });
}
deleteHoliday(id){
  console.log(id);
  this.msg="Holiday"
  this.dialog.delete(this.msg).then((result) => {
    console.log(result);
    if(result)
    {
      this.db.fileData(id,'holiday/delete/').subscribe((response)=>{
          console.log(response);
          this.message=response['message'];
          if(this.message="Holiday removed successfully")
          {
            this.toast.openSucess('Holiday removed successfully','');
          }
          else{
            this.toast.openError('Something Went Wrong Please Try Again!!','');
          }
          this.holidayList() 
        });
    }
  });

}

  ngOnInit() {
  }

}
