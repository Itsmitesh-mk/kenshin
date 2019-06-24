import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { ConstantService } from '../../constant.service';
import { Router, ActivatedRoute } from '@angular/router';
import {MatDialog} from '@angular/material';
import { AddressModalComponent } from '../address-modal/address-modal.component';
import { EmailModalComponent } from '../email-modal/email-modal.component';
import { SnackBarOverview } from 'src/app/toast';
import { sessionStorage }  from '../../local-storage.service';
import { IfStmt } from '@angular/compiler';

@Component({
    selector: 'app-sale-user-detail',
    templateUrl: './sale-user-detail.component.html',
    animations: [slideToTop()]
})

export class SaleUserDetailComponent implements OnInit {
    
    id:any;
    loader:boolean;
    message:any;
    segment:any=[];
    staffSegments:any=[];
    account_form:any={};
    sales_detail:any=[];
    salesdata:any={};
    rolelists:any=[];
    userdata:any=[];
    role:any;
    segmentlist:any=[];
    territorylist:any=[];
    territory:any=[];
    check:boolean;
    check1:boolean;
    filterrole:any;
    checkEmail:any;
    rolelistsales1:any=[];
    
    distributionList:any=[];
    juniorUserDetail:any=[];
    active:any = {};
    
    territorylistdata:any = [];
    networkIdsdata:any = [];
    
    currentActiveTab:any = '';
    senddata:any;
    
    tiID:any=[];
    leadlist:any=[];
    
    designationData = [
        
        { designationName: 'Vice President', designation: 1},
        { designationName: 'Deputy General Manager', designation: 2},
        { designationName: 'General Manager', designation: 3},
        { designationName: 'Assistant General Manager', designation: 4},
        { designationName: 'Sr Manager', designation: 5},
        { designationName: 'Manager', designation: 6},
        { designationName: 'Deputy Manager', designation: 7},
        { designationName: 'Sr Executive', designation: 8},
        { designationName: 'Executive', designation: 9},
        { designationName: 'Assistant Manager', designation: 10},
        { designationName: 'Assistant', designation: 11},
        { designationName: 'Trainee', designation: 12},
        { designationName: 'Others', designation: 13}
    ];
    
    constructor(public db:ConstantService,public router:Router,public user:sessionStorage, public route:ActivatedRoute, public dialog: MatDialog,public toast:SnackBarOverview) { 
        
        this.loader=true;
        this.userdata=this.user['user']['data'];
        this.role=this.userdata['role'];
        this.route.params.subscribe(params=>{
            console.log(params);
            this.id = params.id;
            console.log(this.id);
            this.rolelist()
            if(this.id)
            {
                this.salesuserdetail();

            }
            // this.distributorList();
        });
    }
    
    ngOnInit() {
        
    }
    
    
    
    rolelist()
    {
        console.log("role list");
        
        this.loader=true;
        this.db.fileData('','usertype/list').subscribe((response) => {
            
            console.log(response);
            this.loader=false
            if(response['status']=='Success')
            {
                this.rolelists=response['data'];
                let filterrolesales= this.rolelists.filter(x => x.userTypeId==2);
                this.rolelistsales1 = filterrolesales[0].roles;
                console.log(this.rolelistsales1);
                this.salesuserdetail();
            }
        });
    }
    
    
    distributorList()
    {
        console.log("Function call");
        
        this.db.fetchData({},'network/list').subscribe((response)=>
        {
            console.log(response);
            
            if(response['status']=="Success")
            {
                this.distributionList=response['data'];
            }
            
            console.log(this.distributionList);
        });
    }
    
    
    salesuserdetail() {
        
        setTimeout(() => {
            
            this.currentActiveTab = 1;
            
        }, 200);
        
        console.log('hello');
        
        this.sales_detail = [];
        this.juniorUserDetail = [];
        this.distributionList = [];
        
        this.TotalRSM =[];
        this.TotalASM =[];
        this.TotalTI =[];
        this.TotalTerritoy =[];
        this.TotalDistributor =[];
        
        this.loader = true;
        
        this.db.fileData('','user/detail/'+this.id).subscribe((response)=>{
            
            console.log(response); 
            
            
            setTimeout(() => {
                this.loader=false;
            }, 200);
            
            if(response['status']=='Success')
            {
                // this.sales_detail = response;
                this.salesdata=response['data'];
                
                for (let index = 0; index < this.designationData.length; index++) {
                    
                    if(this.designationData[index].designation == this.salesdata.designation) {
                        
                        this.salesdata.designationName = this.designationData[index].designationName;
                    }
                    
                }
                
                
                
                this.sales_detail=this.salesdata.staffWithJuniors;
                this.juniorUserDetail=this.sales_detail;
                
                this.juniourDetail(this.juniorUserDetail)
                console.log(this.juniorUserDetail);
                
                console.log(this.salesdata);
                
                for(let i=0;i<this.rolelistsales1.length;i++)
                {
                    if(this.rolelistsales1[i].roleId==this.salesdata.role)
                    {
                        this.salesdata.roleName = this.rolelistsales1[i]['roleName'];
                    }
                }
                
                if(this.salesdata.role != 10)
                {
                    console.log("get_juniorUserID function call");
                    //   this.get_juniorUserID();
                }
            }
            
            
            
            this.segment_list();
            
        });
    }
    
    
    editAssignedDiv:any=false
    editAssign()
    {
        this.editAssignedDiv=true;
    }
    
    
    segment_list() {

        console.log('Exist it');
        
        this.db.fileData('','segment/list/').subscribe((response)=>{
            
            console.log(response);
            
            console.log(this.salesdata.staffSegments);
            
            if(response['status']=='Success')
            {
                this.segmentlist = response['data'];
                console.log(this.segmentlist);
                for(let i=0;i < this.segmentlist.length;i++) {
                    
                    const isSegmentExist = this.salesdata.staffSegments.findIndex(row => row.segment ==  this.segmentlist[i].value);
                    
                    if(isSegmentExist !== -1) {
                        this.segmentlist[i].checked=true;
                    }
                }
            }
            
        });
    }
    
    
    getSegmentRelatedData() {
        
        this.get_juniorUserID();
        this.get_territory();
    }
    
    
    get_territory()
    {
        const segmentSelectedArr = [];
        
        for(let i=0;i < this.segmentlist.length;i++) {
            
            if(this.segmentlist[i].checked) {
                segmentSelectedArr.push(this.segmentlist[i].value);
            }
        }
        
        if(segmentSelectedArr.length > 0) {
            
            this.loader = true;
            
            this.db.fetchData({'segments': segmentSelectedArr},'territory/list').subscribe((response)=>{
                
                console.log(response);
                
                this.loader=false;
                if(response['status'] == 'Success')
                {
                    this.territorylist = response['data'];
                    console.log(this.territorylist);
                    console.log(this.TotalTerritoy);
                    
                    this.distributionList = [];
                    
                    for(let i = 0; i < this.territorylist.length; i++)
                    {
                        console.log(this.territorylist[i]);
                        
                        const territoryExist = this.TotalTerritoy.findIndex(row => row.territoryId == this.territorylist[i].territoryID);
                        
                        if(territoryExist !== -1) {
                            
                            this.territorylist[i].check1 = true;
                            
                            this.territorylist[i].disabled = this.TotalTerritoy[territoryExist].disabled;
                            
                            this.loader=true;
                            
                            this.db.fileData('','territory/detail/'+this.territorylist[i].territoryID).subscribe((responseData) => {
                                
                                console.log(responseData);
                                this.loader=false;
                                this.territorylistdata = responseData['data'];
                                
                                for (let j = 0; j < this.territorylistdata.territoryNetworks.length; j++) {
                                    console.log(this.territorylistdata.territoryNetworks[j]);
                                    
                                    this.territorylistdata.territoryNetworks[j].territoryName = this.territorylistdata.territoryName;
                                    
                                    const isSelectedIndex = this.TotalDistributor.findIndex(row => row.networkId == this.territorylistdata.territoryNetworks[j].networkId);
                                    
                                    console.log(this.TotalDistributor);
                                    
                                    if(isSelectedIndex != -1) {
                                        
                                        this.territorylistdata.territoryNetworks[j].checked = true;
                                        
                                        this.territorylistdata.territoryNetworks[j].disabled = this.TotalDistributor[isSelectedIndex].disabled;
                                        
                                    } else {
                                        
                                        this.territorylistdata.territoryNetworks[j].checked = false;
                                    }
                                    
                                    console.log(this.territorylistdata.territoryNetworks[j]);
                                    
                                    this.distributionList.push(this.territorylistdata.territoryNetworks[j]);
                                }
                                
                                console.log(this.distributionList);
                            });
                            
                        }
                    }
                    
                    
                    for (let index = 0; index < this.distributionList.length; index++) {
                        
                        const recordExist = this.TotalDistributor.findIndex(row => row.networkId == this.distributionList[index].networkId);
                        
                        if(recordExist !== -1) {
                            this.distributionList[index].checked = true;
                            this.distributionList[index].disabled = this.TotalDistributor[recordExist].disabled;
                        }
                    }
                    
                    
                    console.log(this.distributionList);
                    
                    let userTempArr = [];
                    
                    if(this.salesdata.role == 6)
                    {
                        userTempArr = this.TotalRSM;
                        
                    } else if(this.salesdata.role == 7) {
                        
                        userTempArr = this.TotalASM;
                        
                    } else if(this.salesdata.role == 8) {
                        
                        userTempArr = this.TotalTI;
                    }
                    
                    for(let i=0;i<this.juniorList.length;i++)
                    {
                        const isExist = userTempArr.findIndex(row => row.userId == this.juniorList[i].userId);
                        
                        if(isExist != -1) {
                            this.juniorList[i].check=true;
                        }
                    }
                }
            });
            
        } else {
            
            this.juniorList = [];
            this.territorylist = [];
            this.distributionList = [];
        }
    }
    
    
    juniorList:any=[];
    userRole:any;
    get_juniorUserID()
    {
        
        
        if(this.salesdata.role==8)
        {
            this.userRole=parseInt(this.salesdata.role)+2;
            
        }
        else
        {
            this.userRole=parseInt(this.salesdata.role)+1;
        }
        
        
        let juniorSelectedArr = [];
        
        if(this.salesdata.role==8)
        {
            juniorSelectedArr = this.TotalTI;
            
        } else if(this.salesdata.role==7) {
            
            juniorSelectedArr = this.TotalASM;
            
        } else if(this.salesdata.role==6) {
            
            juniorSelectedArr = this.TotalRSM;
        }
        
        console.log(juniorSelectedArr);
        
        const segmentSelected = [];
        for (let index = 0; index < this.segmentlist.length; index++) {
            
            if(this.segmentlist[index].checked) {
                segmentSelected.push(this.segmentlist[index].text);
            }
        }
        
        console.log(segmentSelected);
        
        
        if(segmentSelected.length > 0) {
            
            console.log(this.role);
            this.loader=true;
            this.db.fetchData({'role':this.userRole, 'segments': segmentSelected,'currentPage': 1,'pageSize': 200,},'user/list').subscribe((response)=>{
                
                console.log(response);
                this.loader = false;
                if(response['status']=='Success')
                {
                    this.juniorList=response['data'];
                    
                    console.log(juniorSelectedArr);
                    
                    for(let i=0;i<juniorSelectedArr.length;i++)
                    {
                        for(let j=0;j<this.juniorList.length;j++)
                        {
                            if(juniorSelectedArr[i]['userId']===this.juniorList[j]['userId'])
                            {
                                this.juniorList[j].check=true;
                            }
                        }
                    }
                }
                
                console.log(this.juniorList);
            });
        } else {
            
            this.juniorList = [];
        }
    }
    
    
    TotalRSM:any=[];
    TotalASM:any=[];
    TotalTI:any=[];
    TotalTerritoy:any=[];
    TotalDistributor:any=[];
    juniourDetail(juniorList)
    {
        // this. get_territory()
        
        for(let i=0;i<juniorList.salesUserNetworks.length;i++)
        {
            juniorList.salesUserNetworks[i].disabled = false;
            this.TotalDistributor=this.TotalDistributor.concat(juniorList.salesUserNetworks[i]);
            console.log(this.TotalDistributor);
        }
        
        for(let j=0;j<juniorList.userTerritories.length;j++)
        {
            juniorList.userTerritories[j].disabled = false;
            this.TotalTerritoy=this.TotalTerritoy.concat(juniorList.userTerritories[j]);
            console.log(this.TotalTerritoy);
        }
        
        if(this.salesdata.role==8)
        {
            
            console.log("role 8");
            
            
            for(let i=0;i < juniorList.juniors.length;i++)
            {
                
                console.log(juniorList.juniors[i].userId);
                if(juniorList.juniors[i].userId && juniorList.juniors[i].userName) {
                    
                    this.TotalTI=this.TotalTI.concat(juniorList.juniors[i]);
                    
                    for(let j=0;j<juniorList.juniors[i].salesUserNetworks.length;j++)
                    {
                        const existIndex = this.TotalDistributor.findIndex(row => row.establishment == juniorList.juniors[i].salesUserNetworks[j].establishment);
                        
                        if(existIndex == -1 ) {
                            
                            juniorList.juniors[i].salesUserNetworks[j].disabled = true;
                            
                            this.TotalDistributor=this.TotalDistributor.concat(juniorList.juniors[i].salesUserNetworks[j])
                        }
                    }
                    
                    for(let j=0;j<juniorList.juniors[i].userTerritories.length;j++)
                    {
                        const existIndex = this.TotalTerritoy.findIndex(row => row.territoryId == juniorList.juniors[i].userTerritories[j].territoryId);
                        
                        if(existIndex == -1 ) {
                            
                            juniorList.juniors[i].userTerritories[j].disabled = true;
                            
                            this.TotalTerritoy=this.TotalTerritoy.concat(juniorList.juniors[i].userTerritories[j]);
                        }
                    }
                    
                }
                
                console.log(this.TotalTerritoy);
            }
        }
        
        
        if(this.salesdata.role==7)
        {
            console.log("role 7");
            for(let i=0;i<juniorList.juniors.length;i++)
            {
                
                if(juniorList.juniors[i].userId && juniorList.juniors[i].userName) {
                    
                    this.TotalASM=this.TotalASM.concat(juniorList.juniors[i]);
                    console.log(this.TotalASM);
                    
                    for(let j=0;j<juniorList.juniors[i].juniors.length;j++)
                    { 
                        
                        if(juniorList.juniors[i].juniors[j].userId && juniorList.juniors[i].juniors[j].userName) {
                            
                            const asmIndex = this.TotalTI.findIndex(row => row.userName == juniorList.juniors[i].juniors[j].userName);
                            
                            if(asmIndex == -1)
                            {
                                this.TotalTI=this.TotalTI.concat(juniorList.juniors[i].juniors[j])
                            }
                            
                            for(let k=0;k<juniorList.juniors[i].juniors[j].salesUserNetworks.length;k++)
                            {
                                const existIndex = this.TotalDistributor.findIndex(row => row.establishment == juniorList.juniors[i].juniors[j].salesUserNetworks[k].establishment);
                                
                                if(existIndex == -1 ) {
                                    
                                    juniorList.juniors[i].juniors[j].salesUserNetworks[k].disabled = true;
                                    
                                    this.TotalDistributor=this.TotalDistributor.concat(juniorList.juniors[i].juniors[j].salesUserNetworks[k])
                                }
                            }
                            
                            for(let l=0;l<juniorList.juniors[i].juniors[j].userTerritories.length;l++)
                            {
                                console.log("territory");
                                
                                const TiIndex = this.TotalTerritoy.findIndex(row => row.territoryName == juniorList.juniors[i].juniors[j].userTerritories[l].territoryName);
                                if(TiIndex == -1 ) {
                                    
                                    juniorList.juniors[i].juniors[j].userTerritories[l].disabled = true;
                                    
                                    this.TotalTerritoy=this.TotalTerritoy.concat(juniorList.juniors[i].juniors[j].userTerritories[l]);
                                }
                                
                            }
                            
                        }
                        
                    }
                }
                
            }
        }
        
        
        console.log(juniorList);
        if(this.salesdata.role==6)
        {
            console.log("role 6");
            for(let i=0;i < juniorList.juniors.length;i++)
            {
                
                if(juniorList.juniors[i].userId && juniorList.juniors[i].userName) {
                    
                    this.TotalRSM=this.TotalRSM.concat(juniorList.juniors[i]);
                    console.log(this.TotalRSM);
                    
                    for(let a=0;a<juniorList.juniors[i].juniors.length;a++)
                    {
                        
                        if(juniorList.juniors[i].juniors[a].userId && juniorList.juniors[i].juniors[a].userName) {
                            
                            const asmIndex = this.TotalASM.findIndex(row => row.userName == juniorList.juniors[i].juniors[a].userName);
                            if(asmIndex == -1)
                            {
                                this.TotalASM=this.TotalASM.concat(juniorList.juniors[i].juniors[a]);
                            }
                            
                            
                            for(let j=0;j<juniorList.juniors[i].juniors[a].juniors.length;j++)
                            {
                                
                                if(juniorList.juniors[i].juniors[a].juniors[j].userId && juniorList.juniors[i].juniors[a].juniors[j].userName) {
                                    
                                    const tiIndex = this.TotalTI.findIndex(row => row.userName == juniorList.juniors[i].juniors[a].juniors[j].userName);
                                    if(tiIndex == -1)
                                    {
                                        this.TotalTI=this.TotalTI.concat(juniorList.juniors[i].juniors[a].juniors[j])
                                    }
                                    
                                    for(let k=0;k<juniorList.juniors[i].juniors[a].juniors[j].salesUserNetworks.length;k++)
                                    {
                                        const existIndex = this.TotalDistributor.findIndex(row => row.establishment == juniorList.juniors[i].juniors[a].juniors[j].salesUserNetworks[k].establishment);
                                        if(existIndex == -1 ) {
                                            
                                            juniorList.juniors[i].juniors[a].juniors[j].salesUserNetworks[k].disabled = true;
                                            
                                            this.TotalDistributor=this.TotalDistributor.concat(juniorList.juniors[i].juniors[a].juniors[j].salesUserNetworks[k])
                                        }
                                    }
                                    
                                    for(let l=0;l<juniorList.juniors[i].juniors[a].juniors[j].userTerritories.length;l++)
                                    {
                                        console.log("territory");
                                        
                                        const TiIndex = this.TotalTerritoy.findIndex(row => row.territoryName == juniorList.juniors[i].juniors[a].juniors[j].userTerritories[l].territoryName);
                                        
                                        if(TiIndex == -1 ) {
                                            
                                            juniorList.juniors[i].juniors[a].juniors[j].userTerritories[l].disabled = true;
                                            
                                            this.TotalTerritoy=this.TotalTerritoy.concat(juniorList.juniors[i].juniors[a].juniors[j].userTerritories[l]);
                                        }
                                        
                                    }
                                    
                                }     
                            }
                            
                        }
                        
                    }
                    
                }
                
            }
        }
    }
    
    
    select_segment(value,index,event)
    {
        if(event.checked)
        {
            this.segment.push(value);
            console.log(this.segment);
        }
        else
        {
            console.log(index);
            console.log(this.segment[0]);
            
            for( var j=0;j<this.segmentlist.length;j++)
            {
                if(this.segmentlist[index]['value']==this.segment[j])
                {
                    this.segment.splice(j,1);
                }
            }
            console.log(this.segment);
            
        }
    }
    
    
    select_territory(territoryId, isChecked, src)
    {
        console.log(territoryId,isChecked);
        console.log('Select Territory Clicked');
        
        if(isChecked)
        {
            console.log(this.territorylist);
            
            // this.territory.push(value1);
            // console.log(this.territory);
            
            let territoryArr = [];
            
            if(src == 'territory') {
                
                territoryArr = [territoryId];
                
                this.loader=true;
                this.db.fileData('', 'territory/detail/'+territoryId).subscribe((response) => {
                    
                    console.log(response);
                    this.loader=false;
                    this.territorylistdata = response;
                    
                    if(this.territorylistdata.data['territoryNetworks']) {
                        
                        for (let index = 0; index < this.territorylistdata.data['territoryNetworks'].length; index++) {
                            
                            this.territorylistdata.data['territoryNetworks'][index]['territoryName'] = this.territorylistdata.data['territoryName'];
                            
                            this.distributionList.push(this.territorylistdata.data['territoryNetworks'][index]);
                            
                        }
                        
                        console.log(this.distributionList);
                    }
                });
            }
            
            if(src == 'junior') {
                
                console.log(this.territorylist);
                
                for (let index = 0; index < this.territorylist.length; index++) {
                    
                    console.log(territoryId);
                    
                    const isExist = territoryId.findIndex(row => row.territoryId == this.territorylist[index].territoryID);
                    
                    if(isExist != -1) {
                        
                        this.territorylist[index].check1 = true;
                    }
                }
            }
        }
        else
        {
            
            if(src == 'territory') {
                
                this.distributionList = this.distributionList.filter(row => row.territoryId != territoryId);
                console.log(this.distributionList);
            }
        }
        
    }
    
    
    updateSalesUser() {
        
        const updatedSalesArr = {};
        updatedSalesArr['userId'] = this.salesdata.userId;
        
        const segmentSelected = [];
        for(let i = 0;i < this.segmentlist.length;i++) {
            
            if(this.segmentlist[i].checked) {
                segmentSelected.push({'userId':this.salesdata.userId, 'segmentCode': this.segmentlist[i].value, 'segment' : this.segmentlist[i].value });
            }
        }
        
        const territorySelected = [];
        for (let index = 0; index < this.territorylist.length; index++) {
            if(this.territorylist[index].check1 && !this.territorylist[index].disabled) {
                territorySelected.push(this.territorylist[index]['territoryID']);
            }
        }
        
        
        const networkSelected = [];
        for (let index = 0; index < this.distributionList.length; index++) {
            if(this.distributionList[index].checked  && !this.distributionList[index].disabled) {
                networkSelected.push({networkId: this.distributionList[index]['networkId'], territoryId: this.distributionList[index]['territoryId']});
            }
        }
        
        updatedSalesArr['networks'] = networkSelected;
        
        if(this.salesdata.role == '8' || this.salesdata.role == '7' || this.salesdata.role == '6') {
            
            const salesHierarchies = [];
            for (let index = 0; index < this.juniorList.length; index++) {
                
                if(this.juniorList[index].check) {
                    salesHierarchies.push({juniorUserID : this.juniorList[index].userId});
                }
            }
            
            updatedSalesArr['saleHierarchies'] = salesHierarchies;
        }
        
        
        if(this.salesdata.role != '6') {
            updatedSalesArr['territories'] = territorySelected;
        }
        
        
        updatedSalesArr['staffSegments'] = segmentSelected;
        
        console.log(updatedSalesArr);
        
        this.loader = true;
        
        updatedSalesArr['staffSegmentsModified'] = true;
        updatedSalesArr['salesHeirarchyModified'] = true;
        updatedSalesArr['territoriesModified'] = true;
        updatedSalesArr['networksModified'] = true;
        
        
        this.db.fetchData(updatedSalesArr,'user/update').subscribe((response)=>{
            console.log(response);
            this.loader=false;
            this.message=response['message'];
            this.editAssignedDiv = false;
            if(this.message=="User updated successfully")
            {
                this.toast.openSucess('Updated successfully','');
                this.staffSegments=[];
                this.salesuserdetail();
            }
            else
            {
                this.toast.openError('Something went wrong Please Try Again!!','');
            }
        });
    }
    
    
    updateTerritory() {
        
        this.salesdata.territories=this.territory;
        this.salesdata.landline="9050801272";
        this.salesdata.country="string";
        
        this.db.fetchData(this.salesdata,'user/update').subscribe((response)=>{
            
            console.log(response);
            this.loader=false;
            this.message=response['message'];
            if(this.message=="User updated successfully")
            {
                this.toast.openSucess('Updated successfully','');
            }
            else
            {
                this.toast.openError('Something went wrong Please Try Again!!','');
            }
        });
    }
    
    
    toggleterritory(key,action)
    {
        console.log(action);
        console.log(key);
        
        if(action == 'open')
        { 
            this.active[key] = true; 
        }
        
        if(action == 'close')
        { 
            this.active[key] = false;
        }
        
        console.log(this.active);
    }
    
    openDialog() {
        const dialogRef = this.dialog.open(AddressModalComponent,{width: '768px', data: this.salesdata});
        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            this.salesuserdetail();
        });
    }
    
    openEmail(check) {
        
        this.salesdata.type=check;
        console.log(check);
        const dialogRef = this.dialog.open(EmailModalComponent,{ width: '520px', data:this.salesdata});
        dialogRef.afterClosed().subscribe(result => {
            this.salesuserdetail();
        });
    }
    
    updatepassword() {
        
        console.log('pass');
        this.db.fetchData({"userId": this.id,"password":this.account_form.password},'account/changepassword')
        .subscribe((response)=>{ console.log(response)
            this.message=response['message'];
            console.log(this.message);
            if(this.message=="Your password has been changed successfully!")
            {
                this.toast.openSucess('Your password has been changed successfully!','');
            }
            else
            {
                this.toast.openError('Something Went Wrong Please Try Again!!','');
            }
        });
    }
    
    
    lead_list() {
        
        this.loader = true;
        
        this.senddata = {"userId":this.id,"currentPage": 1,"pageSize": 50,'status':'2','leadType':12, 'isActive':true};
        
        this.db.fetchData(this.senddata,'lead/list').subscribe((response)=>{
            
            console.log(response);
            this.loader=false;
            this.leadlist=response['data'];
            
            
            for (let index = 0; index < this.leadlist.length; index++) {
                
                let segmentStr = '';
                for (let index1 = 0; index1 < this.leadlist[index]['leadSegments'].length; index1++) {
                    
                    if(index1 == 0) {
                        segmentStr = this.leadlist[index]['leadSegments'][index1].segment;
                    } else {
                        
                        segmentStr += ', ' + this.leadlist[index]['leadSegments'][index1].segment;
                    }
                }
                
                this.leadlist[index].segmentStr = segmentStr;
                
            }
            
        });
    }
    
    
    orderList:any = [];
    getOrderList() {
        
        this.loader = true;
        
        const senddata={"userId":this.id,"currentPage": 1,"pageSize": 50};
        
        this.db.fetchData(senddata,'order/list').subscribe((response)=>{
            
            console.log(response);
            // this.orderActive=true;
            
            this.orderList = response['data'];
            
            this.loader=false;
            
        });
        
    }
    
    
    trvelPlanLIst:any = [];
    getTravelList()
    {
        this.loader=true;
        
        const monthArr = [{monthId:1, monthName: 'January'},
        {monthId:2, monthName: 'February'},
        {monthId:3, monthName: 'March'},
        {monthId:4, monthName: 'April'},
        {monthId:5, monthName: 'May'},
        {monthId:6, monthName: 'June'},
        {monthId:7, monthName: 'July'},
        {monthId:8, monthName: 'Augest'},
        {monthId:9, monthName: 'September'},
        {monthId:10, monthName: 'October'},
        {monthId:11, monthName: 'November'},
        {monthId:12, monthName: 'December'}]
        
        this.db.fetchData({"userId":this.id,"currentPage": 1,"pageSize": 50},"travelplan/list").subscribe((result)=>{
            
            console.log(result);
            
            this.trvelPlanLIst = result['data'];
            
            
            for (let index = 0; index < this.trvelPlanLIst.length; index++) {
                
                
                const indexExist = monthArr.findIndex(row => row.monthId == this.trvelPlanLIst[index].month);
                
                this.trvelPlanLIst[index].monthName = monthArr[indexExist].monthName;
                
            }
            
            
            setTimeout (() => {
                this.loader=false;
            }, 700);
            
        })
    }
    
    
    
    expenseList:any = [];
    getExpenseList()
    {
        this.loader=true;
        this.db.fetchData({"userId": this.id,"currentPage": 1,"pageSize": 50},"expense/list").subscribe((result)=>{
            
            console.log(result);
            this.loader=false;
            this.expenseList=result['data'];
            
        })
    }
    
    
    orderDetail(index)
    {
        if(this.orderList[index].dealerStatus==1)
        {
            console.log("router work");
            this.router.navigate(['edit-order/'+this.orderList[index].orderId])
        }
        if(this.orderList[index].dealerStatus==2 || this.orderList[index].dealerStatus==3)
        {
            this.router.navigate(['order-detail/'+this.orderList[index].orderId])
        }
    }
    
    
    checkInList:any = [];;
    getCheckinList()
    {
        
        this.loader=true;
        
        const requesData={"userId":this.id, "currentPage": 1,
        "pageSize": 500}
        
        this.db.fetchData(requesData,'activity/list').subscribe((response)=>{
            
            console.log(response);
            this.checkInList=response['data'];
            this.loader=false;
        });
    }
    
    
    
    tmp_concern:any = [];
    concernList:any = [];
    
    getConcernList() {
        
        this.loader = true;
        
        this.db.fetchData( {"currentPage": 1,
        "pageSize": 500, concernStatuses: [3,4,5,6], createdBy:this.id},'concern/list').subscribe((response)=>{
            console.log(response)
            this.loader=false;
            
            this.concernList = response['data'];
            
            
            for (let index = 0; index < this.concernList.length; index++) {
                
                let totalQty = 0;
                let totalAmount = 0;
                
                for (let index1 = 0; index1 < this.concernList[index]['productConcerns'].length; index1++) {
                    
                    if(this.concernList[index]['productConcerns'][index1].qunatity) {
                        totalQty += this.concernList[index]['productConcerns'][index1].qunatity;
                    }
                    
                    totalAmount += this.concernList[index]['productConcerns'][index1].netAmount;
                }
                
                this.concernList[index].totalQty = totalQty;
                this.concernList[index].totalAmount = totalAmount;
                
            }
            
            
            
            
            if(response['status']=='Failed')
            {
                // this.div=true;
                // this.concernList=[];
                // this.tmp_concern=this.concernList
            }
            
            console.log(this.concernList);
            console.log(this.tmp_concern);
            
        })
    }
    
    
    
}
