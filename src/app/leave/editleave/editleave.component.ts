import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConstantService } from 'src/app/constant.service';
import * as moment from 'moment';

@Component({
  selector: 'app-editleave',
  templateUrl: './editleave.component.html',
  styleUrls: ['./editleave.component.scss']
})
export class EditleaveComponent implements OnInit {
  detailed_id:any;
  form:any={};
  currentDate:any = new Date().toJSON().split('T')[0];
  user:any={};
  userType:any;
  userId:any;
  userRole:any;
  username:any;
  mobile:any;
  loader:any=false;
  userRole_name;any;
  editData:any={};
  // leaveApplicationId: any;
  
  
  constructor(public route:ActivatedRoute,public db:ConstantService,public router:Router) { 
    
  }
  
  ngOnInit() {
    this.leaveTypeFunction();
    
    
    
    
    this.user = JSON.parse(localStorage.getItem('user')) || [];
    console.log(this.user);
    this.userType = this.user.data.userType;
    this.userId = this.user.data.userId;
    this.userRole=this.user.data.role;
    this.userRole_name=this.user.data.roleName;
    this.username= this.user.data.userName;
    console.log(this.userType ,"&" , this.userId, "&" ,this.username  );
    this.route.params.subscribe(params=>{
      console.log(params); 
      this.detailed_id=params;  
      console.log(this.detailed_id);
      this.getCountUserLeave(this.userId);
      // alert(this.detailed_id);
      // this.getDetail();
      
    });
  }
  //     startDate;
  // endDate;
  diff;
  dbDiffrence;
  getDetail()
  {
    console.log(this.detailed_id);
    this.loader=true;
    this.db.fetchData({'leaveApplicationId':this.detailed_id.id},'getAllLeaves').subscribe(resp=>{
      console.log(resp);
      this.loader=false
      this.form=resp['data'][0];
      console.log("detailed data");
      console.log(this.form);

      for(let i=0;i<this.newArrayList.length;i++)
      {
        if(this.newArrayList[i].ruleId==this.form.leaveType)
        {
          this.form.leaveName=this.newArrayList[i].subject;
        }
      }
      console.log(this.form.endDate);
      console.log(this.form.startDate);
      
      this.diff=  moment( this.form.endDate).diff(moment( this.form.startDate), 'days');
      this.dbDiffrence=this.diff+1;
      
      console.log("detailed data");
    });
  }
  
  
  endDate;
  limitdate:any=[];
  onDateChangeHandler(date) {
    if(this.form.LeaveType == 'other')
    {
      this.endDate="";
      
    }
    else
    {
      console.log(date);
      
      
      var myDate= moment(date, "YYYY-MM-DD").add(this.limitdate-1, 'days');
      this.endDate=myDate["_d"]
      console.log(this.endDate);
      return this.endDate;  
    }  
  }
  currentyear:any;
  myLeavLeft:any=[];
  leaveCountLeft:any={};
  getCountUserLeave(userId)
  {
    this.loader=true;
    this.db.fetchData({'userId':userId},'getUserRemainingLeaves').subscribe((r)=>{
      console.log("this is the type wise count");
      console.log(r);
      this.loader=false
      this.leaveCountLeft= r['data'];
      console.log("this is the type wise count",this.leaveCountLeft);
      this.currentyear = moment().format('YYYY');
      
      for (var i=0;i<this.leaveCountLeft.length;i++)
      {
        if(this.leaveCountLeft[i].year==this.currentyear)
        {
          this.myLeavLeft.push(this.leaveCountLeft[i]);
        }
      }
      console.log("this is remaining leaves",this.leaveCountLeft.remainingLeaves);
    });
  }
  
  leavCount:any;
  getCount(id)
  {
    console.log(id);
    
    for(let i=0;i<this.leaveCountLeft.length;i++)
    {
      console.log(this.leaveCountLeft[i]);
      
      if(id==this.leaveCountLeft[i].leaveTypeID)
      {
        this.leavCount=this.leaveCountLeft[i].remainingLeaves;
      }
      
    }
    
    
    console.log(this.leavCount);
    
  }
  
  lastDate:any;
  checkValid(date)
  {
    this.form.endDate=null;
    var myDate= moment(date, "YYYY-MM-DD").add(this.leavCount, 'days');
    this.lastDate=myDate["_d"];
    console.log(this.lastDate)
  }
  
  
  moment:any;
  startDate;
  
  date;
  diffrence;
  update_diffrence;
  
  update_leave(updated_id)
  {
    // alert(this.form.leaveApplicationId);
    
    this.startDate=moment(this.form.startDate).format('YYYY-MM-DD');
    this.endDate=moment(this.form.endDate).format('YYYY-MM-DD');
    console.log(this.startDate);
    console.log(this.endDate);
    this.diffrence=moment( this.endDate).diff(moment( this.startDate), 'days')
    console.log(moment( this.endDate).diff(moment( this.startDate), 'days')); 
    console.log(this.diffrence);
    this.update_diffrence= this.diffrence+1;
    //  alert("this is save diffrence"+this.update_diffrence);
    console.log(this.form);
    // console.log(this.form);
    if(this.dbDiffrence > this.update_diffrence)
    {
      this.diffrence = -( this.dbDiffrence-this.update_diffrence)
    }
    else{
      this.diffrence = (this.update_diffrence - this.dbDiffrence)
    }
    const currentDate = moment().format('YYYY-MM-DD');
    this.loader=true
    this.db.fetchData({'leaveType':this.form.leaveType,'startDate':this.startDate,'endDate':this.endDate,'remarks':this.form.remarks,'userId':this.userId,
    'numberOfDays':this.diffrence,'ApplicationDate':currentDate,
    'approvalStatus':0, 
    'leaveApplicationId':this.form.leaveApplicationId
    
  }
  
  
  ,'modifyLeaveApplication').subscribe((r)=>{console.log(r);
    this.loader=false
    
    this.router.navigate(['/leave-list']);
    
  });
}
newArrayList:any={}



leaveTypeFunction()
{
  this.loader=true
  this.db.fetchData({},'leave/list').subscribe((r)=>{
    this.loader=false;
    console.log("=====================================================");
    console.log(r);
    this.newArrayList=r['data'];
    console.log(this.newArrayList);
    this.getDetail();
  });
}
}
