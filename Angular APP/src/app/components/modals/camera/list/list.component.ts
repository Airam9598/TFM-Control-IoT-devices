import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Devices } from 'src/app/models/devices.model';
import { SharedDataService } from 'src/app/shared/data-service';

@Component({
  selector: 'modal-camera-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListCameraComponent implements OnChanges {
  @Input() devices:Devices[]
  cameras:Devices[]
  constructor(protected dataService:SharedDataService){
    this.cameras=[]
    this.devices=[]
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.cameras=[]
    this.devices.forEach(dev=>{
      if(dev.types[0].name.includes("camera")){
        this.cameras.push(dev)
      }
    })
  }

  open(item:Devices){
    window.open(item.info.data.camera, "_blank")
  }
}
