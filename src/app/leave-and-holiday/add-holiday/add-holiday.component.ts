import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { ConstantService } from '../../constant.service';
import * as moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { SnackBarOverview } from 'src/app/toast';
@Component({
  selector: 'app-add-holiday',
  templateUrl: './add-holiday.component.html',
  animations: [slideToTop()]

})
export class AddHolidayComponent implements OnInit {
holiday_form:any={};
statelist:any={};
statedata:any=[];
message:any;
loader:boolean;
user:any={};
  userType:any;
userId:any;
userRole:any;
  constructor(public db:ConstantService,public router:Router,public route:ActivatedRoute,public toast:SnackBarOverview) {
    this.user = JSON.parse(localStorage.getItem('user')) || [];
    console.log(this.user);
    this.userType = this.user.data.userType;
    this.userId = this.user.data.userId;
    this.userRole=this.user.data.role;
    console.log(this.userType ,"&" , this.userId, "&" ,this.userRole);
    
    this.db.fileData('','state/list/').subscribe((response)=>{
    console.log(response);
    this.statelist=response;
    this.statedata=this.statelist.data;
    console.log(this.statedata);
  }); 
}

  ngOnInit() {
   
  }
  onSubmit(){
    this.loader=true;
    if(this.holiday_form.type==2){
    var s = this.holiday_form.states.join(",");
    console.log(s);
    }
    this.holiday_form.states=s;
    var datenow=moment(this.holiday_form.date).format('YYYY-MM-DD');
    console.log(datenow);
    this.holiday_form.date=datenow;
    this.holiday_form.userId=this.userId;
    console.log(this.holiday_form);
    this.db.fetchData(this.holiday_form,'holiday/add').subscribe((response)=>{
      console.log(response);
      this.loader=false;
      this.message=response['message'];
      if(this.message=="Holiday added successfully")
      {
        this.toast.openSucess('Holiday added successfully','');
        this.router.navigate(['/holiday-list']);
      }
      else
      {
        this.toast.openError('Something Went Wrong Please Try Again!!','');
      }
     
    });
    
    console.log(this.holiday_form);
  }
}
