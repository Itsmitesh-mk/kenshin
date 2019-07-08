import { Component,EventEmitter, OnInit, Input, Output } from '@angular/core';
import { UploadImgModalComponent } from '../upload-img-modal/upload-img-modal.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import * as moment from 'moment';
// import { EventEmitter } from 'protractor';
import * as _ from 'lodash';
import { ConstantService } from 'src/app/constant.service';
import { ActivatedRoute } from '@angular/router';
export interface CalendarDate {
  mDate: moment.Moment;
  selected?: boolean;
  today?: boolean;
  worked?: boolean;
  cal_date?: boolean;
  existPlan?:boolean;
}
@Component({
  selector: 'app-sales-promotion',
  templateUrl: './sales-promotion.component.html'
})

export class SalesPromotionComponent implements OnInit {
  
  
  @Input() selectedDates: CalendarDate[] = [];
  @Output() onSelectDate = new EventEmitter<CalendarDate>();
  travelId:any;
  planArray:any=[]
    loader:any=false;
    travelDetail:any={}
    totalPromotionLength:any;
    promotionMonth:any;
    currentDate:any;
    viewGallery:any=false
    selectedDateArray:any=[];
    northActive:any=false;
    southActive:any=false;
    eastActiveA:any=false;
    westActive:any=false;
    centralActive:any=false;
    northEastActive:any=false;
  constructor(public dialog: MatDialog,public service:ConstantService,public route:ActivatedRoute) { 
    
    this.route.params.subscribe( params => {
      console.log(params);
      this.travelId = params.id;
      console.log(this.travelId);
      if(this.travelId)
      {
        this.salesPromotionDetail(this.travelId);
      }
    });
    
  }
  
  followupList:any=[];
  dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  weeks: CalendarDate[][] = [];
  sortedDates: CalendarDate[] = [];
  tab_class:any = true;
  
  ngOnInit() {
  }
  
  openDialog(p): void {
    console.log(p);
    
    const dialogRef = this.dialog.open(UploadImgModalComponent, {
      width: '500px',
      data:{p,
        id:this.travelId}
        
      });
      
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        
      });
    }
    
    fillDates(currentMoment): CalendarDate[] {
      const firstOfMonth = moment(currentMoment).startOf('month').day();
      const firstDayOfGrid = moment(currentMoment).startOf('month').subtract(firstOfMonth, 'days');
      const start = firstDayOfGrid.date();
      return _.range(start, start + 42)
      .map((date: number): CalendarDate => {
        const d = moment(firstDayOfGrid).date(date);
        return {
          today: this.isToday(d),
          selected: this.isSelected(d, this.selectedDates),
          existPlan : this.isActive(d, this.planArray),
          cal_date: this.cal_date,
          
          mDate: d,
        };
      });
    }
    
    selectedDate : any = '';
    selectDate(date)
    {
      this.northActive=false;
      this.southActive=false;
      this. eastActiveA=false;
      this.westActive=false;
      this.centralActive=false;
      this.northEastActive=false;
      let exist;
      this.selectedDate=moment(date).format('YYYY-MM-DD')
      console.log(moment(date).format('YYYY-MM-DD'));
      setTimeout(() => {
      }, 500);
      for(let i=0;i<this.planArray.length;i++)
      {
        if(moment(this.planArray[i].planDate).format('YYYY-MM-DD') == this.selectedDate)
        {
          console.log("tezhg");
          
          exist=this.eastZone.findIndex(row=>row==this.planArray[i].plandDetail[0].state)
          if(exist != -1)
          {
            this.eastActiveA=true;
          }
          exist=this.westZone.findIndex(row=>row==this.planArray[i].plandDetail[0].state)
          if(exist != -1)
          {
            this.westActive=true;
          }
          exist=this.southZone.findIndex(row=>row==this.planArray[i].plandDetail[0].state)
          if(exist != -1)
          {
            this.southActive=true;
          }
          exist=this.northZone.findIndex(row=>row==this.planArray[i].plandDetail[0].state)
          if(exist != -1)
          {
            this.northActive=true;
          }
          exist=this.norhtEastZone.findIndex(row=>row==this.planArray[i].plandDetail[0].state)
          if(exist != -1)
          {
            this.northEastActive=true;
          }
          exist=this.centralZone.findIndex(row=>row==this.planArray[i].plandDetail[0].state)
          if(exist != -1)
          {
            this.centralActive=true;
          }
          this.selectedDateArray=this.planArray[i];
          
        }
      }
      console.log(this.selectedDateArray);
      
    }
    
    generateCalendar(currentDate): void {
      const dates = this.fillDates(currentDate);
      const weeks: CalendarDate[][] = [];
      while (dates.length > 0) {
        weeks.push(dates.splice(0, 7));
      }
      this.weeks = weeks;
      console.log(this.weeks);
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
    isActive(date: moment.Moment, plan: any): boolean {
      return _.findIndex(plan, (d:any) => {
        if (moment(date).isSame(d.planDate, 'day')) {
          this.cal_date = d.planDate;
          console.log(this.cal_date);
          
          return true;
        } else {
          this.cal_date = '';
          return false;
        }
      }) > -1;
    }
    
    
    salesPromotionDetail(id)
    {
      this.planArray=[];
      this.loader=true;
      this.service.fetchData({"travelPlanID":id},"travelplan/list").subscribe((result)=>{
        console.log(result);
        setTimeout (() => {
          this.loader=false;
        }, 700);
        if(result['status']=="Success")
        {
          this.travelDetail=result['data'][0];
          this.totalPromotionLength=this.travelDetail.travelDetails.length;
          this.promotionMonth=moment(this.travelDetail.month, 'MM').format('MMMM');
          for(let i=0;i<this.travelDetail.travelDetails.length;i++)
          {
            
            if(this.planArray.length==0)
            {
              this.planArray.push({planDate:this.travelDetail.travelDetails[i].planDate,plandDetail:[{state:this.travelDetail.travelDetails[i].state,district:this.travelDetail.travelDetails[i].district,city:this.travelDetail.travelDetails[i].city,travelDetailId:this.travelDetail.travelDetails[i].travelDetailId,salesActivity:this.travelDetail.travelDetails[i].isSalesActivity,salesBudget:this.travelDetail.travelDetails[i].salesBudget,activityType:this.travelDetail.travelDetails[i].activityType}]})
            }
            else{
              
              let index= this.planArray.findIndex(row=>row.planDate===this.travelDetail.travelDetails[i].planDate);
              if(index!=-1)
              {
                this.planArray[index].plandDetail.push({state:this.travelDetail.travelDetails[i].state,district:this.travelDetail.travelDetails[i].district,city:this.travelDetail.travelDetails[i].city,travelDetailId:this.travelDetail.travelDetails[i].travelDetailId,salesActivity:this.travelDetail.travelDetails[i].isSalesActivity,salesBudget:this.travelDetail.travelDetails[i].salesBudget,activityType:this.travelDetail.travelDetails[i].activityType})
              }
              else{
                this.planArray.push({planDate:this.travelDetail.travelDetails[i].planDate,plandDetail:[{state:this.travelDetail.travelDetails[i].state,district:this.travelDetail.travelDetails[i].district,city:this.travelDetail.travelDetails[i].city,travelDetailId:this.travelDetail.travelDetails[i].travelDetailId,salesActivity:this.travelDetail.travelDetails[i].isSalesActivity,salesBudget:this.travelDetail.travelDetails[i].salesBudget,activityType:this.travelDetail.travelDetails[i].activityType}]})
              }
            }
          }
          console.log(this.planArray);
          this.selectedDateArray=this.planArray[0];
          console.log( this.selectedDateArray);
          this.selectedDate = this.currentDate=moment(this.planArray[0].planDate).format('YYYY-MM-DD');
          this.selectDate(this.selectedDate);
          this.generateCalendar(moment(this.planArray[0].planDate).format('YYYY-MM-DD'));
          
        }
      })
    }
    
    northZone:any=[
      "HARYANA",
      "HIMACHAL PRADESH",
      "JAMMU & KASHMIR",
      "PUNJAB",
      "UTTAR PRADESH",
      "UTTARAKHAND",
      "DELHI",
      "CHANDIGARH"
    ];
    southZone:any=[
      "ANDHRA PRADESH",
      "KARNATAKA",
      "KERALA",
      "TAMIL NADU",
      "TELANGANA",
      "PONDICHERRY"
    ];
    eastZone:any=[
      "BIHAR",
      "JHARKHAND",
      "ODISHA",
      "WEST BENGAL"
    ];
    westZone:any=[
      "GOA",
      "GUJARAT",
      "MAHARASHTRA",
      "RAJASTHAN",
      "DADRA & NAGAR HAVELI",
      "DAMAN & DIU"
    ];
    centralZone:any=[
      "CHATTISGARH",
      "MADHYA PRADESH"
    ];
    norhtEastZone:any=[
      "ARUNACHAL PRADESH",
      "ASSAM",
      "MANIPUR",
      "MEGHALAYA",
      "MIZORAM",
      "NAGALAND",
      "SIKKIM",
      "TRIPURA"
    ];
    
    
  }
  