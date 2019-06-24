
import { Component, OnInit, Renderer2  } from '@angular/core';
import { ConstantService } from '../../constant.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SnackBarOverview } from 'src/app/toast';
import {MatDialog} from '@angular/material';
import { DialogComponent } from 'src/app/dialog';
// import { userInfo } from 'os';
// import { userInfo } from 'os';
@Component({
  selector: 'app-concern-list',
  templateUrl: './concern-list.component.html'
})
export class ConcernListComponent implements OnInit {
concernList:any=[];
status:any;
user:any=[];
userId:any;
whPending:boolean=false;
whVerified:boolean=false;
fmVerified:boolean=false;
draftActive:boolean=false;
concernActive:boolean=false;
rejectActive:boolean=false;
underActive:boolean=false;
waitActive:boolean=false;
concernNumber:boolean=false;
tmp_concern:any=[];
loader:any=false
div:any=false;
  constructor(public db:ConstantService,public router:Router,public dialog:DialogComponent,public route:ActivatedRoute,public toast:SnackBarOverview,public dia:MatDialog
  ) {
        this.user = JSON.parse(localStorage.getItem('user')) || [];
        console.log(this.user);
        this.userId = this.user.data.userId;


        const concernListType = localStorage.getItem('concernListType') || '';
        console.log(concernListType);  
        
      if(this.user.data.userType==2 && concernListType==""){
           console.log("sales"); 
           this.concern_list(2);
         }  
      else if(this.user.data.userType==3 && concernListType==""){
          console.log("Dist"); 
          this.concern_list(1);
        }  
    
        else if(this.user.data.role==16 && concernListType==""){
          this.concern_list(7);
        }  
        else if(this.user.data.role==17 && concernListType==""){
          this.concern_list(8);
        }  
        else if(this.user.data.userType==1 && concernListType==""){
          console.log("admin"); 
          this.concern_list(20);
        }  
      else if (concernListType == 'Draft') {
          this.concern_list(1);
          localStorage.removeItem('concernListType');
                } 
      else if (concernListType == 'Submit') {
          this.concern_list(2);
          localStorage.removeItem('concernListType');
                  } 
      else if (concernListType == 'Forward') {
          this.concern_list(3);
          localStorage.removeItem('concernListType');
                } 
      else if (concernListType == 'Approval') {
        this.concern_list(4);
        localStorage.removeItem('concernListType');
             } 
    else if (concernListType == 'Approved') {
      this.concern_list(5);
      localStorage.removeItem('concernListType');
      } 
  else if (concernListType == 'Rejected') {
    this.concern_list(6);
    localStorage.removeItem('concernListType');
} 
else if (concernListType == 'Document'&& (this.user.data.userType==3 || this.user.data.userType==2)) {
  this.concern_list(5);
  localStorage.removeItem('concernListType');
 } 
 else if (concernListType == 'Document' && this.user.data.userType==1) {
  this.concern_list(7);
  localStorage.removeItem('concernListType');
 } 
 else if (concernListType == 'WH'&& this.user.data.userType==1) {
  this.concern_list(8);
  localStorage.removeItem('concernListType');
 } 
 else if (concernListType == 'WH'&& (this.user.data.userType==3 || this.user.data.userType==2)) {
  this.concern_list(5);
  localStorage.removeItem('concernListType');
 } 
 else if (concernListType == 'FM' && this.user.data.userType==1) {
  this.concern_list(9);
  localStorage.removeItem('concernListType');
 } 
 else if (concernListType == 'FM'&& (this.user.data.userType==3 || this.user.data.userType==2)) {
  this.concern_list(5);
  localStorage.removeItem('concernListType');
 } 
    
  }


  ngOnInit() {

  }
  concernStatuses:any=[];
  msg:any;
  message:any;
  concern_list(status){
    this.concernStatuses=[];
    this.status=status;
    this.loader=true;
    this.div=false;
    this.tmp_concern = [];

    console.log(status);
    if(status==1){
      this.whPending=false;
      this.status=status;
      this.tmp_concern=[];
      this.rejectActive=false;
      this.waitActive=false;
      this.underActive=false;
      this.concernActive=false;
      this.concernNumber=false;
      this.whVerified=false;
      this.fmVerified=false;
      console.log(this.draftActive);
      
       this.concernStatuses.push(status);
          this.db.fetchData( {"createdBy":this.userId,"currentPage": 1,  "concernStatuses": this.concernStatuses,
          "pageSize": 500},'concern/list').subscribe((response)=>{

            console.log(response)
            this.draftActive=true;
            this.loader=false;
            if(response['status']=='Success')
            {
          
              this.div=false;
                  this.concernList=response['data'];
                  this.tmp_concern=this.concernList;
                  for(let i=0;i<this.tmp_concern.length;i++){
                    this.tmp_concern[i].totalQty=0;
                    this.tmp_concern[i].totalAmount=0;
                    if(this.tmp_concern[i].concernType==1){
                    for(let j=0;j<this.tmp_concern[i].productConcerns.length;j++){
                      console.log(this.tmp_concern[i].productConcerns[j].netAmount, this.tmp_concern[i].productConcerns[j].qunatity);
                      this.tmp_concern[i].totalQty= this.tmp_concern[i].totalQty+this.tmp_concern[i].productConcerns[j].qunatity;
                      this.tmp_concern[i].totalAmount= this.tmp_concern[i].totalAmount+this.tmp_concern[i].productConcerns[j].netAmount;
                    }
                  }
                  }
            }


            if(response['status']=='Failed')
            {
                  this.div=true;
                  this.concernList=[];
                  this.tmp_concern=this.concernList;
            }

            console.log(this.concernList);
            console.log(this.tmp_concern);
        })

} else if(status==2) {
    this.status=status;
     this.tmp_concern=[];
     this.whPending=false;
     this.whVerified=false;
     this.fmVerified=false;
       this.waitActive=false;
       this.rejectActive=false;
       this.draftActive=false;
       this.concernActive=false;
        this.concernNumber=false;
        console.log(this.underActive);
        this.loader=true;
        this.concernStatuses.push(status)
        this.db.fetchData( {"currentPage": 1,"concernStatuses": this.concernStatuses,
        "pageSize": 500},'concern/list').subscribe((response)=>{

              console.log(response)
              this.underActive=true;
              this.loader=false;
              if(response['status']=='Success')
              { 
                
                        this.div=false;
                        this.concernList=response['data'];
                        this.tmp_concern=this.concernList
                        console.log(this.concernList);
                        console.log(this.tmp_concern);

                        for(let i=0;i<this.tmp_concern.length;i++) {

                              this.tmp_concern[i].totalQty=0;

                              this.tmp_concern[i].totalAmount=0;

                              if(this.tmp_concern[i].concernType==1){
                                    for(let j=0;j<this.tmp_concern[i].productConcerns.length;j++){
                                      console.log(this.tmp_concern[i].productConcerns[j].netAmount, this.tmp_concern[i].productConcerns[j].qunatity);
                                      this.tmp_concern[i].totalQty= this.tmp_concern[i].totalQty+this.tmp_concern[i].productConcerns[j].qunatity;
                                      this.tmp_concern[i].totalAmount= this.tmp_concern[i].totalAmount+this.tmp_concern[i].productConcerns[j].netAmount;
                                    }
                              }
                        }
              }

              if(response['status']=='Failed')
              {
                  this.div=true;
                  this.concernList=[];
                  this.tmp_concern=this.concernList
              }
            console.log(this.concernList);
            console.log(this.tmp_concern);
      })

  }
  else if(status==3) {
    this.status=status;
    this.tmp_concern=[];
    this.whPending=false;
    this.whVerified=false;
    this.fmVerified=false;
    this.underActive=false;
    this.rejectActive=false;
    this.draftActive=false;
    this.concernActive=false;
    this.concernNumber=false;
    this.waitActive=true;
    this.loader=true;
 
    this.concernStatuses.push(status)
    this.db.fetchData( {"currentPage": 1,
    "pageSize": 500,"concernStatuses": this.concernStatuses},'concern/list').subscribe((response)=>{

          console.log(response)
          this.loader=false;
          if(response['status']=='Success')
          { 
            
                    this.div=false;
                    this.concernList=response['data'];
                    this.tmp_concern=this.concernList
                    console.log(this.concernList);
                    console.log(this.tmp_concern);

                    for(let i=0;i<this.tmp_concern.length;i++) {

                          this.tmp_concern[i].totalQty=0;

                          this.tmp_concern[i].totalAmount=0;

                          if(this.tmp_concern[i].concernType==1){
                                for(let j=0;j<this.tmp_concern[i].productConcerns.length;j++){
                                  console.log(this.tmp_concern[i].productConcerns[j].netAmount, this.tmp_concern[i].productConcerns[j].qunatity);
                                  this.tmp_concern[i].totalQty= this.tmp_concern[i].totalQty+this.tmp_concern[i].productConcerns[j].qunatity;
                                  this.tmp_concern[i].totalAmount= this.tmp_concern[i].totalAmount+this.tmp_concern[i].productConcerns[j].netAmount;
                                }
                          }
                    }
          }

          if(response['status']=='Failed')
          {
              this.div=true;
              this.concernList=[];
              this.tmp_concern=this.concernList
          }
        console.log(this.concernList);
        console.log(this.tmp_concern);
  })

}
  else if(status==4) {
    this.status=status;
    this.tmp_concern=[];
    this.whPending=false;
    this.underActive=false;
    this.rejectActive=false;
    this.draftActive=false;
    this.concernActive=false;
    this.whVerified=false;
    this.fmVerified=false;
       this.waitActive=false;
       this.concernNumber=true;
    this.loader=true;
    this.concernStatuses.push(status)
    this.db.fetchData( {"currentPage": 1,"concernStatuses": this.concernStatuses,
    "pageSize": 500},'concern/list').subscribe((response)=>{

          console.log(response)
          this.loader=false;
          if(response['status']=='Success')
          { 
            
                    this.div=false;
                    this.concernList=response['data'];
                    this.tmp_concern=this.concernList
                    console.log(this.concernList);
                    console.log(this.tmp_concern);

                    for(let i=0;i<this.tmp_concern.length;i++) {

                          this.tmp_concern[i].totalQty=0;

                          this.tmp_concern[i].totalAmount=0;

                          if(this.tmp_concern[i].concernType==1){
                                for(let j=0;j<this.tmp_concern[i].productConcerns.length;j++){
                                  console.log(this.tmp_concern[i].productConcerns[j].netAmount, this.tmp_concern[i].productConcerns[j].qunatity);
                                  this.tmp_concern[i].totalQty= this.tmp_concern[i].totalQty+this.tmp_concern[i].productConcerns[j].qunatity;
                                  this.tmp_concern[i].totalAmount= this.tmp_concern[i].totalAmount+this.tmp_concern[i].productConcerns[j].netAmount;
                                }
                          }
                    }
          }

          if(response['status']=='Failed')
          {
              this.div=true;
              this.concernList=[];
              this.tmp_concern=this.concernList
          }
        console.log(this.concernList);
        console.log(this.tmp_concern);
  })

}
else if(status==5) {
  this.status=status;
  this.tmp_concern=[];
  this.whPending=false;
  this.rejectActive=false;
  this.waitActive=false;
  this.underActive=false;
  this.draftActive=false;
  this.concernNumber=false;
  this.concernActive=true;
  this.whVerified=false;
  this.fmVerified=false;
  this.loader=true;
 
  this.concernStatuses=[5,7,8,9]
  this.db.fetchData( {"currentPage": 1,"concernStatuses": this.concernStatuses,
  "pageSize": 500},'concern/list').subscribe((response)=>{

        console.log(response)
        this.loader=false;
        if(response['status']=='Success')
        { 
          
                  this.div=false;
                  this.concernList=response['data'];
                  this.tmp_concern=this.concernList
                  console.log(this.concernList);
                  console.log(this.tmp_concern);

                  for(let i=0;i<this.tmp_concern.length;i++) {

                        this.tmp_concern[i].totalQty=0;

                        this.tmp_concern[i].totalAmount=0;

                        if(this.tmp_concern[i].concernType==1){
                              for(let j=0;j<this.tmp_concern[i].productConcerns.length;j++){
                                console.log(this.tmp_concern[i].productConcerns[j].netAmount, this.tmp_concern[i].productConcerns[j].qunatity);
                                this.tmp_concern[i].totalQty= this.tmp_concern[i].totalQty+this.tmp_concern[i].productConcerns[j].qunatity;
                                this.tmp_concern[i].totalAmount= this.tmp_concern[i].totalAmount+this.tmp_concern[i].productConcerns[j].netAmount;
                              }
                        }
                  }
        }

        if(response['status']=='Failed')
        {
            this.div=true;
            this.concernList=[];
            this.tmp_concern=this.concernList
        }
      console.log(this.concernList);
      console.log(this.tmp_concern);
})

}
else if(status==6) {
  this.status=status;
  this.tmp_concern=[];
  this.whPending=false;
  this.whVerified=false;
  this.fmVerified=false;
  this.waitActive=false;
  this.underActive=false;
  this.draftActive=false;
  this.concernActive=false;
  this.concernNumber=false;
  this.rejectActive=true;

  this.loader=true;
  this.concernStatuses.push(status)
  this.db.fetchData( {"currentPage": 1,"concernStatuses": this.concernStatuses,
  "pageSize": 500},'concern/list').subscribe((response)=>{

        console.log(response)
        this.loader=false;
        if(response['status']=='Success')
        { 
          
                  this.div=false;
                  this.concernList=response['data'];
                  this.tmp_concern=this.concernList
                  console.log(this.concernList);
                  console.log(this.tmp_concern);

                  for(let i=0;i<this.tmp_concern.length;i++) {

                        this.tmp_concern[i].totalQty=0;

                        this.tmp_concern[i].totalAmount=0;

                        if(this.tmp_concern[i].concernType==1){
                              for(let j=0;j<this.tmp_concern[i].productConcerns.length;j++){
                                console.log(this.tmp_concern[i].productConcerns[j].netAmount, this.tmp_concern[i].productConcerns[j].qunatity);
                                this.tmp_concern[i].totalQty= this.tmp_concern[i].totalQty+this.tmp_concern[i].productConcerns[j].qunatity;
                                this.tmp_concern[i].totalAmount= this.tmp_concern[i].totalAmount+this.tmp_concern[i].productConcerns[j].netAmount;
                              }
                        }
                  }
        }

        if(response['status']=='Failed')
        {
            this.div=true;
            this.concernList=[];
            this.tmp_concern=this.concernList
        }
      console.log(this.concernList);
      console.log(this.tmp_concern);
})

}
else if(status==7)  {
  this.tmp_concern=[];
 
  this.whVerified=false;
  this.fmVerified=false;
  this.rejectActive=false;
  this.waitActive=false;
  this.draftActive=false;
  this.concernActive=false;
  this.concernNumber=false;
  this.underActive=false;
  this.whPending=true;
  this.loader=true;
  this.concernStatuses.push(status);
 
  this.db.fetchData( {"currentPage": 1,"concernStatuses": this.concernStatuses,
  "pageSize": 500},'concern/list').subscribe((response)=>{

        console.log(response)
        this.loader=false;
        if(response['status']=='Success')
        { 
          
                  this.div=false;
                  this.concernList=response['data'];
                  this.tmp_concern=this.concernList
                  console.log(this.concernList);
                  console.log(this.tmp_concern);

                  for(let i=0;i<this.tmp_concern.length;i++) {

                        this.tmp_concern[i].totalQty=0;

                        this.tmp_concern[i].totalAmount=0;

                        if(this.tmp_concern[i].concernType==1){
                              for(let j=0;j<this.tmp_concern[i].productConcerns.length;j++){
                                console.log(this.tmp_concern[i].productConcerns[j].netAmount, this.tmp_concern[i].productConcerns[j].qunatity);
                                this.tmp_concern[i].totalQty= this.tmp_concern[i].totalQty+this.tmp_concern[i].productConcerns[j].qunatity;
                                this.tmp_concern[i].totalAmount= this.tmp_concern[i].totalAmount+this.tmp_concern[i].productConcerns[j].netAmount;
                              }
                        }
                  }
        }

        if(response['status']=='Failed')
        {
            this.div=true;
            this.concernList=[];
            this.tmp_concern=this.concernList
        }
      console.log(this.concernList);
      console.log(this.tmp_concern);
})

}
else if(status==8)  {
  this.tmp_concern=[];
  this.whVerified=true;
  this.whPending=false;;
  this.fmVerified=false;
  this.rejectActive=false;
  this.waitActive=false;
  this.underActive=false;
  this.draftActive=false;
  this.concernActive=false;
  this.concernNumber=false;
  this.loader=true;
  this.concernStatuses.push(status);
 
  this.db.fetchData( {"currentPage": 1,"concernStatuses": this.concernStatuses,
  "pageSize": 500},'concern/list').subscribe((response)=>{

        console.log(response)
        this.loader=false;
        if(response['status']=='Success')
        { 
          
                  this.div=false;
                  this.concernList=response['data'];
                  this.tmp_concern=this.concernList
                  console.log(this.concernList);
                  console.log(this.tmp_concern);

                  for(let i=0;i<this.tmp_concern.length;i++) {

                        this.tmp_concern[i].totalQty=0;

                        this.tmp_concern[i].totalAmount=0;

                        if(this.tmp_concern[i].concernType==1){
                              for(let j=0;j<this.tmp_concern[i].productConcerns.length;j++){
                                console.log(this.tmp_concern[i].productConcerns[j].netAmount, this.tmp_concern[i].productConcerns[j].qunatity);
                                this.tmp_concern[i].totalQty= this.tmp_concern[i].totalQty+this.tmp_concern[i].productConcerns[j].qunatity;
                                this.tmp_concern[i].totalAmount= this.tmp_concern[i].totalAmount+this.tmp_concern[i].productConcerns[j].netAmount;
                              }
                        }
                  }
        }

        if(response['status']=='Failed')
        {
            this.div=true;
            this.concernList=[];
            this.tmp_concern=this.concernList
        }
      console.log(this.concernList);
      console.log(this.tmp_concern);
})

}
else if(status==9)  {
  this.tmp_concern=[];
  this.whVerified=false;
  this.fmVerified=true;
  this.rejectActive=false;
  this.waitActive=false;
  this.underActive=false;
  this.draftActive=false;
  this.concernActive=false;
  this.whPending=false;
  this.concernNumber=false;
  this.loader=true;
  this.concernStatuses.push(status);
 
  this.db.fetchData( {"currentPage": 1,"concernStatuses": this.concernStatuses,
  "pageSize": 500},'concern/list').subscribe((response)=>{

        console.log(response)
        this.loader=false;
        if(response['status']=='Success')
        { 
          
                  this.div=false;
                  this.concernList=response['data'];
                  this.tmp_concern=this.concernList
                  console.log(this.concernList);
                  console.log(this.tmp_concern);

                  for(let i=0;i<this.tmp_concern.length;i++) {

                        this.tmp_concern[i].totalQty=0;

                        this.tmp_concern[i].totalAmount=0;

                        if(this.tmp_concern[i].concernType==1){
                              for(let j=0;j<this.tmp_concern[i].productConcerns.length;j++){
                                console.log(this.tmp_concern[i].productConcerns[j].netAmount, this.tmp_concern[i].productConcerns[j].qunatity);
                                this.tmp_concern[i].totalQty= this.tmp_concern[i].totalQty+this.tmp_concern[i].productConcerns[j].qunatity;
                                this.tmp_concern[i].totalAmount= this.tmp_concern[i].totalAmount+this.tmp_concern[i].productConcerns[j].netAmount;
                              }
                        }
                  }
        }

        if(response['status']=='Failed')
        {
            this.div=true;
            this.concernList=[];
            this.tmp_concern=this.concernList
        }
      console.log(this.concernList);
      console.log(this.tmp_concern);
})

}
else if(status==20){
  this.tmp_concern=[];
  this.whVerified=false;
  this.fmVerified=false;
  this.rejectActive=false;
  this.waitActive=false;
  this.underActive=false;
  this.draftActive=false;
  this.concernActive=false;
  this.whPending=false;
  this.concernNumber=false;
  this.loader=true;
  this.concernStatuses=[5,6,7,8,9]
  this.db.fetchData( {"currentPage": 1,"concernStatuses": this.concernStatuses,
  "pageSize": 500},'concern/list').subscribe((response)=>{

        console.log(response)
        this.loader=false;
        if(response['status']=='Success')
        { 
          
                  this.div=false;
                  this.concernList=response['data'];
                  this.tmp_concern=this.concernList
                  console.log(this.concernList);
                  console.log(this.tmp_concern);

                  for(let i=0;i<this.tmp_concern.length;i++) {

                        this.tmp_concern[i].totalQty=0;

                        this.tmp_concern[i].totalAmount=0;

                        if(this.tmp_concern[i].concernType==1){
                              for(let j=0;j<this.tmp_concern[i].productConcerns.length;j++){
                                console.log(this.tmp_concern[i].productConcerns[j].netAmount, this.tmp_concern[i].productConcerns[j].qunatity);
                                this.tmp_concern[i].totalQty= this.tmp_concern[i].totalQty+this.tmp_concern[i].productConcerns[j].qunatity;
                                this.tmp_concern[i].totalAmount= this.tmp_concern[i].totalAmount+this.tmp_concern[i].productConcerns[j].netAmount;
                              }
                        }
                  }
        }

        if(response['status']=='Failed')
        {
            this.div=true;
            this.concernList=[];
            this.tmp_concern=this.concernList
        }
      console.log(this.concernList);
      console.log(this.tmp_concern);
})

}
  }
  
  delete_concern(id){
    console.log(id);
    this.msg="Concern"
    this.dialog.delete(this.msg).then((result) => {
      console.log(result);
      if(result)
      {
        this.db.fileData(id,'concern/delete/').subscribe((response)=>{
            console.log(response);
            this.message=response['message'];
            if(this.message="Concern removed successfully")
            {
              this.toast.openSucess('Concern removed successfully','');
            }
            else{
              this.toast.openError('Something Went Wrong Please Try Again!!','');
            }
            this.concern_list(1);
          });
      }
    });
  }
}
