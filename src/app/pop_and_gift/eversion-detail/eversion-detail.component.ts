import { Component, OnInit } from '@angular/core';
import { ConstantService } from 'src/app/constant.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-eversion-detail',
  templateUrl: './eversion-detail.component.html',
  styleUrls: ['./eversion-detail.component.scss']
})
export class EversionDetailComponent implements OnInit {
  
  eVersionId:any;
  
  eVersionDetail:any={};
  constructor(public service:ConstantService,public route:ActivatedRoute) {
    
    this.route.params.subscribe( params => {
      console.log(params);
      this.eVersionId=params.id;
      // console.log(this.date ,"&" , this.expenseId);
      if(this.eVersionId)
      {
        this.getEversionDetail();
      }
    });
  }
  
  ngOnInit() {
  }
  
  url:any;
  requestfn:any;
  api:any;
  getEversionDetail()
  {
    console.log("hello");
    this.service.fetchData({id:this.eVersionId},"eversion/list").subscribe((result)=>{
      console.log(result);
      if(result['status']=='Success')
      {
        this.eVersionDetail=result['data'][0];
        this.url = this.service.dburl;
        this.requestfn = 'download/document/';
        this.api = this.url+this.requestfn;
      }
      
    })
  }
  
}
