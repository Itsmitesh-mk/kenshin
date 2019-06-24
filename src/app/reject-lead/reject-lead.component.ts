import { Component, OnInit } from '@angular/core';
import { ConstantService } from '../constant.service';

@Component({
  selector: 'app-reject-lead',
  templateUrl: './reject-lead.component.html',
  styleUrls: ['./reject-lead.component.scss']
})
export class RejectLeadComponent implements OnInit {

  rejectedList:any=[];
  loader:any=false;
  div:any=false;
  constructor(public service:ConstantService) {

    this.rejectLeadList();
   }

  ngOnInit() {
  }

  rejectLeadList()
  {
    this.div=false;
    this.loader=true
    this.service.fetchData({"leadConverted": false,"taskStatus": 2,"taskType": 1},"task/list").subscribe((result)=>{
      console.log(result);
      this.loader=false;
      if(result['status']=='Success')
      {
        this.rejectedList=result['data'];
      }
      if(result['status']=='Failed')
      {
        this.div=true;
      }
    })
  }

}
