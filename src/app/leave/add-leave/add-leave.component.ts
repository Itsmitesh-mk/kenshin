import { Component, OnInit, ModuleWithComponentFactories, PLATFORM_ID, Inject } from '@angular/core';
import { ConstantService } from 'src/app/constant.service';
import { Router, RouterLinkWithHref } from '@angular/router';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { DialogComponent } from 'src/app/dialog';
import { isPlatformBrowser } from '@angular/common';
import * as $ from 'jquery';
@Component({
  selector: 'app-add-leave',
  templateUrl: './add-leave.component.html'
})
export class AddLeaveComponent implements OnInit {
  
  form:any={};
  
  
  user:any={};
  userType:any;
  userId:any;
  leaveName:any;
  userRole:any;
  iseligible:boolean=false;
  loader:any=false
  username:any;
  isLeavesAllowed:any=false;
  
  currentDate:any = new Date().toJSON().split('T')[0];
  yearSelected:any;
  currentYear1:any;
  
  
  constructor(
    
    public alrt:DialogComponent,
    private datePipe: DatePipe,
    public db:ConstantService, public router:Router,
    
    @Inject(PLATFORM_ID) private platformId: Object
    ) {
      
      
      this.leaveTypeFunction();
      var date = new Date();
      
      this.user = JSON.parse(localStorage.getItem('user')) || [];
      console.log(this.user);
      this.userType = this.user.data.userType;
      this.userId = this.user.data.userId;
      this.userRole=this.user.data.role;
      this.username= this.user.data.userName;
      console.log(this.userType ,"&" , this.userId, "&" ,this.userRole ,"&&" , this.username  );
      this.getCountUserLeave(this.userId);
      
    }
    ngOnInit() {
      this.yearSelected = parseInt(moment().format('YYYY'));
      this.currentYear1=moment().format('YYYY');
    }
    moment:any;
    startDate;
    endDate;
    date;
    diffrence;
    newArrayList:any=[];
    array:any=[];
    role_array:any=[];
    leaveTypeFunction()
    {
      this.loader=true
      this.db.fetchData({},'leave/list').subscribe((r)=>{
        this.loader=false
        console.log(r);
        this.newArrayList=r['data'];
      });
    }
    
    
    onDateChangeHandler(date) {
      if(this.form.LeaveType == 'other')
      {
        this.endDate="";
        
      }
      else
      {
        var myDate= moment(date, "YYYY-MM-DD").add(this.limitdate-1, 'days');
        this.endDate=myDate["_d"]
        console.log(this.endDate);
        return this.endDate;
        
      }
    }
    
    save_sales_leave()
    {
      
      this.startDate=moment(this.form.StartDate).format('YYYY-MM-DD');
      this.endDate=moment(this.form.EndDate).format('YYYY-MM-DD');
      const currentDate = moment().format('YYYY-MM-DD');
      this.diffrence=  moment( this.endDate).diff(moment( this.startDate), 'days');
      console.log(this.diffrence);
      const isLeaveAllowed = this.onDateChangeHandler(0);
      
      this.loader=true
      this.db.fetchData({
        'leaveType':this.form.LeaveType,'startDate':this.startDate,'endDate':moment(this.form.EndDate).format("YYYY-MM-DD"),'remarks':this.form.remark,
        'userId':this.userId,
        'numberOfDays':this.diffrence +1,'ApplicationDate':currentDate,
        'approvalStatus':0, 'leaveApplicationId':0},'applyLeave').subscribe((response)=>{
          console.log(response);
          this.loader=false
          if(response["message"]=="Success")
          {
            this.router.navigate(['/leave-list']);
          }     
        });
      }
      leaveCountLeft:any=[];
      currentyear;
      myLeavLeft:any=[];
      getCountUserLeave(userId)
      {
          this.loader=true
          this.db.fetchData({'userId':userId},'getUserRemainingLeaves').subscribe((r)=>{
          console.log(r);
          if(r['message']=='Success')
          {
            this.leaveCountLeft= r['data'];
            this.currentyear = r['data'][0]['year'];
            console.log(this.currentyear);
            for (var i=0;i<this.leaveCountLeft.length;i++)
            {
              if(this.leaveCountLeft[i].year==this.currentyear)
              {
                this.myLeavLeft.push(this.leaveCountLeft[i]);
              }
            }
            this.loader=false;
          }
          console.log("this is remaining leaves",this.myLeavLeft);
        });
      }
      
      
      limitdate:any=[];
      msg:any;
      isDescription:boolean=false;
      limitdate1:any={};
      apple(ruleId)
      {
        this.form.EndDate='';
        this.form.StartDate='';
        this.loader=true
        console.log(ruleId,this.form);
        let index=this.newArrayList.findIndex(x=>x.ruleId==ruleId);
        this.form.description=this.newArrayList[index].description;
        this.isDescription=true;
        console.log(this.form);
        for( var i=0;i<=this.myLeavLeft.length; i++)
        {
          if(this.myLeavLeft[i].leaveTypeID==ruleId)
          {
            this.limitdate = this.myLeavLeft[i].remainingLeaves;
            this.leaveName=this.myLeavLeft[i].leaveType;
            this.loader=false;
            break;
          }
          
        }
        if(this.limitdate==0){
          this.msg="You Don't Have Any Pending "+this.leaveName;
          this.alrt.error(this.msg);
          this.iseligible=true;
        }
        else{
          this.iseligible=false;
        }
        console.log("this is limit date", this.limitdate);
      }
      
      setFocus(form)
       {
        for (var key in form.controls)
        {
          
          if (form.controls.hasOwnProperty(key)) {
            if(form.controls[key].status=='INVALID')
            {
              if (isPlatformBrowser(this.platformId)) {
                
                $('#'+key).focus();
                $(window).scrollTop(0);
                
              }
              return true;
            }
            console.log(key + " -> " + form.controls[key].status);
          }
        }
      }
      
      
      previous()
      {
        this.yearSelected= this.yearSelected-1;
        this.db.fetchData( {'userId':this.userId, 'year': this.yearSelected},'getUserYearLeaves').subscribe((rep)=>{
        this.myLeavLeft= rep['data'];
        this.loader=false
        });
      }
      
      next()
      {
        this.yearSelected= this.yearSelected+1;
        this.db.fetchData( {'userId':this.userId, 'year': this.yearSelected},'getUserYearLeaves').subscribe((rep)=>{
        this.myLeavLeft= rep['data'];
        this.loader=false
        });
      }
      
    }
    
    
    