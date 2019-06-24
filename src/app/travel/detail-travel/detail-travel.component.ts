import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConstantService } from 'src/app/constant.service';
import { MatDialog } from '@angular/material';
import { UpdateTravelComponent } from '../update-travel/update-travel.component';
import { SnackBarOverview } from 'src/app/toast';
import { AddOnDetailComponent } from '../add-on-detail/add-on-detail.component';
import { DialogComponent } from 'src/app/dialog';

@Component({
  selector: 'app-detail-travel',
  templateUrl: './detail-travel.component.html'
})
export class DetailTravelComponent implements OnInit {
  
  activeStatus1:any='';
  activeStatus2:any='';
  activeStatus3:any='';
  travelId:any;
  travelDetail:any=[];
  user:any={};
  userType:any;
  userId:any;
  loader:any=false;
  userRole:any;
  travel:any={};
  constructor(public route:ActivatedRoute,public service:ConstantService,public dialog: MatDialog,public toast:SnackBarOverview,public alrt:DialogComponent) {
    
    this.user = JSON.parse(localStorage.getItem('user')) || [];
    console.log(this.user);
    this.userType = this.user.data.userType;
    this.userId = this.user.data.userId;
    this.userRole=this.user.data.role;
    console.log(this.userType ,"&" , this.userId, "&" ,this.userRole);
    
    this.route.params.subscribe( params => {
      console.log(params);
      this.travelId = params.id;
      console.log(this.travelId);
      this.getUserList();
      if(this.travelId)
      {
        this.getTravelDetail();
      }
    });
  }
  
  ngOnInit() {
  }
  
  planArray:any=[]
  getTravelDetail()
  {
    this.planArray=[];
    this.loader=true;
    this.service.fetchData({"travelPlanID":this.travelId},"travelplan/list").subscribe((result)=>{
      console.log(result);
      setTimeout (() => {
        this.loader=false;
      }, 700);
      if(result['status']=="Success")
      {
        this.travelDetail=result['data'][0];
        console.log(this.travelDetail);
        
        for(let i=0;i<this.travelDetail.travelDetails.length;i++)
        {
          
          if(this.planArray.length==0)
          {
            this.planArray.push({planDate:this.travelDetail.travelDetails[i].planDate,plandDetail:[{state:this.travelDetail.travelDetails[i].state,district:this.travelDetail.travelDetails[i].district,city:this.travelDetail.travelDetails[i].city,travelDetailId:this.travelDetail.travelDetails[i].travelDetailId,salesActivity:this.travelDetail.travelDetails[i].isSalesActivity,salesBudget:this.travelDetail.travelDetails[i].salesBudget,activityType:this.travelDetail.travelDetails[i].activityType}]})
          }
          else{
            
            let index= this.planArray.findIndex(row=>row.planDate===this.travelDetail.travelDetails[i].planDate);
            if(index!=-1)
            {
              this.planArray[index].plandDetail.push({state:this.travelDetail.travelDetails[i].state,district:this.travelDetail.travelDetails[i].district,city:this.travelDetail.travelDetails[i].city,travelDetailId:this.travelDetail.travelDetails[i].travelDetailId,salesActivity:this.travelDetail.travelDetails[i].isSalesActivity,salesBudget:this.travelDetail.travelDetails[i].salesBudget,activityType:this.travelDetail.travelDetails[i].activityType})
            }
            else{
              this.planArray.push({planDate:this.travelDetail.travelDetails[i].planDate,plandDetail:[{state:this.travelDetail.travelDetails[i].state,district:this.travelDetail.travelDetails[i].district,city:this.travelDetail.travelDetails[i].city,travelDetailId:this.travelDetail.travelDetails[i].travelDetailId,salesActivity:this.travelDetail.travelDetails[i].isSalesActivity,salesBudget:this.travelDetail.travelDetails[i].salesBudget,activityType:this.travelDetail.travelDetails[i].activityType}]})
            }
          }
        }
        console.log(this.planArray);
        
        
        if(this.travelDetail['status']==1)
        {
          this.activeStatus1='pending';
        }
        if(this.travelDetail['status']==2)
        {
          this.activeStatus2='approved';
        }
        if(this.travelDetail['status']==3)
        {
          this.activeStatus3='reject';
        }
      }
    })
  }
  
  updateTravel(value)
  {
    console.log(value);
    
    const dialogRef = this.dialog.open(UpdateTravelComponent, {
      width: '1024px',
      data:{
        id:this.travelDetail.travelPlanID,
        value
      }});
      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
        console.log('The dialog was closed');
        if(result)
            {
              this.getTravelDetail();
            }
      });
    }
    
    deleteTravelPlan(travelDetailID)
    {
      this.alrt.delete('Travel Plan  !').then((result) => {
        if(result)
        { 
          console.log(travelDetailID);
          
          this.loader=true;
          this.service.fileData("","traveldetail/delete/"+travelDetailID).subscribe((result)=>{
            console.log(result);
            this.loader=false;
            if(result['status']=='Success')
            {
              this.getTravelDetail
              
            }
          })
        }})
      }

      financeUserList:any=[];
      getUserList()
      {
        this.loader=true;
        this.service.fetchData({role:17, "currentPage": 1,"pageSize": 50},"user/list").subscribe((result)=>{
          console.log(result);
          this.loader=false;
          if(result['status']=='Success')
          {
            this.financeUserList=result['data'];
          }
        })
      }
      
      // updateTravelStatus(id,status)
      // {
      //   this.travel.travelPlanID=id;
      //   console.log(status.value);
        
      // }
      updatedstatus(id,status)
      {
        this.travel.travelPlanID=id;
        console.log(status);
        this.travel.status=status;
        
        this.saveStatus()
        
      }

      saveStatus()
      {
          this.value={"travelPlanID": this.travel.travelPlanID,"status": this.travel.status}
          
        console.log(this.value);
        
        this.service.fetchData(this.value,"travelplan/travelapproval").subscribe((result)=>{
          console.log(result);
          if(result['status']==['Success'])
          {
            this.toast.openSucess('Status updated successfully','');
            this.getTravelDetail();
          }
        })
      }
      value:any={}
      
      saveTravelStatus()
      {
        if(this.travel.status==4)
        {
          this.travel.travelRejectedBy=this.userId;
        }
        this.travel.travelPlanID=this.travelId
        console.log(this.travel);
        
        this.service.fetchData(this.travel,"travelplan/travelapproval").subscribe((result)=>{
          console.log(result);
          if(result['status']=='Success')
          {
            this.getTravelDetail();
          }
        })
      }

      saveSalesStatus()
      {
        if(this.travel.status==6)
        {
          this.travel.salesRejectedBy=this.userId;
        }
        else{
          this.travel.salesApprovedBy=this.userId
        }
        this.travel.travelPlanID=this.travelId
        console.log(this.travel);
        this.service.fetchData(this.travel,"travelplan/salesapproval").subscribe((result)=>{
          console.log(result);
          if(result['status']=='Success')
          {
            this.getTravelDetail();
          }
        })        
        
      }
      addOnDetail(date)
      {
        
        console.log("hello");
        
        const dialogRef = this.dialog.open(AddOnDetailComponent, {
          width: '1024px',
          data:{
            olddata:this.travelDetail,
            date:date
          }});
          dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if(result)
            {
              this.getTravelDetail();
            }
            console.log('The dialog was closed');
          });
        }
        
        
      }
      