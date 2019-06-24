import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { ConstantService } from '../../constant.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SnackBarOverview } from 'src/app/toast';
import { DialogComponent } from 'src/app/dialog';

@Component({
  selector: 'app-add-leave-rules',
  templateUrl: './add-leave-rules.component.html',
  animations: [slideToTop()]
})

export class AddLeaveRulesComponent implements OnInit {
leave_form:any={};
message:any;
loader:boolean;

designationData:any = [];
daysInvalid:any = true;
ruleId:any = '';

  constructor(public db:ConstantService,public router:Router, public route:ActivatedRoute,public toast:SnackBarOverview, public msg:DialogComponent) {

     this.designationData = [

        { ruleId: 0, designationName: 'Vice President', designation: 1, noOfLeaves: 0},
        { ruleId: 0, designationName: 'Deputy General Manager', designation: 2, noOfLeaves: 0},
        { ruleId: 0, designationName: 'General Manager', designation: 3, noOfLeaves: 0},
        { ruleId: 0, designationName: 'Assistant General Manager', designation: 4, noOfLeaves: 0},
        { ruleId: 0, designationName: 'Sr Manager', designation: 5, noOfLeaves: 0},
        { ruleId: 0, designationName: 'Manager', designation: 6, noOfLeaves: 0},
        { ruleId: 0, designationName: 'Deputy Manager', designation: 7, noOfLeaves: 0},
        { ruleId: 0, designationName: 'Sr Executive', designation: 8, noOfLeaves: 0},
        { ruleId: 0, designationName: 'Executive', designation: 9, noOfLeaves: 0},
        { ruleId: 0, designationName: 'Assistant Manager', designation: 10, noOfLeaves: 0},
        { ruleId: 0, designationName: 'Assistant', designation: 11, noOfLeaves: 0},
        { ruleId: 0, designationName: 'Trainee', designation: 12, noOfLeaves: 0},
        { ruleId: 0, designationName: 'Others', designation: 13, noOfLeaves: 0}
    ];

  }

  ngOnInit() {

      console.log(this.leave_form);
      this.route.params.subscribe(params => {

            console.log(params);

            if(params.id && params.id!= '0') {
              this.ruleId = params.id;
              console.log(this.ruleId);
              this.leaveRulesData();
            } else {
              this.ruleId = 0;
            }


      });
  }

  ruleData:any = [];
  leaveRulesData() {

        console.log("Function call");

        this.loader = true;
        console.log(this.ruleId);
        this.db.fetchData({'ruleId':this.ruleId},'leave/list').subscribe((response)=>
        {
              console.log(response);
              this.loader = false;

              this.ruleData = response['data'][0];

              this.leave_form.subject = this.ruleData.subject;
              this.leave_form.description = this.ruleData.description;

              for (let index = 0; index < this.ruleData.designationsWiseLeaves.length; index++) {
                   
                  const indexExist = this.designationData.findIndex(row => row.designation == this.ruleData.designationsWiseLeaves[index].designation);

                  this.designationData[indexExist].noOfLeaves = this.ruleData.designationsWiseLeaves[index].noOfLeaves;
              }
            
        });
    }


  onDayChangeHandler(designation) {

       const designationIndex = this.designationData.findIndex(row => row.designation == designation);

       if(this.designationData[designationIndex].noOfLeaves < 0) {
           this.designationData[designationIndex].noOfLeaves = 0;
       }
  }

  submit(f) {

    this.leave_form.designationLeaves = this.designationData;

    this.daysInvalid = true;
    for (let index = 0; index < this.leave_form.designationLeaves.length; index++) {
        
         if(this.leave_form.designationLeaves[index].noOfLeaves != 0) {
            this.daysInvalid = false;
         }
    }

    if (this.daysInvalid) {
        return;
    }

    console.log(this.leave_form);

    this.loader = true;

    let apiURL = '';

    if(this.ruleId && this.ruleId != '0') {

        this.leave_form.ruleId = this.ruleId;
        apiURL = 'leave/update';
    } else {
      apiURL = 'leave/add';
    }


    this.db.fetchData(this.leave_form, apiURL).subscribe((response:any)=>{

          console.log(response);
          this.loader=false;
          this.message=response['message'];

          if(response.status == 'Failed') {
               this.msg.error(this.message);
          } else {
             this.router.navigate(['/leave-rule-list']);
          }

    });

  }

}
