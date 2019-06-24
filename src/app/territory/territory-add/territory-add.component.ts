import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { ConstantService } from '../../constant.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SnackBarOverview } from 'src/app/toast';
import { DialogComponent } from 'src/app/dialog';
import * as $ from 'jquery';
import { Select2OptionData } from 'ng2-select2';

import {MatDialog, MatDialogRef} from '@angular/material';
import { PlaceModalComponent } from '../place-modal/place-modal.component';

@Component({
  selector: 'app-territory-add',
  templateUrl: './territory-add.component.html',
  animations: [slideToTop()],
})

export class TerritoryAddComponent implements OnInit {
    public salesNetworkData: Array<Select2OptionData>;
    public userRolesArr: Array<Select2OptionData>;
    public options: Select2Options;
    public value: string[];
    public current: string;
    rolesDropdownSettings:any = {};
    dropdownSettings:any = {};
    segmentDropdownSettings:any = {};

    salesData = [];


    isDetailPincodeBtnClicked:any = false;

  drop_me: any = '-1';
  territory_form: any = {};

  masterArr: any = [];

  data: any = {};
  showSelectAll:any = false;

  finalPincodesArr: any = [];
  finalPincodesDetailArr: any = [];

  distinctSelectedState:any = [];

  territoryId: any = '';
  existingTerritoryArr: any = [];
  loader: boolean;

  tmpTerr:any=[];
  formSubmit:any = false;

  segmentlist:any=[];
  isCityClicked:any = false;
  clickedCityDetail:any = {};

  isAnyStateSelected:any = false;
  isAnyDistrictSelected:any = false;

  constructor(public db: ConstantService,
              public router: Router,
              public route:ActivatedRoute,
              public toast: SnackBarOverview,
              public dialog:DialogComponent,
              public matDialog: MatDialog) {

      this.data = {};
      this.data.segment = [];
      this.data.salesUsers = [];
      this.existingTerritoryArr = [];

      this.salesNetworkData = [];
      this.data.salesUsers = [];

      this.data.pincodeEmpty = false;
      this.data.userEmpty = false;
  }


  openDialog(popupType): void {

        this.existingTerritoryArr.popupType = popupType;

        this.existingTerritoryArr.allSegmentList = this.segmentlist;

        this.existingTerritoryArr.userRolesArr = this.userRolesArr;

        const dialogRef = this.matDialog.open(PlaceModalComponent, { width: '768px',  data: this.existingTerritoryArr});
        dialogRef.afterClosed().subscribe(result => {
            this.onExistingTerritoryHandler();
            console.log(result);
        });
  }


  onItemSelect(item: any) {

      console.log(item);
      this.getRoleWiseUserList(item.roleId);
  }

  onItemDeselect(item: any) {

      console.log(item);

      this.salesData =  this.salesData.filter(row => row.roleId != item.roleId);
      this.salesNetworkData = JSON.parse(JSON.stringify(this.salesData));

  }

  onSelectAll(items: any) {
       console.log(items);

       for (let index = 0; index < items.length; index++) {
             this.getRoleWiseUserList(items[index].roleId);
       }
  }

  onItemDeselectAll(items:any) {

      console.log(items);

      this.salesData =  [];
      this.salesNetworkData = JSON.parse(JSON.stringify(this.salesData));
  }


  ngOnInit() {
  
     this.route.params.subscribe(params=>{

            console.log(params);
            this.formSubmit = false;
            this.data = {};
            this.territoryId = params.id;
            console.log(this.territoryId);

            this.onStateListHandler();

            if (this.territoryId != '0') {
                this.onExistingTerritoryHandler();
            } else {

                this.masterArr = [];
                this.finalPincodesArr = [];
                this.finalPincodesDetailArr = [];

                this.isDetailPincodeBtnClicked = false;

                console.log(this.masterArr);
                console.log(this.finalPincodesArr);
                console.log(this.finalPincodesDetailArr);
                this.getUserTypeRoles();
            }

            this.segment_list();
      });

      this.options = {
        multiple: true
      }

      this.options = {
          multiple: true
      }

      this.dropdownSettings = {
            singleSelection: false,
            idField: 'userId',
            textField: 'userName',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            allowSearchFilter: true,
            maxHeight: 197
      };

      this.rolesDropdownSettings = {
            singleSelection: false,
            idField: 'roleId',
            textField: 'roleName',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            allowSearchFilter: true,
            maxHeight: 197
      };

      this.segmentDropdownSettings = {
            closeDropDownOnSelection:true,
            singleSelection: false,
            idField: 'text',
            textField: 'text',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            allowSearchFilter: true,
            maxHeight: 197
      };

  }


  territoryStateDelete(stateName) {

     this.loader = true;

     this.db.fetchData({

        'territoryId': this.territoryId,
        'state': stateName

      }, 'territory/pincode/delete')

     .subscribe((response: any) => {
           console.log(response);
           this.loader = false;
           this.toast.openSucess('Deleted Sucessfully!', '');

           this.clickedCityDetail.pincodeArr = [];
           this.isCityClicked = false;
           this.onExistingTerritoryHandler();
     });

  }


  segment_list() {
   
        this.db.fileData('','segment/list/').subscribe((response)=>{
            console.log(response);
            this.segmentlist=response['data'];
        });
  }


  getSegmentChangeHandler(event) {

      console.log(this.data.segment);
      console.log(this.data.salesUsers);

      if (this.data.segment.length == 0) {

           this.data.roleSelected = '';
           this.salesNetworkData = [];
           this.data.salesUsers = [];
      }


      console.log(this.data.roleSelected);


      if(this.data.segment.length > 0 && this.data.roleSelected) {

            for (let index = 0; index < this.data.roleSelected.length; index++) {
                 this.getRoleWiseUserList(this.data.roleSelected[index].roleId);
            }
      }
  }


  onStateListHandler() {

        this.loader = true;

        this.db.fileData('', 'state/list/').subscribe((response) => {
            this.masterArr = [];
            console.log(response);
            if (response['data']) {

                for (let index = 0; index < response['data'].length; index++) {
                    this.masterArr.push({stateName: response['data'][index], districtData: []});
                }

                this.loader = false;
            }

            this.stateCheckedHandler();
            this.districtCheckedHandler();

            console.log(this.masterArr);
        });
  }


  /*  Territory Edit Set Function Start */
  onExistingTerritoryHandler() {

        this.tmpTerr.push(this.territoryId);
        console.log(this.tmpTerr);
        
        this.loader = true;
        this.db.fileData('' , 'territory/detail/' + this.territoryId).subscribe((response:any)=>{
             console.log(response);
             this.existingTerritoryArr = response.data;

             console.log(this.existingTerritoryArr);
            //  this.data.territory = this.existingTerritoryArr.territoryName;
             this.loader = false;
            
             this.onSetCityPincodeHandler();
             this.getUserTypeRoles();

        });
  }


  detailCityClickHandler(stateMasterId) {

         this.isCityClicked = true;
      
         for (let index = 0; index < this.existingTerritoryArr.states.length; index++) {
               
               for (let index1 = 0; index1 < this.existingTerritoryArr.states[index].distrcits.length; index1++) {

                       for (let index2 = 0; index2 < this.existingTerritoryArr.states[index].distrcits[index1].cities.length; index2++) {

                              if(this.existingTerritoryArr.states[index].distrcits[index1].cities[index2].stateMasterId == stateMasterId) {

                                console.log(this.existingTerritoryArr.states[index].distrcits[index1].cities[index2]);

                                  this.existingTerritoryArr.states[index].distrcits[index1].cities[index2].checked = true;

                                  this.clickedCityDetail.stateName = this.existingTerritoryArr.states[index].stateName;

                                  this.clickedCityDetail.districtName = this.existingTerritoryArr.states[index].distrcits[index1].districtName;

                                  this.clickedCityDetail.cityName = this.existingTerritoryArr.states[index].distrcits[index1].cities[index2].cityName;


                                    this.loader = true;
                                    this.db.fetchData({'stateMasterIds': [stateMasterId]}, 'city/pincodes').subscribe((response: any) => {
                            
                                            console.log(response);
                                            setTimeout(() => {
                                                this.loader = false;
                                            }, 1000);

                                            const pincodeArr = [];

                                            if(response.data[0]) {

                                                for (let cityPincodeIndex = 0; cityPincodeIndex < response.data[0]['pinCodes'].length; cityPincodeIndex++) {

                                                    pincodeArr.push(response.data[0]['pinCodes'][cityPincodeIndex]);
                                                }
                                            }

                                            this.clickedCityDetail.pincodeArr = pincodeArr;

                                            console.log(pincodeArr);
                                    });

                                 

                                  console.log(this.clickedCityDetail);

                              } else {

                                  this.existingTerritoryArr.states[index].distrcits[index1].cities[index2].checked = false;
                              }
                       }     
                   
               }
        
         }
        
  }


  onSetCityPincodeHandler() {

        const territoryStates = this.existingTerritoryArr['states'];

        console.log(territoryStates);

        for (let index = 0; index < territoryStates.length; index++) {

                for (let index1 = 0; index1 < territoryStates[index]['distrcits'].length; index1++) {

                        for (let index2 = 0; index2 < territoryStates[index]['distrcits'][index1]['cities'].length; index2++) {

                                for (let index3 = 0; index3 < territoryStates[index]['distrcits'][index1]['cities'][index2]['pinCodes'].length; index3++) {

                                    this.finalPincodesArr.push({stateMasterId: territoryStates[index]['distrcits'][index1]['cities'][index2].stateMasterId, pincode: territoryStates[index]['distrcits'][index1]['cities'][index2]['pinCodes'][index3]});

                                    this.finalPincodesDetailArr.push({stateMasterId: territoryStates[index]['distrcits'][index1]['cities'][index2].stateMasterId, stateName: territoryStates[index].stateName, districtName: territoryStates[index]['distrcits'][index1]['districtName'], cityName: territoryStates[index]['distrcits'][index1]['cities'][index2].cityName, pincode: territoryStates[index]['distrcits'][index1]['cities'][index2]['pinCodes'][index3]});

                                }
                        }
                }
        }

        console.log(this.finalPincodesArr);
        console.log(this.finalPincodesDetailArr);
    }


    onSetTerritoryInchargeHandler() {

        // for (let index = 0; index < this.salesNetworkData.length; index++) {

        //     if(this.salesNetworkData[index].roleId == 10) {

        //         for (let index1 = 0; index1 < this.salesNetworkData[index].roleDataArr.length; index1++) {

        //                 const isIndexExist = this.existingTerritoryArr.salesUsers.findIndex(row => row.userId == this.salesNetworkData[index].roleDataArr[index1].userId);

        //                 if (isIndexExist !== -1) {
        //                     this.salesNetworkData[index].roleDataArr[index1].checked = true;
        //                 }
        //         }
        //     }
        // }
    }

    /*  Territory Edit Set Function ENd */


  getUserTypeRoles() {

      this.loader = true;

      this.userRolesArr = [];
      this.db.fileData( '' , 'usertype/list').subscribe((response:any)=>{
          console.log(response);
          this.loader = false;

          for (let index = 0; index < response.data.length; index++) {

               if (response.data[index].userTypeId === 2) {

                  const userRoleData = [];

                  for (let index1 = 0; index1 < response.data[index].roles.length; index1++) {

                      const typeRoles = response.data[index].roles[index1];
                      userRoleData.push({userTypeId: response.data[index].userTypeId,
                                              roleId: typeRoles.roleId,
                                              roleName: typeRoles.roleName });
                  }

                  this.userRolesArr = userRoleData;
               }
          }

          console.log(this.userRolesArr);
      });
  }

  getRoleWiseUserList(userRoleId) {

            this.loader = true;
            
            this.db.fetchData(
            {
                'userType': 2,
                'role': userRoleId,
                'segments': this.data.segment,
                'currentPage': 1,
                'pageSize': 50

            }, 'user/list').subscribe((response: any) => {

                console.log(response);
                this.loader = false;

                if (response.data) {
                
                    for (let index = 0; index < response.data.length; index++) {

                        const salesIndex = this.salesData.findIndex(row=> row.userId == response.data[index].userId);

                        if(salesIndex == -1) {
                             
                            this.salesData.push({roleId: response.data[index].role, userId : response.data[index].userId, userName: response.data[index].userName + ' / ' + response.data[index].cityOffice, cityOffice: response.data[index].cityOffice});

                        }
                    }

                    this.salesNetworkData = JSON.parse(JSON.stringify(this.salesData));

                    console.log(this.salesNetworkData);

                    if (this.territoryId != '0') {
                        this.onSetTerritoryInchargeHandler();
                    }

                }

                console.log(this.salesNetworkData);
            });
  }


  getDistrictList(stateName, isChecked, onPageLoad) {

      const stateIndex = this.masterArr.findIndex(row => row.stateName == stateName);


      if (isChecked) {

            this.loader = true;
            
            this.db.fetchData([stateName] , 'district/list').subscribe((response: any) => {
                console.log(response);

                this.loader = false;

                 if (response.data && response.data[0]) {

                      this.masterArr[stateIndex].districtData = response.data[0]['distrcits'];
                 }

                 console.log(this.masterArr);
            });

      } else {
            this.masterArr[stateIndex].districtData = [];
            this.data.pincodeSelectAll = false;
            // this.onFinalPinCodesHandler();
      }

      this.stateCheckedHandler();

  }



  stateCheckedHandler() {

        let isChecked = false;

        for (let index = 0; index < this.masterArr.length; index++) {
             
              if(this.masterArr[index].checked) {
                   isChecked = true;
              }
        }

        this.isAnyStateSelected = isChecked;
  }


  getCityList(stateName, districtName, isChecked, onPageLoad, districtType) {

    console.log(stateName, districtName, isChecked);

    const stateIndex = this.masterArr.findIndex(row => row.stateName == stateName);

    let districtIndex = 0;
    if (districtType == 'single') {
        districtIndex = this.masterArr[stateIndex]['districtData'].findIndex(row => row.districtName == districtName);
    }

    if (isChecked) {

        setTimeout(() => {

            let districtDBArray = [];

            if (districtType == 'single') {
                districtDBArray = [{ 'districtName': districtName }];
            }

            if (districtType == 'all') {

                for (let index = 0; index < this.masterArr[stateIndex]['districtData'].length; index++){ 
                    districtDBArray.push({'districtName' : this.masterArr[stateIndex]['districtData'][index]['districtName']});

                }
            }

            console.log(districtDBArray);

            this.loader = true;
            this.db.fetchData([
                {
                  'stateName': stateName,
                  'distrcits': districtDBArray,
                  'unusedPin': false

                }], 'city/list').subscribe((response: any) => {
    
                console.log(response);
                setTimeout(() => {
                  this.loader = false;
                }, 1000);

                this.showSelectAll = true;
    
                if (response.data && response.data[0]) {
                    
                    for (let districtTempIndex = 0; districtTempIndex < response.data[0]['distrcits'].length; districtTempIndex++) {

                            const cityArr = [];

                            for (let index = 0; index < response.data[0]['distrcits'][districtTempIndex]['cities'].length; index++) {

                                    const pincodeArr = [];

                                    cityArr.push({cityName: response.data[0]['distrcits'][districtTempIndex]['cities'][index]['cityName'], pincodeArr: pincodeArr, stateMasterId: response.data[0]['distrcits'][districtTempIndex]['cities'][index]['stateMasterId']});
                            }

                            console.log(cityArr);

                            if (districtType == 'single') {
                                this.masterArr[stateIndex].districtData[districtIndex]['cities'] = cityArr;
                            }
        
                            if (districtType == 'all') {
                                this.masterArr[stateIndex].districtData[districtTempIndex]['cities'] = cityArr;
                            }
                    }

                    console.log(this.masterArr[stateIndex].districtData);
                }

            });

        }, 500);

        console.log(this.masterArr[stateIndex]['districtData']);

    } else {
      
        this.masterArr[stateIndex].districtData[districtIndex]['cities'] = [];
        this.data.pincodeSelectAll = false;
        // this.onFinalPinCodesHandler();
    }

    this.districtCheckedHandler();

  }


  districtCheckedHandler() {

        let isChecked = false;

        for (let index = 0; index < this.masterArr.length; index++) {
            
            if(this.masterArr[index].checked) {


                for (let index1 = 0; index1 < this.masterArr[index].districtData.length; index1++) {
                        
                        if (this.masterArr[index].districtData[index1].checked) {
                            isChecked = true;
                        }
                }
                
            }
        }

        this.isAnyDistrictSelected = isChecked;

        console.log(this.isAnyDistrictSelected);
  }


  masterActionHandler(target, stateName, districtName, cityName, pincode, isChecked, stateMasterId) {

       const stateIndex = this.masterArr.findIndex(row => row.stateName == stateName );

       console.log(target, stateIndex, stateName, districtName, cityName, pincode, isChecked);

       let districtIndex = '';
       let cityIndex = '';
       let pincodeIndex = '';

       if(districtName && districtName != null) {

            districtIndex = this.masterArr[stateIndex]['districtData'].findIndex(row => row.districtName == districtName );
       }
      
       if (cityName && cityName != null) {

            cityIndex = this.masterArr[stateIndex]['districtData'][districtIndex]['cities'].findIndex(row => row.stateMasterId == stateMasterId );

            console.log(cityIndex);
       }

        if (pincode && pincode != null) {

             pincodeIndex = this.masterArr[stateIndex]['districtData'][districtIndex]['cities'][cityIndex]['pincodeArr'].findIndex(row => row.pincode == pincode );
        }


        if (target === 'state') {

            this.loader = true;

            setTimeout(() => {

                const stateDistrictArr = this.masterArr[stateIndex].districtData;

                for (let index = 0; index < stateDistrictArr.length; index++) {
                    
                    stateDistrictArr[index].checked = isChecked;

                    if (isChecked == false) {
                        stateDistrictArr[index].cities = [];
                    }

                    if(isChecked == false && index == stateDistrictArr.length-1) {
                        // this.onFinalPinCodesHandler();
                    }

                    if (isChecked  === true && index == stateDistrictArr.length-1) {
                        this.getCityList(stateName, true, true, false, 'all');
                    }
                }

                if(isChecked == false) {
                    this.data.pincodeSelectAll = false;
                }

                this.loader = false;

            }, 1000);

        }

        if (target === 'city') {

               if(isChecked) {

                    console.log(stateMasterId);

                    this.loader = true;
                    this.db.fetchData({'stateMasterIds': [stateMasterId]}, 'city/pincodes').subscribe((response: any) => {
            
                            console.log(response);
                            setTimeout(() => {
                                this.loader = false;
                            }, 1000);

                            const pincodeArr = [];

                            if(response.data[0]) {

                                for (let index = 0; index < response.data[0]['pinCodes'].length; index++) {

                                     pincodeArr.push({pincode: response.data[0]['pinCodes'][index], stateMasterId: this.masterArr[stateIndex].districtData[districtIndex]['cities'][cityIndex]['stateMasterId'], checked : true});
                                }
                            }

                            this.masterArr[stateIndex].districtData[districtIndex]['cities'][cityIndex].pincodeArr = pincodeArr;

                            console.log(pincodeArr);
                    });

               } else {


                    for (let index = 0; index < this.masterArr[stateIndex].districtData[districtIndex]['cities'][cityIndex].pincodeArr.length; index++) {

                        this.masterArr[stateIndex].districtData[districtIndex]['cities'][cityIndex].pincodeArr[index].checked = false;
                    }
               }
        }


        if (target === 'pincode') {

            const pincodeArr = this.masterArr[stateIndex].districtData[districtIndex]['cities'][cityIndex]['pincodeArr'][pincodeIndex];

            pincodeArr.checked = isChecked;

            // this.onFinalPinCodesHandler();
        }

        console.log(this.masterArr);
  }


  onFinalPinCodesHandler() {

        let isAnyPincodeSelected = false;
        this.loader = true;

        setTimeout(() => {

            for (let index = 0; index < this.masterArr.length; index++) {

                if (this.masterArr[index].checked) {

                    for (let index2 = 0; index2 < this.masterArr[index]['districtData'].length; index2++) {

                        if (this.masterArr[index]['districtData'][index2].checked) {

                            for (let index3 = 0; index3 < this.masterArr[index]['districtData'][index2]['cities'].length; index3++) {

                                if (this.masterArr[index]['districtData'][index2]['cities'][index3]) {

                                    for (let index4 = 0; index4 < this.masterArr[index]['districtData'][index2]['cities'][index3]['pincodeArr'].length; index4++) {

                                        if (this.masterArr[index]['districtData'][index2]['cities'][index3]['pincodeArr'][index4].checked) {

                                            const isPincodeExist = this.finalPincodesArr.findIndex(pincode => pincode == this.masterArr[index]['districtData'][index2]['cities'][index3]['pincodeArr'][index4].pincode);

                                            isAnyPincodeSelected = true;

                                            if(isPincodeExist === -1) {

                                                   console.log(this.masterArr[index]['districtData'][index2]['cities'][index3]['pincodeArr']);

                                                    this.finalPincodesArr.push({stateMasterId :this.masterArr[index]['districtData'][index2]['cities'][index3]['pincodeArr'][index4].stateMasterId,  pincode: this.masterArr[index]['districtData'][index2]['cities'][index3]['pincodeArr'][index4].pincode});

                                                    this.finalPincodesDetailArr.push({stateMasterId :this.masterArr[index]['districtData'][index2]['cities'][index3]['pincodeArr'][index4].stateMasterId, stateName: this.masterArr[index].stateName, districtName: this.masterArr[index]['districtData'][index2]['districtName'], cityName: this.masterArr[index]['districtData'][index2]['cities'][index3].cityName, pincode: this.masterArr[index]['districtData'][index2]['cities'][index3]['pincodeArr'][index4].pincode});
                                            }
                    
                                        }
                                    }
                                }
                            }

                        }
                    }

                }


                if(index == this.masterArr.length - 1) {

                    setTimeout(() => {

                        this.loader = false;

                        if(isAnyPincodeSelected) {

                            this.onStateListHandler();
                            this.showSelectAll = false;
                            this.data.pincodeSelectAll = false;

                            this.distinctSelectedState = [];
                            for (let finalIndex = 0; finalIndex < this.finalPincodesDetailArr.length; finalIndex++) {

                                const existIndex = this.distinctSelectedState.findIndex(stateName => stateName == this.finalPincodesDetailArr[finalIndex].stateName);

                                if(existIndex == -1) {
                                    this.distinctSelectedState.push(this.finalPincodesDetailArr[finalIndex].stateName);
                                }
                                
                            }

                            this.toast.openSucess('PincodeList Updated!', '');


                        } else {
                            this.toast.openSucess('No Pincode Selected!', '');
                        }

                    }, 500);
                }
            }

        }, 1000);


        console.log(this.finalPincodesDetailArr);
  }


  save_territory() {

       console.log("submit");


       if(!this.isDetailPincodeBtnClicked && !this.data.territory) {

        console.log('hello');
           $('#territoryName').focus();
           return;
       }


       if (!this.isDetailPincodeBtnClicked && (!this.data.segment || this.data.segment.length == 0)) {

            if(!this.data.segment || this.data.segment.length == 0) {
                $('#segmentName').focus();
            }

            return;
       }

        console.log(this.finalPincodesArr);

        const userArr = [];

        console.log(this.data.salesUsers);

        if(!this.isDetailPincodeBtnClicked && this.data.salesUsers && this.data.salesUsers.length > 0) {

            for (let index = 0; index < this.data.salesUsers.length; index++) {
                userArr.push(this.data.salesUsers[index].userId);
            }
        }
        
        
        console.log(userArr);

        if (this.finalPincodesArr.length === 0) {
          this.data.pincodeEmpty = true;
        } else {
          this.data.pincodeEmpty = false;
        }

        // if (userArr.length === 0) {
        //    this.data.userEmpty = true;
        // } else {
        //    this.data.userEmpty = false;
        // }

        if (this.data.pincodeEmpty) {
            return;
        }

        this.loader = true;

        let callApiObject = {};
        let callApiUrl = '';

        if(this.territoryId != '0') {

            callApiObject = {'territoryID': this.territoryId, 'territoryPinCodes': this.finalPincodesArr};
            callApiUrl = 'territory/pincode/add';

        } else {

            callApiObject = {'territoryName': this.data.territory, 'segments': this.data.segment, 'territoryPinCodes': this.finalPincodesArr, 'salesUsers': userArr};
            callApiUrl = 'territory/add';
        }

        console.log(callApiObject);
        console.log(callApiUrl);

        this.db.fetchData(callApiObject, callApiUrl)
        .subscribe((response: any) => {
              console.log(response);
              this.loader = false;

              if(response.status == 'Success') {

                    this.toast.openSucess('Territory Saved Sucessfully!', '');

                    if(this.isDetailPincodeBtnClicked) {
                        
                    this.isDetailPincodeBtnClicked = false;
                    this.onExistingTerritoryHandler();
    
                    } else {
    
                    this.router.navigate(['/territory-list'])
                    }
              } else {
                   this.dialog.alertWarning(response.message);
              }
              
        });
  }



   getAllPincodeHandler(isChecked) {

        if(isChecked) {

            const stateMasterIdArr = [];

            for (let index = 0; index < this.masterArr.length; index++) {
    
                if (this.masterArr[index].checked) {
    
                    for (let index2 = 0; index2 < this.masterArr[index]['districtData'].length; index2++) {
    
                        if (this.masterArr[index]['districtData'][index2].checked) {
    
                            for (let index3 = 0; index3 < this.masterArr[index]['districtData'][index2]['cities'].length; index3++) {
    
                                if (this.masterArr[index]['districtData'][index2]['cities'][index3]['pincodeArr'].length === 0) {

                                    stateMasterIdArr.push(this.masterArr[index]['districtData'][index2]['cities'][index3].stateMasterId);
                                }
                            }
                        }
                    }
    
                }
            }

            console.log(stateMasterIdArr);


            if(stateMasterIdArr.length > 0) {

                this.loader = true;
                this.db.fetchData({'stateMasterIds': stateMasterIdArr}, 'city/pincodes').subscribe((response: any) => {
    
                        console.log(response);
                        setTimeout(() => {
                            this.loader = false;
                        }, 1000);
    
                      
    
                        for (let index = 0; index < response.data.length; index++) {

                                const pincodeArr = [];

                                for (let index1 = 0; index1 < response.data[index]['pinCodes'].length; index1++) {
    
                                    pincodeArr.push({pincode: response.data[index]['pinCodes'][index1], stateMasterId: response.data[index].stateMasterId, checked : true});
                                }
    
    
                                for (let masterIndex = 0; masterIndex < this.masterArr.length; masterIndex++) {
    
                                    if (this.masterArr[masterIndex].checked) {
                        
                                        for (let masterindex2 = 0; masterindex2 < this.masterArr[masterIndex]['districtData'].length; masterindex2++) {
                        
                                            if (this.masterArr[masterIndex]['districtData'][masterindex2].checked) {
                        
                                                for (let masterindex3 = 0; masterindex3 < this.masterArr[masterIndex]['districtData'][masterindex2]['cities'].length; masterindex3++) {
                        
                                                    if (this.masterArr[masterIndex]['districtData'][masterindex2]['cities'][masterindex3].stateMasterId == response.data[index].stateMasterId) {
    
                                                         this.masterArr[masterIndex]['districtData'][masterindex2]['cities'][masterindex3].checked = true;
                        
                                                         this.masterArr[masterIndex]['districtData'][masterindex2]['cities'][masterindex3].pincodeArr = pincodeArr;
    
                                                    }
                                                }
                                            }
                                        }
                        
                                    }
                                }
                        }
                });

            } else {

                this.pincodeSelectAllHandler(isChecked);
            }

        } else {

            this.pincodeSelectAllHandler(isChecked);
        }

   }


   pincodeSelectAllHandler(isChecked) {

        this.loader= true;

        setTimeout(() => {

            for (let index = 0; index < this.masterArr.length; index++) {

                if (this.masterArr[index].checked) {
    
                    for (let index2 = 0; index2 < this.masterArr[index]['districtData'].length; index2++) {
    
                        if (this.masterArr[index]['districtData'][index2].checked) {
    
                            for (let index3 = 0; index3 < this.masterArr[index]['districtData'][index2]['cities'].length; index3++) {
    
                                if (this.masterArr[index]['districtData'][index2]['cities'][index3]) {
    
                                    this.masterArr[index]['districtData'][index2]['cities'][index3].checked = isChecked;
    
                                    for (let index4 = 0; index4 < this.masterArr[index]['districtData'][index2]['cities'][index3]['pincodeArr'].length; index4++) {
                                        
                                        this.masterArr[index]['districtData'][index2]['cities'][index3]['pincodeArr'][index4].checked = isChecked;
    
                                    }
                                }
                            }
                        }
                    }
    
                }

                if(index == this.masterArr.length -1) {
                    this.loader= false;
                }
            }
            
        }, 1000);
  }


  emptyFinalPincodeArr() {

      this.isDetailPincodeBtnClicked=true;

      this.finalPincodesDetailArr = [];
      this.finalPincodesArr = [];

  }


  deleteSelectedPincode(pincodeType, pincodeRowSelected) {

        console.log(pincodeType);

        this.dialog.delete(pincodeType).then((result) => {

            console.log(result);

            if(result) {

                if(pincodeType == 'Pincode') {

                    console.log(pincodeRowSelected);

                    this.finalPincodesArr = this.finalPincodesArr.filter(pincodeRow => pincodeRow.stateMasterId != pincodeRowSelected.stateMasterId && pincodeRow.pincode != pincodeRowSelected.pincode);

                    this.finalPincodesDetailArr = this.finalPincodesDetailArr.filter(pincodeRow =>  pincodeRow.stateMasterId != pincodeRowSelected.stateMasterId && pincodeRow.pincode != pincodeRowSelected.pincode);

                    console.log(this.finalPincodesArr);
                    console.log(this.finalPincodesDetailArr);

                } else if(pincodeType == 'all') {

                    this.finalPincodesArr = [];
                    this.finalPincodesDetailArr = [];

                } else {

                    const statePincodeArr = this.finalPincodesDetailArr.filter(pincodeRow =>  pincodeRow.stateName ==  pincodeType);

                    for (let index = 0; index < statePincodeArr.length; index++) {
                        
                        this.finalPincodesArr = this.finalPincodesArr.filter(pincodeRow => pincodeRow.pincode != statePincodeArr[index].pincode);
                    }

                    this.finalPincodesDetailArr = this.finalPincodesDetailArr.filter(pincodeRow =>  pincodeRow.stateName !=  pincodeType);

                    console.log(this.finalPincodesArr);
                }

                this.data.deleteAllSelected = '';

                this.distinctSelectedState = [];
                for (let finalIndex = 0; finalIndex < this.finalPincodesDetailArr.length; finalIndex++){

                    const existIndex = this.distinctSelectedState.findIndex(stateName => stateName == this.finalPincodesDetailArr[finalIndex].stateName);

                    if(existIndex == -1 && this.finalPincodesDetailArr[finalIndex].stateName) {
                        this.distinctSelectedState.push(this.finalPincodesDetailArr[finalIndex].stateName);
                    }
                }

                this.toast.openSucess('Pincode Deleted!', '');

            } else {
                this.data.deleteAllSelected = '';
            }
            
        })
  }

  active: any = {};
  toggleterritory(key, action)
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