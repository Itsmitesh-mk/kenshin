import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as $ from 'jquery';
import { ConstantService } from 'src/app/constant.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { SnackBarOverview } from 'src/app/toast';

@Component({
  selector: 'app-add-scheme',
  templateUrl: './add-scheme.component.html'
})
export class AddSchemeComponent implements OnInit {

  scheme:any={};
  currentDate:any = new Date().toJSON().split('T')[0];
  dropdownSettings:any={};
  dropdownSettings1:any={};
  dropdownSettings2:any={};
  schemeDistributors:any={}
  productList:any=[];
  loader:any=false;
  schemeProductDetails:any=[];
  schemedetail:any={"partNumber":"","prodesc":""};
  territoryLIst:any=[];
  constructor(@Inject(PLATFORM_ID) private platformId: Object,public service:ConstantService,public router:Router,public toast:SnackBarOverview) {
    
    this.schemedetail.schemeType=1;
    this.getProductList();
    this.getTerritoryList();
  }

  ngOnInit() {
    this.dropdownSettings = {
      singleSelection: false,
      closeDropDownOnSelection:true,
      idField: 'partNumber',
      textField: 'partNumberCode',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
      maxHeight: 197
    };
    this.dropdownSettings1 = {
      
      idField: 'territoryID',
      textField: 'territoryName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
      maxHeight: 197
    };
    this.dropdownSettings2 = {
      idField: 'networkId',
      
      textField: 'establishment',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
      maxHeight: 197
    };
  }

  setFocus(form) {
    for (var key in form.controls)
     {
      if (form.controls.hasOwnProperty(key)) {
        if(form.controls[key].status=='INVALID')
        {
          if (isPlatformBrowser(this.platformId)) {
                    $('#'+key).focus();
                  }
                  break;
        }
          console.log(key + " -> " + form.controls[key].status);
      }
  }
    
  }
  submitDetail()
  {

    this.scheme.schemeDistributors=this.schemedetail.schemeDistributors;
    this.scheme.validFrom=moment(this.scheme.validFrom).format('YYYY-MM-DD');
    this.scheme.validTill=moment(this.scheme.validTill).format('YYYY-MM-DD');

    this.loader=true; 
    this.scheme.schemeProductDetails=this.schemeProductDetails;
    this.scheme.isActive=1;
    this.scheme.schemeType=this.schemedetail.schemeType;
    console.log(this.scheme);
    this.service.fetchData(this.scheme,"createscheme").subscribe((result)=>{
      console.log(result);
      this.loader=false
      if(result['message']=='Success')
      {
        this.toast.openSucess('Scheme ','Added successfully');

        this.router.navigate(['/scheme-list']);

      }
    })
    
  }

  getSchemeType()
  {
    console.log(this.schemedetail.schemeType);
    
  }

  getTerritoryList()
  {
    this.service.fetchData({},"territory/list").subscribe((result)=>{
      console.log(result);
      if(result['status']=='Success')
      {
        this.territoryLIst=result['data'];
        console.log(this.territoryLIst);
        
      }
    })
  }

  distributoList:any=[];
  getDistribotorList(territory)
  {
    // this.distributoList=[];
  
    const territoriesIds=[];
      this.loader=true;
      for(let i=0;i<territory.length;i++)
      {
        territoriesIds.push(territory[i].territoryID);
      }
      console.log(territory);
     if(territoriesIds.length!=0)
     {
      this.service.fetchData({territoriesIds:territoriesIds},"territoriesnetworks/list").subscribe((result)=>{
        console.log(result);
        this.loader=false;
        if(result['status']=='Success')
        {
          this.distributoList=result['data'];
          console.log(this.distributoList);
          
        }
      })
     }
    
    
  }
  getSelectedDistribotorList()
  {
    this.distributoList=[];
    
  }

  selectedDistributor(distributor)
  {
    this.schemedetail.schemeDistributors=[];
    console.log(distributor);

    for(let i=0;i<this.distributoList.length;i++)
    {
      console.log("test");
      for(let j=0;j<distributor.length;j++)
      {
        
        if(this.distributoList[i].networkId==distributor[j].networkId)
        {
            this.schemedetail.schemeDistributors.push({"distributorID":this.distributoList[i].networkId,"distributorTerritoryID":this.distributoList[i].territoryId});
        }
      }
    }
      console.log(this.schemedetail.schemeDistributors);
  }

  getProductList()
  {
    this.loader=true;
    this.service.fetchData({"currentPage": 1,"pageSize": 500},"product/list").subscribe((result)=>{
      console.log(result);
      this.loader=false
      if(result['status']=='Success')
      {
        this.productList=result['data'];
      }
    })
  }
  partCode:any;
  selectedPartNumber(event)
  {
    this.partCode=event;
  }

  addScheme(product,des)
  {
    console.log(product);
    console.log(des);
    
    for(let i=0;i<product.length;i++)
    {
      this.schemeProductDetails.push({"partNumberCode":product[i],"offerDescription":des});
    }
    
    this.schemedetail.partNumber='';
    this.schemedetail.prodesc='';
    
  }

  removeScheme(index)
  {
    this.schemeProductDetails.splice(index,1);
  }

}
