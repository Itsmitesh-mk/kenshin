import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { ConstantService } from 'src/app/constant.service';
import { SnackBarOverview } from 'src/app/toast';
import * as moment from 'moment';

@Component({
  selector: 'app-editdate-scheme',
  templateUrl: './editdate-scheme.component.html',
  styleUrls: ['./editdate-scheme.component.scss']
})
export class EditdateSchemeComponent implements OnInit {

  schemeData:any={}
  currentDate:any = new Date().toJSON().split('T')[0];
  constructor(@Inject(MAT_DIALOG_DATA) public data,public service:ConstantService,public toast:SnackBarOverview) { 
    console.log(data);
    this.schemeData=data;
  }
  ngOnInit() {
  }
  
  checkValid()
  {
    if(moment(this.schemeData.validFrom).format('YYYY-MM-DD')>moment(this.schemeData.validTill).format('YYYY-MM-DD'))
    {
      this.schemeData.validTill=null;
    }
  }
  updateScheme()
  {
    console.log(this.schemeData.validFrom);
    
    let value={validFrom:moment(this.schemeData.validFrom).format('YYYY-MM-DD'),validTill:moment(this.schemeData.validTill).format('YYYY-MM-DD'),schemeCode:this.schemeData.schemeCode,isActive:this.schemeData.isActive}
    this.service.fetchData(value,"/modifyscheme").subscribe((result)=>{
      console.log(result);
      if(result['message']=='Success')
      {
        this.toast.openSucess("Scheme","Update SuccessFully")
      }
      
    })
  }

}
