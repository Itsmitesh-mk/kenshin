import { Component, EventEmitter,OnInit, Input, Output } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { ConstantService } from 'src/app/constant.service';
import { Router, ActivatedRoute } from '@angular/router';
import { sessionStorage }  from '../../local-storage.service';
import * as moment from 'moment';
import * as _ from 'lodash';
import { _localeFactory } from '@angular/core/src/application_module';
export interface CalendarDate {
  mDate: moment.Moment;
  selected?: boolean;
  today?: boolean;
  worked?: boolean;
  cal_date?: boolean;
}
@Component({
  selector: 'app-followup-list',
  templateUrl: './followup-list.component.html'
})

export class FollowupListComponent implements OnInit {
  userdata:any=[];
  senddata:any=[];
  filter:any={};
  name:any;
  date:any;
  befordate:any;
  afterdate:any;
  type:any;
  loader:any=false;
  role:any;
  currentDate:any = new Date().toJSON().split('T')[0];
  @Input() selectedDates: CalendarDate[] = [];
  @Output() onSelectDate = new EventEmitter<CalendarDate>();
  constructor(public db: ConstantService,public router:Router,public user:sessionStorage, public route:ActivatedRoute) {
    this.userdata=this.user['user']['data'];
    this.role=this.userdata['role'];
    this.filter.isClosed=false;
    this.filter.followUpBeforeDate=1;
    setTimeout(() => {
      this.generateCalendar();
      this.todayFollowUpList(this.currentDate);
      this.getUserTypeList();
    }, 500);
  }
  followupList:any=[];
  dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  weeks: CalendarDate[][] = [];
  sortedDates: CalendarDate[] = [];
  tab_class:any = true;
  
  ngOnInit() {
    
  }
  
 
  
  isSelectedMonth(date: moment.Moment, d: any): boolean {
    return moment(date).isSame(d, 'month');
  }
  prevMonth(): void {
    this.currentDate = moment(this.currentDate).subtract(1, 'months');
  }
  nextMonth(): void {
    this.currentDate = moment(this.currentDate).add(1, 'months');
  }
  selectDate(date){
    console.log(moment(date).format('YYYY-MM-DD'));
    setTimeout(() => {
      this.todayFollowUpList(moment(date).format('YYYY-MM-DD'));
    }, 500);
  }
  
  goToDetail(id)
  {
    this.router.navigate(['/all-followup-list/'+id])
  }
  
  generateCalendar(): void {
    const dates = this.fillDates(this.currentDate);
    const weeks: CalendarDate[][] = [];
    while (dates.length > 0) {
      weeks.push(dates.splice(0, 7));
    }
    this.weeks = weeks;
    console.log(this.weeks);
  }
  
  
  
  fillDates(currentMoment: moment.Moment): CalendarDate[] {
    const firstOfMonth = moment(currentMoment).startOf('month').day();
    const firstDayOfGrid = moment(currentMoment).startOf('month').subtract(firstOfMonth, 'days');
    const start = firstDayOfGrid.date();
    return _.range(start, start + 42)
    .map((date: number): CalendarDate => {
      const d = moment(firstDayOfGrid).date(date);
      return {
        today: this.isToday(d),
        selected: this.isSelected(d, this.selectedDates),
        cal_date: this.cal_date,
        mDate: d,
      };
    });
  }
  
  
  isToday(date: moment.Moment): boolean {
    return moment().isSame(moment(date), 'day');
  }
  
  
  isSelected(date: moment.Moment, d: any): boolean {
    return _.findIndex(d, (selectedDate:any) => {
      return moment(date).isSame(selectedDate.mDate, 'day');
    }) > -1;
  }
  
  
  cal_date: any = '';
  isActive(date: moment.Moment, user_data: any): boolean {
    return _.findIndex(user_data, (diet:any) => {
      if (moment(date).isSame(diet.date_created, 'day')) {
        this.cal_date = diet.date_created;
        return true;
      } else {
        this.cal_date = undefined;
        return false;
      }
    }) > -1;
  }
  
  
  
  
  
  nextFollowUpDate:any;
  div:any=false;
  todayFollowUpList(dates:any)
  {
    console.log(dates);
    console.log(this.filter.followUpBeforeDate);
    console.log(this.filter.followUpAfterDate);
    if(this.filter.followUpBeforeDate==1){
      console.log("befor date is working");
      this.befordate=undefined
      this.afterdate=undefined;
      this.nextFollowUpDate=moment(dates).format('YYYY-MM-DD');
    }
    else if(this.filter.followUpAfterDate==1){
      console.log("after date is working");
      this.afterdate=moment(dates).format('YYYY-MM-DD');
      this.befordate=undefined;
      this.nextFollowUpDate=undefined;
    }else{
      console.log(dates);
      console.log("todays date is working")
      this.nextFollowUpDate=moment(dates).format('YYYY-MM-DD');
      this.afterdate=undefined;
      this.befordate=undefined;
    }
    this.div=false;
    this.followupList=[];
    this.date=moment(dates).format('DD');
    if(this.userdata['userType']==2)
    {
      this.senddata={'isClosed':this.filter.isClosed,'followUpAfterDate':this.afterdate,'followUpBeforeDate':this.befordate,"userId":this.userdata['userId'],'followUpDate':this.nextFollowUpDate,'companyName':this.filter.establishment,'followUpType':this.filter.nextFollowUpType,"userRole  ":this.filter.role,"userName":this.filter.userName,'currentPage': 1,'pageSize': 50};
    }
    if(this.userdata['userType']==1)
    {
      this.senddata={'isClosed':this.filter.isClosed,'followUpAfterDate':this.afterdate,'followUpBeforeDate':this.befordate,'followUpDate':this.nextFollowUpDate,'companyName':this.filter.establishment,'followUpType':this.filter.nextFollowUpType,"userRole":this.filter.role,"userName":this.filter.userName,'currentPage': 1,'pageSize': 50};
    }
    this.loader=true;
    console.log(this.senddata);
    this.db.fetchData(this.senddata,"followup/list").subscribe((result)=>{
      console.log(result);
      if(result['status']=='Success')
      {
        setTimeout (() => {
          this.loader=false;
        }, 1500);
        this.followupList=result['data'];
        for(let i=0;i<this.followupList.length;i++)
        {
          for(let j=0;j<this.userRole.length;j++)
          {
            if(this.userRole[j]['roleId']===this.followupList[i]['userRole'])
            {
              this.followupList[i]['roleName']=this.userRole[j]['roleName'];
            }
          }
        }
      }
      if(result['status']=='Failed')
      {
        setTimeout (() => {
          this.div=true;
          this.loader=false;
        }, 1000);
      }
    });
    console.log('****** FILTER *******');
    console.log(this.filter)
    
  }
  
  
  
 
  
  
  rolelistsales1:any=[];
  rolelists:any=[];
  userRole:any=[];
  getUserTypeList()
  {
    this.db.fileData('','usertype/list').subscribe((response)=>{
      console.log(response);
      this.rolelists=response['data'];
      let filterrolesales= this.rolelists.filter(x => x.userTypeId==2);
      this.userRole=filterrolesales[0].roles;
      // console.log(this.rolelistsales1);
      // let filterrolesystem= this.rolelists.filter(x => x.userTypeId==1);
      // // this.rolelistsystem1=filterrolesystem[0].roles;
      // for(let i=0;i<this.rolelistsales1.length;i++){
      //   this.userRole.push({"roleName":this.rolelistsales1[i]['roleName']});}
      // console.log(this.rolelistsales1);
      console.log(this.userRole);
    });
  }
  
  
}

