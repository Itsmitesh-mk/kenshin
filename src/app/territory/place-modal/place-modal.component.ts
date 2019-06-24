import { Component, OnInit,Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Select2OptionData } from 'ng2-select2';
import { ConstantService } from '../../constant.service';
import { SnackBarOverview } from 'src/app/toast';

@Component({
  selector: 'app-place-modal',
  templateUrl: './place-modal.component.html'
})
export class PlaceModalComponent implements OnInit {

  public salesNetworkData: Array<Select2OptionData>;
  dropdownSettings:any = {};
  loader: boolean;

  data:any = {};

  constructor(public dialogRef: MatDialogRef<PlaceModalComponent>, @Inject(MAT_DIALOG_DATA) public popUpData:any, public db: ConstantService, public toast: SnackBarOverview,) { 

      console.log(popUpData);

      this.data = popUpData;

      this.data.segment = this.data.segments;

      if(this.data.salesUsers.length > 0) {

           this.data.roleSelected = this.data.salesUsers[0].role;
           this.getRoleWiseUserList(this.data.salesUsers[0].role, this.data.segments, 'onLoad');
           console.log(this.data.roleSelected);
      }
  }

  ngOnInit() {


    this.dropdownSettings = {
        singleSelection: false,
        idField: 'userId',
        textField: 'userName',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        allowSearchFilter: true,
        maxHeight: 197
    };

  }

  getSegmentChangeHandler() {

      console.log(this.data.segment);
      console.log(this.data.salesUsers);

      if (this.data.segment.length == 0) {

            this.data.roleSelected = '';
            this.salesNetworkData = [];
            this.data.salesUsers = [];
      }

      if (this.data.segment.length > 0 && this.data.roleSelected) {
            this.getRoleWiseUserList(this.data.roleSelected, this.data.segment, 'onForm');
      }
  }


  getRoleWiseUserList(userRoleId, segmentList, target) {

        // this.loader = true;

        console.log(segmentList);

        this.salesNetworkData = [];

        if(target == 'onForm') {

           this.data.salesUsers = [];
        }
        
        this.db.fetchData(
        {
            'userType': 2,
            'role': userRoleId,
            'segments': segmentList,
            'currentPage': 1,
            'pageSize': 200

        }, 'user/list').subscribe((response: any) => {

            console.log(response);
            // this.loader = false;

            if (response.data) {
                
                    const salesData = [];

                    for (let index = 0; index < response.data.length; index++) {

                        salesData.push({userId : response.data[index].userId, userName: response.data[index].userName + ' / ' + response.data[index].cityOffice, cityOffice: response.data[index].cityOffice});
                    }

                    this.salesNetworkData = salesData;
                    console.log(this.salesNetworkData);
            }

            console.log(this.salesNetworkData);
        });
  }


  updateTerritoryData() {

        console.log("submit");

        if (!this.data.segment || this.data.segment.length == 0) {
            return;
        }

        const userArr = [];

        console.log(this.data.salesUsers);

        if(this.data.salesUsers && this.data.salesUsers.length > 0) {

            for (let index = 0; index < this.data.salesUsers.length; index++) {
                userArr.push(this.data.salesUsers[index].userId);
            }
        }
        
        
        console.log(userArr);

        this.loader = true;

        let callApiObject = {'territoryID': this.data.territoryID, 'segments': this.data.segment, 'salesUsers': userArr};

        let callApiUrl = 'territory/update';

        console.log(callApiObject);
        console.log(callApiUrl);

        this.db.fetchData(callApiObject, callApiUrl)
        .subscribe((response: any) => {
              console.log(response);
              this.loader = false;
              this.dialogRef.close();
              this.toast.openSucess('Territory Updated Sucessfully!', '');
        });
  }



  closeModel() {

      this.dialogRef.close();
  }

}
