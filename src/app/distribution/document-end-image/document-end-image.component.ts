import { Component, OnInit,Inject } from '@angular/core';
import { SnackBarOverview } from 'src/app/toast';
import { ConstantService } from '../../constant.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material'

@Component({
  selector: 'app-document-end-image',
  templateUrl: './document-end-image.component.html',
  styleUrls: ['./document-end-image.component.scss']
})
export class DocumentEndImageComponent implements OnInit {


  loader:boolean;

  selectedFile:any=[];
  formData:any = {};
  networkData:any = {};

  constructor(public db: ConstantService, public toast:SnackBarOverview, public dialogRef: MatDialogRef<DocumentEndImageComponent>,@Inject(MAT_DIALOG_DATA) public data:any) {

        this.networkData = data;
        console.log(data);
   }

    ngOnInit() {

      this.selectedFile=[];
      this.urls=[];
    }

    saveNetworkDocument() {


        if(!this.formData.title || this.formData.title.length < 4) {
            return;
        }

        if(!this.urls || this.urls.length==0) {

            return;
        }

        let documentData = {};

        documentData = new FormData;
        documentData['action']=1;
        documentData['binaryData']=this.urls[this.urls.length - 1];
        documentData['documentType']=6;
        documentData['documentName'] = this.selectedFile[0].name;
        documentData['referenceId']=this.networkData.id;
        this.loader=true;

        for(var i=0; i<this.selectedFile.length; i++)
        {

            if(this.selectedFile[i].type == 'application/pdf') {
              documentData['fileName'] = "document"+i+".pdf",this.selectedFile[i];
            } else {
              documentData['fileName'] = "document"+i+".jpg",this.selectedFile[i];
            }
        }

        console.log(documentData);
        let value=[];
        value[0]=documentData;
        console.log(value);

        this.db.fetchData(value,"document/update").subscribe((resp)=>
        {
              console.log(resp);
              if(resp)
              {
                  this.loader=false;
                  this.toast.openSucess('Image Added Sucessfully','');
                  this.dialogRef.close();
                
              }
        });

    }

    urls:any=[];
    insertDocument(data)
    {
            this.selectedFile=[];
            this.urls=[];
            const files = data.target.files;
            if (files) {

                for (const file of files) {

                    const reader = new FileReader();

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

            console.log(this.urls);
    }


    deleteimg(index)
    {
        this.urls.splice(index, 1);
        this.selectedFile.splice(index, 1);
          
    }



}
