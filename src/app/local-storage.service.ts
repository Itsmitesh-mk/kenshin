import { Injectable, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { ConstantService } from 'src/app/constant.service';
import { DialogComponent } from 'src/app/dialog';



@Injectable({ providedIn: 'root' })
export class sessionStorage implements OnInit {
    loading = false;   
    alert:any;
    user: any = {};
    nexturl:any;
    constructor(private route: ActivatedRoute, private router: Router,public service: ConstantService, public dialog:DialogComponent) {  
            
        }
        
     ngOnInit() {
            this.user.st_log = false;
            console.log(this.user);
        }
        
        getSe():  Observable<any> {
            
            this.user = JSON.parse(localStorage.getItem('user')) || [];

            const expirationTime = this.user.expirationTime;
            const currentTime = new Date().getTime();

            console.log(expirationTime, currentTime);

            if(currentTime > expirationTime) {

                this.user = {};
                this.user.st_log = false;
                this.service.can_active='';
                this.service.datauser = {};
                localStorage.removeItem('user');
            }

            return of(this.user);
        }
        
        
        logoutSession() {       
            this.user = {};
            this.user.st_log = false;
            this.service.can_active='';
            this.service.datauser = {};
            localStorage.removeItem('user');
        }

    }
    export class LocalStorageService { }
    