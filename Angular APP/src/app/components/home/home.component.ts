import { Component,Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Panels } from 'src/app/models/panels.model';
import { AccessService } from 'src/app/services/access-service.service';
import { PanelService } from 'src/app/services/panel.service';
import * as moment from 'moment';
import { Devices } from 'src/app/models/devices.model';
import { SharedDataService } from 'src/app/shared/data-service';
import { Zones } from 'src/app/models/zones.model';
import { DeviceService } from 'src/app/services/device.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GeneralForm } from 'src/app/models/generalform.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

@Injectable()
export class HomeComponent {
  panelFormGroup=new FormGroup({
    name: new FormControl('',[Validators.required,Validators.minLength(2),Validators.maxLength(50)])
  })
  panelElements=[new GeneralForm("name","text","Nombre",true)]
  errorMessage:string
  showPanel:boolean

  pages: number = 1;
  backUpZones:Zones[]
  backUpdevices:Devices[]
  panelUpdate:any
  loading:boolean
  error:boolean

  constructor(protected deviceService:DeviceService, protected panelService:PanelService,protected loginservice:AccessService, protected dataService:SharedDataService, protected actRoute: ActivatedRoute, protected route: Router, protected cookieService:CookieService){
    if(dataService.userData.id<=0){
      this.route.navigate(['/loading'])
    }
    this.showPanel=false;
    this.errorMessage=""
    this.loading=false
    this.error=false
    this.backUpZones=[]
    this.backUpdevices=[]
    this.backUpZones=[...this.dataService.zones] as Zones[]
    this.deviceService.getDevicesPanel(this.dataService.actPanel.id)?.subscribe({
      next:(result)=>{
        if(result.data.length==0) return
        this.dataService.devices=result.data as Devices[]
        this.backUpdevices= [...this.dataService.devices] as Devices[]
      },
      error: (err) => {
        console.error('Error al obtener los dispositivos:', err);
      }
    })
  }



  filter(elem:any){
    this.backUpZones=elem
    this.backUpdevices= [...this.dataService.devices] as Devices[]
    this.backUpdevices=this.backUpdevices.filter(elem =>{return this.backUpZones.some(zone => zone.id === elem.zone.id)})
  }

  getDate2(date:any){
    if(date){
      let tempdate=date.$date.$numberLong
      return moment(parseInt(tempdate)).format('DD/MM/YYYY HH:mm')
    }else{
      return "Sin datos"
    }

  }

  reloadPanels(){
    this.error=false
    this.loading=true
    this.panelService.getPanels()?.subscribe({
      next:(response)=>{
        this.dataService.updatePanels(response.data as Panels[])
        this.loading=false
        if(this.dataService.panels.length<=0){
          this.error=true
        }else{
          this.route.navigateByUrl('/', { skipLocationChange: true }).then(() =>
          this.route.navigate(["/home"]))
        }
      },
      error:(error)=>{
        this.error=true
      }
    });
  }

  closeSes(){
    this.loginservice.logout()
    this.dataService.logout()
    this.route.navigate(['/'])
  }

  createPanel($elements:any){
    this.panelService.setPanel($elements.name)?.subscribe({
      next:(response)=>{
        this.route.navigate(["/loading"])
      },
      error:(error)=>{
        this.errorMessage=""
        if(error.error.message!=null){
          this.errorMessage = error.error.message
        }else{
          Object.keys(error.error).forEach((key: string) => {
            Object.keys(error.error[key]).forEach((key2: string) => {
            if(this.errorMessage.length>0) this.errorMessage+='<br><br>'
            this.errorMessage = this.errorMessage + error.error[key][key2][error.error[key][key2].length - 1];
            })
          })

        }
      }
    });
  }

}
