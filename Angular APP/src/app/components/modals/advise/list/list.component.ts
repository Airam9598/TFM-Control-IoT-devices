import { Component, Input, DoCheck, SimpleChanges } from '@angular/core';
import { Devices } from 'src/app/models/devices.model';
import { Zones } from 'src/app/models/zones.model';
import * as moment from 'moment';
import { SharedDataService } from 'src/app/shared/data-service';
@Component({
  selector: 'modal-adviselist',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class AdviseList implements DoCheck {

  advices:Array<String>;
  done:boolean
  constructor(protected dataService:SharedDataService){
    this.advices=[]
    this.done=false
  }

  close(){
    this.advices=[]
    this.done=false
  }

  ngDoCheck(): void {
    if(this.dataService.devices.length>0 && !this.done){
      this.dataService.devices.forEach(dev=>{
        if(dev.types[0].name=="air temperature"){
          if(dev.zone.max_air_temp){
            if(dev.info.data[dev.types[0].name].value> dev.zone.max_air_temp) this.advices.push("Se ha superado la temperatura del aire<br><b>Zona:</b> "+dev.zone.name+"<br><b>Dispositivo:</b> "+dev.name+"<br><b>Fecha:</b> "+moment().format('DD/MM/YYYY HH:mm'))
          }
          if(dev.zone.min_air_temp){
            if(dev.info.data[dev.types[0].name].value< dev.zone.min_air_temp) this.advices.push("La temperatura del aire está por debajo del mínimo<br><b>Zona:</b> "+dev.zone.name+"<br><b>Dispositivo:</b> "+dev.name+"<br><b>Fecha:</b> "+moment().format('DD/MM/YYYY HH:mm'))
          }

        }else  if(dev.types[0].name=="soil temperature"){
          if(dev.zone.max_soil_temp){
            if(dev.info.data[dev.types[0].name].value> dev.zone.max_soil_temp) this.advices.push("Se ha superado la temperatura del suelo<br><b>Zona:</b> "+dev.zone.name+"<br><b>Dispositivo:</b> "+dev.name+"<br><b>Fecha:</b> "+moment().format('DD/MM/YYYY HH:mm'))
          }
          if(dev.zone.min_soil_temp){
            if(dev.info.data[dev.types[0].name].value< dev.zone.min_soil_temp) this.advices.push("La temperatura del suelo está por debajo del mínimo<br><b>Zona:</b> "+dev.zone.name+"<br><b>Dispositivo:</b> "+dev.name+"<br><b>Fecha:</b> "+moment().format('DD/MM/YYYY HH:mm'))
          }

        }else  if(dev.types[0].name=="soil Moisture"){
          if(dev.zone.max_soil_moisture){
            if(parseFloat((dev.info.data[dev.types[0].name].value * 100).toFixed(2)) > dev.zone.max_soil_moisture) this.advices.push("Se ha superado la humedad del suelo<br><b>Zona:</b> "+dev.zone.name+"<br><b>Dispositivo:</b> "+dev.name+"<br><b>Fecha:</b> "+moment().format('DD/MM/YYYY HH:mm'))
          }
          if(dev.zone.min_soil_moisture){
            if(parseFloat((dev.info.data[dev.types[0].name].value * 100).toFixed(2)) < dev.zone.min_soil_moisture) this.advices.push("La humedad del suelo está por debajo del mínimo<br><b>Zona:</b> "+dev.zone.name+"<br><b>Dispositivo:</b> "+dev.name+"<br><b>Fecha:</b> "+moment().format('DD/MM/YYYY HH:mm'))
          }

        }
      })
      this.done=true;
    }
  }
}
