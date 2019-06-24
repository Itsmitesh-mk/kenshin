import { Component, OnInit,Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material'
import { ConstantService } from '../../constant.service';
import { SnackBarOverview } from 'src/app/toast';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-update-network',
  templateUrl: './update-network.component.html',
  styleUrls: ['./update-network.component.scss']
})

export class UpdateNetworkComponent implements OnInit {
  message:any;
  loader:any;
  territoryId:any;
  contact_person:any={};
  tmp_list:any=[];
  networkUpdateActions:any=[];
  networkUserDetail:any;
  saleslist:any=[];
  dateArray:any={};

  constructor(public toast:SnackBarOverview,public router:Router,public dialogRef: MatDialogRef<UpdateNetworkComponent>,@Inject(MAT_DIALOG_DATA) public data:any,public db:ConstantService)
  {
        console.log(data);
        this.networkUserDetail=this.data;

        console.log(this.networkUserDetail);
        this.tmp_list=this.networkUserDetail.networkContacts;
        console.log(this.networkUserDetail)
        console.log(this.networkUserDetail.financialYear);
        console.log(this.networkUserDetail.targetLimit);
        console.log(this.networkUserDetail.networkId);
        this.dateArray={'dateOfBirth':moment(this.networkUserDetail.dateOfBirth).format('YYYY-MM-DD'),'dateOfMarriage':moment(this.networkUserDetail.dateOfMarriage).format('YYYY-MM-DD'),'dateOfCommencement':moment(this.networkUserDetail.dateOfCommencement).format('YYYY-MM-DD')};
        
        console.log(this.dateArray);
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



   addContactPerson()
  {
    if(!this.contact_person.mobile2){
      this.contact_person.mobile2='';
    }
    this.tmp_list.push(this.contact_person);
    this.contact_person={};
    console.log(this.tmp_list);
  }

  removeContact(index)
  {
     this.tmp_list.splice(index,1);
  }

  namecheck(event: any) 
  {
    const pattern = /[A-Z\+\a-z\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) 
    {event.preventDefault(); }
   }

update_data:any={};
  updateMobileEmail(){
    if(this.networkUserDetail.type=='email'){
      this.update_data.email=this.networkUserDetail.email;
      this.update_data.networkId=this.data.networkId;
      this.update_data.networkUpdateActions={'basicInfoModified':true};
      console.log(this.update_data);
    }
    else if(this.networkUserDetail.type=='networkCode'){
      this.update_data.networkCode=this.networkUserDetail.networkCode;
      this.update_data.networkId=this.data.networkId;
      this.update_data.networkUpdateActions={'basicInfoModified':true};
      console.log(this.update_data);
    }

    else if(this.networkUserDetail.type=='source'){
      this.update_data.source=this.networkUserDetail.source;
      this.update_data.networkId=this.data.networkId;
      this.update_data.networkUpdateActions={'basicInfoModified':true};
      console.log(this.update_data);
    }

    else if(this.networkUserDetail.type=='mobile'){
      this.update_data.mobile=this.networkUserDetail.mobile;
      this.update_data.networkId=this.data.networkId;
      this.update_data.networkUpdateActions={'basicInfoModified':true};
      console.log(this.update_data);
    }

    else if(this.networkUserDetail.type=='landline'){
      this.update_data.landline=this.networkUserDetail.landline;
      this.update_data.networkId=this.data.networkId;
      this.update_data.networkUpdateActions={'basicInfoModified':true};
      console.log(this.update_data);
    }

    else if(this.networkUserDetail.type=='gst'){
      this.update_data.gst=this.networkUserDetail.gst;
      this.update_data.networkId=this.data.networkId;
      this.update_data.networkUpdateActions={'basicInfoModified':true};
      console.log(this.update_data);
    }
    else if(this.networkUserDetail.type=='pan'){
      this.update_data.pan=this.networkUserDetail.pan;
      this.update_data.networkId=this.data.networkId;
      this.update_data.networkUpdateActions={'basicInfoModified':true};
      console.log(this.update_data);
    }
    else if(this.networkUserDetail.type=='bank'){
      this.update_data.bankName=this.networkUserDetail.bankName;
      this.update_data.accountNumber=this.networkUserDetail.accountNumber;
      this.update_data.ifscCode=this.networkUserDetail.ifscCode;
      this.update_data.networkId=this.data.networkId;
      this.update_data.networkUpdateActions={'basicInfoModified':true};
      console.log(this.update_data);
    }
    else if(this.networkUserDetail.type=='nameOfApplicant'){
      this.update_data.nameOfApplicant=this.networkUserDetail.nameOfApplicant;
      this.update_data.networkId=this.data.networkId;
      this.update_data.networkUpdateActions={'basicInfoModified':true};
      console.log(this.update_data);
    }
    else if(this.networkUserDetail.type=='dates'){

      
      this.update_data.dateOfBirth=moment(this.dateArray.dateOfBirth).format('YYYY-MM-DD') ;
      this.update_data.dateOfMarriage=moment(this.dateArray.dateOfMarriage).format('YYYY-MM-DD');
      this.update_data.dateOfCommencement=moment(this.dateArray.dateOfCommencement).format('YYYY-MM-DD');
      this.update_data.networkId=this.data.networkId;
      this.update_data.networkUpdateActions={'basicInfoModified':true};
      console.log(this.update_data);
    }
    else if(this.networkUserDetail.type=='contact'){
      this.update_data.networkContacts=this.tmp_list;
      this.update_data.networkId=this.data.networkId;
      this.update_data.networkUpdateActions={'contactsModified':true};
      console.log(this.update_data);
    }
    
      console.log(this.data.sales);

      this.loader = true;
      this.db.fetchData(this.update_data,'network/update').subscribe((response)=>{
        console.log(response);
        this.loader=false;
        this.message=response['message'];
        if(this.message=="Distributor Network Updated Successfully")
        {
          this.toast.openSucess('Updated successfully','');
          this.router.navigate(['/distribution-detail/'+this.data.networkId]) 
        }
        else
        {
          this.toast.openError('Something went wrong Please Try Again!!','');
        }
        this.dialogRef.close();
      });

    if(this.networkUserDetail.type=='addlimit'){
        this.update_data.targetLimit=this.networkUserDetail.targetLimit;
        this.update_data.financialYear=this.networkUserDetail.financialYear;
        this.update_data.networkId=this.data.networkId;
        this.update_data.networkUpdateActions={'contactsModified':true};
        console.log(this.update_data);
        console.log(this.data.sales);
        this.db.fetchData(this.update_data,'network/limit/add').subscribe((response)=>{
          console.log(response);
          this.loader=false;
          this.message=response['message'];
          if(this.message=="Network limit added successfully")
          {
            this.toast.openSucess('Updated successfully','');
            this.router.navigate(['/distribution-detail/'+this.data.networkId]) 
          }
          else
          {
            this.toast.openError('Something went wrong Please Try Again!!','');
          }
          this.dialogRef.close();
        });
      }

      if(this.networkUserDetail.type=='editlimit'){
        console.log(this.networkUserDetail.type);
        console.log(this.networkUserDetail.limitIndex);
        console.log("data recieved at update limit");
        this.update_data.targetLimit=this.networkUserDetail.targetLimit;
        this.update_data.financialYear=this.networkUserDetail.financialYear;
        this.update_data.networkId=this.data.networkId;
        this.update_data.networkUpdateActions={'contactsModified':true};
        console.log(this.update_data);
        console.log(this.data.sales);
        this.db.fetchData(this.update_data,'network/limit/update').subscribe((response)=>{
          console.log(response);
          this.loader=false;
          this.message=response['message'];
          if(this.message=="Network limit added successfully")
          {
            this.toast.openSucess('Updated successfully','');
            this.router.navigate(['/distribution-detail/'+this.data.networkId]) 
          }
          else
          {
            this.toast.openError('Something went wrong Please Try Again!!','');
          }
          this.dialogRef.close();
        });
      }


      if(this.networkUserDetail.type=='taskremarks'){
        console.log(this.networkUserDetail.type);
        console.log(this.networkUserDetail.remarks);
       
        this.update_data.remarks=this.networkUserDetail.remarks;
        this.update_data.taskId=this.networkUserDetail.taskId;
        this.update_data.taskDetailId=this.networkUserDetail.taskDetailId;;
        console.log(this.update_data);
        this.db.fetchData(this.update_data,'taskdetail/update').subscribe((response)=>{
          console.log(response);
          this.loader=false;
          if(response['status']=="Success")
          {
            this.toast.openSucess('Updated successfully','');
          }
          else
          {
            this.toast.openError('Something went wrong Please Try Again!!','');
          }
          this.dialogRef.close();
        });
      }



















  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}
