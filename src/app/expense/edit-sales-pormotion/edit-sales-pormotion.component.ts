import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConstantService } from 'src/app/constant.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { SnackBarOverview } from 'src/app/toast';
import { DialogComponent } from 'src/app/dialog';

@Component({
  selector: 'app-edit-sales-pormotion',
  templateUrl: './edit-sales-pormotion.component.html',
  styleUrls: ['./edit-sales-pormotion.component.scss']
})
export class EditSalesPormotionComponent implements OnInit {

  userId:any;
  expenseList:any=[];
  userName:any;
  loader:any=false;
  div:any=false
  user:any={};
  userType:any;
  salesExpense:any={}
  expenseId:any;
  userRole:any;
  promation_Expense:any={};
  totalrentalExp:any=0;
  totalfoodExpense:any=0;
  totalavAidsExpense:any=0;
  totalgiftsExpense:any=0;
  totalotherExpense:any=0;
  totalPromationalExp:any=0;
  currentDate:any = new Date().toJSON().split('T')[0];

  constructor(public route:ActivatedRoute,public service:ConstantService,public router:Router,public toast:SnackBarOverview,public dialog:DialogComponent) {
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
  url:any;
  requestfn:any;
  api:any;
  SalesExpenseList:any=[];
  getExpenseList(expenseId)
  {
    this.loader=true
    this.service.fileData("","expense/detail/"+expenseId).subscribe((result)=>{
      console.log(result);
      this.loader=false
      if(result['status']=='Success')
      {
        this.salesExpense=result['data'];
        console.log(this.salesExpense);
        console.log(this.salesExpense.salesPromotionExpense.salesPromotionExps);
        this.SalesExpenseList=this.salesExpense.salesPromotionExpense.salesPromotionExps;
        this.url = this.service.dburl;
        this.requestfn = 'download/document/';
        this.api = this.url+this.requestfn;
        this.calculatePromationalExpense(this.SalesExpenseList)
      }
    })
  }

  addToPromationList()
  {  
    this.promation_Expense.total=parseInt(this.promation_Expense.rentalExpenses)+parseInt(this.promation_Expense.foodExpense)+parseInt(this.promation_Expense.avAidsExpense)+parseInt(this.promation_Expense.giftsExpense)+parseInt(this.promation_Expense.miscExpense);
    this.SalesExpenseList.push(this.promation_Expense)
    this.calculatePromationalExpense(this.SalesExpenseList);
    this.promation_Expense={};

  }

  calculatePromationalExpense(promationalExpArray)
  {
    this.totalrentalExp=0
    this.totalfoodExpense=0
    this.totalavAidsExpense=0
    this.totalgiftsExpense=0
    this.totalotherExpense=0
    this.totalPromationalExp=0
   
    for(let i=0;i<promationalExpArray.length;i++)
    {
      this.totalrentalExp=parseInt(this.totalrentalExp)+parseInt(promationalExpArray[i].rentalExpenses);
      this.totalfoodExpense=parseInt(this.totalfoodExpense)+parseInt(promationalExpArray[i].foodExpense);
      this.totalavAidsExpense=parseInt(this.totalavAidsExpense)+parseInt(promationalExpArray[i].avAidsExpense);
      this.totalgiftsExpense=parseInt(this.totalgiftsExpense)+parseInt(promationalExpArray[i].giftsExpense);
      this.totalotherExpense=parseInt(this.totalotherExpense)+parseInt(promationalExpArray[i].miscExpense);
    }
    this.totalPromationalExp=parseInt(this.totalrentalExp)+parseInt(this.totalfoodExpense)+parseInt(this.totalavAidsExpense)+parseInt(this.totalgiftsExpense)+parseInt(this.totalotherExpense);
  }
  removeExpense(index)
  {
    this.SalesExpenseList.splice(index,1);
  }

  promotionexpense()
  {
    this.loader=true;
    console.log(this.SalesExpenseList);
    this.salesExpense.actualExpenseAmount=this.totalPromationalExp;
    this.salesExpense.salesPromotionExpense={"salesPromotionExps":this.SalesExpenseList};
    console.log(this.salesExpense);
    this.service.fetchData(this.salesExpense,"expense/update").subscribe((result)=>{
      console.log(result);
      this.loader=false;
      if(result['status']=='Success')
      {
        this.toast.openSucess("Expense","Update SuccessFully");
        this.router.navigate(['/expense-list']);
      }
    })
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
      console.log(this.selectedFile[i]);
      
      if(this.selectedFile[i].type == 'application/pdf') {
        this.misc_Expense_Document['fileName'] = "document"+i+".pdf",this.selectedFile[i];
      } else {
        this.misc_Expense_Document['fileName'] = "document"+i+".jpg",this.selectedFile[i];
      }
      // this.misc_Expense_Document.fileName = "image"+i+".jpg",this.selectedFile[i];
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
        this.toast.openSucess('Document Added Sucessfully','');
        
      }
    });
  }

}
