import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConstantService } from 'src/app/constant.service';
import { isPlatformBrowser } from '@angular/common';
import { SnackBarOverview } from 'src/app/toast';
import { DialogComponent } from 'src/app/dialog';


@Component({
  selector: 'app-editmisc',
  templateUrl: './editmisc.component.html',
  styleUrls: ['./editmisc.component.scss']
})
export class EditmiscComponent implements OnInit {

  userId:any;
  expenseList:any=[];
  userName:any;
  loader:any=false;
  div:any=false
  user:any={};
  userType:any;
  misc_Expense:any={}
  expenseId:any;
  userRole:any;
  miscExpenselist:any={};
  currentDate:any = new Date().toJSON().split('T')[0];
  
  constructor(public dialog:DialogComponent,public route:ActivatedRoute,public router:Router, public service:ConstantService,@Inject(PLATFORM_ID) private platformId: Object, public toast:SnackBarOverview) {
    this.user = JSON.parse(localStorage.getItem('user')) || [];
    console.log(this.user);
    this.userType = this.user.data.userType;
    this.userId = this.user.data.userId;
    this.userRole=this.user.data.role;
    console.log(this.userType ,"&" , this.userId, "&" ,this.userRole);
    this.route.params.subscribe( params => {
      console.log(params);
      this.expenseId = params.id;
      console.log(this.expenseId);
      if(this.expenseId)
      {
        this.getExpenseList(this.expenseId);
      }
      });
   }

  ngOnInit() {
  }
  urls:any;
  requestfn:any;
  api:any;
  totalExpenseList:any=[];
  getExpenseList(expenseId)
  {
    this.loader=true;
    this.service.fileData("","expense/detail/"+expenseId).subscribe((result)=>{
      console.log(result);
      this.loader=false
      if(result['status']=='Success')
      {
        this.misc_Expense=result['data'];
        console.log(this.misc_Expense);
        console.log(this.misc_Expense.miscExpense.miscExp);
        this.totalExpenseList=this.misc_Expense.miscExpense.miscExp;
        this.urls = this.service.dburl;
        this.requestfn = 'download/document/';
        this.api = this.urls+this.requestfn;
        this.calculateamount(this.totalExpenseList);
      }
    })
  }

  addToMiscExpenseList()
  {
    console.log(this.miscExpenselist);
    this.totalExpenseList.push(this.miscExpenselist);
    this.calculateamount(this.totalExpenseList);
    this.miscExpenselist={};
    
  }
 totalAmount:any=0;
  calculateamount(forCalculation)
  {  
    this.totalAmount=0;
    for(let i=0;i<forCalculation.length;i++)
    {
      this.totalAmount=parseInt(this.totalAmount)+parseInt(forCalculation[i].amount);
    }
      console.log(this.totalAmount);

  }

  removeExpense(index)
  {
    this.totalExpenseList.splice(index,1)
  }

  miscExpense()
  { 
    console.log(this.totalAmount);
    console.log(this.totalExpenseList);
    this.misc_Expense.actualExpenseAmount=this.totalAmount;
    this.misc_Expense.miscExpense={"miscExp":this.totalExpenseList}
    console.log(this.misc_Expense);
    this.loader=true;
     this.service.fetchData(this.misc_Expense,"expense/update").subscribe((result)=>{
      console.log(result);
      this.loader=false;
      if(result['status']=='Success')
      {
        this.router.navigate(['/expense-list']);
        this.toast.openSucess("Expense","Updated SuccessFully");
      }    
    })
    
  }

  allmiscexpense(expenseStatus)
  {
    this.misc_Expense.status=expenseStatus;
  }

  setFocus(form) {
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
  selectedFile:any=[];
  documentUrl:any=[];
  insertImage(data)
  {
          this.selectedFile=[];
          let files = data.target.files;
          if (files) {
            for (let file of files) {
              let reader = new FileReader();
              reader.onload = (e: any) => {
                this.documentUrl.push(e.target.result);
              }
              reader.readAsDataURL(file);
            }
          }
          console.log(this.documentUrl);
          console.log(data.target.files.length);
          for(var i=0; i<data.target.files.length; i++)
          {
            this.selectedFile.push(data.target.files[i]);
          }

          setTimeout(() => {
            this.Insert_Image();
          }, 500);
  }
  misc_Expense_Document;
  Insert_Image()
  {
          this.misc_Expense_Document=new FormData;
          this.misc_Expense_Document.action=1;
          this.misc_Expense_Document.binaryData=this.documentUrl[this.documentUrl.length - 1];
          this.misc_Expense_Document.documentType=4;
          this.misc_Expense_Document['documentName'] = this.selectedFile[0].name;
          this.misc_Expense_Document.referenceId=this.expenseId;
          this.loader=true;
          for(var i=0; i<this.selectedFile.length; i++)
          {
            this.misc_Expense_Document.fileName = "image"+i+".jpg",this.selectedFile[i];
          }
          console.log(this.misc_Expense_Document);
          let value=[];
          value[0]=this.misc_Expense_Document;
          console.log(value);

          this.service.fetchData(value,"document/update").subscribe((resp)=>
          {
              console.log(resp);
              if(resp)
              {
                  this.loader=false;
                  this.getExpenseList(this.expenseId);
                  this.toast.openSucess('Image Added Sucessfully','');
                
              }
          });
  }

  picdata:any={}
  picvalue:any=[];
  deleteimg(picid,filename)
  {
    console.log(picid,filename);
    this.picdata.documentId=picid;
    this.picdata.action=2;
    this.picdata.fileName=filename;
    this.picdata.documentType=4;
    this.picdata.referenceId=this.expenseId;
    this.picvalue.push(this.picdata);
    console.log(this.picvalue);
    this.dialog.delete("Document").then((result) => {
      console.log(result);
      if(result)
      {
        this.loader=true;
        this.service.fetchData(this.picvalue,"document/update").subscribe((resp)=>
        { 
          console.log(resp);
          if(resp['status']=='Success')
          {
            this.toast.openSucess('Image Deleted Sucessfully','');
            this.loader=false;
            this.getExpenseList(this.expenseId);
            this.picvalue=[];
          }
          
        });
      }
    });
  }
}
