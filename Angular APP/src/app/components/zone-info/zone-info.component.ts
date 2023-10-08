import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Devices } from 'src/app/models/devices.model';
import { Users } from 'src/app/models/users.model';
import { Zones } from 'src/app/models/zones.model';
import { DeviceService } from 'src/app/services/device.service';
import { ZoneService } from 'src/app/services/zone.service';
import { SharedDataService } from 'src/app/shared/data-service';

@Component({
  selector: 'app-zone-info',
  templateUrl: './zone-info.component.html',
  styleUrls: ['./zone-info.component.css']
})
export class ZoneInfoComponent implements OnInit {
  @Input() cameras:Devices[]
  @Output()close = new EventEmitter();
  irrigate:boolean
  devicesclasified:{[key:string] : Devices[]}
  constructor(public dataService:SharedDataService,public deviceService:DeviceService,public zoneService:ZoneService){
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
    return this.dataService.devices.filter(dev=> dev.types[0].name===value )
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
    this.zoneService.irrigateZone(this.dataService.actPanel.id,this.dataService.actZone.id,!this.irrigate+"")?.subscribe({
      next:(result)=>{
        this.irrigate=!this.irrigate
      }
    })

  }

  ngOnInit() {
      this.devicesclasified["air temperature"]=this.getValue("air temperature")
      this.devicesclasified["soil temperature"]=this.getValue("soil temperature")
      this.devicesclasified["soil Moisture"]=this.getValue("soil Moisture")
      this.devicesclasified["precipitation"]=this.getValue("precipitation")
      this.devicesclasified["irrigate"]=this.getValue("irrigate")
      this.devicesclasified["camera"]=this.getValue("camera")
      this.devicesclasified["irrigate"].forEach(elem=>{
        if(elem.info && elem.info["data"]["irrigate"]=="true") this.irrigate=true
      })
  }

  isButtonVisible(array:Array<string>):boolean{
    let value=false;
    array.forEach(elem=>{
      let temp=this.dataService.panels.find(elem => elem.id === this.dataService.actPanel.id)
      if(temp) if(!!+temp.pivot[elem]) value=true
    })
    return (value)
  }
}


