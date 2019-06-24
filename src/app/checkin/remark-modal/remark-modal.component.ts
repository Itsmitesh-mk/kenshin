import { Component, OnInit,Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material'
import { ConstantService } from '../../constant.service';
import { SnackBarOverview } from 'src/app/toast';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-remark-modal',
  templateUrl: './remark-modal.component.html'
})
export class RemarkModalComponent implements OnInit {
  checkinId:any=[];
  loader:any=false;
  update_data:any={};
  constructor(public toast:SnackBarOverview,public router:Router,public dialogRef: MatDialogRef<RemarkModalComponent>,@Inject(MAT_DIALOG_DATA) public data:any,public db:ConstantService)
  {console.log(data);
    this.checkinId=this.data;

    console.log(this.checkinId);
  }
  ngOnInit() {
  }
  updateactivity(){
    if(this.checkinId.type=='activityReamrk'){
      this.update_data.activityId=this.checkinId.id;
      console.log(this.update_data);
    this.loader=true;
      this.db.fetchData(this.update_data,'activityremark/update').subscribe((response)=>{
        console.log(response);
        this.loader=false;
        if(response['status']=="Success")
          {
            console.log(this.update_data.activityId);
            this.toast.openSucess('Updated successfully','');
            this.router.navigate(['checkin-detail/'+this.update_data.activityId]);
            this.dialogRef.close();
          }
          else
          {
            this.toast.openError('Something went wrong Please Try Again!!','');
          }
       
      });
    }
  }
}
