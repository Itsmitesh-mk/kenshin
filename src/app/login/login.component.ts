import { Component, OnInit } from '@angular/core';
import { slideToRight } from '../router-animation/router-animation.component';
import { ConstantService } from 'src/app/constant.service';
import { sessionStorage }  from '../local-storage.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogComponent } from 'src/app/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  animations: [slideToRight()]
})
export class LoginComponent implements OnInit {

  data:any = {};
  loading = false;

  alert:any;
  user: any = {};
  nexturl:any;

constructor(public service: ConstantService, public ses:sessionStorage, private router: Router,private route: ActivatedRoute, public dialog:DialogComponent) { }
 ngOnInit(){
   this.setAnimation()


 }

 active:any;
 setAnimation()
 {
  setTimeout(() => {
    this.active=true;
  }, 3500);
 }
  login() {

    this.loading = true;
    console.log(this.data);

    this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/lead-list';

    this.service.login( this.data ,'login')
    .subscribe((data:any)=> {
        console.log(data);

        setTimeout(() => {
          this.loading = false;
        }, 1000);

        if(data) {

              this.user = data;
              console.log(this.user);
              this.user.st_log = true;

              this.user.expirationTime = (new Date().getTime()) + 60000 * 360;
              localStorage.setItem('user', JSON.stringify(this.user));

              console.log(this.user);
              console.log(this.user.token);

              localStorage.removeItem('accessModuleData');

              if(this.user.data && !this.user.data.superAdmin) {

                      this.service.fileData('', 'admin/access/' + this.user['data']['userId']).subscribe( ( responseData ) => {

                          console.log(responseData);
                          
                          localStorage.setItem('accessModuleData', JSON.stringify(responseData['data']));

                          console.log(this.nexturl);
                          if(this.user.data.userType==1) {
      
                              this.router.navigate(['/dashboard/']);
                          }
                          else if(this.user.data.role==12)
                          {
                              this.router.navigate(['/distribution-detail/'+ this.user.data.distributerNetwork['networkId']]);   
                          }

                          else if(this.user.data.userType == 2) {

                            this.router.navigate(['/dashboard/']);  
                              
                          } else {
                              
                             this.router.navigate(['/lead-list']);
                          }
                        //   else if(this.userdata)
                        //   {
                        //       this.router.navigate(['/lead-list']);
                        //   }

                          // this.dbModuleData = responseData['data'];
                          // this.moduleAssignedEdit = false;
                          // this.system_detail = response;
                          // this.systemdata=this.system_detail.data;
                          
                      }, error => {
                          console.log(error);
                      });
                    
              } else {

                      localStorage.setItem('accessModuleData', '');

                      this.router.navigate(['/lead-list']);
              }

        } else {

            this.dialog.error('Please check your Username and Password')
        }
        
    },error=>{

          this.loading = false;
          console.log(error);
          this.dialog.error('Invalid login credentials')
    });
    
  }

}
