import { Component, OnInit } from '@angular/core';
import { ConstantService } from '../../constant.service';
import { SnackBarOverview } from 'src/app/toast';
import { DialogComponent } from 'src/app/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { sessionStorage }  from '../../local-storage.service';

@Component({
  selector: 'app-leave-rule-detail',
  templateUrl: './leave-rule-detail.component.html'
})
export class LeaveRuleDetailComponent implements OnInit {

  loader:boolean;
  ruleId:any;
  ruleData:any = {};
  userdata:any=[];

  constructor(public db:ConstantService,public toast:SnackBarOverview,public dialog:DialogComponent, public route:ActivatedRoute, public user:sessionStorage) { 

      this.userdata=this.user['user']['data'];
  }

  ngOnInit() {

        this.route.params.subscribe(params=>{
          
            console.log(params);
            this.ruleId = params.id;
            console.log(this.ruleId);
            this.leaveRulesData();

        });
  }


  leaveRulesData() {

        console.log("Function call");

        this.loader = true;
                console.log(this.ruleId);
        this.db.fetchData({'ruleId':this.ruleId},'leave/list').subscribe((response)=>
        {
              console.log(response);
              this.loader = false;
            if(response['status']=='Success')
            {
              this.ruleData = response['data'][0];
            }
      
        });
  }

}
