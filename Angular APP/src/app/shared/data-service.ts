import { Injectable } from '@angular/core';
import { Users } from '../models/users.model';
import { Panels } from '../models/panels.model';
import { CookieService } from 'ngx-cookie-service';
import { LoginComponent } from '../components/login/login.component';
import { AccessService } from '../services/access-service.service';
import { Zones } from '../models/zones.model';
import { ZoneService } from '../services/zone.service';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
    private userData : Users
    public actPanel !: Panels
    public panels !: Panels[]
    public zones!: Zones[]
    cookieService:CookieService
    loginService:AccessService
    zoneService:ZoneService
    constructor(cookieService:CookieService,loginService:AccessService,zoneService:ZoneService) { 
        this.cookieService=cookieService
        this.loginService=loginService
        this.userData=this.loginService.user
        this.zoneService=zoneService
    }

    getUser(): Promise<Users>{
        return new Promise<Users>((resolve, reject) => {
            if (this.userData.id <0) {
                this.loginService.isLoggedIn().subscribe({
                next: (user) => {
                    this.addUser(this.loginService.user)
                    resolve(this.userData);
                },
                error: (error2) => {
                    resolve(this.userData);
                }
                });
            } else {
                resolve(this.userData);
            }
        });
    }

    addUser(user:Users){
        this.userData = user
        this.panels=this.userData.panels
        this.updateActPanel()
    }

    logout(){
        this.panels=[]
        this.userData=new Users(-1,"","","",[],"")
        this.zones=[]
        this.actPanel=new Panels(-1,"",0,"")
    }

    updatePanels(newPanels:Panels[]){
        this.userData.panels=newPanels
        this.panels=this.userData.panels
        this.updateActPanel()
    }

    getZones():Promise<Zones[]>{
        return new Promise<Zones[]>((resolve, reject) => {
            if(this.actPanel== undefined || this.actPanel.id<0)resolve([])
            if(this.zones.length>0) resolve(this.zones)
            this.zoneService.getZones(this.actPanel.id)?.subscribe({
                next: (zones) => {
                    this.zones=zones.data as Zones[]
                    resolve(this.zones);
                },
                error: (error2) => {
                    resolve([])
                }
            });
        })
    }



    addActualPanel(panel:Panels){
        this.cookieService.set("panels",panel.id.toString())
        this.actPanel=panel
        this.zones=[]
        this.getZones()
    }

    updateActPanel():boolean{
        if(this.cookieService.check("panels")){
            if(this.panels != undefined && this.panels.length>0){
                let findpanel=this.panels.find(elem=>elem.id.toString() == this.cookieService.get("panels"))
                if( (this.actPanel == undefined && findpanel )|| (findpanel && this.actPanel.id != findpanel.id)){
                    this.actPanel=findpanel
                    this.zones=[]
                    this.getZones()
                }else if(!findpanel){
                    this.cookieService.set("panels",this.panels[0].id.toString())
                    this.actPanel=this.panels[0]
                    this.zones=[]
                    this.getZones()
                }
            }else{
                this.cookieService.delete("panels")
            }
        }else{
            if(this.panels.length>0){
                this.actPanel=this.panels[0]
                this.zones=[]
                this.getZones()
                this.cookieService.set("panels",this.actPanel.id.toString())
            }
        }
        return true;
    }
}