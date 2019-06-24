import { Component, OnInit,Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material'
import { ConstantService } from '../../constant.service';
import { Router } from '@angular/router';
import { SnackBarOverview } from 'src/app/toast';
@Component({
  selector: 'app-gift-modal',
  templateUrl: './gift-modal.component.html',
})
export class GiftModalComponent implements OnInit {
 
  loader:boolean;
   extraData:any={};
   id:any;
   doc:any=[];
   url:any;
   requestfn:any;
   api:any;
   message:any;
  constructor(  public router:Router,public dialogRef: MatDialogRef<GiftModalComponent>,@Inject(MAT_DIALOG_DATA) public data:any,public db:ConstantService,public toast:SnackBarOverview){ 
     console.log(data);  
     this.extraData=this.data; 
  }
  ngOnInit() {
  }
  MobileNumber(event: any) 
  {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) 
    {event.preventDefault(); }
   }
  update_detail(){
    this.loader=true;
    console.log(this.extraData);
    if(this.extraData.check=='extrafield'){
    this.db.fetchData(this.extraData,'pop/update').subscribe((response)=>{console.log(response)
      this.message=response['message']
      this.loader=false;
      if(this.message=="PopGift updated successfully")
      {
        this.toast.openSucess('PopGift updated successfully','');
        // this.router.navigate(['/gift-list']) 
      }
      else
      {
        this.toast.openError('Something Went Wrong Please Try Again!!','');
      }
      
     });
  }
  else{
    this.db.fetchData(this.extraData,'pop/update').subscribe((response)=>{console.log(response)
      this.message=response['message']
      this.loader=false;
      if(this.message=="PopGift updated successfully")
      {
        this.toast.openSucess('PopGift updated successfully','');
        // this.router.navigate(['/gift-list']) 
      }
      else
      {
        this.toast.openError('Something Went Wrong Please Try Again!!','');
      }
      
     });
  }
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
    console.log(this.data)
  }
}
