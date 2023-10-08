import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { Devices } from 'src/app/models/devices.model';
import { Types } from 'src/app/models/types.model';
import { Users } from 'src/app/models/users.model';
import { SharedDataService } from 'src/app/shared/data-service';

@Component({
  selector: 'modal-devlist',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})


export class DevListComponent implements OnChanges {
  @Output() dataEvent = new EventEmitter<any>();
  actUser:Users
  constructor(protected dataService:SharedDataService){
    this.actUser=new Users(-1,"","","",[],{})
    this.dataService.getUser().then((userData: Users) => {
      this.actUser=userData
    })
  }

  close(){
    this.dataService.devices=[]
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.dataService.devices.length>0){
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

  isButtonVisible(array:Array<string>):boolean{
    let value=false;
    array.forEach(elem=>{
      let temp=this.actUser.panels.find(elem => elem.id === this.dataService.actPanel.id)
      if(temp) if(!!+temp.pivot[elem]) value=true
    })
    return (this.actUser.id >= 0 && value)
  }

}
