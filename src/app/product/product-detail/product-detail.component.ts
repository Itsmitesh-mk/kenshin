import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { ConstantService } from '../../constant.service';
import { Router, ActivatedRoute } from '@angular/router';
import {MatDialog } from '@angular/material';
import { ProductModalComponent } from '..//product-modal/product-modal.component';
import { SnackBarOverview } from 'src/app/toast';
import { DialogComponent } from 'src/app/dialog';
import { sessionStorage }  from '../../local-storage.service';
import { EditmodelComponent } from '../editmodel/editmodel.component';
@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  animations: [slideToTop()]
})
export class ProductDetailComponent implements OnInit {
  loader:boolean;
  id:any;
  product_detail:any={};
  productdata:any=[];
  url:any;
  name:any;
  requestfn:any;
  api:any;
  selectedFile:any;
  documentId:any;
  documentType:any;
  picdata:any={};
  documentName:any;
  fileName:any;
  referenceId=this.id;
  iconName:any;
  userdata:any=[];
  msge:any;
  binaryData:any;
  role:any;
  action="1";
  constructor(public db: ConstantService,public router:Router,public user:sessionStorage,public toast:SnackBarOverview, public route:ActivatedRoute, public dialog: MatDialog, public msg:DialogComponent) { }
  ngOnInit() {
    this.loader=true;
    this.userdata=this.user['user']['data'];
    this.role=parseInt(this.userdata['role']);
    console.log(this.role);
    this.route.params.subscribe(params=>{
      console.log(params);
      this.id = params.id;
      console.log(this.id);
      if(this.id){
        this.show_details();    
      }else{
      }
    });
  }
  openDialog(check): void {
    this.productdata.type=check;
    const dialogRef = this.dialog.open(ProductModalComponent, {
      width: '700px',
      data: this.productdata
    });
    dialogRef.afterClosed().subscribe(result => {
      this.show_details();
      console.log('The dialog was closed');
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
          this.productdata=new FormData;
          this.productdata.action=this.action;
          this.productdata.binaryData=this.urls[this.urls.length - 1];
          this.productdata.documentType=1;
          this.productdata.documentName=this.name;
          this.productdata.referenceId=this.id;
          this.loader=true;
          for(var i=0; i<this.selectedFile.length; i++)
          {
            this.productdata.fileName = "image"+i+".jpg",this.selectedFile[i];
          }
          console.log(this.productdata);
          let value=[];
          value[0]=this.productdata;
          console.log(value);

          this.db.fetchData(value,"document/update").subscribe((resp)=>
          {
              console.log(resp);
              if(resp)
              {
                  this.loader=false;
                  this.show_details();
                  this.toast.openSucess('Image Added Sucessfully','');
                
              }
          });
  }
  

  picvalue:any=[];
  deleteimg(picid,filename)
  {
    console.log(picid,filename);
    this.picdata.documentId=picid;
    this.picdata.action=2;
    this.picdata.fileName=filename;
    this.picdata.documentType=1;
    this.picdata.referenceId=this.id;
     this.picvalue.push(this.picdata);
     console.log(this.picvalue);
     this.msge="Your Pic"
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
          this.show_details();
          this.picvalue=[];
        }

      });
    }
  });
  }
  show_details() {

     this.loader=true;
   
            this.db.fileData('','product/detail/'+this.id).subscribe((response)=>{
              console.log(response);
              this.product_detail = response;
              this.productdata=this.product_detail.data;
              // if(this.productdata.isLive==true){
              //   this.productdata.appStatus="Yes";
              // }
              // else{
              //   this.productdata.appStatus="No";
              // }
              this.name = this.productdata.productName;
              this.url = this.db.dburl;
              this.requestfn = 'download/document/';
              this.api = this.url+this.requestfn;
              console.log(this.api);

              setTimeout(() => {
                 this.loader=false;
              }, 1000);

            },error=>{
              console.log(error);
            })
    

  }

  isLive:any;
  productLive(id,event)
  {
    console.log(this.productdata.isLive);
    
    if(this.productdata.isLive==true)
    {
      this.isLive=false;
    }
    if(this.productdata.isLive==false)
    {
      this.isLive=true;

    }
    console.log(id,event.checked);
    this.db.fetchData({"productId":id ,"isLive":this.isLive},'product/live').subscribe((response)=>{
      console.log(response)
    if(response['status']=='Success')
    {
      this.show_details();
      console.log("live");
      this.toast.openSucess('Product Update Success','');
    }
  })
  
}

openPackingDialog(productId,masterPacking,secondaryPacking)
{
  
  const dialogRef = this.dialog.open(EditmodelComponent, {
    width: '700px',
    data: {productId:productId,masterPacking:masterPacking,secondaryPacking:secondaryPacking}
  });
  dialogRef.afterClosed().subscribe(result => {
    console.log(result);
    
    this.show_details();
    console.log('The dialog was closed');
  });
}
}
