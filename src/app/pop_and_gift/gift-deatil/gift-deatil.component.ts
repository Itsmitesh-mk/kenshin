import { Component, OnInit } from '@angular/core';
import { ConstantService } from '../../constant.service';
import { Router, ActivatedRoute } from '@angular/router';
import {MatDialog } from '@angular/material';
import { SnackBarOverview } from 'src/app/toast';
import { DialogComponent } from 'src/app/dialog';
import { GiftModalComponent } from '../gift-modal/gift-modal.component';
import { sessionStorage }  from '../../local-storage.service';
@Component({
  selector: 'app-gift-deatil',
  templateUrl: './gift-deatil.component.html',
})
export class GiftDeatilComponent implements OnInit {
  giftdata:any={};
  gift_form:any={};
  role:any;
  userdata:any=[];
  action=1;
  selectedFile:any=[];
  giftpicdata:any={};
  name:any;
  id:any;
  url:any;
  msge:any;
  api:any;
  gift:any;
  request:any;
  loader:boolean;
  constructor(public db: ConstantService,public user:sessionStorage,public router:Router,public toast:SnackBarOverview, public route:ActivatedRoute, public dialog: MatDialog,public msg:DialogComponent) { }

  ngOnInit() {
    this.userdata=this.user['user']['data'];
      this.role=this.userdata['role'];
    // this.giftdetail();
    // this.loader=true;
    this.route.params.subscribe(params=>{
      console.log(params);
      this.id = params.id;
      console.log(this.id);
      if(this.id){
        this.giftdetail();
      }else{
      }
    });
  }
  
 
  urls:any=[];
  insertImage(data)
  {
        this.selectedFile=[];
        let files = data.target.files;
        if (files) {
          for (let file of files) {
            let reader = new FileReader();
            reader.onload = (e: any) => {
              this.urls.push(e.target.result);
            }
            reader.readAsDataURL(file);
          }
        }
        console.log(this.urls);
        console.log(data.target.files.length);
        for(var i=0; i<data.target.files.length; i++)
        {
          this.selectedFile.push(data.target.files[i]);
        }
        setTimeout(() => {
          this.Insert_Image();
        }, 500);
  }



  Insert_Image()
  {

    this.giftdata=new FormData;
    this.giftdata.action=this.action;
    this.giftdata.binaryData=this.urls[this.urls.length - 1];
    this.giftdata.documentType=3;
    this.giftdata.documentName=this.name;
    console.log(this.giftdata.documentName);
    this.giftdata.referenceId=this.id;
    for(var i=0; i<this.selectedFile.length; i++)
    {
      this.giftdata.fileName="image"+i+".jpg",this.selectedFile[i];
    }
    console.log(this.giftdata);
    let value=[];
    value[0]=this.giftdata;
    console.log(value);
    this.loader=true;
    this.db.fetchData(value,"document/update").subscribe((resp)=>
    {
      console.log(resp);
      if(resp)
      {
        this.giftdetail();
        this.toast.openSucess('Image Added Sucessfully','');
        this.loader=false;
      }
    });
  }

  
  picvalue:any=[];
  deleteimg(picid,filename)
  {
    console.log(picid,filename);
    this.giftpicdata.documentId=picid;
    this.giftpicdata.action=2;
    this.giftpicdata.fileName=filename;
    this.giftpicdata.documentType=3;
    this.giftpicdata.referenceId=this.id;
     this.picvalue.push(this.giftpicdata);
     console.log(this.picvalue);
     this.msge="Image";
     this.msg.delete(this.msge).then((result) => {
      console.log(result);
      if(result)
      {
        this.loader=true;
    this.db.fetchData(this.picvalue,"document/update").subscribe((resp)=>
      { 
        console.log(resp);
        if(resp)
        {
          this.toast.openSucess('Image Deleted Sucessfully','');
          this.loader=false;
          this.giftdetail();
          this.picvalue=[];
        
        }
      });
    }
  });
  }
  giftdetail(){
    console.log(this.id);;
    console.log("avlok");

    this.loader = true;
    this.db.fileData(this.id,"pop/detail/").subscribe((response)=>{
      console.log(response);

      this.loader = false;
      this.giftdata=response['data'];
       this.name=this.giftdata['name'];
      console.log(this.giftdata);
      this.url=this.db.dburl;
      this.request='download/document/';
      this.api=this.url+this.request;
  });

}
openDialog(check): void {
  console.log(check)
  this.giftdata.check=check;
  const dialogRef = this.dialog.open(GiftModalComponent, {
    width: '700px',
    data: this.giftdata
  });
  
  dialogRef.afterClosed().subscribe(result => {
    this.giftdetail();
    console.log('The dialog was closed');
  });
}

}
