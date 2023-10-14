import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Devices } from 'src/app/models/devices.model';
import { GeneralForm } from 'src/app/models/generalform.model';
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
  @Output()editZone = new EventEmitter();
  @Output()deleteZone = new EventEmitter();
  irrigate:boolean
  showDevices:boolean
  showCameras:boolean
  showZone:boolean
  devicesclasified:{[key:string] : Devices[]}

  zoneFormGroup = new FormGroup({
    name: new FormControl('',[Validators.required,Validators.minLength(2),Validators.maxLength(50)]),
    country: new FormControl('',[Validators.required]),
    lat: new FormControl(0,[Validators.required]),
    lng: new FormControl(0,[Validators.required]),
    max_soil_temp: new FormControl(),
    min_soil_temp: new FormControl(),
    max_soil_moisture: new FormControl(),
    min_soil_moisture: new FormControl(),
    max_air_temp: new FormControl(),
    min_air_temp: new FormControl(),
  });
  zoneElements=[new GeneralForm("name","text","Nombre",true),new GeneralForm("country","country","País",true)]

  errorMessage:string
  constructor(public dataService:SharedDataService,public deviceService:DeviceService,public zoneService:ZoneService){
    this.cameras=[]
    this.errorMessage=""
    this.irrigate=false
    this.showZone=false
    this.showDevices=false
    this.showCameras=false
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
    this.dataService.actZone=new Zones(-1,"","",0,0,0)
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

  createZone(info:any){
      this.errorMessage=""
      if(info){
        for(let val of Object.keys(info)){
          if (info[val as keyof typeof info] == undefined) {
            delete info[val as keyof typeof info]
          }
        }
      }
      if (Object.keys(info).length>0) {
        if(this.dataService.actZone.id>0){
          this.zoneService.editZone(this.dataService.actPanel.id,this.dataService.actZone.id,info)?.subscribe({
            next:(response)=>{
              this.dataService.actZone=response.data as Zones
              this.dataService.getZones();
              this.showZone=false;
              this.editZone.emit()
             // this.restore()
            },
            error:(error)=>{
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

        }else{
          this.zoneService.setZone(this.dataService.actPanel.id,info)?.subscribe({
            next:(response)=>{
              this.dataService.getZones();
              this.showZone=false
              this.editZone.emit()
              //this.restore()
            },
            error:(error)=>{
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
  }
}


