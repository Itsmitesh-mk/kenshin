import { Component, OnInit } from '@angular/core';
import { ConstantService } from '../constant.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(public service:ConstantService) {
    this.count_list();
   }

  ngOnInit() {
  }

  counterArray:any={}
  distributorCount:any=0
  leadCount:any=0
  count_list(){
console.log("service");

    this.service.fileData("","dashboard/count").subscribe( r =>{
      console.log(r);
      if(r['status']=='Success')
      {
        this.counterArray=r['data'];
        console.log(this.distributorCount);
        if(this.counterArray.networkCount.length!=0)
        {
          this.distributorCount=this.counterArray.networkCount[0].total
        }
        if(this.counterArray.leadCount.length!=0)
        {
          this.leadCount=this.counterArray.leadCount[0].statusCount;
        }
      
      }
    });
    
    // return this.counterArray;
  }
  
}
