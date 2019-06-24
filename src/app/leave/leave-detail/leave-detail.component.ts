import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConstantService } from 'src/app/constant.service';

@Component({
  selector: 'app-leave-detail',
  templateUrl: './leave-detail.component.html'
})
export class LeaveDetailComponent implements OnInit {

  constructor(public route:ActivatedRoute, public router:Router, public db:ConstantService) {
  }
  detailed_id:any;
form:any={};
  user:any={};
  userType:any;
  userId:any;
  userRole:any;
  username:any;
  mobile:any;
  loader:any=false;
  userRole_name;any;


  from:any={};
  ngOnInit() {
    this.getUserDetail();
    this.user = JSON.parse(localStorage.getItem('user')) || [];
    console.log(this.user);
    this.userType = this.user.data.userType;
    this.userId = this.user.data.userId;
    this.userRole=this.user.data.role;
    this.userRole_name=this.user.data.roleName;
    this.username= this.user.data.userName;
    console.log(this.userType ,"&" , this.userId, "&" ,this.username  );
     this.route.params.subscribe(params=>{
  console.log(params); 
  this.detailed_id=params;  
  console.log(this.detailed_id);
  this.getDetail();
    });
    }

// allList:any={};
//   getUserLeaves()
//   {
//     this.db.fetchData({},'getAllLeaves').subscribe((rep)=>{
//       console.log(rep);
//      this.allList=rep['data'];
//      console.log("=====================================list data===========");
//      console.log(this.allList);   
     
//      console.log("=====================================list data===========");
//     })
//   }

  allDetailedData:any={};
  getDetail()
  {
    console.log(this.detailed_id);
    // 'leaveApplicationId':this.detailed_id
    // this.db.fetchData({'leaveApplicationId':this.detailed_id},'getUserLeaves').subscribe(resp=>{
      this.loader=true
      this.db.fetchData({'leaveApplicationId':this.detailed_id.id,'approvalStatus':3},'getAllLeaves').subscribe(resp=>{
      console.log(resp);
      this.loader=false
      this.allDetailedData=resp['data'][0];
      console.log("detailed data");
      console.log(this.allDetailedData);
      console.log("detailed data");
    });
  }

  getUserDetail()
  {
    // 'userId': this.userId
    this.loader=true;
    console.log(this.userId);
    this.db.fetchData({},'detail/'+this.userId).subscribe(resp=>{
      console.log(resp);
      this.loader=false
      this.allDetailedData=resp['data'][0];
      console.log("detailed data");
      console.log(this.allDetailedData);
      console.log("detailed data");
    });
  }
// for update status functions 
  update_status(status,la_id)
  {
   
    console.log(status,la_id);
    if(status==1)
    {
      this.form.reason="";
    }
    this.loader=true
    this.db.fetchData({approvalStatus:status,'leaveApplicationId':la_id,reason:this.form.reason},'approveLeave').subscribe((rep)=>
    console.log(rep));
    this.loader=false
    this.router.navigate(['/leave-list']);
  }

  edit_detail(id)
  {
    // alert(id);
    this.loader=true
    this.db.fetchData({'leaveApplicationId':id},'getAllLeaves').subscribe(resp=>{
      console.log(resp);
      this.loader=false
      this.allDetailedData=resp['data'][0];
      console.log("detailed data");
      console.log(this.allDetailedData);
      this.router.navigate(['/add-leave']);
      console.log("detailed data");
    });

    // 
    // this.db.fetchData({'leaveApplicationId':id},'modifyLeaveApplication').subscribe((r)=>{
    //   console.log("this is leaveApplicationId");
    //   console.log(r);
    //   console.log("this is leaveApplicationId");
    // });
  }
}
