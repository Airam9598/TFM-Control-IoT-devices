import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Devices } from 'src/app/models/devices.model';
import { Zones } from 'src/app/models/zones.model';
import { DeviceService } from 'src/app/services/device.service';
import { PanelService } from 'src/app/services/panel.service';
import { UserService } from 'src/app/services/user.service';
import { ZoneService } from 'src/app/services/zone.service';
import { SharedDataService } from 'src/app/shared/data-service';

@Component({
  selector: 'modal-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class DeleteComponent {
  @Input() item:any
  @Input() text:string
  @Output() closeEvent = new EventEmitter<any>();
  mem:{ [key: string]: string } ={
    "panel": "el panel",
    "zone": "la zona",
    "device": "el dispositivo",
    "user" : "tu usuario"
  }
  constructor(protected route:Router,protected dataService:SharedDataService,
    protected deviceService:DeviceService,protected panelService:PanelService,
    protected zoneService:ZoneService,protected userService:UserService){
    this.text=""
  }

  delete(){
    switch(this.text){
      case "device":
         this.deviceService.deleteDevice(this.dataService.actPanel.id,this.dataService.actZone.id,this.dataService.actDev.id)?.subscribe({
          next:()=>{
            (document.getElementById("close") as HTMLButtonElement).click()
            this.dataService.devices=this.dataService.devices.filter(elem=>elem.id!=this.dataService.actDev.id)
            this.dataService.actDev=new Devices("",-1,"","",-1,this.dataService.actZone,[],[])
          }
        })
        break;
      case "panel":
        this.panelService.deletePanel(this.dataService.actPanel.id)?.subscribe({
          next:()=>{
            this.closeEvent.emit()
            this.dataService.updatePanels(this.dataService.panels.filter(elem=> elem.id != this.dataService.actPanel.id))
            this.route.navigate(['/home'])
          }
        })
        break;
      case "zone":
        this.zoneService.deleteZone(this.dataService.actPanel.id,this.dataService.actZone.id)?.subscribe({
          next:()=>{
            this.dataService.zones=this.dataService.zones.filter(elem=> elem.id != this.dataService.actZone.id);
            this.dataService.actZone=new Zones(-1,"","",-1,-1,-1)
            this.closeEvent.emit()
          }
        })
        break;
      case "user":
        this.userService.deleteUser()?.subscribe({
          next:()=>{
            this.closeEvent.emit()
            this.dataService.logout()
            this.route.navigate(['/'])
          }
        })
    }
  }

}
