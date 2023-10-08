import { Component, AfterViewInit,DoCheck} from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Users } from 'src/app/models/users.model';
import { PanelService } from 'src/app/services/panel.service';
import { SharedDataService } from 'src/app/shared/data-service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements DoCheck  {
  routes: { [key: string]: string } = {
    "/home" :"1",
    "/zones" :"2",
    "/history" :"3",
    "/config" :"4",
  }


  panelUpdate:any
  Timer:any
  actUser:Users
  constructor(private router:Router,private cookieService:CookieService,public dataService:SharedDataService, private panelService:PanelService){
    this.actUser=new Users(-1,"","","",[],{})
    this.dataService.getUser().then((userData: Users) => {
      this.actUser=userData
    })
  }
  ngDoCheck(): void {
    if(this.dataService.actPanel){
      (document.getElementById("panelsSelector") as HTMLSelectElement).value=this.dataService.actPanel.id.toString()
    }
  }

  changePanel(input:any){
    this.cookieService.set("panels",input.target.value)
    this.dataService.loaded=false
    this.dataService.updateActPanel()
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
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(["/home"]))
      });
  }

  isButtonVisible(array:Array<string>):boolean{
    let value=false;
    array.forEach(elem=>{
      let temp=this.actUser.panels.find(elem => elem.id === this.dataService.actPanel.id)
      if(temp) if(!!+temp.pivot[elem]) value=true
    })
    return (this.actUser.id >= 0 && value)
  }


}
