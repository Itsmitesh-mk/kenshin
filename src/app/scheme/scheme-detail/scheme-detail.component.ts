import { Component, OnInit } from '@angular/core';
import { ConstantService } from 'src/app/constant.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { EditSchemeComponent } from '../edit-scheme/edit-scheme.component';
import { DialogComponent } from 'src/app/dialog';
import { SnackBarOverview } from 'src/app/toast';
import { EditdateSchemeComponent } from '../editdate-scheme/editdate-scheme.component';
import { AddDistributorComponent } from '../add-distributor/add-distributor.component';

@Component({
  selector: 'app-scheme-detail',
  templateUrl: './scheme-detail.component.html',
  styleUrls: ['./scheme-detail.component.scss']
})
export class SchemeDetailComponent implements OnInit {

  schemeCode:any;
  schemeDetail:any={};
  totalProduct:any=[];
  loader:any=false;
  dropdownSettings1:any={}
dropdownSettings2:any={}
  constructor(public service:ConstantService,public route:ActivatedRoute,public dialog: MatDialog,public alert:DialogComponent,public toast:SnackBarOverview) { 

    this.route.params.subscribe(params=>{
      console.log(params);
      this.schemeCode = params.id;
      console.log(this.schemeCode);
      if(this.schemeCode)
      {
        this.getSchemeDetail();
      }
     
});
  }

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

  getSchemeDetail()
  {
    this.loader=true;
    this.service.fetchData({"schemeCode": this.schemeCode},"/getschemedescription").subscribe((result)=>{
      console.log(result);
      this.loader=false;
      if(result['message']=='Success')
      {
        this.schemeDetail=result['data'];
        this.totalProduct=this.schemeDetail.schemeProductDetails;
        this.getDistribotorList(this.schemeDetail.schemeDistributors)
      }
    })
  }
  selectedTerritory:any=[];
  distributoList:any=[];
  tmpDistributorList:any=[];
  getDistribotorList(territory)
  {
    this.distributoList=[];
    const territoriesIds=[];
      // this.loader=true;
      for(let i=0;i<territory.length;i++)
      {
        if(territoriesIds.length==0)
        {
          territoriesIds.push(territory[i].distributorTerritoryID);
        }
        else{
          let idIndex=territoriesIds.findIndex(row=>row!=territory[i].distributorTerritoryID);
          if(idIndex!= -1)
          {
          territoriesIds.push(territory[i].distributorTerritoryID);

          }
        }
      }
      console.log(territoriesIds);
      this.selectedTerritory=territoriesIds;
     if(territoriesIds.length!=0)
     {
      this.service.fetchData({territoriesIds:territoriesIds},"territoriesnetworks/list").subscribe((result)=>{
        console.log(result);
        this.loader=false;
        if(result['status']=='Success')
        {
          this.tmpDistributorList=result['data'];

          for(let i=0;i<this.tmpDistributorList.length;i++)
          {
            for(let j=0;j<territory.length;j++)
            {
              if(this.tmpDistributorList[i].networkId==territory[j].distributorID)
              {
                this.distributoList.push(this.tmpDistributorList[i]);
              }
            }
          }
          // console.log(this.distributoList);
          
        }
      })
     }
    
    
  }

  addDistributor(value)
  {
    console.log(value);
    
    const dialogRef = this.dialog.open(AddDistributorComponent,
      {
        width: '800px',
         data:{'territory':this.selectedTerritory,value,'schemeCode':this.schemeDetail.schemeCode}
      });
    dialogRef.afterClosed().subscribe(result => {
    this.getSchemeDetail();
  });
  }

  openEditDialog(field,value)
  {
    const dialogRef = this.dialog.open(EditSchemeComponent,
        {
          width: '512px',
           data:{field,
           value,'schemeCode':this.schemeDetail.schemeCode,"isActive":this.schemeDetail.isActive}
        });
      dialogRef.afterClosed().subscribe(result => {
      this.getSchemeDetail();
    });
  }

  openEditDateDialog(field)
  {
    const dialogRef = this.dialog.open(EditdateSchemeComponent,
        {
          width: '512px',
           data:this.schemeDetail
        });
      dialogRef.afterClosed().subscribe(result => {
      this.getSchemeDetail();
    });
  }
  removeScheme(partNumber)
  {
    console.log(partNumber);
    
    this.alert.delete("Scheme").then((result) => {
      console.log(result);
      if(result)
      {
        this.service.fetchData({"partNumberCode": partNumber,"schemeCode": this.schemeDetail.schemeCode},"/removeschemefromproduct").subscribe((result)=>{
          console.log(result);
          if(result['message']=='Success')
          {
            this.toast.openSucess('Scheme ','Removed successfully');
            this.getSchemeDetail();
          }
          
        })
      }
    });
   
  }
  removeDistributor(id,code)
  {
    console.log(id);
    
    this.alert.delete("Scheme").then((result) => {
      console.log(result);
      if(result)
      {
        this.service.fetchData({"distributorID": id,"schemeCode": code},"removedistributor").subscribe((result)=>{
          console.log(result);
          if(result['message']=='Success')
          {
            this.toast.openSucess('Scheme ','Removed successfully');
            this.getSchemeDetail();
          }
          
        })
      }
    });
  }
}
