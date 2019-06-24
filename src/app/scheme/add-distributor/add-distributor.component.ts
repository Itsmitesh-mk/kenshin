import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { ConstantService } from 'src/app/constant.service';
import { SnackBarOverview } from 'src/app/toast';

@Component({
  selector: 'app-add-distributor',
  templateUrl: './add-distributor.component.html',
  styleUrls: ['./add-distributor.component.scss']
})
export class AddDistributorComponent implements OnInit {

    schemedetail:any={}
    territory:any=[];
    distributorData:any={}
    territoryLIst:any=[];
    distributorList:any=[];
    dropdownSettings1:any={}
    dropdownSettings2:any={}
    schemeCode:any;
    // selectedDistributor:any=[];
    loader:any=false;
  currentDate:any = new Date().toJSON().split('T')[0];
  constructor(@Inject(MAT_DIALOG_DATA) public data,public service:ConstantService,public toast:SnackBarOverview) { 
    this.getTerritoryList();
    console.log(data);
    this.schemeCode=data['schemeCode'];
    this.schemedetail.distributor=data['value'];
    this.territory=data['territory'];
    console.log(this.territory);
    this.getDistributorList(this.territory)
  }

  form:any={};

  ngOnInit() {
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
  selectedTerritory:any=[];
  newData:any=[];
  apple:any={};
  arrayText:any=[];
  getTerritoryList()
  {
    this.service.fetchData({},"territory/list").subscribe((result)=>{
      console.log(result);
      if(result['status']=='Success')
      {
        this.territoryLIst=result['data'];
        console.log(this.territoryLIst);
        for(let i=0;i<this.territoryLIst.length;i++)
        {
          for(let j=0;j<this.territory.length;j++)
          {
            
            if(this.territory[j]==this.territoryLIst[i].territoryID)
            {
              this.selectedTerritory.push({territoryID:this.territoryLIst[i].territoryID,territoryName:this.territoryLIst[i].territoryName});
            }
          }
        }

        this.schemedetail.territory=this.selectedTerritory;
        console.log(this.selectedTerritory);
        
      }
    })
  }

  getDistributorList(territoriesIds)
  {
    this.service.fetchData({territoriesIds:territoriesIds},"territoriesnetworks/list").subscribe((result)=>{
      console.log(result);
      if(result['status']=='Success')
      {
        this.distributorList=result['data'];
      }
    })
   
  }
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
          this.distributorList=result['data'];
          console.log(this.distributorList);
          
        }
      })
     }
    
    
  }
  selectedDistributor(distributor)
  {
    this.schemedetail.schemeDistributors=[];
    console.log(distributor);

    for(let i=0;i<this.distributorList.length;i++)
    {
      console.log("test");
      for(let j=0;j<distributor.length;j++)
      {
        
        if(this.distributorList[i].networkId==distributor[j].networkId)
        {
            this.schemedetail.schemeDistributors.push({"distributorID":this.distributorList[i].networkId,"distributorTerritoryID":this.distributorList[i].territoryId,schemeCode:this.schemeCode});
        }
      }
    }
      console.log(this.schemedetail.schemeDistributors);
  }

  saveDistributor()
  {
    this.service.fetchData({isActive:1,schemeCode:this.schemeCode,schemeDistributors:this.schemedetail.schemeDistributors},"adddistributor").subscribe((result)=>{
      console.log(result);
      
    })
  }
}
