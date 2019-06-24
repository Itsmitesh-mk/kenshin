import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { ConstantService } from 'src/app/constant.service';
import { SnackBarOverview } from 'src/app/toast';

@Component({
  selector: 'app-editmodel',
  templateUrl: './editmodel.component.html',
  styleUrls: ['./editmodel.component.scss']
})
export class EditmodelComponent implements OnInit {

  loader:boolean;
  extraData:any={};
 constructor(@Inject(MAT_DIALOG_DATA) public data:any,public service:ConstantService,public toast:SnackBarOverview){ 
   console.log(data);
   this.extraData=this.data;
   console.log(this.extraData);
 }
 ngOnInit() {
 }

 update_detail()
 {
   this.loader=true
   this.service.fetchData(this.extraData,"product/update").subscribe((result)=>{
     console.log(result);
     this.loader=false
     if(result['status']=='Success')
     {
      this.toast.openSucess("Product Packing Detail"," Update SuccessFully")
     }
     
   })
   
 }
}
