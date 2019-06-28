import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root',
})
export class ConstantService {
  dburl:string = 'http://13.234.72.162/api/';
  // dburl:string = 'http://13.234.72.162:8084/api/';
  
  constructor(public http: HttpClient) { }
  header: any = new HttpHeaders();
  can_active:string = '';
  loading:any;  
  navigate_type:any='';
  datauser:any={};
  user:any = [];
  token_data:string='';
  tokenInfo:any;
  
  data:any=[];
  
  
  
  public exportAsExcelFile(json: any[], excelFileName: string): void {
    
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    console.log('worksheet',worksheet);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    // const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }
  
  login(request_data:any,fn:any)
  {
    console.log(request_data);
    this.header.append('Content-Type', 'application/json');
    console.log(request_data);
    return this.http.post( this.dburl+fn,request_data,{headers:this.header});
  }
  
  fetchData(request_data:any,fn:any){
    this.count_list();
    this.user = JSON.parse(localStorage.getItem('user')) || [];
    this.token_data = this.user.data.token;
    console.log(this.token_data);
    let header = new HttpHeaders();
    console.log(request_data);
    header=header.append('Authorization', 'Bearer ' + this.token_data);
    
    console.log( this.dburl);
    header=header.append('Content-Type',"application/json");
    return this.http.post( this.dburl+fn,JSON.stringify(request_data),{headers: header});
  }
  
  fileData(request_data:any,fn:any){
    this.count_list();
    this.user = JSON.parse(localStorage.getItem('user')) || [];
    this.token_data = this.user.data.token;
    console.log(this.token_data);
    let header = new HttpHeaders();
    header=header.append('Content-Type', 'application/json');
    header=header.append('Authorization', 'Bearer ' + this.token_data);
    console.log(request_data);
    return this.http.get( this.dburl+fn+request_data, {headers:header});
  }
  
  putData(request_data:any,fn:any){
    this.user = JSON.parse(localStorage.getItem('user')) || [];
    this.token_data = this.user.data.token;
    console.log(this.token_data);
    let header = new HttpHeaders();
    header=header.append('Content-Type', 'application/json');
    header=header.append('Authorization', 'Bearer ' + this.token_data);
    console.log(request_data);
    return this.http.put( this.dburl+fn, JSON.stringify(request_data), {headers:header});
  }
  
  setData(value)
  {
    this.data=value;
  }
  
  getData()
  {
    return this.data;
  }
  
  DownloadFileData(request_data:any,fn:any){
    this.user = JSON.parse(localStorage.getItem('user')) || [];
    this.token_data = this.user.data.token;
    console.log(this.token_data);
    let header = new HttpHeaders();
    console.log(request_data);
    header=header.append('Authorization', 'Bearer ' + this.token_data);
    header=header.append('Content-Type',"application/json");
    return this.http.post( this.dburl+fn,JSON.stringify(request_data),{headers: header});
  }
  
  excelFileData(request_data:any,fn:any) {
    
    this.user = JSON.parse(localStorage.getItem('user')) || [];
    this.token_data = this.user.data.token;
    console.log(this.token_data);
    let header = new HttpHeaders();
    console.log(request_data);
    header=header.append('Authorization', 'Bearer ' + this.token_data);
    header=header.append('Content-Type', 'application/json');
    return this.http.post( this.dburl + fn, JSON.stringify(request_data), {headers: header, responseType: 'blob'});
  }
  
  downloadProductData(request_data:any,fn:any) {
    
    this.user = JSON.parse(localStorage.getItem('user')) || [];
    this.token_data = this.user.data.token;
    console.log(this.token_data);
    let header = new HttpHeaders();
    console.log(request_data);
    header=header.append('Authorization', 'Bearer ' + this.token_data);
    header=header.append('Content-Type', 'application/json');
    return this.http.get( this.dburl + fn, {headers: header, responseType: 'blob'});
  }

  counterArray:any={};
  distributorCount:any=0;
  leadCount:any=0
  count_list(){
    this.user = JSON.parse(localStorage.getItem('user')) || [];
    this.token_data = this.user.data.token;
    console.log(this.token_data);
    let header = new HttpHeaders();
    header=header.append('Content-Type', 'application/json');
    header=header.append('Authorization', 'Bearer ' + this.token_data);
    this.http.get( this.dburl+"dashboard/count"+'', {headers:header}).subscribe( r =>{
      console.log(r);
      if(r['status']=='Success')
      {
        this.counterArray=r['data'];
        console.log(this.distributorCount);
        if(this.counterArray.networkCount.length!=0)
        {
          this.distributorCount=this.counterArray.networkCount[0].total;
        }
        if(this.counterArray.leadCount.length!=0)
        {
          this.leadCount=this.counterArray.leadCount[0].statusCount;
        }
      
      }
    });
    
  }
 

  
  
  
}
