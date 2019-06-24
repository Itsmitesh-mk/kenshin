import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { ConstantService } from '../../constant.service';
import { DialogComponent } from 'src/app/dialog';
import { MatDialog } from '@angular/material';
import { ReadMassageComponent } from '../read-massage/read-massage.component';
import { ReadPopupComponent } from '../read-popup/read-popup.component';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-annoucement-list',
  templateUrl: './annoucement-list.component.html',
  animations: [slideToTop()]

})
export class AnnoucementListComponent implements OnInit {
userlist:any=[];
loader:boolean;
rolelists:any=[];
removesubject:boolean=false;
removemessage:boolean=false;
rolelistsystem1:any=[];
rolelistsales1:any=[];
subjectlist:any=[];
rolelistclient1:any=[];
messagelist
div:any=false;
filter:any={};
user:any={}
userType:any;
userId:any;
userRole:any;
announcementlist:any=[];
totalSMSCount:any;

  dburl:any = '';
  
  constructor(public db:ConstantService,public dialog:DialogComponent,public popupDialog: MatDialog) { 
    this.user = JSON.parse(localStorage.getItem('user')) || [];
    console.log(this.user);
    this.userType = this.user.data.userType;
    this.userId = this.user.data.userId;
    this.userRole=this.user.data.role;
    if(this.userRole==1)
    {
      this.announcement({"currentPage":1,"pageSize":50});
    }
    else{
      if(this.userId)
      {
        this.announcement({"currentPage":1,"pageSize":50,"userId":this.userId});
      }
    }
    console.log(this.userType ,"&" , this.userId, "&" ,this.userRole);
    this.db.fileData('','usertype/list').subscribe((response)=>{
      console.log(response);
      this.userlist=response['data'];
    });
  }

  ngOnInit() {

       this.dburl = this.db.dburl;
       this.getSMSCount();
  }


  getSMSCount() {

     
      this.db.fileData('', 'getsmscount').subscribe((response)=>{

           console.log(response);

           if(response && response['data']) {
              this.totalSMSCount = response['data'];
           } else {
               this.totalSMSCount = 0;
           }
      });
       
  }

  downloadFile()
  {
      console.log("function");
      this.db.excelFileData({},'pwnload').subscribe(result=> {  saveAs(result, 'YourFileName.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
  
      });
  }


  distinctArray:any=[]
  rolelist(){
    this.loader=true;
    this.db.fileData('','usertype/list').subscribe((response)=>{
      console.log(response);
      this.loader=false
      this.rolelists=response['data'];
      let filterrolesales= this.rolelists.filter(x => x.userTypeId==2);
      this.rolelistsales1=filterrolesales[0].roles;
      let filterrolesystem= this.rolelists.filter(x => x.userTypeId==1);
      this.rolelistsystem1=filterrolesystem[0].roles;
      let filterroleclient= this.rolelists.filter(x => x.userTypeId==3);
      this.rolelistclient1=filterroleclient[0].roles;
      for(let i=0;i<this.rolelistsales1.length;i++){
        this.rolelistsystem1.push(this.rolelistsales1[i]);
      }
      for(let i=0;i<this.rolelistclient1.length;i++){
        this.rolelistsystem1.push(this.rolelistclient1[i]);
      }
      console.log(this.rolelistsales1);
      console.log(this.rolelistsystem1);
      for(let i=0;i<this.announcementlist.length;i++){
       for(let j=0;j<this.announcementlist[i].announcementToRoles.length;j++){
         let annoucementrole=this.rolelistsystem1.filter(x=>x.roleId==this.announcementlist[i].announcementToRoles[j].roleId)
         console.log(annoucementrole);
         this.announcementlist[i].announcementToRoles[j].rolename=annoucementrole[0].roleName;
        
       }
      }
    });
  }
  clearfilter(){
    this.removesubject=false;
    this.removemessage=false;
    this.filter={};
    this.announcement({"currentPage":1,"pageSize":50});
  }
  announcement(val){
    this.loader=true;
    this.db.fetchData(val,'announcement/list').subscribe((response)=>{
      console.log(response);
      console.log('hello');
      
      this.loader=false;
      if(response['status']=='Success')
      {
        this.announcementlist = response['data'];
      }
      if(response['status']=='Failed')
      {
        this.div=true;
        this.announcementlist =[];
      }
      console.log(this.announcementlist);
      this.rolelist();
      for(let i=0;i<this.announcementlist.length;i++)
      {
          console.log(this.announcementlist[i].sendSMS);
          if(this.announcementlist[i].sendSMS==true)
          {
            console.log('hello')
           this.announcementlist[i].actionsms="SMS";
          }
          else{
           this.announcementlist[i].actionsms="";
          }
          if(this.announcementlist[i].sendEmail==true)
          {
           this.announcementlist[i].actionemail="Email";
          }
          else{
           this.announcementlist[i].actionemail="";
          }
      }
    });
  }


  readMassage(massage,id)
  {

    if(this.userRole !=1)
    {
      this.db.fileData("","announcement/markread/"+id+"/"+this.userId).subscribe((result)=>{
        console.log(result);
      })
    }
    const dialogRef = this.popupDialog.open(ReadMassageComponent, {
      width: '600px',
         data:{
          massage
         }});
        dialogRef.afterClosed().subscribe(result => {
        console.log(result);
      console.log('The dialog was closed');
      });
  }

  checkRead(User,status)
  {
    console.log(status);
    const dialogRef = this.popupDialog.open(ReadPopupComponent, {
      width: '768px',
         data:{
          User,
          status
         }});
        dialogRef.afterClosed().subscribe(result => {
        console.log(result);
      console.log('The dialog was closed');
      });
  }
  subjectList(){
    this.db.fetchData({ "subject":this.filter.subject},'announcement/list').subscribe((response)=>{
      console.log(response);
        this.subjectlist=response['data']});
  }
  subjectFilter(){
    console.log(this.filter.subject);
    this.announcement({ "currentPage":1,
      "pageSize": 50,"subject":this.filter.subject});
      this.removesubject=true;
  }
  removesubjectfilter(){
    this.filter.subject='';
    this.announcement({ "currentPage": 1,
    "pageSize": 50,"subject":this.filter.subject,"message":this.filter.message});
    this.removesubject=false;
  }
  messageList(){
    this.db.fetchData({ "message":this.filter.message},'announcement/list').subscribe((response)=>{
      console.log(response);
        this.messagelist=response['data']});
  }
  messageFilter(){
    console.log(this.filter.segment,this.filter.message);
    this.announcement({ "currentPage":1,
      "pageSize": 50,"subject":this.filter.subject,"message":this.filter.message});
      this.removemessage=true;
  }
  removemessagefilter(){
    this.filter.message='';
    this.announcement({ "currentPage": 1,
    "pageSize": 50,"subject":this.filter.subject,"message":this.filter.message});
    this.removemessage=false;
  }

  deleteAnnouncement(id)
  {
    this.dialog.delete('Announcement  !').then((result) => {
      if(result)
      {
      console.log(id);
      this.db.fileData("","/announcement/delete/"+id).subscribe((result)=>{
        console.log(result);
      if(result['status']=="Success")
      {
        this.announcement({"currentPage":1,"pageSize":50});
      }
      })
      }})
  }
}
 