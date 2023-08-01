import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Devices } from 'src/app/models/devices.model';
import { Zones } from 'src/app/models/zones.model';

@Component({
  selector: 'modal-adviselist',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class AdviseList implements OnChanges {
  @Input() devices:Devices[]
  
  advices:Array<String>;
  constructor(){
    this.devices=[]
    this.advices=[]
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.devices.length>0){
      this.devices.forEach(dev=>{
        if(dev.types[0].name=="air temperature"){
          if(dev.zone.max_air_temp){
            if(dev.info.data[dev.types[0].name].value> dev.zone.max_air_temp) this.advices.push("Se ha superado la temperatura del aire en la zona "+dev.zone.name)
          }
          if(dev.zone.min_air_temp){
            if(dev.info.data[dev.types[0].name].value< dev.zone.min_air_temp) this.advices.push("La temperatura del aire está por debajo del mínimo en la zona "+dev.zone.name)
          }

        }else  if(dev.types[0].name=="soil temperature"){
          if(dev.zone.max_soil_temp){
            if(dev.info.data[dev.types[0].name].value> dev.zone.max_soil_temp) this.advices.push("Se ha superado la temperatura del suelo en la zona "+dev.zone.name)
          }
          if(dev.zone.min_soil_temp){
            if(dev.info.data[dev.types[0].name].value< dev.zone.min_soil_temp) this.advices.push("La temperatura del suelo está por debajo del mínimo en la zona "+dev.zone.name)
          }

        }else  if(dev.types[0].name=="soil Moisture"){
          if(dev.zone.max_soil_moisture){
            if(parseFloat((dev.info.data[dev.types[0].name].value * 100).toFixed(2)) > dev.zone.max_soil_moisture) this.advices.push("Se ha superado la humedad del suelo en la zona "+dev.zone.name)
          }
          if(dev.zone.min_soil_moisture){
            if(parseFloat((dev.info.data[dev.types[0].name].value * 100).toFixed(2)) < dev.zone.min_soil_moisture) this.advices.push("La humedad del suelo está por debajo del mínimo en la zona "+dev.zone.name)
          }

        }
      })
    }
  }
}
