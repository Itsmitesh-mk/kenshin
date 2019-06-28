import { Component } from '@angular/core';
import * as moment from 'moment';
import { ConstantService } from 'src/app/constant.service';
import { ConnectionService } from 'ng-connection-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'kenshin';
  status = 'ONLINE';
  isConnected = true;
  constructor(public service: ConstantService,private connectionService:ConnectionService) { 

    console.log( 'in app');
    
    this.connectionService.monitor().subscribe(isConnected => {
      console.log(isConnected);
      
      this.isConnected = isConnected;
      if(this.isConnected){
      this.status = "ONLINE";
      } else {
      this.status = "OFFLINE"
      }
      alert(this.status);
      });
      

  }

 
}
