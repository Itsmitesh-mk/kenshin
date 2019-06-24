import { Component, OnInit, Renderer2, ViewChild, Inject, ElementRef, PLATFORM_ID } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { ConstantService } from '../../constant.service';
import { SnackBarOverview } from 'src/app/toast';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogComponent } from 'src/app/dialog';
import { isPlatformBrowser } from '@angular/common';
import * as $ from 'jquery';
import { throwMatDialogContentAlreadyAttachedError } from '@angular/material';

@Component({
    selector: 'app-user-add',
    templateUrl: './user-add.component.html',
    animations: [slideToTop()]
})

export class UserAddComponent implements OnInit {
    sales_data:any={};
    staffSegments:any=[];
    r:any=1;
    users_territory:any=[];
    userTerritories:any=[];
    system_data:any={};
    user_type:any={};
    rolelists:any=[];
    rolelistsales1:any=[];
    rolelistsystem1:any=[];
    segmentlist:any=[];
    statelist:any=[];
    st:any=[];
    districtlist:any=[];
    districtlistOffice:any=[];
    district1:any=[];
    districtOffice1:any=[];
    citylist:any=[];
    citylistOffice:any=[];
    districts1:any=[];
    districtsOffice1:any=[];
    districts2:any=[];
    districtsOffice2:any=[];
    cities1:any=[];
    areas:any=[];
    cities:any=[];
    citiesOffice:any=[];
    areasOffice:any=[];
    citiesOffice1:any=[];
    
    networkIdsdata:any=[];
    networkIds:any=[];
    territoryList:any=[];
    placeholder:any;
    document=[];
    message:any;
    juniorList:any=[];
    loader:boolean;
    saleHierarchies:any=[];
    
    isModuleSelected:any=true;
    
    disabledTerritories:any = [];
    disabledNetwork:any = [];
    selectedTempArr:any = [];
    
    step:any = 0;
    
    moduleData = [{ moduleId: '1', moduleName: 'Lead', view: false, moduleRights: [
        {name: 'Add', checked: false},
        {name: 'Edit', checked: false},
        {name: 'Delete', checked: false}]
    },
    
    { moduleId: '2', moduleName: 'Distribution Network', view: false, moduleRights: [
        {name: 'Add', checked: false},
        {name: 'Edit', checked: false},
        {name: 'Delete', checked: false}]
    },
    
    { moduleId: '3',moduleName: 'Task', view: false,  moduleRights: [
        {name: 'Add', checked: false},
        {name: 'Edit', checked: false},
        {name: 'Delete', checked: false}]
    },
    
    { moduleId: '4', moduleName: 'Order', view: false, moduleRights: [
        {name: 'Add', checked: false},
        {name: 'Edit', checked: false},
        {name: 'Delete', checked: false}]
    },
    
    
    { moduleId: '5', moduleName: 'Travel Plan', view: false, moduleRights: [
        {name: 'Add', checked: false},
        {name: 'Edit', checked: false},
        {name: 'Delete', checked: false}]
    },
    
    { moduleId: '6', moduleName: 'Expense', view: false, moduleRights: [
        {name: 'Add', checked: false},
        {name: 'Edit', checked: false},
        {name: 'Delete', checked: false}]
    },
    
    { moduleId: '7', moduleName: 'Product Concern', view: false, moduleRights: [
        {name: 'Add', checked: false},
        {name: 'Edit', checked: false},
        {name: 'Delete', checked: false}]
    },
    { moduleId: '15', moduleName: 'Other Concern', view: false, moduleRights: [ 
        {name: 'Add', checked: false},
        {name: 'Edit', checked: false},
        {name: 'Delete', checked: false}]
    },
    { moduleId: '8', moduleName: 'Checkin', view: false, moduleRights: [
        {name: 'Add', checked: false},
        {name: 'Edit', checked: false},
        {name: 'Delete', checked: false}]
    },
    
    { moduleId: '9', moduleName: 'Followup', view: false, moduleRights: [ 
        {name: 'Add', checked: false},
        {name: 'Edit', checked: false},
        {name: 'Delete', checked: false}]
    },
    { moduleId: '11', moduleName: 'Sales Leave', view: false, moduleRights: [ 
        {name: 'Add', checked: false},
        {name: 'Edit', checked: false},
        {name: 'Delete', checked: false}]
    },
    { moduleId: '12', moduleName: 'Pop & Gift Order', view: false, moduleRights: [ 
        {name: 'Add', checked: false},
        {name: 'Edit', checked: false},
        {name: 'Delete', checked: false}]
    },
    { moduleId: '13', moduleName: 'Schemes', view: false, moduleRights: [ 
        {name: 'Add', checked: false},
        {name: 'Edit', checked: false},
        {name: 'Delete', checked: false}]
    },
    { moduleId: '14', moduleName: 'Vendors', view: false, moduleRights: [ 
        {name: 'Add', checked: false},
        {name: 'Edit', checked: false},
        {name: 'Delete', checked: false}]
    }
    
];

masterArray = [{ moduleId: '16', moduleName: 'Product', view: false, moduleRights: [
    {name: 'Add', checked: false},
    {name: 'Edit', checked: false},
    {name: 'Delete', checked: false}]
},

{ moduleId: '17', moduleName: 'User', view: false, moduleRights: [
    {name: 'Add', checked: false},
    {name: 'Edit', checked: false},
    {name: 'Delete', checked: false}]
},

{ moduleId: '18',moduleName: 'Territories', view: false,  moduleRights: [
    {name: 'Add', checked: false},
    {name: 'Edit', checked: false},
    {name: 'Delete', checked: false}]
},

{ moduleId: '19', moduleName: 'Marketing', view: false, moduleRights: [
    {name: 'Add', checked: false},
    {name: 'Edit', checked: false},
    {name: 'Delete', checked: false}]
},


{ moduleId: '20', moduleName: 'Leaves & Holiday', view: false, moduleRights: [
    {name: 'Add', checked: false},
    {name: 'Edit', checked: false},
    {name: 'Delete', checked: false}]
},

{ moduleId: '21', moduleName: 'Announcement', view: false, moduleRights: [
    {name: 'Add', checked: false},
    {name: 'Edit', checked: false},
    {name: 'Delete', checked: false}]
},

{ moduleId: '22', moduleName: 'Allowance', view: false, moduleRights: [
    {name: 'Add', checked: false},
    {name: 'Edit', checked: false},
    {name: 'Delete', checked: false}]
}
];

designationData:any=[];
userAssignedTerriotories:any = [];

constructor(public db:ConstantService,
    public toast: SnackBarOverview, 
    public router:Router, 
    public route:ActivatedRoute,
    private renderer: Renderer2,
    public alrt:DialogComponent,
    @Inject(PLATFORM_ID) private platformId: Object) { 
        
        
        this.designationData = [
            
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
        
        
        this.getDesignationList();
    }
    
    
    ngOnInit() {
        
        this.rolelist();
        this.getAllSegment();
        this.get_state();
        
        this.sales_data.concernApprovalAccess = false;
        
        this.renderer.removeClass(document.body, 'nav-active');
    }
    
    selectAllHandler(event) 
    {
        if(event.checked)
        {
            for (let index = 0; index< this.masterArray.length; index++)
            {
                this.masterArray[index].view=true;
            }
        }
        else
        {
            for (let index = 0; index< this.masterArray.length; index++)
            {
                this.masterArray[index].view=false;
            }
        }
        
    }
    
    
    setStep(index: number) {
        this.step = index;
    }
    
    nextStep() {
        this.step++;
    }
    
    prevStep() {
        this.step--;
    }
    
    
    setFocus(form) {
        
        console.log(form.controls);
        
        for (var key in form.controls)
        {
            
            if (form.controls.hasOwnProperty(key)) {
                if(form.controls[key].status=='INVALID')
                {
                    if (isPlatformBrowser(this.platformId)) {
                        $('#'+key).focus();
                        
                    }
                    
                    console.log(key);
                    return true;
                    
                }
                console.log(key + " -> " + form.controls[key].status);
            }
        }
    }
    
    desginationList:any=[];
    getDesignationList()
    {
        this.db.fileData("","designation/list").subscribe((result)=>{
            console.log(result);
            if(result['status']=='Success')
            {
                this.desginationList=result['data'];                
            }
        })
    }
    
    seniorUserDesignation:any=[];
    filterDesignaton(id)
    {
        for(let i=0;i<this.desginationList.length;i++)
        {
            if(this.desginationList[i].order<id)
            {
                this.seniorUserDesignation.push(this.desginationList[i]);
            }
        }
        
    }
    
    userList:any=[];
    seniorUserList(designationOrder)
    {
        console.log(designationOrder);
        
        this.loader=true;
        this.db.fetchData({'userType': 1, 'currentPage': 1,'pageSize': 200},"user/list").subscribe((result)=>{
            console.log(result);
            this.loader=false
            if(result['status']=='Success')
            {
                const userArray=result['data'];
                this.userList=userArray.filter(row=>row.designation==designationOrder);
            }
        })
    }
    
    rolelist() {
        
        this.db.fileData('','usertype/list').subscribe((response)=>{
            console.log(response);
            if(response['status']=='Success')
            {
                this.rolelists=response['data'];
                let filterrolesales= this.rolelists.filter(x => x.userTypeId==2);
                this.rolelistsales1=filterrolesales[0].roles;
                let filterrolesystem= this.rolelists.filter(x => x.userTypeId==1);
                this.rolelistsystem1=filterrolesystem[0].roles;
                
                for(let i=0;i<this.rolelistsystem1.length;i++)
                {
                    this.rolelistsystem1[i].userType=1;
                }
                for(let j=0;j<this.rolelistsales1.length;j++)
                {
                    this.rolelistsales1[j].userType=2;
                }
                for(let i=0;i<this.rolelistsales1.length;i++){
                    if(this.rolelistsales1[i]['roleId']!=9){
                        this.rolelistsystem1.push(this.rolelistsales1[i]);}
                    }
                    console.log(this.rolelistsales1);
                    console.log(this.rolelistsystem1);
            }
            
            });
        }
        
        setplaceholder() {
            
            if(this.user_type.role==6){
                this.placeholder="Select RSM";
            } else if( this.user_type.role==7) { 
                
                this.placeholder="Select ASM"; 
                
            }else{
                this.placeholder="Select T. I."; 
            }
            
        }
        
        role:any={};
        
        roles(userType) {
            
            this.user_type.type=userType;
            if(this.user_type.type == 2) {
                
                for (let index = 0; index < this.segmentlist.length; index++) {
                    this.segmentlist[index].checked = false;
                }
                
                this.juniorList = [];
                this.territoryList = [];
                this.networkIdsdata = [];
            }
            
            console.log(this.user_type);
        }
        
        
        saveUserSelectedDetail() {
            
            this.selectedTempArr['segmentSelected'] = [];
            for (let index = 0; index < this.segmentlist.length; index++) {
                
                if(this.segmentlist[index].checked) {
                    this.selectedTempArr['segmentSelected'].push(this.segmentlist[index].text);
                }
            }
            
            this.selectedTempArr['userSelected'] = [];
            for (let index = 0; index < this.juniorList.length; index++) {
                
                if(this.juniorList[index].checked) {
                    this.selectedTempArr['userSelected'].push(this.juniorList[index].userId);
                }
            }
            
            this.selectedTempArr['territorySelected'] = [];
            for (let index = 0; index < this.territoryList.length; index++) {
                
                if(this.territoryList[index].check && !this.territoryList[index].disabled) {
                    this.selectedTempArr['territorySelected'].push({territoryID: this.territoryList[index].territoryID, disabled: false});
                }
                
                if(this.territoryList[index].check && this.territoryList[index].disabled) {
                    this.selectedTempArr['territorySelected'].push({territoryID: this.territoryList[index].territoryID, disabled: true});
                }
            }
            
            this.selectedTempArr['networkSelected'] = [];
            for (let networkIndex = 0; networkIndex < this.networkIdsdata.length; networkIndex++) {
                
                if(this.networkIdsdata[networkIndex].checked && !this.networkIdsdata[networkIndex].disabled) {
                    
                    this.selectedTempArr['networkSelected'].push({networkId: this.networkIdsdata[networkIndex].networkId, disabled: false });
                }
                
                if(this.networkIdsdata[networkIndex].checked && this.networkIdsdata[networkIndex].disabled) {
                    
                    this.selectedTempArr['networkSelected'].push({networkId: this.networkIdsdata[networkIndex].networkId, disabled: true });
                }
            }
            
            console.log(this.selectedTempArr['segmentSelected']);
            console.log(this.selectedTempArr['territorySelected']);
            console.log(this.selectedTempArr['networkSelected']);
        }
        
        
        
        getSegmentRelatedData() {
            
            this.saveUserSelectedDetail();
            console.log(this.selectedTempArr);
            
            if(this.selectedTempArr['segmentSelected'].length > 0) {
                
                if(this.user_type.role==10) {
                    this.getTerritoryData();
                }
                
                if(this.user_type.role==8 || this.user_type.role==7 || this.user_type.role==6) {
                    this.getUserDataToAssign();
                    this.getTerritoryData();
                }
                
            } else {
                
                this.juniorList= [];
                this.territoryList = [];
                this.networkIdsdata = [];
            }
            
        }
        
        
        getUserDataToAssign() {
            
            if(this.user_type.role==8) {
                this.role = parseInt(this.user_type.role) + 2;
            } else {
                this.role = parseInt(this.user_type.role) + 1;
            }
            
            this.loader = true;
            
            console.log(this.role);
            
            this.db.fetchData({
                'role':this.role,
                'segments': this.selectedTempArr['segmentSelected'],
                'currentPage': 1,
                'pageSize': 200 },'user/list').subscribe((response) => {
                    
                    this.loader = false;
                    
                    console.log(response);
                    if(response['status']=='Success')
                    {
                        this.juniorList = response['data'];
                        
                        for (let index = 0; index < this.juniorList.length; index++) {
                            
                            const indexExist = this.selectedTempArr['userSelected'].findIndex(juniorId => juniorId == this.juniorList[index].userId);
                            
                            if(indexExist != -1) {
                                
                                this.juniorList[index].checked = true;
                                this.onUserAssignedHandler(this.juniorList[index].userId, true);
                            }
                        }
                    }
                    
                    
                    console.log(this.juniorList);
                });
                
            }
            
            userAssignedDefaultSelectedHandler() {
                
                for (let index = 0; index < this.juniorList.length; index++) {
                    
                    if(this.juniorList[index].checked) {
                        
                        
                        
                    }
                }
            }
            
            
            onUserAssignedHandler(userId, isChecked) {
                
                console.log('hello ' + userId + ', ' + isChecked);
                
                if(isChecked) {
                    
                    this.saveUserSelectedDetail();
                    
                    this.db.fileData('', 'user/detail/' + userId).subscribe((response) => {
                        
                        console.log(response);
                        
                        if(response['status']=='Success')
                        {
                            const assignData = response['data']['staffWithJuniors'];
                            
                            const userAssignedTerritories = [];
                            for (let territoryIndex = 0; territoryIndex < assignData['userTerritories'].length; territoryIndex++) {
                                
                                userAssignedTerritories.push({territoryID : assignData['userTerritories'][territoryIndex]['territoryId']})
                                
                            }
                            
                            for (let juIndex1 = 0; juIndex1 < assignData['juniors'].length; juIndex1++) {
                                
                                for (let juTerrIndex1 = 0; juTerrIndex1 < assignData['juniors'][juIndex1]['userTerritories'].length; juTerrIndex1++) {
                                    
                                    const isIndexExist = userAssignedTerritories.findIndex(row => row.territoryID == assignData['juniors'][juIndex1]['userTerritories'][juTerrIndex1]['territoryId']);
                                    
                                    if(isIndexExist == -1) {
                                        
                                        userAssignedTerritories.push({territoryID : assignData['juniors'][juIndex1]['userTerritories'][juTerrIndex1]['territoryId']})
                                    }
                                    
                                    
                                    for (let juIndex2 = 0; juIndex2 < assignData['juniors'][juIndex1]['juniors'].length; juIndex2++) {
                                        
                                        
                                        for (let juTerrIndex2 = 0; juTerrIndex2 < assignData['juniors'][juIndex1]['juniors'][juIndex2]['userTerritories'].length; juTerrIndex2++) {
                                            
                                            
                                            const isIndexExist = userAssignedTerritories.findIndex(row => row.territoryID == assignData['juniors'][juIndex1]['juniors'][juIndex2]['userTerritories'][juTerrIndex2]['territoryId']);
                                            
                                            
                                            if(isIndexExist == -1) {
                                                
                                                userAssignedTerritories.push({territoryID : assignData['juniors'][juIndex1]['juniors'][juIndex2]['userTerritories'][juTerrIndex2]['territoryId']});
                                                
                                            }
                                            
                                            for (let juIndex3 = 0; juIndex3 < assignData['juniors'][juIndex1]['juniors'][juIndex2]['juniors'].length; juIndex3++) {
                                                
                                                for (let juTerrIndex3 = 0; juTerrIndex3 < assignData['juniors'][juIndex1]['juniors'][juIndex2]['juniors'][juIndex3]['userTerritories'].length; juTerrIndex3++) {
                                                    
                                                    const isIndexExist = userAssignedTerritories.findIndex(row => row.territoryID ==  assignData['juniors'][juIndex1]['juniors'][juIndex2]['juniors'][juIndex3]['userTerritories'][juTerrIndex3]['territoryId']);
                                                    
                                                    
                                                    if(isIndexExist == -1) {
                                                        
                                                        userAssignedTerritories.push({territoryID : assignData['juniors'][juIndex1]['juniors'][juIndex2]['juniors'][juIndex3]['userTerritories'][juTerrIndex3]['territoryId']});
                                                        
                                                    }
                                                }
                                            }
                                        } 
                                    }
                                }
                            }
                            
                            
                            const userAssignedNetwork = [];
                            for (let networkIndex = 0; networkIndex < assignData['salesUserNetworks'].length; networkIndex++) {
                                
                                userAssignedNetwork.push({networkId : assignData['salesUserNetworks'][networkIndex]['networkId']});
                            }
                            
                            
                            for (let juIndex1 = 0; juIndex1 < assignData['juniors'].length; juIndex1++) {
                                
                                for (let juNetIndex1 = 0; juNetIndex1 < assignData['juniors'][juIndex1]['salesUserNetworks'].length; juNetIndex1++) {
                                    
                                    const isIndexExist = userAssignedNetwork.findIndex(row => row.networkId == assignData['juniors'][juIndex1]['salesUserNetworks'][juNetIndex1]['networkId']);
                                    
                                    if(isIndexExist == -1) {
                                        
                                        userAssignedNetwork.push({networkId : assignData['juniors'][juIndex1]['salesUserNetworks'][juNetIndex1]['networkId']})
                                    }
                                    
                                    
                                    for (let juIndex2 = 0; juIndex2 < assignData['juniors'][juIndex1]['juniors'].length; juIndex2++) {
                                        
                                        
                                        for (let juNetIndex2 = 0; juNetIndex2 < assignData['juniors'][juIndex1]['juniors'][juIndex2]['salesUserNetworks'].length; juNetIndex2++) {
                                            
                                            
                                            const isIndexExist = userAssignedNetwork.findIndex(row => row.networkId == assignData['juniors'][juIndex1]['juniors'][juIndex2]['salesUserNetworks'][juNetIndex2]['networkId']);
                                            
                                            
                                            if(isIndexExist == -1) {
                                                
                                                userAssignedNetwork.push({networkId : assignData['juniors'][juIndex1]['juniors'][juIndex2]['salesUserNetworks'][juNetIndex2]['networkId']});
                                                
                                            }
                                            
                                            for (let juIndex3 = 0; juIndex3 < assignData['juniors'][juIndex1]['juniors'][juIndex2]['juniors'].length; juIndex3++) {
                                                
                                                for (let juNetIndex3 = 0; juNetIndex3 < assignData['juniors'][juIndex1]['juniors'][juIndex2]['juniors'][juIndex3]['salesUserNetworks'].length; juNetIndex3++) {
                                                    
                                                    const isIndexExist = userAssignedNetwork.findIndex(row => row.networkId ==  assignData['juniors'][juIndex1]['juniors'][juIndex2]['juniors'][juIndex3]['salesUserNetworks'][juNetIndex3]['networkId']);
                                                    
                                                    
                                                    if(isIndexExist == -1) {
                                                        
                                                        userAssignedNetwork.push({networkId : assignData['juniors'][juIndex1]['juniors'][juIndex2]['juniors'][juIndex3]['salesUserNetworks'][juNetIndex3]['networkId']});
                                                        
                                                    }
                                                }
                                            }
                                        } 
                                    }
                                }
                            }
                            
                            
                            console.log(userAssignedTerritories);
                            console.log(userAssignedNetwork);
                            
                            for (let index = 0; index < userAssignedTerritories.length; index++) {
                                
                                const isTerrIndexExist = this.selectedTempArr['territorySelected'].findIndex(row => row.territoryID == userAssignedTerritories[index].territoryID);
                                
                                if(isTerrIndexExist == -1) {
                                    
                                    this.selectedTempArr['territorySelected'].push({territoryID : userAssignedTerritories[index].territoryID, disabled: true});
                                    
                                }  else {
                                    
                                    this.selectedTempArr['territorySelected'][isTerrIndexExist].disabled = true;
                                }
                            }
                            
                            
                            for (let index = 0; index < userAssignedNetwork.length; index++) {
                                
                                const isNetworkIndexExist = this.selectedTempArr['networkSelected'].findIndex(row => row.networkId == userAssignedNetwork[index].networkId);
                                
                                if(isNetworkIndexExist == -1) {
                                    
                                    this.selectedTempArr['networkSelected'].push({networkId : userAssignedNetwork[index].networkId, disabled: true});
                                    
                                } else {
                                    
                                    this.selectedTempArr['networkSelected'][isNetworkIndexExist]['disabled'] = true;
                                }
                            }
                            
                            console.log(this.selectedTempArr['networkSelected']);
                            
                            
                            for (let territoryIndex = 0; territoryIndex < this.territoryList.length; territoryIndex++) {
                                
                                const isExist = this.selectedTempArr['territorySelected'].findIndex(row => row.territoryID == this.territoryList[territoryIndex].territoryID);
                                
                                if(isExist != -1) {
                                    
                                    this.territoryList[territoryIndex].check = true;
                                    this.territoryList[territoryIndex].disabled = this.selectedTempArr['territorySelected'][isExist].disabled;
                                    
                                    this.getTerritoryNetwork(this.territoryList[territoryIndex].territoryID, true);
                                }
                            }
                        }
                        
                    });
                    
                    
                } else {
                    
                    for (let index = 0; index < this.territoryList.length; index++) {
                        
                        this.territoryList[index].check = false;
                        this.territoryList[index].disabled = false;
                    }
                    
                    this.getSegmentRelatedData();
                }
            }
            
            
            getTerritoryData() {
                
                this.networkIdsdata = [];
                
                this.loader=true;
                
                this.db.fetchData({'segments': this.selectedTempArr['segmentSelected']},'territory/list').subscribe((response)=>{
                    
                    console.log(response);
                    this.loader=false;
                    
                    if(response['status']=='Success')
                    
                    {
                        this.territoryList= response['data'];
                        
                        for (let index = 0; index < this.territoryList.length; index++) {
                            
                            const indexExist = this.selectedTempArr['territorySelected'].findIndex(row => row.territoryID == this.territoryList[index].territoryID);
                            
                            if(indexExist != -1) {
                                
                                this.territoryList[index].check = true;
                                this.territoryList[index].disabled =  this.selectedTempArr['territorySelected'][indexExist].disabled;
                                
                                this.getTerritoryNetwork(this.territoryList.territoryID, true);
                            }
                        }
                    }
                    
                    console.log(this.territoryList);
                    
                });
            }
            
            
            
            getTerritoryNetwork(id, isChecked) {
                
                console.log(id,isChecked);
                
                // this.saveUserSelectedDetail();
                console.log(this.selectedTempArr);
                
                if(isChecked) {
                    
                    this.loader=true;
                    
                    this.db.fileData('','territory/detail/'+id).subscribe((response)=>{
                        
                        console.log(response);
                        this.loader=false;
                        
                        if(!response['data']['territoryNetworks']) {
                            response['data']['territoryNetworks'] = [];
                        }
                        
                        for (let territoryIndex = 0; territoryIndex < response['data']['territoryNetworks'].length; territoryIndex++) {
                            
                            let networkSegmentMatch = false;
                            for (let segmentIndex = 0; segmentIndex < response['data']['territoryNetworks'][territoryIndex].networkSegments.length; segmentIndex++) {
                                
                                console.log(response['data']['territoryNetworks'][territoryIndex].networkSegments);
                                
                                console.log(this.selectedTempArr);
                                
                                const segmentExistIndex = this.selectedTempArr['segmentSelected'].findIndex(segment => segment == response['data']['territoryNetworks'][territoryIndex].networkSegments[segmentIndex].segment);
                                
                                if(segmentExistIndex != -1) {
                                    networkSegmentMatch =true;
                                }
                            }
                            
                            
                            if(networkSegmentMatch) {
                                
                                const indexExist = this.networkIdsdata.findIndex(row => row.networkId == response['data']['territoryNetworks'][territoryIndex].networkId);
                                
                                if(indexExist == -1) {
                                    
                                    response['data']['territoryNetworks'][territoryIndex].territoryArr = [];
                                    
                                    response['data']['territoryNetworks'][territoryIndex].territoryArr.push(response['data'].territoryID);
                                    
                                    this.networkIdsdata.push(response['data']['territoryNetworks'][territoryIndex]);
                                    
                                } else {
                                    
                                    this.networkIdsdata[indexExist].territoryArr.push(response['data'].territoryID);
                                }
                            }
                        }
                        
                        
                        for (let networkIndex = 0; networkIndex < this.networkIdsdata.length; networkIndex++) {
                            
                            const isIndexExist = this.selectedTempArr['networkSelected'].findIndex(row  => row.networkId == this.networkIdsdata[networkIndex].networkId);
                            
                            if(isIndexExist != -1) {
                                
                                this.networkIdsdata[networkIndex].checked = true;
                                this.networkIdsdata[networkIndex].disabled = this.selectedTempArr['networkSelected'][isIndexExist].disabled;
                            }
                        }
                        
                        console.log(this.networkIdsdata);
                        
                    });
                    
                } else {
                    
                    for (let networkIndex = 0; networkIndex < this.networkIdsdata.length; networkIndex++) {
                        const indexExist =  this.networkIdsdata[networkIndex].territoryArr.findIndex(territoryId=> territoryId == id);
                        
                        if(indexExist != -1) {
                            
                            if(this.networkIdsdata[networkIndex].territoryArr.length > 1) {
                                
                                const territoryIndex = this.networkIdsdata[networkIndex].territoryArr.findIndex(val => val == id);
                                
                                this.networkIdsdata[networkIndex].territoryArr.splice(territoryIndex, 1);
                                
                            } else {
                                
                                this.networkIdsdata.splice(networkIndex, 1);
                            }
                        }
                    }
                }
            }
            
            
            ///////////segment list start////////////
            getAllSegment(){
                
                this.db.fileData('','segment/list/').subscribe((response)=>{
                    console.log(response);
                    this.segmentlist=response['data'];
                });
            }
            
            ///////state list start//////////////////
            tmpstateList:any=[];
            get_state(){
                
                this.loader=true;
                this.db.fileData('','state/list/').subscribe((response)=>{
                    console.log(response);
                    this.loader=false
                    this.statelist=response['data'];
                    this.tmpstateList=this.statelist;
                    
                });
            }
            
            
            tmpofficedistrict:any=[];
            get_districtOffice(){
                this.sales_data.districtOffice='';
                this.sales_data.cityOffice='';
                this.sales_data.pinOffice='';
                if(this.user_type.type=='2'){
                    this.loader=true;
                    this.st=Array(this.sales_data.statef)
                    this.db.fetchData(this.st,'district/list/').subscribe((response)=>{
                        console.log(response);
                        this.loader=false;
                        this.districtlistOffice=response['data'];
                        this.districtOffice1=this.districtlistOffice[0].distrcits;
                        this.tmpofficedistrict=this.districtOffice1;
                    });
                }
            }
            
            tmpdistrictList:any=[];
            get_district(){
                if(this.user_type.type=='2'){
                    this.loader=true;
                    this.sales_data.district='';
                    this.sales_data.pin='';
                    this.sales_data.city='';
                    this.st=Array(this.sales_data.state)
                    this.db.fetchData(this.st,'district/list/').subscribe((response)=>{
                        this.loader=false;
                        console.log(response);
                        this.districtlist=response['data'];
                        this.district1=this.districtlist[0].distrcits;
                        this.tmpdistrictList=this.district1;
                        
                    });
                }
                else{
                    this.loader=true;
                    this.system_data.district='';
                    this.system_data.pin='';
                    this.system_data.city='';
                    console.log(this.system_data.state);
                    this.st=Array(this.system_data.state)
                    this.db.fetchData(this.st,'district/list/').subscribe((response)=>{
                        console.log(response);
                        this.loader=false;
                        this.districtlist=response['data'];
                        this.district1=this.districtlist[0].distrcits;
                        this.tmpdistrictList=this.district1;
                    });
                }
                
                
                console.log(this.tmpdistrictList);
                
            }
            /////////////////city list start///////////
            tmpofficecitylist:any=[];
            get_cityOffice(){
                this.loader=true;
                this.sales_data.cityOffice='';
                this.sales_data.pinOffice='';
                console.log(this.sales_data.statef,this.sales_data.districtOffice);
                console.log(this.sales_data.districtOffice);
                this.db.fetchData(Array({"stateName":this.sales_data.statef,"distrcits":Array({"districtName":this.sales_data.districtOffice})}),'city/list').subscribe((response)=>{
                    console.log(response);
                    this.loader=false;
                    this.citylistOffice=response['data'];
                    this.districtsOffice1=this.citylistOffice[0].distrcits;
                    this.citiesOffice=this.districtsOffice1[0].cities;
                    this.tmpofficecitylist=this.citiesOffice;
                    console.log(this.citiesOffice);
                });
            }
            tmpcityList:any=[];
            get_city(){
                if(this.user_type.type=='2'){
                    this.loader=true;
                    this.sales_data.city='';
                    this.sales_data.pin='';
                    console.log(this.sales_data.state,this.sales_data.district);
                    console.log(this.sales_data.district);
                    this.db.fetchData(Array({"stateName":this.sales_data.state,"distrcits":Array({"districtName":this.sales_data.district})}),'city/list').subscribe((response)=>{
                        console.log(response);
                        this.loader=false;
                        this.citylist=response['data'];
                        this.districts1=this.citylist[0].distrcits;
                        this.cities=this.districts1[0].cities;
                        this.tmpcityList=this.cities;
                        console.log(this.cities);
                    });
                }
                else{
                    this.loader=true;
                    this.system_data.city='';
                    this.system_data.pin='';
                    console.log(this.system_data.state,this.system_data.district);
                    console.log(this.system_data.district);
                    this.db.fetchData(Array({"stateName":this.system_data.state,"distrcits":Array({"districtName":this.system_data.district})}),'city/list').subscribe((response)=>{
                        console.log(response);
                        this.loader=false;
                        this.citylist=response['data'];
                        this.districts1=this.citylist[0].distrcits;
                        this.cities=this.districts1[0].cities;
                        this.tmpcityList=this.cities;
                        console.log(this.cities);
                    });
                }
            }
            ///////////////// pincode list start///////////////////
            tmpofficePinlist:any=[];
            get_pincodeOffice(masterId){
                this.loader=true;
                this.sales_data.pinOffice='';
                console.log(this.sales_data.statef,this.sales_data.districtOffice,this.sales_data.cityOffice);
                
                this.db.fetchData({"stateMasterIds":[masterId]},'city/pincodes').subscribe((response)=>{
                    console.log(response);
                    
                    this.loader=false;
                    // this.citylistOffice=response['data'];
                    // this.districtsOffice2=this.citylistOffice[0].distrcits;
                    // this.citiesOffice1=this.districtsOffice2[0].cities;
                    // let filterpincodeOffice= this.citiesOffice1.filter(x => x.cityName==this.sales_data.cityOffice);
                    this.areasOffice=response['data'][0]['pinCodes'];
                    this.tmpofficePinlist=this.areasOffice;
                    
                    console.log( this.areasOffice);
                    console.log(this.citiesOffice1);
                });
            }
            tmpPinList:any=[];
            
            get_pincode(masterId) {
                
                if(this.user_type.type=='2') {
                    
                    this.loader=true;
                    this.sales_data.pin='';
                    
                    console.log(this.sales_data.state,this.sales_data.district,this.sales_data.city);
                    
                    this.db.fetchData({"stateMasterIds":[masterId]},'city/pincodes').subscribe((response)=>{
                        
                        console.log(response);
                        this.loader=false;
                        // this.citylist=response['data'];
                        // this.districts2=this.citylist[0].distrcits;
                        // this.cities1=this.districts2[0].cities;
                        
                        this.areas=response['data'][0]['pinCodes'];
                        this.tmpPinList=this.areas;
                        console.log( this.tmpPinList);
                        // console.log(this.cities1);
                        
                    });
                    
                } else {
                    
                    this.loader=true;
                    this.system_data.pin='';
                    console.log(this.system_data.state,this.system_data.district,this.system_data.city);
                    this.db.fetchData({"stateMasterIds":[masterId]},'city/pincodes').subscribe((response)=>{
                        console.log(response);
                        this.loader=false;
                        // this.citylist=response['data'];
                        
                        this.areas=response['data'][0]['pinCodes'];
                        this.tmpPinList=this.areas;
                        console.log( this.areas);
                        // console.log(this.cities1);
                    });
                }
                
            }
            
            onSubmit() {
                
                this.sales_data.stateOffice=this.sales_data.statef;
                console.log(this.sales_data.segment);
                console.log(this.staffSegments);
                
                if( this.user_type.type=='2') {
                    
                    const segmentArr = [];
                    for(let i=0;i<this.segmentlist.length;i++){
                        
                        if(this.segmentlist[i].checked) {
                            
                            segmentArr.push( {"segmentCode": this.segmentlist[i].text, "segment": this.segmentlist[i].text});
                        }
                    }
                    
                    
                    const saleHierarchy = [];
                    
                    for (let index = 0; index < this.juniorList.length; index++) {
                        if(this.juniorList[index].checked) {
                            saleHierarchy.push({'juniorUserID': this.juniorList[index].userId});   
                        }
                    }
                    
                    
                    const territorySelected = [];
                    if(this.territoryList && this.territoryList.length) {
                        
                        for (let index = 0; index < this.territoryList.length; index++) {
                            if(this.territoryList[index].check && !this.territoryList[index].disabled) {
                                territorySelected.push(this.territoryList[index]['territoryID']);
                            }
                        }
                    }
                    
                    
                    const networks = [];
                    for (let index = 0; index < this.networkIdsdata.length; index++) {
                        
                        if(this.networkIdsdata[index].checked && !this.networkIdsdata[index].disabled) {
                            networks.push({networkId: this.networkIdsdata[index].networkId, territoryId: this.networkIdsdata[index].territoryId} );
                        }
                    }
                    
                    
                    this.sales_data.staffSegments = segmentArr;
                    this.sales_data.saleHierarchies = saleHierarchy;
                    this.sales_data.territories = territorySelected;
                    this.sales_data.networks = networks;
                    
                    console.log(this.networkIdsdata);
                    
                    this.sales_data.userType=this.user_type.type,
                    this.sales_data.role=this.user_type.role,
                    this.sales_data.country="India";
                    this.sales_data.userType = 2;
                    
                    this.sales_data.totalTarget = this.sales_data.target;
                    
                    this.sales_data.document=[];
                    console.log(this.sales_data);
                    
                    console.log(this.user_type.leaveApprover);
                    
                    this.sales_data.designation = this.user_type.designation;
                    
                    
                    console.log(this.sales_data);
                    this.loader=true;
                    this.db.fetchData(this.sales_data,'user/add').subscribe((response)=>{
                        
                        console.log(response);
                        this.loader=false;
                        console.log(response);
                        this.staffSegments=[];
                        this.message=response['message'];
                        if(this.message=="User added successfully")
                        {
                            this.toast.openSucess('User added successfully','');
                            this.router.navigate(['/sale-user-list'])
                        }
                        else
                        {
                            
                            this.alrt.alertWarning(this.message);
                            
                            // this.toast.openError('Email or Phone Can Not Be Duplicate or Invalid Please Try Again!!','');
                        }
                    });
                    
                }  else {
                    
                    this.system_data.userType=this.user_type.type,
                    this.system_data.role=this.user_type.role,
                    this.system_data.country="India";
                    this.system_data.document=[];
                    this.sales_data.staffSegments = [];
                    this.system_data.designation = this.user_type.designation;
                    if(this.user_type.leaveApprover)
                    {
                        this.system_data.leaveApprover = this.user_type.leaveApprover;
                        
                    }
                    console.log(this.system_data);
                    
                    
                    const moduleAccesses = [];
                    
                    for (let index = 0; index < this.moduleData.length; index++) {
                        
                        if(this.moduleData[index].view) {
                            
                            if(!this.moduleData[index].moduleRights[0].checked) {
                                this.moduleData[index].moduleRights[0].checked = false;
                            }
                            
                            if(!this.moduleData[index].moduleRights[1].checked) {
                                this.moduleData[index].moduleRights[1].checked = false;
                            }
                            
                            if(!this.moduleData[index].moduleRights[2].checked) {
                                this.moduleData[index].moduleRights[2].checked = false;
                            }
                            
                            moduleAccesses.push({
                                'moduleId': this.moduleData[index].moduleId,
                                'module': this.moduleData[index].moduleName,
                                'show': true,
                                'add': this.moduleData[index].moduleRights[0].checked,
                                'edit': this.moduleData[index].moduleRights[1].checked,
                                'delete': this.moduleData[index].moduleRights[2].checked,
                            });
                        }
                    }

                    for (let index = 0; index < this.masterArray.length; index++) {
                        
                        if(this.masterArray[index].view) {
                            
                            if(!this.masterArray[index].moduleRights[0].checked) {
                                this.masterArray[index].moduleRights[0].checked = false;
                            }
                            
                            if(!this.masterArray[index].moduleRights[1].checked) {
                                this.masterArray[index].moduleRights[1].checked = false;
                            }
                            
                            if(!this.masterArray[index].moduleRights[2].checked) {
                                this.masterArray[index].moduleRights[2].checked = false;
                            }
                            
                            moduleAccesses.push({
                                'moduleId': this.masterArray[index].moduleId,
                                'module': this.masterArray[index].moduleName,
                                'show': true,
                                'add': this.masterArray[index].moduleRights[0].checked,
                                'edit': this.masterArray[index].moduleRights[1].checked,
                                'delete': this.masterArray[index].moduleRights[2].checked,
                            });
                        }
                    }
                    
                    console.log(moduleAccesses);
                    
                    
                    if(this.user_type.role == '1' && moduleAccesses.length == 0) {
                        
                        this.isModuleSelected = false;
                        return false;
                        
                    } else {
                        
                        this.isModuleSelected = true;;
                    }
                    
                    console.log(moduleAccesses);
                    this.loader=true;
                    
                    this.db.fetchData(this.system_data,'user/add').subscribe((response)=>{
                        console.log(response);
                        this.message=response['message'];
                        this.staffSegments=[];
                        if(this.message == "User added successfully")
                        {
                            if(this.user_type.type == '1') {
                                const accessData = {};
                                accessData['userId'] = response['data'];
                                accessData['moduleAccesses'] = moduleAccesses;
                                console.log(accessData);
                                this.db.fetchData(accessData,'admin/saveaccess').subscribe((responseData)=>{
                                    console.log(responseData);
                                    this.loader=false;
                                    this.message=responseData['message'];
                                    this.toast.openSucess('User added successfully','');
                                    this.router.navigate(['/system-user-list'])
                                });
                            } else {
                                this.loader=false;
                                this.toast.openSucess('User added successfully','');
                                this.router.navigate(['/system-user-list'])
                            }
                        } else {
                            this.loader=false;
                            this.alrt.alertWarning(this.message);
                        }
                    });
                }
            }
            
            
            active:any = {};
            toggleterritory(key,action)
            {
                console.log(action);
                console.log(key);
                if(action == 'open')
                { this.active[key] = true; }
                if(action == 'close')
                { this.active[key] = false;}
                console.log(this.active);
            }
            
            
            userActionHandler(userId, isChecked) {
                
                
                for (let index = 0; index < this.juniorList.length; index++) {
                    
                    if(this.juniorList[index].checked) {
                        
                        this.loader = true;
                        console.log(this.juniorList[index].userId);
                        
                        this.db.fileData(this.juniorList[index].userId,'user/detail/').subscribe((response)=>{
                            
                            console.log(response);  
                            this.loader=false;
                            
                            if(response)
                            {
                                this.users_territory = response['data']['userTerritories'];
                                console.log(this.users_territory);
                                
                                for(let i=0;i<this.territoryList.length;i++)
                                {
                                    for(let j=0;j<this.users_territory.length;j++)
                                    {
                                        if(this.territoryList[i]['territoryName']==this.users_territory[j]['territoryName'])
                                        {
                                            this.territoryList[i].check=true;
                                            console.log(this.territoryList);
                                        }
                                        
                                    }
                                }
                            };
                            
                        });
                    }
                }
            }
            
            
            get_user_territory(userId)
            {
                this.loader=true;
                console.log(userId);
                
                this.db.fileData(userId,'user/detail/').subscribe((response)=>{
                    
                    console.log(response);  
                    this.loader=false;
                    
                    if(response)
                    {
                        this.users_territory = response['data']['userTerritories'];
                        
                        console.log(this.users_territory);
                        
                        for(let i=0;i<this.territoryList.length;i++)
                        {
                            for(let j=0;j<this.users_territory.length;j++)
                            {
                                if(this.territoryList[i]['territoryName']==this.users_territory[j]['territoryName'])
                                {
                                    this.territoryList[i].check=true;
                                    console.log(this.territoryList);
                                }
                                
                            }
                        }
                    };
                });
            }
            
            
            state_array_filter(state)
            {
                this.tmpstateList=[];
                let value=state.toUpperCase();
                this.tmpstateList=[];
                for(var i=0; i<this.statelist.length; i++)
                {
                    if(this.statelist[i].toUpperCase().search(value) !==-1)
                    {
                        this.tmpstateList.push(this.statelist[i]);
                    }
                }
                console.log(this.tmpstateList);
            }
            
            district_array_filter(district)
            {
                this.district1=[];
                let value=district.toUpperCase();
                for(var i=0; i<this.tmpdistrictList.length; i++)
                {
                    if(this.tmpdistrictList[i]['districtName'].toUpperCase().search(value) !==-1)
                    {
                        this.district1.push(this.tmpdistrictList[i]);
                    }
                }
            }
            
            city_array_filter(city)
            {
                console.log(city);
                console.log(this.tmpcityList);
                
                this.cities=[];
                let value=city.toUpperCase();
                for(var i=0; i<this.tmpcityList.length; i++)
                {
                    if(this.tmpcityList[i]['cityName'].toUpperCase().search(value) !==-1)
                    {
                        this.cities.push(this.tmpcityList[i]);
                    }
                }
            }
            pin_array_filter(pin)
            {
                this.areas=[];
                console.log(this.tmpPinList);
                
                let value=pin;
                console.log(value);
                
                for(var i=0; i<this.tmpPinList.length; i++)
                {
                    if(this.tmpPinList[i].toString().search(value) !==-1)
                    {
                        this.areas.push(this.tmpPinList[i]);
                    }
                }
            }
            
            officedistrict_array_filter(district)
            {
                this.districtOffice1=[];
                let value=district.toUpperCase();
                for(var i=0; i<this.tmpofficedistrict.length; i++)
                {
                    if(this.tmpofficedistrict[i]['districtName'].toUpperCase().search(value) !==-1)
                    {
                        this.districtOffice1.push(this.tmpofficedistrict[i]);
                    }
                }
            }
            
            officecity_array_filter(city)
            {
                console.log(city);
                console.log(this.tmpofficecitylist);
                
                this.citiesOffice=[];
                let value=city.toUpperCase();
                for(var i=0; i<this.tmpofficecitylist.length; i++)
                {
                    if(this.tmpofficecitylist[i]['cityName'].toUpperCase().search(value) !==-1)
                    {
                        this.citiesOffice.push(this.tmpofficecitylist[i]);
                    }
                }
            }
            
            
            officepin_array_filter(pin)
            {
                this.areasOffice=[];
                console.log(this.tmpPinList);
                
                let value=pin;
                console.log(value);
                
                for(var i=0; i<this.tmpofficePinlist.length; i++)
                {
                    if(this.tmpofficePinlist[i].toString().search(value) !==-1)
                    {
                        this.areasOffice.push(this.tmpofficePinlist[i]);
                    }
                }
            }
            
            MobileNumber(event: any) 
            {
                const pattern = /[0-9\+\-\ ]/;
                let inputChar = String.fromCharCode(event.charCode);
                if (event.keyCode != 8 && !pattern.test(inputChar)) 
                {event.preventDefault(); }
                
            }
        }
        