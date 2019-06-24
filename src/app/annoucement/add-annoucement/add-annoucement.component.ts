import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { ConstantService } from '../../constant.service';
import { SnackBarOverview } from 'src/app/toast';
import { Router, ActivatedRoute } from '@angular/router';
import * as $ from 'jquery';

@Component({
  selector: 'app-add-annoucement',
  templateUrl: './add-annoucement.component.html',
  animations: [slideToTop()]
})

export class AddAnnoucementComponent implements OnInit {
    
  button:any=false;
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
  isSegmentRequired:any = false;

  data:any = {};

  showDistributorList:any = false;
  showRetailerList:any = false;
  showSalesList:any = false;

  salesNetworkData:any = [];

  salesNetworkSelectedData:any = [];

  userRolesArr:any = [];

  loader: boolean;

  selectedFile:any=[];
  documentData:any={};

  segmentlist:any=[];

  constructor(public db: ConstantService,
              public toast: SnackBarOverview,
              public router: Router) {

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

     this.getUserTypeRoles();
     this.segment_list();
  }

  segment_list() {
   
        this.db.fileData('','segment/list/').subscribe((response)=>{
            console.log(response);
            this.segmentlist=response['data'];
        });
  }


  getSegmentChangeHandler() {

        console.log(this.data.segment);

        if (this.data.segment.length == 0) {


            for (let index = 0; index < this.userRolesArr.length; index++) {
                 this.userRolesArr[index].checked = false;
            }

            this.salesNetworkData = [];
            this.salesNetworkSelectedData = [];

        } else {

              this.segmentBasedNetworkData();
        }
  }

  segmentBasedNetworkData() {

       this.salesNetworkData = [];
       for (let index = 0; index < this.userRolesArr.length; index++) {

                if(this.userRolesArr[index].checked) {

                        this.loader = true;

                        let apiUrl = '';
                        let apiObject = {};
                        if (this.userRolesArr[index].userTypeId == '3' && this.userRolesArr[index].roleId == '12') {
                            apiUrl = 'network/list';
                            apiObject = {role: this.userRolesArr[index].roleId};
                        } else {
            
                            apiUrl = 'user/list';
                            apiObject = {
                                'userType': this.userRolesArr[index].userTypeId,
                                'role': this.userRolesArr[index].roleId,
                                'segments': this.data.segment,
                                'currentPage': 1,
                                'pageSize': 200,
                                'totalRecords': 200
                            };
                        }
            
                        console.log(apiUrl);
                        console.log(apiObject);
            
                        this.loader = true;
                        this.db.fetchData(apiObject, apiUrl).subscribe((response:any) => {
            
                            console.log(response);

                            setTimeout(() => {
                                this.loader = false;
                            }, 2000);
                            
                            if(response.data && response.data.length > 0) {

                                  let lastIndex = null;

                                  const isRoleExist = this.salesNetworkData.findIndex(row => row.roleId == response.data[0].role);

                                  if (isRoleExist == -1) {

                                      const userRoleData = this.userRolesArr.filter(row => row.roleId == response.data[0].role);

                                      this.salesNetworkData.push({roleId: this.userRolesArr[index].roleId, roleName: userRoleData[0]['roleName'], roleDataArr: []});

                                      lastIndex = this.salesNetworkData.length - 1;

                                  } else {
                                      lastIndex = isRoleExist;
                                  }


                                  for (let index1 = 0; index1 < response.data.length; index1++) {
            
                                      this.salesNetworkData[lastIndex].roleDataArr.push({userId: response.data[index1].userId, userName: response.data[index1].userName, city:response.data[index1].city});
                                  }
                            }
                            console.log(this.salesNetworkData);
                        });
                }
       }

       console.log(this.salesNetworkData);
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

  getDistrictList(state,stateval) {
    this.loader=true;
      this.st =Array(state);
      console.log(stateval);
      if(stateval === true) {

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


    roleSelectedChange(roleSelected) {

          console.log(roleSelected);

          if (roleSelected.checked === true) {

                let apiUrl = '';
                let apiObject = {};
                if (roleSelected.userTypeId == '3' && roleSelected.roleId == '12') {

                    apiUrl = 'network/list';
                    apiObject = {role: roleSelected.roleId};
                    
                } else {

                    apiUrl = 'user/list';


                    if(roleSelected.userTypeId == '1') {

                        apiObject = {
                            'userType': roleSelected.userTypeId,
                            'role': roleSelected.roleId,
                            'currentPage': 1,
                            'pageSize': 200,
                            'totalRecords': 200
                        };
                    } 


                    if(roleSelected.userTypeId == '2') {

                        apiObject = {
                            'userType': roleSelected.userTypeId,
                            'role': roleSelected.roleId,
                            'segments': this.data.segment,
                            'currentPage': 1,
                            'pageSize': 200,
                            'totalRecords': 200
                        };
                    }
                   
                }

                console.log(apiUrl);
                console.log(apiObject);

                this.loader = true;


                setTimeout(() => {

                    this.db.fetchData(apiObject, apiUrl).subscribe((response:any) => {

                        console.log(response);
                        this.loader = false;
    
                        this.salesNetworkData.push({roleId: roleSelected.roleId, roleName: roleSelected.roleName, roleDataArr: []});
    
                        const lastIndex = this.salesNetworkData.length - 1;
    
                        console.log(this.salesNetworkData);
    
                        if (response.data) {
    
                            for (let index = 0; index < response.data.length; index++) {
    
                                this.salesNetworkData[lastIndex].roleDataArr.push({userId: response.data[index].userId, userName: response.data[index].userName,city:response.data[index].cityOffice});
                            }
                        }
    
                        console.log(this.userRolesArr);
                    });
                    
                }, 1000);
  
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

             for (let index = 0; index < this.salesNetworkData.length; index++) {

                  if(this.salesNetworkData[index].roleId == roleId) {
                       if(!isChecked) {
                           this.salesNetworkData[index].selectAll = false;
                       }
                  }
                 
             }
        }

        if (isChecked === true) {
            this.salesNetworkSelectedData.push({roleId: roleId, userId: userId, userName: userName, isRead: false, readOn: '2019-02-16T09:57:00.905Z'});
        }

        console.log(this.salesNetworkSelectedData);
    }


    urls:any=[];
    insertDocument(data)
    {

           this.urls = [];
           this.selectedFile = [];

          let files = data.target.files;
          if (files) {
            for (let file of files) {
              let reader = new FileReader();
              reader.onload = (e: any) => {
                this.urls.push(e.target.result);
              }
              reader.readAsDataURL(file);
            }
          }
          console.log(this.urls);
          console.log(data.target.files.length);
          for(var i=0; i<data.target.files.length; i++)
          {
              this.selectedFile.push(data.target.files[i]);
          }
 
          console.log(this.selectedFile);
 
         //  setTimeout(() => {
         //    this.Insert_Image();
         //  }, 500);
    }
 
 
    deleteDocument(index)
    {
        this.urls.splice(index, 1);
        this.selectedFile.splice(index, 1);
    }


    onSelectAllHandler(roleId, isChecked) {


          console.log(this.salesNetworkData);

           console.log(roleId, isChecked);
           for (let index = 0; index < this.salesNetworkData.length; index++) {

               if (this.salesNetworkData[index].roleId == roleId) {

                    for (let userIndex = 0; userIndex < this.salesNetworkData[index].roleDataArr.length; userIndex++) {

                         this.salesNetworkData[index].roleDataArr[userIndex].checked = isChecked;

                         this.saveNetworkData(this.salesNetworkData[index].roleDataArr[userIndex].userId, roleId, this.salesNetworkData[index].roleDataArr[userIndex].userName, isChecked);
                
                    }
                      
               }
           }
    }


    saveAnnouncementDetail() {


             let segmentRequired = false;

             for (let index = 0; index < this.userRolesArr.length; index++) {

                  if(this.userRolesArr[index].userTypeId == 2) {
                       segmentRequired = true;
                  }
             }

             console.log(segmentRequired, this.data.segment);

             if (segmentRequired && this.data.segment && this.data.segment.length == 0) {
                  this.isSegmentRequired = true;
                  $('#segment').focus();
                  return;
             }
         
            const annoucmentDocumentData = [];
        
            for(var i=0; i<this.selectedFile.length; i++)
            {
                this.documentData=new FormData;
                this.documentData.action=1;
                this.documentData.binaryData=this.urls[i];
                this.documentData.documentType=1;
                this.documentData.documentName=this.data.subject;
                this.documentData.referenceId=0;
                this.documentData.fileName="Document"+i+".pdf",this.selectedFile[i];
                this.documentData.iconName = "DocumentIcon"+i+".pdf",this.selectedFile[i];

                console.log(this.documentData);

                annoucmentDocumentData[i] = JSON.parse(JSON.stringify(this.documentData));
            }

            console.log(annoucmentDocumentData);

            this.loader = true;
            this.button=true;

            console.log(this.salesNetworkSelectedData);

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
                'documents': annoucmentDocumentData,
                'isActive': true,

            }, 'announcement/add').subscribe((response: any) => {

                console.log(response);
                this.loader=false;
                this.toast.openSucess('Announcement Saved Sucessfully!', '');
                this.router.navigate(['/annoucement-list'])
            });
    }


    active: any = {};
    toggleSearch(key, action)
    {
        console.log(action);
        console.log(key);
        if (action === 'open')
        {
           this.active[key] = true;
  
           $('#'+key).focus();
        }
  
        if (action === 'close')
        {
           this.active[key] = false;
        }
  
        console.log(this.active);
    }


}
