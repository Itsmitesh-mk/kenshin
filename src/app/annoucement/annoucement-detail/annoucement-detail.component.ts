import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { ConstantService } from '../../constant.service';
import { SnackBarOverview } from 'src/app/toast';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogComponent } from 'src/app/dialog';
import {MatDialog } from '@angular/material';

 
@Component({
  selector: 'app-annoucement-detail',
  templateUrl: './annoucement-detail.component.html',
 
})
export class AnnoucementDetailComponent implements OnInit {
  territory_form:any={};
  statelist:any=[];
  states:any=[];
  st:any;
  districts:any=[];
  cities:any=[];
  city:any=[];
  stateval:any=[];
  districtval:any=[];
  checkState:any;
  checkDistrict:any;
  annoucementDetails:any=[];
  data:any = {};

  showDistributorList:any = false;
  showRetailerList:any = false;
  showSalesList:any = false;

  salesNetworkData:any = [];

  salesNetworkSelectedData:any = [];

  userRolesArr:any = [];

  loader: boolean;
   id:any;
  constructor(public db: ConstantService,
    public router:Router,public toast:SnackBarOverview, public route:ActivatedRoute, public dialog: MatDialog,public msg:DialogComponent) {
        this.getUserTypeRoles();
        this.route.params.subscribe(params=>{
                    console.log(params);
                    this.id = params.id;
                    console.log(this.id);
                    if(this.id){
                      this.annoucementdetail();
                    }else{
                    }
                  });
        this.data.isSMSChecked = false;
        this.data.isEmailChecked = false;
        this.db.fileData('', 'state/list/').subscribe((response)=>{
            console.log(response);
            this.statelist = response;
            this.states = this.statelist.data;
            console.log(this.states);
        });
        
  }

  ngOnInit() {

  

  }

 
  getUserTypeRoles() {

        this.loader = true;
        this.db.fileData( '' , 'usertype/list').subscribe((response:any)=>{
            console.log(response);
             this.loader = false;

             console.log(response.length);

             for (let index = 0; index < response.data.length; index++) {

                 console.log('hello');

                  for (let index1 = 0; index1 < response.data[index].roles.length; index1++) {

                      const typeRoles = response.data[index].roles[index1];
                      this.userRolesArr.push({userTypeId: response.data[index].userTypeId,
                                              roleId: typeRoles.roleId,
                                              roleName: typeRoles.roleName });
                  }
             }

             console.log(this.userRolesArr);
        });
  }
  annoucementdetail(){
      this.loader=true;
    this.db.fetchData({
      "announcementId": this.id},'announcement/list').subscribe((response)=>{
        console.log(response);
        this.loader=false;
        this.annoucementDetails=response['data'][0];
        console.log(this.annoucementDetails);
        this.data.subject=this.annoucementDetails.subject;
        this.data.isSMSChecked = this.annoucementDetails.sendSMS;
        this.data.isEmailChecked = this.annoucementDetails.sendEmail;
        for(let i=0;i<this.annoucementDetails.announcementToRoles.length;i++){
           this.annoucementDetails.announcementToRoles[i].checked=true;
           this.roleSelectedChange(this.annoucementDetails.announcementToRoles[i]);
           console.log( this.annoucementDetails.announcementToRoles[i]);
           
               let userRoleIndex=this.userRolesArr.findIndex(x=>x.roleId==this.annoucementDetails.announcementToRoles[i].roleId);
               console.log(userRoleIndex);
               this.userRolesArr[userRoleIndex].checked=true;
          
         
        }
    });
}
  getDistrictList(state,stateval) {

    
      this.st =Array(state);
      console.log(stateval);
      if(stateval === true) {
        this.loader=true;

            this.db.fetchData(this.st,'district/list').subscribe((response:any)=>{

                console.log(response);
                this.loader=false;
                this.districts.push(response.data[0]);
                console.log(this.districts);     
            });

      } else {

          const x = this.districts.findIndex(items => items.stateName === state);
          this.districts.splice(x, 1);
      }

  }


  getAreaList(stateName,districtName,districtval)
  {
        console.log(districtval);
      
        console.log(stateName); 
        console.log(districtName);    
        if(districtval==true) {
            this.loader=true;
            this.db.fetchData(Array({"stateName":stateName,"distrcits":Array({"districtName":districtName})}),'city/list').subscribe((response:any)=>{

                console.log(response);
                this.loader=false;
                this.cities.push({ "stateName":stateName,"distrcits":districtName,"citiesnpins":response.data[0].distrcits[0].cities});
                console.log(this.cities);
                this.city=this.cities[0]
                console.log(this.city);      
            });

      } else {
          var x = this.cities.findIndex(items => items.distrcits === districtName);
          this.cities.splice(x, 1);
      }
  }


    active:any = {};
    toggleterritory(key,action)
    {
            console.log(action);
            console.log(key);
            
            if(action == 'open')
            { this.active[key] = true; }
            if(action == 'close')
            { this.active[key] = false;}

            console.log(this.active);
    }


    roleSelectedChange(roleSelected) {

          console.log(roleSelected);

          if (roleSelected.checked === true) {

                this.loader = true;
                this.db.fetchData(
                {
                    'userType': roleSelected.userTypeId,
                    'role': roleSelected.roleId,
                    'currentPage': 1,
                    'pageSize': 50,
                    'totalRecords': 50

                }, 'user/list').subscribe((response:any) => {

                    console.log(response);
                    this.loader = false;

                    this.salesNetworkData.push({roleId: roleSelected.roleId, roleName: roleSelected.roleName, roleDataArr: []});

                    const lastIndex = this.salesNetworkData.length - 1;

                    console.log(this.salesNetworkData);

                    if (response.data) {

                        for (let index = 0; index < response.data.length; index++) {

                            this.salesNetworkData[lastIndex].roleDataArr.push({userId: response.data[index].userId, userName: response.data[index].userName});
                        }
                    }
                });
          }

          if (roleSelected.checked === false) {

               const itemIndex = this.salesNetworkData.findIndex(salesRow => salesRow.roleId === roleSelected.roleId);

               this.salesNetworkData.splice(itemIndex, 1);

               this.salesNetworkSelectedData = this.salesNetworkSelectedData.filter(selectedRow=> selectedRow.roleId !== roleSelected.roleId);

               console.log(this.salesNetworkSelectedData);
          }

          console.log(this.salesNetworkData);
    }

    saveNetworkData(userId, roleId, userName, isChecked) {

        console.log(isChecked);

        if (isChecked === false) {

             const rowIndex = this.salesNetworkSelectedData.findIndex(userRow => userRow.id === userId);
             this.salesNetworkSelectedData.splice(rowIndex, 1);
        }

        if (isChecked === true) {
            this.salesNetworkSelectedData.push({roleId: roleId, userId: userId, userName: userName, isRead: true, readOn: '2019-02-16T09:57:00.905Z'});
        }

        console.log(this.salesNetworkSelectedData);
    }


    saveAnnouncementDetail() {

            this.loader = true;

            this.db.fetchData(
            {
                'announcementId': 0,
                'message': this.data.message,
                'subject': this.data.subject,
                'sendSMS': this.data.isSMSChecked,
                'sendEmail': this.data.isEmailChecked,
                'readBy': 0,
                'readPending': 0,
                'sentTo': 0,
                'announcementToRoles': this.salesNetworkSelectedData,
                'isActive': true,

            }, 'announcement/add').subscribe((response: any) => {

                console.log(response);
                this.loader=false;
                this.toast.openSucess('Announcement Saved Sucessfully!', '');
                this.router.navigate(['/annoucement-list'])
            });
    }

}
