import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Users } from 'src/app/models/users.model';
import { AccessService } from 'src/app/services/access-service.service';

@Component({
  selector: 'app-user-icon',
  templateUrl: './user-icon.component.html',
  styleUrls: ['./user-icon.component.css']
})
export class UserIconComponent {
  @Input() user:Users=new Users(-1,"","","",[],"")

  constructor(private loginservice:AccessService, private route: Router){}
  
  closeSes(){
    this.loginservice.logout()?.subscribe({
      next:(response)=>{
        this.route.navigate(['/'])
      },
      error:(error)=>{
        this.route.navigate(['/'])
      } 
    });
  }
}
