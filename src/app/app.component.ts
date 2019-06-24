import { Component } from '@angular/core';
import * as moment from 'moment';
import { ConstantService } from 'src/app/constant.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'kenshin';
  constructor(public service: ConstantService,) { }
}
