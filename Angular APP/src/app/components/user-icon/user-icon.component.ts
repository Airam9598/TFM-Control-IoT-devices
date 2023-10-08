import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Panels } from 'src/app/models/panels.model';
import { Users } from 'src/app/models/users.model';
import { AccessService } from 'src/app/services/access-service.service';
import { PanelService } from 'src/app/services/panel.service';
import { SharedDataService } from 'src/app/shared/data-service';

@Component({
  selector: 'app-user-icon',
  templateUrl: './user-icon.component.html',
  styleUrls: ['./user-icon.component.css']
})
export class UserIconComponent {
  actUser:Users
  constructor(private loginservice:AccessService, private route: Router, protected dataService:SharedDataService, private panelservice:PanelService){
    this.actUser=this.dataService.userData
  }

  closeSes(){
    this.loginservice.logout()?.subscribe({
      next:(response)=>{
        this.dataService.logout()
        this.route.navigate(['/'])
      },
      error:(error)=>{
        this.route.navigate(['/'])
      }
    });
  }
}
