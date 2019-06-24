import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { CitiesModalComponent } from '../cities-modal/cities-modal.component';
import { ConstantService } from '../constant.service';
import { SnackBarOverview } from 'src/app/toast';
import { DialogComponent } from 'src/app/dialog';

@Component({
    selector: 'app-allowance',
    templateUrl: './allowance.component.html'
})

export class AllowanceComponent implements OnInit {

  loader:boolean;
  designationArr:any = [];

  constructor(public dialog: MatDialog, public db: ConstantService, public toast: SnackBarOverview, public confirm:DialogComponent) { }

  ngOnInit() {
    
    this.allowanceList();
  }

    openDialog(): void {

        const dialogRef = this.dialog.open(CitiesModalComponent, {
          width: '768px',
          data: {}
        });

    }


    allowanceList() {


      console.log(this.designationArr);

      this.loader = true;

      this.db.fetchData({} ,'allowance/list').subscribe((response) => {

            console.log(response);

            this.designationArr = response['data'];

            console.log(this.designationArr);

            this.loader = false;
            // this.toast.openSucess('Allowances Updated successfully','');
      });




    }

    saveAllowance() {

         console.log(this.designationArr);

         this.loader = true;

         const allowanceData = {};

         allowanceData['allowances'] = this.designationArr;

         this.db.fetchData(allowanceData ,'allowance/update').subscribe((response) => {
               console.log(response);

              this.loader = false;

              this.confirm.success();
         });
    }

}

