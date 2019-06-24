import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { SnackBarOverview } from 'src/app/toast';
import { ConstantService } from 'src/app/constant.service';
import { DialogComponent } from 'src/app/dialog';
@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.component.html'
})
export class ImageModalComponent implements OnInit {
urls:any=[];
url:any;
request:any;
api:any;
concernStatus:any;
document:any;
  constructor(@Inject(MAT_DIALOG_DATA)public data,public dialog:MatDialog,public toast:SnackBarOverview,public service:ConstantService,public confirm:DialogComponent) {
     console.log(data); 
 
    }
   
    deleteimg(index)
    {
          this.urls.splice(index, 1);
          this.dialog.closeAll();
    }
  ngOnInit() {
    this.url=this.service.dburl;
    this.request='download/document/';
    this.api=this.url+this.request;
    console.log(this.api);
    this.urls.push(this.data.document);
    console.log(this.urls);
  }

}
