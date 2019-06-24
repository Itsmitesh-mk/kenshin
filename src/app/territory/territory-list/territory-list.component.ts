import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { ConstantService } from '../../constant.service';
import { DialogComponent } from 'src/app/dialog';

@Component({
  selector: 'app-territory-list',
  templateUrl: './territory-list.component.html',
  animations: [slideToTop()]

})
export class TerritoryListComponent implements OnInit {
territorylist:any=[];
data:any;

auto3:any = '';
filter:any={};
loader:boolean;
namelist:any=[];
pinlist:any=[];
pinlist1:any=[];
removename:boolean=false;
removepin:boolean=false;
removesegment:boolean=false;
div:any=false;

segmentlist:any = [];

  constructor(public db:ConstantService,public dialog:DialogComponent) {
    this.getTerritoryList({});
    
   }

   deleteTerritory(id)
   {
     console.log(id);
     
     this.dialog.delete('Territory User  !').then((result) => {

          if(result)
          {
                console.log(id);
                this.db.fileData("","territory/delete/"+id).subscribe((result)=>{

                    console.log(result);
                    
                    if(result['status']=="Success")
                    {
                        this.getTerritoryList({});
                    }
                })
            }
      })
   }


  ngOnInit() {


  }

  clearfilter(){
    this.removename=false;
    this.filter={};
    this.getTerritoryList({});
  }
  getTerritoryList(requestData)
  {
        this.div = false;
        this.loader = true;

        console.log(requestData);

        this.db.fetchData(requestData, 'territory/list').subscribe((response)=>{

              console.log(response);

              if(response['status']=='Success')
              {
                  this.territorylist = response;
              } else {
                this.div = true;
                  this.territorylist = [];
              }

              this.loader = false;
              this.data = this.territorylist.data;
              console.log(this.data);
        });
  }



  modifyFilterData() {

        const selectedData = {};

        if(this.filter.name) {
            selectedData['territoryName'] = this.filter.name;
        }

        if (this.filter.segment) {
            selectedData['segments'] = [this.filter.segment];
        }

        if (this.filter.pincode) {
           selectedData['pinCode'] = this.filter.pincode;
        }

        console.log(selectedData);

        return selectedData;
  }
  

  nameList() {

      this.db.fetchData({ "territoryName":this.filter.name},'territory/list').subscribe((response)=>{
          console.log(response);
          this.namelist=response['data'];
          console.log(this.namelist);
      });  
  }

  nameFilter() {

      console.log(this.filter.name);
      const selectedData = this.modifyFilterData();
      this.getTerritoryList(selectedData);
      this.removename=true;
  }

  removenamefilter() {

      this.filter.name = '';
      this.namelist = [];

      const selectedData = this.modifyFilterData();
      this.getTerritoryList(selectedData);
      this.removename=false;
  }

  pincodeTerritoryList() {

      console.log(this.filter.pincode.length);

      if(this.filter.pincode && (this.filter.pincode).length == 6) {

           const selectedData = this.modifyFilterData();
           this.getTerritoryList(selectedData);
      }

      if(!this.filter.pincode || (this.filter.pincode).length == 0) {

          const selectedData = this.modifyFilterData();
          this.getTerritoryList({});
      }
  }
  
  removePinFilter() {
      this.filter.pincode='';
      const selectedData = this.modifyFilterData();
      this.getTerritoryList(selectedData);
      this.removepin=false;
  }


  segmentList() {

    this.db.fileData('','segment/list/' + this.filter.segment).subscribe((response)=>{
        console.log(response);
        this.segmentlist=response['data']});
  }


  segmentFilter() {

      const selectedData = this.modifyFilterData();
      this.getTerritoryList(selectedData);
      this.removesegment=true;
  }

  removeSegmentFilter() {

      this.filter.segment='';

      const selectedData = this.modifyFilterData();
      this.getTerritoryList(selectedData);

      this.segmentlist=[];
      this.removesegment=false;
  }




  pinList(){
    this.loader=true;
    this.db.fetchData({ "pincode":this.filter.pincode},'territory/detail').subscribe((response)=>{
      console.log(response);
      this.loader=false
        this.pinlist=response['data']});
        console.log(this.pinlist);
        for (let indexp = 0; indexp < this.pinlist.length; indexp++) {

          const terrPincodeArrp = [];

          const stateArrp = this.pinlist[indexp]['states'];

          for (let index2p = 0; index2p < stateArrp.length; index2p++) {

              const districtArrp = stateArrp[index2p]['distrcits'];

              for (let index3p = 0; index3p < districtArrp.length; index3p++) {

                  const cityArrp =  districtArrp[index3p]['cities'];
                  for (let index4p = 0; index4p < cityArrp.length; index4p++) {

                    const areaArrp = cityArrp[index4p]['pinCodes']

                    for (let index5p = 0; index5p < areaArrp.length; index5p++) {
                  
                         terrPincodeArrp.push(areaArrp[index5p]);
                    }

                  }
              }
            
          }

          this.pinlist[indexp].pincodeArr = terrPincodeArrp;
    }
        console.log(this.pinlist)
        this.pinlist1=[];
        for(let i=0;i<this.pinlist.length;i++){
          for(let j=0;j<this.pinlist[i].pincodeArr.length;j++){
            this.pinlist1.push(this.pinlist[i].pincodeArr[j]);
          }
        }
        console.log(this.pinlist1);
  }
  pinFilter(){
    this.filter.name='';
    this.removename=false;
    console.log(this.filter.pincode);
    this.getTerritoryList({ "pincode":this.filter.pincode});
      this.removepin=true;
  }
  removepinfilter(){
    this.filter.pincode='';
    this.getTerritoryList({ "pincode":this.filter.pincode});
    this.removepin=false;
  }
   goToEditTerritoryPage() {




   }

}
