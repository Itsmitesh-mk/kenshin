import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ConstantService } from 'src/app/constant.service';
import * as moment from 'moment';

@Component({
  selector: 'app-remaining-leave',
  templateUrl: './remaining-leave.component.html',
  styleUrls: ['./remaining-leave.component.scss']
})
export class RemainingLeaveComponent implements OnInit {
  
  userId:any;
  leaveList:any=[];
  constructor(@Inject(MAT_DIALOG_DATA)public data,public dialog:MatDialog,public service:ConstantService) {
    
    console.log(data);
    this.userId=data['userId'];
    if(this.userId)
    {
      this.getRemainingLeave();
    }
  }
  
  ngOnInit() {
  }
  currentyear:any;
  getRemainingLeave()
  {
    this.service.fetchData({'userId':this.userId},'getUserRemainingLeaves').subscribe((result)=>{
      console.log(result);
      if(result['message']=='Success')
      {
        const leaveArray=result['data'];
        this.currentyear = result['data'][0]['year'];
        this.currentyear = moment().format('YYYY');
        console.log(this.currentyear);
        for (var i=0;i<leaveArray.length;i++)
        {
          if(leaveArray[i].year==this.currentyear)
          {
            this.leaveList.push(leaveArray[i]);
          }
        }
      }
    })
  }
  
}
