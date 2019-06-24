import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { ActivatedRoute } from '@angular/router';
import { ConstantService } from 'src/app/constant.service';
import {MatDialog} from '@angular/material';
import { UpdateNetworkComponent } from '../update-network/update-network.component';
import { UpdateNetworkAddressComponent } from '../update-network-address/update-network-address.component';
import { SnackBarOverview } from 'src/app/toast';
import { sessionStorage }  from '../../local-storage.service';
import { Router } from '@angular/router';
import { OtherAddressComponent } from 'src/app/order/other-address/other-address.component';
import { DialogComponent } from 'src/app/dialog';
import { DocumentEndImageComponent } from '../document-end-image/document-end-image.component';
@Component({
  selector: 'app-distribution-detail',
  templateUrl: './distribution-detail.component.html',
  animations: [slideToTop()]
})


export class DistributionDetailComponent implements OnInit {
  id:any;
  concernActive:any='';
  detailActive:any='';
  orderActive:any='';
  message:any;
  IsActive:any=1;
  tmp_list:any=[];
  userdata:any=[];
  role:any;
  div:any=false;
  orderlist:any=[];
  msg:any=[];
  cartActive:any='';
  contact_person:any=[];
  territoryId:any;
  action="1";
  name:any;
  documentData:any=[]
  networkUpdateActions:any=[];
  saleslist:any=[];
  account_form:any={};
  networkUserDetail:any=[];
  salesUsersegment:any=[];
  concernList:any=[];
  segmentlist:any=[];
  senddata:any;
  status:any;
  index:any;
  selectedFile:any=[];
  // networkSegments:any=[];
  salesUser:any=[];
  loader:any=false;
  territoryList:any=[];

  editAssignedDiv:any = false;
  segmentUpdateActions:any = '';

  currentActiveTab:any = '';

  documentListData:any = [];
  dburl:any = '';

  userType:any;

  constructor(public router:Router,public toast:SnackBarOverview,public user:sessionStorage,public route:ActivatedRoute,public service:ConstantService,public dialog: MatDialog,public dia:DialogComponent) {
    this.route.params.subscribe(params=>{
      console.log(params);
      this.id = params.id;
      console.log(this.id);
      this.userdata=this.user['user']['data'];
      this.role=this.userdata['role'];

      this.userType = this.userdata['userType'];
    });

      setTimeout(() => {
        
      }, 1000);
   }



  ngOnInit() {
    this.show_details();

    this.dburl = this.service.dburl;
    setTimeout(() => {
     
    }, 500);
  }
  urls:any=[];
  insertDocument(data)
    {
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
 
          setTimeout(() => {
            this.Insert_Image();
          }, 500);
    }
    
  data:any = {};
    productdata:any=[];
    Insert_Image()
    {
      for(var i=0; i<this.selectedFile.length; i++)
      {
        console.log(this.selectedFile[i]);
        
          this.documentData=new FormData;
          this.documentData.action=1;
          this.documentData.binaryData=this.urls[i];
          this.documentData.documentType=1;
          this.documentData.documentName=this.selectedFile[i].name;
          this.documentData.referenceId=this.id;
          this.documentData.fileName="Document"+i+".pdf",this.selectedFile[i];
          this.documentData.iconName = "DocumentIcon"+i+".pdf",this.selectedFile[i];

          console.log(this.documentData);

      }
      let value=[];
      value[0]=this.documentData;
  
            this.service.fetchData(value,"document/update").subscribe((resp)=>
            {
                console.log(resp);
                if(resp)
                {
                    this.loader=false;
                    this.selectedFile=[];
                    this.toast.openSucess('Document Added Sucessfully','');
                  
                }
            });
    }

  show_details(){
    this.loader=true;
    this.detailActive=true
      this.service.fetchData({'networkId': this.id},"network/list").subscribe((result=>{

            console.log(result);
            this.networkUserDetail=result['data'][0];
            console.log(this.networkUserDetail);
            this.loader=false;
            this.rolelist();
            this.segment_list();
            this.get_sales(1, '');
            setTimeout(() => {
              this.currentActiveTab = 1;
            }, 200);
      }))
  }

  order_list(){
    this.loader=true;
    this.orderActive=true ;
    console.log(this.userdata['userType']);
    if(this.userdata['userType']==3){
      this.senddata={"networkId":this.id,"currentPage": 1,"pageSize": 50};
    }else if(this.userdata['userType']==2){
      this.senddata={"networkId":this.id,"currentPage": 1,"pageSize": 50};
    }else{
      this.senddata={"networkId":this.id,"currentPage": 1,"pageSize": 50};
    }
    this.service.fetchData(this.senddata,'order/list').subscribe((response)=>{
      console.log(response);
      if(response['status']=='Success')
      {
        this.orderlist = response['data'];
      }else{
        this.div=true;
      }
      console.log(this.orderlist);
      
      this.loader=false;
    });
  }
  tmp_concern_list:any=[];
  concern_list(status){
    this.status=status;
    this.concernActive=true;
    this.loader=true;
    this.service.fetchData( {"currentPage": 1,'networkId':this.id,
    "pageSize": 500},'concern/list').subscribe((response)=>{
      console.log(response)
      this.loader=false;
      if(response['status']=='Success')
      {
        this.concernList=response['data'];
        for(var i=0;i<this.concernList.length;i++){
          if(this.concernList[i].claimNo!=''){
            this.tmp_concern_list.push(this.concernList[i]);
          }
        }
        this.loader=false;
      }
      if(response['status']=='Failed')
      {
        this.div=true;
        this.loader=false;
        this.concernList=[];
      }
    console.log(this.concernList);
  })
}

documentList() {

      this.loader=true;
      this.service.fileData('','network/document/'+this.id).subscribe((response)=>{

        console.log(response)
        this.loader=false;
        this.documentListData = response['data'];

        console.log(this.documentListData);
    })
  }


  select_sales(value,index,event,territoryId,userName,role) {

        // if(event.checked)
        // { 
          
        //      this.salesUser.push({'salesUserId':value,'networkId':this.networkUserDetail.networkId,'territoryId':territoryId,'salesUserName':userName,'salesUserRole':role});

        //      console.log(this.salesUser);

        // } else {
               
               // console.log(index);
               // console.log(this.salesUser[index]);
                // if(this.salesUser[index]['salesUserId'])
                // {this.salesUser.splice(index,1);}
                // console.log(this.salesUser);
      //  }
  }


  updateSales() {

    this.networkUpdateActions={"salesUsersModified":true};


    const salesUsers = [];
    for (let index = 0; index < this.territoryList.length; index++) {
         if(this.territoryList[index].check) {

            salesUsers.push({'salesUserId':this.territoryList[index].userId,'networkId':this.networkUserDetail.networkId,'territoryId': this.territoryList[index].territoryId,'salesUserName':this.territoryList[index].userName,'salesUserRole':this.territoryList[index].role});
         }
    }


    this.segmentUpdateActions={"segmentsModified":true};
    console.log(this.salesUsersegment);

    const segmentSelected = [];
    for (let index = 0; index < this.segmentlist.length; index++) {
          
         if(this.segmentlist[index].check) {

             segmentSelected.push({networkId: this.networkUserDetail.networkId,segmentCode: this.segmentlist[index].text, segment: this.segmentlist[index].value})
         }
    }

    if(segmentSelected.length == 0) {
       this.toast.openError('No Segment Selected!!','');
       return;
    }


    this.loader = true;

    this.service.fetchData({'networkUpdateActions':this.networkUpdateActions,'networkId': this.networkUserDetail.networkId, 'salesUsers': salesUsers},'network/assignto/update').subscribe((response)=>{

            console.log(response);

            this.message=response['message'];
            // if(this.message=="Network Sales Users Updated")
            // {
        
            // } else { 
            //     this.toast.openError('Something went wrong Please Try Again!!','');
            // }

            this.service.fetchData({'networkUpdateActions':this.segmentUpdateActions,'networkId':this.networkUserDetail.networkId,"networkSegments":segmentSelected,

              },'network/update').subscribe((response)=>{

                  console.log(response);
                  this.message=response['message'];

                  this.loader = false;

                  if(this.message)
                  {
                      this.toast.openSucess('Updated successfully','');
                      this.editAssignedDiv = false;
                      this.show_details();
                      // this.router.navigate(['/distribution-detail/'+this.networkUserDetail.networkId]) 
                  } else {
                      this.toast.openError('Something went wrong Please Try Again!!','');
                  }
            });


      });


  }

  updateSegment() {

    this.networkUpdateActions={"segmentsModified":true};
    console.log(this.salesUsersegment);
    this.service.fetchData({'networkUpdateActions':this.networkUpdateActions,'networkId':this.networkUserDetail.networkId,"networkSegments":this.salesUsersegment,
      },'network/update').subscribe((response)=>{
        console.log(response);
        this.message=response['message'];
        if(this.message)
        {this.toast.openSucess('Updated successfully','');
          this.router.navigate(['/distribution-detail/'+this.networkUserDetail.networkId]) 
        }else{this.toast.openError('Something went wrong Please Try Again!!','');}});

  }


  openDialog(){
    console.log(this.networkUserDetail);
    const dialogRef = this.dialog.open(UpdateNetworkAddressComponent,{data:this.networkUserDetail});
    dialogRef.afterClosed().subscribe(result =>{
      console.log(result);
      this.saleslist=[];
      this.show_details();
    });
  }


  segment_list() {

      this.service.fileData('','segment/list/').subscribe((response)=>{

              console.log(response);
              this.segmentlist=response['data'];

          
              // for(let i=0;i<this.networkUserDetail.networkSegments.length;i++) {
              //       this.salesUsersegment.push(this.networkUserDetail.networkSegments[i]);
              // }

              for(let i=0;i<this.segmentlist.length;i++) {

                  const indexExist = this.networkUserDetail.networkSegments.findIndex(row => row.segment == this.segmentlist[i].text);

                  if(indexExist != -1) {
                      this.segmentlist[i].check=true;
                  }

                  // for(let j=0;j<this.salesUsersegment.length;j++){
                  //     if(this.salesUsersegment[j].segmentCode==this.segmentlist[i].value){
                  //         this.segmentlist[i].check=true;
                  //     }
                  // }
              }
      });
  }


  get_sales(src, srcData) {

      let territoryStr = '';

      if(src == 1) {

            for (let index = 0; index < this.networkUserDetail.networkTerritories.length; index++) {
      
                //  territoryIds.push(this.networkUserDetail.networkTerritories[index]['territoryId']);
                if(index == 0) {
                    territoryStr += '?territoryIds='+this.networkUserDetail.networkTerritories[index]['territoryId'];
                } else {
                    territoryStr += '&territoryIds='+this.networkUserDetail.networkTerritories[index]['territoryId'];
                }
              }

      } else {

          territoryStr = srcData;
      }


      console.log(territoryStr);

      if(territoryStr) {

          this.loader=true;
          console.log('hello');
    
          this.service.fetchData('', 'territory/salesusers' + territoryStr).subscribe((response)=>{
    
                console.log(response);
                this.loader=false;
                this.saleslist=response['data'];
    
                console.log(this.saleslist);
                // const role=this.saleslist.filter(x=>x.role==10);
                // this.territoryList = [];
                // if(role.length != 0)
                // {
                //     console.log(role);
                //     this.territoryList = role;
    
                // } else {
    
                //       const role = this.saleslist.filter(x=>x.role==8)
                //       if(role.length!=0)
                //       {
                //           console.log(role);
                //           this.territoryList=role;
                //       } else {
    
                //           const role=this.saleslist.filter(x=>x.role==7);
    
                //           if(role.length!=0) {
    
                //               console.log(role);
                //               this.territoryList=role;
                //           } else {
                //                 const role=this.saleslist.filter(x=>x.role==6)
                //                 if(role.length!=0){
                //                   console.log(role);
                //                   this.territoryList=role;
                //                 }
                //           }
                //       }
                //   }
    
                  // console.log(this.saleslist);
    
                  // for(let i=0;i<this.networkUserDetail.networkSalesUsers.length;i++){
                  //       // this.salesUser.push(this.networkUserDetail.networkSalesUsers[i]);
                  // }
    
                  // for(let i=0;i<this.territoryList.length;i++)  {
    
                  //     const indexExist = this.networkUserDetail.networkSalesUsers.findIndex(row => row.salesUserId == this.territoryList[i].userId);
    
                  //     if(indexExist != -1) {
                  //       this.territoryList[i].check=true;
                  //     }
                  // }
            })
      }
  }


  rolelists:any=[];
  AllUserList:any=[]
  rolelist() {
    this.loader=true;
    this.service.fileData('','usertype/list').subscribe((response)=>{
          console.log(response);
          this.rolelists=response['data'];
          this.loader=false;
          let filterrolelead= this.rolelists.filter(x => x.userTypeId==2);
            this.AllUserList=filterrolelead[0].roles;
            console.log(this.AllUserList);
        });
      }
     


      userList(role){
      console.log(role);
      const rolee=this.saleslist.filter(x=>x.role==role);
                this.territoryList = [];
                if(role.length != 0)
                {
                    console.log(rolee);
                    this.territoryList = rolee;
                }
                for(let i=0;i<this.networkUserDetail.networkSalesUsers.length;i++){
                  // this.salesUser.push(this.networkUserDetail.networkSalesUsers[i]);
            }

            for(let i=0;i<this.territoryList.length;i++)  {

                const indexExist = this.networkUserDetail.networkSalesUsers.findIndex(row => row.salesUserId == this.territoryList[i].userId);

                if(indexExist != -1) {
                  this.territoryList[i].check=true;
                }
            }
     
      }
    

  get_network_terrtory(segmentSelected) {

      this.loader = true;

      this.service.fetchData({'pinCode':this.networkUserDetail.pin, 'segments': segmentSelected },'territory/list').subscribe((response)=>{

                console.log(response);
                this.loader=false;
                this.saleslist =response['data'];

                let territoryStr = '';

                if(response['data']) {

                    for (let index = 0; index < response['data'].length; index++) {

                        if(index == 0) {
                            territoryStr += '?territoryIds='+response['data'][index]['territoryID'];
                        } else {
                            territoryStr += '&territoryIds='+response['data'][index]['territoryID'];
                        }
                    }
                }

                this.get_sales(2, territoryStr);

                console.log(territoryStr);
              // this.saleslist=response['data'][0]['salesUsers'];
            
      })
  }



  select_segments(value,index,event) {


        const segmentSelected = [];
        for (let index1 = 0; index1 < this.segmentlist.length; index1++) {

            if(this.segmentlist[index1].check) {
                segmentSelected.push(this.segmentlist[index1].text);
            }
        }

        console.log(segmentSelected);

        if(segmentSelected.length == 0) {

             this.territoryList = [];

        } else {

            this.get_network_terrtory(segmentSelected); 

        }

  }


  openEmail(check) {
    this.networkUserDetail.type=check;
    console.log(check);
    console.log("chech assign user update");
    const dialogRef = this.dialog.open(UpdateNetworkComponent,{width : '1000px' ,data:this.networkUserDetail});
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.saleslist=[];
      this.show_details();
    });
  }

  editlimit(check,index){
    this.networkUserDetail.networkLimits[index].type=check;
    console.log(index);
    console.log(check);
    console.log("chech assign user update");
    const dialogRef = this.dialog.open(UpdateNetworkComponent,{width : '1000px' ,data:this.networkUserDetail.networkLimits[index]});
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.saleslist=[];
      this.show_details();
    });

  }


  updatepassword(){
    console.log('pass');
    this.service.fetchData({"userId": this.networkUserDetail.userId,"password":this.account_form.password},'account/changepassword')
    .subscribe((response)=>{ console.log(response)
      this.message=response['message'];
      console.log(this.message);
      if(this.message=="Your password has been changed successfully!")
      {
        this.toast.openSucess('Your password has been changed successfully!','');
      }else{
        this.toast.openError('Something Went Wrong Please Try Again!!','');
      }
    });
  }


  addAddress(id){
    const dialogRef = this.dialog.open(OtherAddressComponent,{
      width: '1600px',
         data:{
           id
           }});
         dialogRef.afterClosed().subscribe(result => {
          console.log(result);
        console.log('The dialog was closed');
        this.show_details();
      });
  }


  openDialogone(id): void {
    const dialogRef = this.dialog.open(DocumentEndImageComponent, {
    width: '768px',
    data: {id}
    });
    
    dialogRef.afterClosed().subscribe(result => {

         this.documentList();
    });
    }

  removeShippingAddress(index,id){
    console.log(this.networkUserDetail.shippingAddresses[index]);
    console.log(id);
    this.dia.delete(this.msg).then((result) => {
      console.log(result);
      if(result)
      {
          this.service.fileData(id,'shippingaddress/delete/').subscribe((response)=>{
            console.log(response);
            this.message=response['message'];
            if(this.message)
            {
              
                this.toast.openSucess('Deleted successfully','');
                this.router.navigate(['/distribution-detail/'+this.networkUserDetail.networkId]);
                this.networkUserDetail.shippingAddresses.splice(index,1);
            }else{
                this.toast.openError('Something went wrong Please Try Again!!','');
              
            }
        });
      }
    });
  }



  deleteNetworkDocument(index) {




  }


}