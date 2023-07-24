import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { Devices } from 'src/app/models/devices.model';
import { Types } from 'src/app/models/types.model';

@Component({
  selector: 'modal-devlist',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})


export class DevListComponent implements OnChanges {
  @Input() devices:Devices[]
  @Output() dataEvent = new EventEmitter<any>();
  constructor(){
    this.devices=[]
  }

  close(){
    this.devices=[]
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.devices.length>0){
    }
  } 

  setDevice(device:Devices){
    this.dataEvent.emit(device);
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

}
