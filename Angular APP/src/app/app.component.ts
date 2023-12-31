import { Component } from '@angular/core';
import { Users } from './models/users.model';
import { Router } from '@angular/router';
import { AccessService } from './services/access-service.service';
import { SharedDataService } from './shared/data-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'riego';
  showMenu=true;
  notify2:Array<string>;
  constructor(private router: Router, private loginservice:AccessService, public dataService:SharedDataService) {
    this.notify2=[]
    this.checkMenu()
  }

  onActivate():void{
    this.checkMenu()
  }

  checkMenu(){
    if (this.router.url == "/login" || this.router.url == "/loading" || this.router.url == "/" || (this.router.url == "/home" && (this.dataService.panels.length==0) ) || this.router.url == "/registry"){
      this.showMenu=false;
      this.notify2=[];
    }else{
      this.showMenu=true;
    }

  }
  onDeactivate(event:any):void{
    this.notify2=[];
    setTimeout(()=>{
      if(event.notify != undefined && event.notify.length ==2 ){
        this.notify2=event.notify;
      }
    },200);

  }

  setNotifyPay(event:Array<any>):any{
    this.notify2=[];
    setTimeout(()=>{
      this.notify2=event;
    },200);
  }
}
