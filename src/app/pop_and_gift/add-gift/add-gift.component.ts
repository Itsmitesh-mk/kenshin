import { Component, OnInit, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { ConstantService } from '../../constant.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SnackBarOverview } from 'src/app/toast';
import { isPlatformBrowser } from '@angular/common';
import * as $ from 'jquery';

@Component({
  selector: 'app-add-gift',
  templateUrl: './add-gift.component.html',
  animations: [slideToTop()]
})
export class AddGiftComponent implements OnInit {
  gift_form:any={};
  message:any;
  loader:boolean;
  selectedFile:any=[];
  giftdata:any={};

  constructor(public db:ConstantService,public router:Router, public route:ActivatedRoute,public toast:SnackBarOverview, @Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit() {
  }
  MobileNumber(event: any) 
  {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) 
    {event.preventDefault(); }
   }


    setFocus(form):void {

        for (var key in form.controls)
        {
          if (form.controls.hasOwnProperty(key)) {
            if(form.controls[key].status=='INVALID')
            {
              if (isPlatformBrowser(this.platformId)) {
                        $('#'+key).focus();
                      }
                      break;
            }
              console.log(key + " -> " + form.controls[key].status);
          }
        }
    }


   urls:any=[];
   insertImage(data)
   {
        //  this.selectedFile=[];
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

        //  setTimeout(() => {
        //    this.Insert_Image();
        //  }, 500);
   }


    picvalue:any=[];
    deleteimg(index)
    {
          this.urls.splice(index, 1);
          this.selectedFile.splice(index, 1);
    }


    onSubmit() {


        this.gift_form.documents = [];

        // console()
       
        for(var i=0; i<this.selectedFile.length; i++)
        {
            this.giftdata=new FormData;
            this.giftdata.action=1;
            this.giftdata.binaryData=this.urls[i];
            this.giftdata.documentType=3;
            this.giftdata.documentName=this.gift_form.name;
            this.giftdata.referenceId=0;
            this.giftdata.fileName="image"+i+".jpg",this.selectedFile[i];

            console.log(this.giftdata.documentName);

            this.gift_form.documents[i] = JSON.parse(JSON.stringify(this.giftdata));
        }

        console.log(this.gift_form.documents);
      
        this.loader=true;
        this.gift_form.redeem=this.gift_form.point;
        this.db.fetchData(this.gift_form,'pop/add').subscribe((response:any)=>{
          console.log(response);
          this.message=response['message']
            this.loader=false;
          if(this.message=="PopGift added successfully")
          {
            this.toast.openSucess('Gift added successfully','');
            this.router.navigate(['/gift-list'])
          }
          else
          {
            this.toast.openError('Something Went Wrong Please Try Again!!','');
          }
          
        });
    }
}
