import { Component, OnInit, Renderer2 } from '@angular/core';
import { ConstantService } from '../constant.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
})
export class NavigationComponent implements OnInit {
  
  user:any={}
  userType:any;
  userId:any;
  userRole:any;
  userName:any;
  networkId:any;
  data:any={};
  userNetworkId:any;
  counterArray:any={}
  
  accessModuleData:any = [];
  moduleActiveData:any = '';
  
  constructor(private renderer: Renderer2,public service:ConstantService) {
    
    this.user = JSON.parse(localStorage.getItem('user')) || [];
    console.log(this.user);
    this.userType = this.user.data.userType;
    this.userId = this.user.data.userId;
    
    if(this.user.data.distributerNetwork && this.user.data.distributerNetwork['networkId']) {
      
      this.userNetworkId = this.user.data.distributerNetwork['networkId'];
      
    }
    
    this.userRole = this.user.data.role;
    this.userName = this.user.data.userName;
    
    if(this.userType == 3)
    {
      this.networkId=this.user.data.distributerNetwork.networkId;
    }
    
    if(localStorage.getItem('accessModuleData')) {
      this.accessModuleData = JSON.parse(localStorage.getItem('accessModuleData')) || [];    
    } else {
      this.accessModuleData = [];
    }
    
    console.log(this.accessModuleData);
  }
  
  
  ngOnInit() {
    this.counterArray=this.service.counterArray;
    console.log(this.counterArray);
  }
  
  
  toggleHeader() {
    this.renderer.removeClass(document.body, 'nav-active');
  }
  
  status:boolean = false;
  toggleDropdown() {
    
    const activeClass = $(event.target).hasClass('active');
    const activeId = $(event.target).attr('id');
    
    console.log(activeClass);
    console.log(activeId);
    
    $('a.active').removeClass('active');
    
    if(!activeClass) {
      
      console.log(event.target);
      
      this.renderer.addClass(event.target, 'active');
      this.renderer.removeClass(document.body, 'active');
      
      if(activeId == 'distributionNetwork') {
        $('.menu').scrollTop(0);
      }
      
      if(activeId == 'masters') {
        $('.menu').scrollTop(9999);
      }
      
      
    } else {
      console.log(event.target);
      this.renderer.removeClass(event.target, 'active');
    }
    
  }
  
  
  navBarModuleHandler() {
    $('a.active').removeClass('active');
    this.renderer.addClass(event.target, 'active');
  }
  
  
  status1:boolean = false;
  toggleNav() {
    
    console.log('helloooo');
    this.status1 = !this.status1;
    if(this.status1) {
      this.renderer.addClass(document.body, 'active');
    }
    else {
      this.renderer.removeClass(document.body, 'active');
    }
  }


}
