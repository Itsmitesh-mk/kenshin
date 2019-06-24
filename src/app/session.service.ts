import { Injectable } from '@angular/core';
import { Router,RouterModule,Routes, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { sessionStorage }  from './local-storage.service';
import { ConstantService } from 'src/app/constant.service';
import { Location } from '@angular/common';



@Injectable()
export class AuthGuard implements CanActivate {
    
    user:any = [];
    token:any;
    href:any = '';
    can_active:any;
    constructor(public loc: Location, private router: Router, public ses: sessionStorage,public service: ConstantService) {
    }
    
    
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        
        
        this.ses.getSe().subscribe(
            data => {
                this.user = data;
                console.log(this.user);
            },
            error => {
                console.log('err');
                
            });
            
            
            if (this.user.st_log)
            {
                console.log(this.user);
                // const location: RouterStateSnapshot = this.loc.location;
                // (this.loc.Location._platformStrategy._platformLocation.location)
                // const snapshot: RouterStateSnapshot = this.router.routerState.snapshot;
                // console.log(snapshot);
                // console.log(this.router);
                // console.log(this.router.url,"Current URL");
                // this.href = this.router.url;
                // this.href = window.location.href;
                // console.log(this.href);
                console.log(this.user);
                this.service.datauser = this.user;
                this.service.can_active = '1';
                this.user.url =  this.href;
                console.log(this.service.can_active);
                return true;
            }
            else
            {
                this.service.can_active = '';
                this.service.datauser = {};
                this.router.navigate([''], { queryParams: { returnUrl: state.url }});
                return false;
            }
        
            
        }
        
        
    }