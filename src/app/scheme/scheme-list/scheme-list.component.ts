import { Component, OnInit } from '@angular/core';
import { ConstantService } from 'src/app/constant.service';
import { DialogComponent } from 'src/app/dialog';
import { SnackBarOverview } from 'src/app/toast';

@Component({
  selector: 'app-scheme-list',
  templateUrl: './scheme-list.component.html'
})
export class SchemeListComponent implements OnInit {
  
  schemeList:any=[];
  div:boolean=false;
  loader:any=false;

  user:any;
  userType:any;
  constructor(public service:ConstantService,public dialog:DialogComponent,public toast:SnackBarOverview) { 
    this.productSchemeList();
  }
  
  ngOnInit() {

    this.user = JSON.parse(localStorage.getItem('user')) || [];
    console.log(this.user);
    this.userType = this.user.data.userType;

    console.log(this.userType);
  }
  
  productSchemeList()
  {
    this.loader=true;
    this.service.fetchData({isActive:2},"getallscheme").subscribe((result)=>{
      console.log(result);
      this.loader=false;
      if(result['message']=='Success')
      {
        this.schemeList=result['data'];
      }
      else{
        this.div=true;
        this.schemeList=[];
      }
    })
  }
  
  // removeScheme(schemeCode)
  // {
  //   this.dialog.delete("Scheme").then((result) => {
  //     console.log(result);
  //     if(result)
  //     {
  //       this.service.fetchData({schemeCode:schemeCode},"/deactivatescheme").subscribe((result)=>{
  //         console.log(result);
  //         if(result['message']=='Success')
  //         {
  //           this.toast.openSucess('Scheme removed successfully','');
  //           this.productSchemeList();
  //         }
          
  //       })
  //     }
  //   });
    
  // }
  
  isactive(schemeCode,isActive)
  {
    console.log(isActive,schemeCode);
    
    if(isActive=='1')
    {
      this.service.fetchData({schemeCode:schemeCode},"deactivatescheme").subscribe((result)=>{
        console.log(result);
        if(result['message']=="Success")
        {
          this.toast.openSucess('Scheme ','Deactivated');
          this.productSchemeList();
        }
      })
    }
    else
    {
      this.service.fetchData({schemeCode:schemeCode,isActive: 1},"modifyscheme").subscribe((result)=>{
        console.log(result);
        if(result['message']=="Success")
        {
          this.toast.openSucess('Scheme ','Activated');
          this.productSchemeList();
        }
      })
      
    }
  }
}
