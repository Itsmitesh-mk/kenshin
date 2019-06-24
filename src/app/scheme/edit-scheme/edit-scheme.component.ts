import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { LoginComponent } from 'src/app/login/login.component';
import { ConstantService } from 'src/app/constant.service';
import { SnackBarOverview } from 'src/app/toast';

@Component({
  selector: 'app-edit-scheme',
  templateUrl: './edit-scheme.component.html',
  styleUrls: ['./edit-scheme.component.scss']
})
export class EditSchemeComponent implements OnInit {

  schemeData:any={}
  currentDate:any = new Date().toJSON().split('T')[0];
  constructor(@Inject(MAT_DIALOG_DATA) public data,public service:ConstantService,public toast:SnackBarOverview) { 
    console.log(data);
    this.schemeData=data;

  }

  ngOnInit() {
  }

  value:any={};
  updateScheme()
  {
    console.log(this.schemeData.isActive);
    
    this.value.schemeCode=this.schemeData.schemeCode;
    this.value.isActive=this.schemeData.isActive;
    console.log(this.schemeData);
    if(this.schemeData.field=='title')
    {
      this.value.title=this.schemeData.value
    }
    if(this.schemeData.field=='schemeDescription')
    {
      this.value.schemeDescription=this.schemeData.value
      
    }
    if(this.schemeData.field=='validFrom')
    {
      this.value.validFrom=this.schemeData.value      
    }
    if(this.schemeData.field=='validTill')
    {
      this.value.validTill=this.schemeData.value
      
    }
    if(this.schemeData.field=='tc')
    {
      this.value.tc=this.schemeData.value
      
    }
    console.log(this.value);
    this.service.fetchData(this.value,"/modifyscheme").subscribe((result)=>{
      console.log(result);
      if(result['message']=='Success')
      {
        this.toast.openSucess("Scheme","Update SuccessFully")
      }
      
    })
    
  }

}
