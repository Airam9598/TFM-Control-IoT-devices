import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Devices } from 'src/app/models/devices.model';
import { Zones } from 'src/app/models/zones.model';
import { DeviceService } from 'src/app/services/device.service';
import { ZoneService } from 'src/app/services/zone.service';
import { SharedDataService } from 'src/app/shared/data-service';

@Component({
  selector: 'app-zone-info',
  templateUrl: './zone-info.component.html',
  styleUrls: ['./zone-info.component.css']
})
export class ZoneInfoComponent implements OnChanges {
  @Input() zone:Zones
  @Input() devices:Devices[]
  @Input() cameras:Devices[]
  @Output()close = new EventEmitter();
  irrigate:boolean
  devicesclasified:{[key:string] : Devices[]}
  constructor(public dataService:SharedDataService,public deviceService:DeviceService,public zoneService:ZoneService){
    this.zone=new Zones(-1,"","",0,0,-1)
    this.devices=[]
    this.cameras=[]
    this.irrigate=false
    this.devicesclasified={
      "air temperature":[],
      "soil temperature":[],
      "soil Moisture":[],
      "precipitation":[],
      "irrigate":[],
      "camera":[]
    }
  }

  closePanel(){
    this.close.emit()
  }
  updateZone(info:any){
    this.dataService.zones=[]
    this.dataService.getZones().then((zones: Zones[]) => {
    })
  }

  getValue(value:string){
    return this.devices.filter(dev=> dev.types[0].name===value )
  }

  changeValue(info2:string,select:any){
    let extra=""
    if(info2.includes("temperature")){
      extra=this.devicesclasified[info2].find(elem=>elem.id==select.target.value)!.info.data[info2].value +"°"
    }else if(info2.includes("Moisture")){
      extra=(this.devicesclasified[info2].find(elem=>elem.id==select.target.value)!.info.data[info2].value* 100).toFixed(2)
    }

    (document.getElementById("Info "+info2) as HTMLParagraphElement).innerText=extra
  }

  changeIrrigate(){
    this.zoneService.irrigateZone(this.dataService.actPanel.id,this.zone.id,!this.irrigate+"")?.subscribe({
      next:(result)=>{
        this.irrigate=!this.irrigate
      }
    })

  }

  ngOnChanges(changes: SimpleChanges) {
      /*this.devices.forEach(dev=>{
        this.deviceService.getDeviceRecent(this.dataService.actPanel.id,this.zone.id,dev.id)?.subscribe({
          next:(reponse)=>{
            this.devices[this.devices.findIndex(elem=>elem.id==(reponse as Devices).id)]=reponse.data as Devices
            console.log(reponse.data as Devices)
          }
        })
      })*/
      this.devicesclasified["air temperature"]=this.getValue("air temperature")
      this.devicesclasified["soil temperature"]=this.getValue("soil temperature")
      this.devicesclasified["soil Moisture"]=this.getValue("soil Moisture")
      this.devicesclasified["precipitation"]=this.getValue("precipitation")
      this.devicesclasified["irrigate"]=this.getValue("irrigate")
      this.devicesclasified["camera"]=this.getValue("camera")

      this.devicesclasified["irrigate"].forEach(elem=>{
        if(elem.info["data"]["irrigate"]=="true") this.irrigate=true
      })
  } 
}


