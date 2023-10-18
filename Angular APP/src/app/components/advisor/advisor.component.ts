import { Component, Input, DoCheck, Output, EventEmitter } from '@angular/core';
import { Zones } from 'src/app/models/zones.model';
import { SharedDataService } from 'src/app/shared/data-service';
import * as moment from 'moment';
import { Router } from '@angular/router';
@Component({
  selector: 'app-advisor',
  templateUrl: './advisor.component.html',
  styleUrls: ['./advisor.component.css']
})
export class AdvisorComponent implements DoCheck {
  @Input() zone:Zones=new Zones(-1,"","",-1,0,0)
  @Output() closeEvent=new EventEmitter<any>();
  advices:Array<string>
  numDevices:number
  constructor(protected dataService:SharedDataService,protected router:Router){
    this.advices=[]
    this.numDevices=0;
  }
  ngDoCheck(): void {
    if(this.numDevices==0 && this.dataService.devices){
      this.numDevices=this.dataService.devices.length
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
      });
    }
  }
}
