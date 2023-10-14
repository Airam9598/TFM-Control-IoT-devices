import { Component, EventEmitter, Input, Output, SimpleChanges,OnChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Devices } from 'src/app/models/devices.model';
import { GeneralForm } from 'src/app/models/generalform.model';
import { Types } from 'src/app/models/types.model';
import { DeviceService } from 'src/app/services/device.service';
import { SharedDataService } from 'src/app/shared/data-service';

@Component({
  selector: 'app-general-list',
  templateUrl: './general-list.component.html',
  styleUrls: ['./general-list.component.css']
})
export class GeneralListComponent {
  @Output() setDeviceEvent = new EventEmitter<any>();
  @Output() closeEvent = new EventEmitter<any>();
  @Input() type:string
  @Input() title:string

  cameras:Devices[]
  showDevice:boolean
  devFormGroup = new FormGroup({
    name: new FormControl('',[Validators.required,Validators.minLength(2),Validators.maxLength(50)]),
    dev_id: new FormControl('',[Validators.required]),
    url: new FormControl('',[]),
  });
  devElements=[new GeneralForm("name","text","Nombre",true),new GeneralForm("dev_id","text","Identificador",true),new GeneralForm("type","type_device","Tipo de dispositivo",true)]
  errorMessage:string
  createdTypes:Array<string>
  constructor(protected dataService:SharedDataService,protected deviceService:DeviceService){
    this.type="";
    this.title=""
    this.errorMessage=""
    this.cameras=[]
    this.showDevice=false
    this.createdTypes=[]
    this.dataService.devices.forEach(dev=>{
      if(dev.types[0].name.includes("camera")){
        this.cameras.push(dev)
      }
    })
  }

  closePanel(){
    this.closeEvent.emit()
  }

  setDevice(device:Devices){
    this.dataService.actDev=device
    this.showDevice=true
  }
  unsetDevice(){
    this.dataService.actDev=new Devices("",-1,"","",-1,this.dataService.actZone,[],[])
    this.showDevice=false
  }

  setImage(type:Types[]):string{
    let images:{[key:string]:string}={
      'device':"../../../../assets/device.png",
      'soil Moisture':"../../../../assets/sensor_hum.png",
      'irrigate':"../../../../assets/irrigate.png",
      'soil temperature':"../../../../assets/sensor_temp.png",
      'air temperature':"../../../../assets/sensor_temp.png",
      '':"../../../../assets/sensor_hum_temp.png",
      'camera':"../../../../assets/camera.png",
    }
    return images[type[0].name] || images["device"]
  }

  isButtonVisible(array:Array<string>):boolean{
    let value=false;
    array.forEach(elem=>{
      let temp=this.dataService.panels.find(elem => elem.id === this.dataService.actPanel.id)
      if(temp) if(!!+temp.pivot[elem]) value=true
    })
    return (value)
  }


  open(item:Devices){
    window.open(item.info.data.camera, "_blank")
  }

  createDevice(info:any){
    this.errorMessage=""
    if(info){
      for(let val of Object.keys(info)){
        if (info[val as keyof typeof info] == undefined) {
          delete info[val as keyof typeof info]
        }
      }
    }

    if(info.type.length<=0){
      this.errorMessage = "Hay que elegir un tipo de dispositivo"
      return
    }

    if (Object.keys(info).length>0) {
      if(this.dataService.actDev.id>0){
        this.deviceService.editDevice(this.dataService.actPanel.id,this.dataService.actZone.id,this.dataService.actDev.id,info)?.subscribe({
          next:(response)=>{
            (document.getElementById("closegeneralForm") as HTMLButtonElement).click()
            //this.dataEvent2.emit(response.data as Devices);
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
        this.deviceService.setDevice(this.dataService.actPanel.id,this.dataService.actZone.id,info)?.subscribe({
          next:(response)=>{
            (document.getElementById("closegeneralForm") as HTMLButtonElement).click()
            //this.dataEvent.emit(response.data as Devices);
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
