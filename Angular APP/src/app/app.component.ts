import { Component } from '@angular/core';
import { Users } from './models/users.model';
import { Router } from '@angular/router';
import { AccessService } from './services/access-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'riego';
  showMenu=true;
  user2:Users;
  notify2:Array<string>;
  constructor(private router: Router, private loginservice:AccessService) { 
    this.user2=new Users(-1,"","","",[],"");
    this.notify2=[];
  }

  onActivate():void{
    if (this.router.url == "/login" || this.router.url == "/" || this.router.url == "/home" || this.router.url == "/registry"){
      this.showMenu=false;
      this.notify2=[];
    }else{
      this.showMenu=true;
    }

    this.loginservice.isLoggedIn().subscribe((isLoggedIn) => {
      if (!isLoggedIn){
        this.loginservice.deleteToken()
      }
      this.user2=this.loginservice.user
    });
      
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
