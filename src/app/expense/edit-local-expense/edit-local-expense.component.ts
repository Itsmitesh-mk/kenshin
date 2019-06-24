import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConstantService } from 'src/app/constant.service';
import { DialogComponent } from 'src/app/dialog';
import { SnackBarOverview } from 'src/app/toast';

@Component({
  selector: 'app-edit-local-expense',
  templateUrl: './edit-local-expense.component.html',
  styleUrls: ['./edit-local-expense.component.scss']
})
export class EditLocalExpenseComponent implements OnInit {
  userId:any;
  expenseList:any=[];
  userName:any;
  loader:any=false;
  div:any=false
  user:any={};
  userType:any;
  userRole:any;
  expenseId:any;
  localExpense:any={}
  localHQExpense:any={};
  localConveyances:any=[];
  designation:any;
  constructor(public route:ActivatedRoute,public service:ConstantService,public dialog:DialogComponent, public toast:SnackBarOverview,public router:Router) {
    this.user = JSON.parse(localStorage.getItem('user')) || [];
    console.log(this.user);
    this.userType = this.user.data.userType;
    this.userId = this.user.data.userId;
    this.userRole=this.user.data.role;
    this.designation=this.user.data.salesUser.designation;
    console.log(this.userType ,"&" , this.userId, "&" ,this.userRole);
    this.route.params.subscribe( params => {
      console.log(params);
      this.expenseId = params.id;
      console.log(this.expenseId);
      
      if(this.expenseId)
      {
        this.getExpenseList(this.expenseId);
        this.getAllowanceList(this.designation)
      }
      });
   }

  ngOnInit() {
  }
  url:any;
  requestfn:any;
  api:any;
  SalesExpenseList:any=[];
  // localConveyances:any=[]
  getExpenseList(expenseId)
  {
    this.loader=true
    console.log(expenseId);
    
    this.service.fileData("","expense/detail/"+expenseId).subscribe((result)=>{
      console.log(result);
      this.loader=false
      if(result['status']=='Success')
      {
        this.localExpense=result['data'];
        console.log(this.localExpense);
        console.log(this.localExpense.localHQExpense.localConveyances);
        this.localConveyances=this.localExpense.localHQExpense.localConveyances;
        this.calculateLocalExpense(this.localConveyances);
        this.url = this.service.dburl;
        this.requestfn = 'download/document/';
        this.api = this.url+this.requestfn;
        // this.calculatePromationalExpense(this.SalesExpenseList)
      }
    })
  }

  localexpense(status)
  {
    this.localExpense.status=status;
  }

  LocalConvenseExpense()
  {
    this.localExpense.localHQExpense={"localConveyances":this.localConveyances};
    this.localExpense.userId=this.userId;
    // this.localConvense.department=this.userInformation.userType;
    // this.localConvense.expenseType=this.expenseForm.form;
    // this.localConvense.expenseSanctioner=this.expenseForm.expenseSanctioner;
    this.localExpense.claimAmount=this.totalLocalExp;
    this.localExpense.actualExpenseAmount=this.totalLocalExp;
    console.log(this.localExpense);
    this.loader=true;
    this.service.fetchData(this.localExpense,"expense/update").subscribe((result)=>{
      console.log(result);
      this.loader=false
      if(result['status']=='Success')
      {
        // this.uploadBillAttechment(result['data']);
        this.router.navigate(['/expense-list']);
        this.toast.openSucess("Expense","Update SuccessFully");
      }
    })
  }

  allowanceList:any=[];
  getAllowanceList(designation)
  {
    this.loader=true
    this.service.fetchData({designation:designation},"allowance/list").subscribe((result)=>{
      console.log(result);
      this.loader=false
      if(result['status']=='Success')
      {
        this.allowanceList=result['data'][0];
      }
      
    })
  }

  readonlyArea=false;
  readonlyValue(value)
  {
    if(value==1)
    {
      this.readonlyArea=true
    }
    if(value==2)
    {
      this.readonlyArea=false;
    }
    
  }

  calculateAmount(mode:any,km:any)
  {
    console.log(this.allowanceList);
    if(mode==9)
    {
      this.localHQExpense.amount=parseFloat(this.allowanceList.selfCarPerKM)*parseFloat(km);
    }
    if(mode==8)
    {
      this.localHQExpense.amount=parseFloat(this.allowanceList.selfBikePerKM)*parseFloat(km);

    }
  }
  addToLocalConvenseList()
  {
    console.log(this.localHQExpense);
    this.localConveyances.push(this.localHQExpense)
    this.localHQExpense={};
    this.calculateLocalExpense(this.localConveyances);
    console.log(this.localConveyances);
  }

  removeLocalConvenseList(index)
  {
    this.localConveyances.splice(index,1);
    this.calculateLocalExpense(this.localConveyances);
  }
  otherLocalExp:any=0;
  localExp:any=0;
  totalLocalExp:any=0;
  calculateLocalExpense(localExpArray)
  {
    this.otherLocalExp=0;
    this.localExp=0;
    this.totalLocalExp=0;
    for(let i=0;i<localExpArray.length;i++)
    {
      this.otherLocalExp=parseInt(this.otherLocalExp)+parseInt(localExpArray[i].otherExpense);
      this.localExp=parseInt(this.localExp)+parseInt(localExpArray[i].amount);
    }
    this.totalLocalExp=parseInt(this.otherLocalExp)+parseInt(this.localExp);
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
