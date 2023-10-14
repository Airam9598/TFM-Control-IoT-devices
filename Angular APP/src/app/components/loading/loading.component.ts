import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccessService } from 'src/app/services/access-service.service';
import { DeviceService } from 'src/app/services/device.service';
import { SharedDataService } from 'src/app/shared/data-service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent {
  public loaded:boolean;
  constructor(protected dataService:SharedDataService, protected loginService: AccessService,private route: Router){
    this.loaded=false
    this.loginService.isLoggedIn().subscribe((isLoggedIn:boolean) => {
      if (isLoggedIn){
        this.dataService.addUser(this.loginService.user)
        const waitForLoad = () => {
          return new Promise<void>((resolve) => {
            const checkCondition = () => {
              if (this.dataService.loaded) {
                resolve();
              } else {
                setTimeout(checkCondition, 100);
              }
            };
            checkCondition();
          });
        };

        waitForLoad()
          .then(() => {
            this.loaded=true
            this.route.navigate(['/home'])
          });
      }else{
        this.loaded=false
        this.loginService.deleteToken()
        this.route.navigate(['/login'])
      }
    });
  }
}
