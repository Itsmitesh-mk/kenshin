import { Injectable } from '@angular/core';
import { Router,RouterModule,Routes, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { sessionStorage }  from './local-storage.service';
import { ConstantService } from 'src/app/constant.service';

@Injectable()
export class AuthGuardLog implements CanActivate {
  
   users:any = [];
   constructor(private router: Router,public ses: sessionStorage, public service: ConstantService) { }

 

   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
            this.ses.getSe().subscribe(
              data => {
               this.users = data;
               console.log(this.users);
               },
               error => {
                  console.log('error');

                  });


      if (this.users.st_log) {
        console.log(this.users);
          if(state.url != '/')   {          
            //this.router.navigate([state.url]);
          }else{
            this.router.navigate(['dashboard']);

          }
          this.service.can_active = '1';
           return false;

       }else{
            this.service.can_active = '';
            return true;
       }
      
    


      }

}
export class AuthGuardLogService { }
