import {Component, OnInit, Renderer2} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { sessionStorage }  from '../local-storage.service';
import { ConstantService } from '../constant.service';
import * as moment from 'moment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  
  user:any={}
userType:any;
userId:any;
userRole:any;
userName:any;
taskDate:any=moment().format('YYYY-MM-DD');
  constructor(private renderer: Renderer2,public router:Router,public ses: sessionStorage,public service:ConstantService) { 
    this.user = JSON.parse(localStorage.getItem('user')) || [];
    console.log(this.user);
    this.userType = this.user.data.userType;
    this.userId = this.user.data.userId;
    this.userRole=this.user.data.role;
    this.userName=this.user.data.userName;
    this.getTaskNotification();
    
  }
  
  ngOnInit() {
  }
  
  logout(): void {     
    this.ses.logoutSession();
    this.router.navigate(['']);
    
    
  }
  toggle = false;

  status1:boolean = false;
  toggleNav() {
    this.status1 = !this.status1;
    if(this.status1) {
      this.renderer.addClass(document.body, 'active');
    }
    else {
      this.renderer.removeClass(document.body, 'active');
    }
  }

  taskNotification:any=[];
  getTaskNotification()
  {
    var myDate= moment(this.taskDate, "YYYY-MM-DD").add(2, 'days');
    this.taskDate=moment(myDate["_d"]).format('YYYY-MM-DD');
    console.log(this.taskDate);
    // return this.endDate;
    console.log(this.taskDate);
    this.service.fetchData({deadline:this.taskDate},"mytask/list").subscribe((result)=>{
      console.log(result);
      if(result['status']=='Success')
      {
        this.taskNotification=result['data'];

      }
    })
  }

}
