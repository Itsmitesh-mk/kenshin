import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { SnackBarOverview } from 'src/app/toast';
import { ConstantService } from 'src/app/constant.service';

@Component({
  selector: 'app-upload-img-modal',
  templateUrl: './upload-img-modal.component.html'
})
export class UploadImgModalComponent implements OnInit {

  salesPromotion:any={};
  loader:any=false;
  constructor(@Inject(MAT_DIALOG_DATA)public data,public toast: SnackBarOverview,public db:ConstantService) { 

    this.salesPromotion=data.p;
    this.salesPromotion.travelPlanID=data.id;
    // this.salesPromotion.documents=Array();
    console.log(data);
    
  }

  ngOnInit() {
  }

  deleteimg(index)
  {
    this.urls.splice(index, 1);
    this.selectedFile.splice(index, 1);
  }
  
  uploadBillAttechment()
  {
    let documentData = {};
    console.log(this.urls);
    
    // this.salesPromotion.documents=Array;
    let value:any = [];
    
    for(let j=0;j<this.urls.length;j++)
    {  
      documentData = new FormData;
      documentData['action']=1;
      documentData['binaryData']=this.urls[j];
      documentData['documentType']=11;
      documentData['documentName'] = this.selectedFile[0].name;
      documentData['referenceId']=this.salesPromotion.travelDetailId;
      if(this.selectedFile[j].type == 'application/pdf') {
        documentData['fileName'] = "document"+j+".pdf",this.selectedFile[j];
      } else {
        documentData['fileName'] = "document"+j+".jpg",this.selectedFile[j];
      }
      value.push(documentData);
    }
    
    // this.salesPromotion.documents=value;
    console.log(this.salesPromotion);
    this.loader=true;
    this.db.fetchData(value, 'document/update').subscribe((resp)=>
    {
      console.log(resp);
      if(resp['status']=='Success')
      {
        this.toast.openSucess('Document Added Sucessfully','');
      }
    });
    
  }
  
  urls:any=[];
  selectedFile:any=[];
  insertImage(data)
  {
    console.log(this.selectedFile);
    
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
    
    console.log(this.selectedFile);
    
  }

}
