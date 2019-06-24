import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-master-tab-list',
  templateUrl: './master-tab-list.component.html',
})
export class MasterTabListComponent implements OnInit {

  user:any={}
userType:any;
userId:any;
userRole:any;
  constructor() { 
    this.user = JSON.parse(localStorage.getItem('user')) || [];
    console.log(this.user);
    this.userType = this.user.data.userType;
    this.userId = this.user.data.userId;
    this.userRole=this.user.data.role;
    console.log(this.userType ,"&" , this.userId, "&" ,this.userRole);
  }

  ngOnInit() {
  }

}
