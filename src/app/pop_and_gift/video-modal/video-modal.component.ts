import { Component, OnInit } from '@angular/core';
import { ConstantService } from '../../constant.service';
import { SnackBarOverview } from 'src/app/toast';
import { Router } from '@angular/router';

@Component({
  selector: 'app-video-modal',
  templateUrl: './video-modal.component.html'
})
export class VideoModalComponent implements OnInit {
  
  
  data:any = {};
  loader:boolean;
  
  constructor(public db:ConstantService, public toast: SnackBarOverview,public router:Router) {
    
    this.data.mediaType=2;
  }
  
  ngOnInit() {
    
    
    
  }
  
  saveEversion() {
    
    // this.uploadBillAttechment()
    this.loader=true;
    this.db.fetchData(this.data, 'eversion/add').subscribe((response:any)=>{
      console.log(response);
      if(response['status']=='Success')
      {
        this.toast.openSucess('E-version Updated successfully','');
        this.uploadBillAttechment(response['data']);
      }
      this.loader=false;
      
    });
  }
  
  deleteimg(index)
  {
    this.urls.splice(index, 1);
    this.selectedFile.splice(index, 1);
  }
  
  uploadBillAttechment(id)
  {
    let documentData = {};
    console.log(this.urls);
    
    let value:any = [];
    
    for(let j=0;j<this.urls.length;j++)
    {  
      documentData = new FormData;
      documentData['action']=1;
      documentData['binaryData']=this.urls[j];
      documentData['documentType']=9;
      documentData['documentName'] = this.selectedFile[0].name;
      documentData['referenceId']=id;
      if(this.selectedFile[j].type == 'application/pdf') {
        documentData['fileName'] = "document"+j+".pdf",this.selectedFile[j];
      } else {
        documentData['fileName'] = "document"+j+".jpg",this.selectedFile[j];
      }
        value.push(documentData);
      // this.loader=true;
    }
    
    this.data.file=value;
    console.log(this.data);
    this.loader=true;
    this.db.fetchData(value, 'document/update').subscribe((resp)=>
    {
      console.log(resp);
      if(resp['status']=='Success')
      {
        // this.router.navigate(['/gift-list']);
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
