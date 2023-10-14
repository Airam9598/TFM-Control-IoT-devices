import { Component, ViewChild, OnInit,Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Panels } from 'src/app/models/panels.model';
import { Users } from 'src/app/models/users.model';
import { AccessService } from 'src/app/services/access-service.service';
import { PanelService } from 'src/app/services/panel.service';
import { ChartComponent } from "ng-apexcharts";
import * as moment from 'moment';
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ApexFill,
  ApexTitleSubtitle,
  ApexOptions
} from "ng-apexcharts";
import { Devices } from 'src/app/models/devices.model';
import { SharedDataService } from 'src/app/shared/data-service';
import { Zones } from 'src/app/models/zones.model';
import { DeviceService } from 'src/app/services/device.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GeneralForm } from 'src/app/models/generalform.model';


export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  fill: ApexFill;
  title:ApexTitleSubtitle;
  responsive: ApexResponsive[];
  labels: any;
  events:any;
  options:ChartOptions
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

@Injectable()
export class HomeComponent {
  panelFormGroup=new FormGroup({
    name: new FormControl('',[Validators.required,Validators.minLength(2),Validators.maxLength(50)])
  })
  panelElements=[new GeneralForm("name","text","Nombre",true)]
  errorMessage:string
  showPanel:boolean


  initialLoading:boolean
  backUpZones:Zones[]
  backUpdevices:Devices[]
  advises:Array<string>
  countries:Map<string,number>
  activateddevices:Map<string,number>
  panelUpdate:any
  loading:boolean
  error:boolean
  @ViewChild("chartdev") chartdev!: ChartComponent;
  @ViewChild("chartcountryzones") chartzone!: ChartComponent;

  public devchartOptions: Partial<any>;
  public zonechartOptions: Partial<any>;

  constructor(protected deviceService:DeviceService, protected panelService:PanelService,protected loginservice:AccessService, protected dataService:SharedDataService, protected actRoute: ActivatedRoute, protected route: Router, protected cookieService:CookieService){
    if(dataService.userData.id<=0){
      this.route.navigate(['/loading'])
    }
    this.showPanel=false;
    this.errorMessage=""
    this.loading=false
    this.initialLoading=true
    this.error=false
    this.advises=[]
    this.activateddevices=new Map
    this.activateddevices.set("Activos",0)
    this.activateddevices.set("Inactivos",0)
    this.backUpZones=[]
    this.backUpdevices=[]
    this.countries=new Map

    this.devchartOptions = {
      series: [],
      chart: {
        width: 380,
        type: "pie",
        events: {
          dataPointSelection: (event:any, chartContext:any, config:any) => {
            if(this.devchartOptions['labels'][config["selectedDataPoints"][0]]){
              var res = new Date();
              res.setDate(res.getDate() - this.dataService.actPanel.diference_days);
              if(this.devchartOptions['labels'][config["selectedDataPoints"][0]]=="Inactivos"){
                this.backUpdevices=this.dataService.devices.filter(dev=> dev.types[0].name!="camera" && dev.types[0].name!="irrigate" && dev.info && dev.info.data[dev.types[0].name].date && res.valueOf()>dev.info.data[dev.types[0].name].date.$date.$numberLong)
              }else{
                this.backUpdevices=this.dataService.devices.filter(dev=> dev.types[0].name=="camera" || dev.types[0].name=="irrigate" || !dev.info || !dev.info.data[dev.types[0].name].date || res.valueOf()<=dev.info.data[dev.types[0].name].date!.$date.$numberLong)
              }
            }else{
              this.backUpdevices=this.dataService.devices
            }
          }
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val:any, opts:any) {
          return opts.w.config.series[opts.seriesIndex];
        },
        style: {
          fontFamily: 'Arial, sans-serif',
          fontSize: '15px',
          fontWeight: 'bold',
        }
      },
      legend: {
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px',
        fontWeight: 'bold',
      },
      stroke: {
        curve: "smooth",
        width: 0
      },
      fill: {
        type: 'gradient',
      },
      labels: ["Activos", "Inactivos"],
      colors: [ "#18cf75","#F44336"],
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 1000,
        animateGradually: {
            enabled: true,
            delay: 200
        },
        dynamicAnimation: {
            enabled: true,
            speed: 350
        }
      },
      responsive: [
        {
          breakpoint: 520,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };

    this.zonechartOptions = {
      series: [44, 55, 13, 43, 22],
      chart: {
        width: 380,
        type: "pie"
      },
      dataLabels: {
        enabled: true,
        formatter: function (val:any, opts:any) {
          return opts.w.config.series[opts.seriesIndex];
        },
        style: {
          fontFamily: 'Arial, sans-serif',
          fontSize: '15px',
          fontWeight: 'bold',
        }
      },
      stroke: {
        curve: "smooth",
        width: 0
      },
      fill: {
        type: 'gradient',
      },
      labels: ["Italia", "España", "Alemania", "Mexico","Francia"],
      legend: {
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px',
        fontWeight: 'bold',
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 1000,
        animateGradually: {
            enabled: true,
            delay: 200
        },
        dynamicAnimation: {
            enabled: true,
            speed: 350
        }
      },
      responsive: [
        {
          breakpoint: 520,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };

    this.loadInfo();
  }

  loadInfo(): void {
        this.backUpZones=[...this.dataService.zones] as Zones[]
        for(let zone of this.dataService.zones){
          if(this.countries.has(zone.country)){
            const count = this.countries.get(zone.country);
            if (count !== undefined) this.countries.set(zone.country, count + 1);
          }else{
            this.countries.set(zone.country,1)
          }
        }
        this.countries=new Map([...this.countries.entries()].sort((a, b) => {
          return b[1]- a[1] ;
        }))
        this.zonechartOptions['series']=Array.from(this.countries.values())
        this.zonechartOptions['labels']=Array.from(this.countries.keys())

        this.deviceService.getDevicesPanel(this.dataService.actPanel.id)?.subscribe({
            next:(result)=>{
              if(result.data.length==0) return
              this.dataService.devices=result.data as Devices[]
              this.dataService.devices.forEach(dev=>{
                if(dev.types[0].name=="air temperature"){
                  if(dev.zone.max_air_temp){
                    if(dev.info.data[dev.types[0].name].value> dev.zone.max_air_temp) this.advises.push("Se ha superado la temperatura del aire<br><b>Zona:</b> "+dev.zone.name+"<br><b>Dispositivo:</b> "+dev.name+"<br><b>Fecha:</b> "+moment().format('DD/MM/YYYY HH:mm'))
                  }
                  if(dev.zone.min_air_temp){
                    if(dev.info.data[dev.types[0].name].value< dev.zone.min_air_temp) this.advises.push("La temperatura del aire está por debajo del mínimo<br><b>Zona:</b> "+dev.zone.name+"<br><b>Dispositivo:</b> "+dev.name+"<br><b>Fecha:</b> "+moment().format('DD/MM/YYYY HH:mm'))
                  }

                }else  if(dev.types[0].name=="soil temperature"){
                  if(dev.zone.max_soil_temp){
                    if(dev.info.data[dev.types[0].name].value> dev.zone.max_soil_temp) this.advises.push("Se ha superado la temperatura del suelo<br><b>Zona:</b> "+dev.zone.name+"<br><b>Dispositivo:</b> "+dev.name+"<br><b>Fecha:</b> "+moment().format('DD/MM/YYYY HH:mm'))
                  }
                  if(dev.zone.min_soil_temp){
                    if(dev.info.data[dev.types[0].name].value< dev.zone.min_soil_temp) this.advises.push("La temperatura del suelo está por debajo del mínimo<br><b>Zona:</b> "+dev.zone.name+"<br><b>Dispositivo:</b> "+dev.name+"<br><b>Fecha:</b> "+moment().format('DD/MM/YYYY HH:mm'))
                  }

                }else  if(dev.types[0].name=="soil Moisture"){
                  if(dev.zone.max_soil_moisture){
                    if(parseFloat((dev.info.data[dev.types[0].name].value * 100).toFixed(2)) > dev.zone.max_soil_moisture) this.advises.push("Se ha superado la humedad del suelo<br><b>Zona:</b> "+dev.zone.name+"<br><b>Dispositivo:</b> "+dev.name+"<br><b>Fecha:</b> "+moment().format('DD/MM/YYYY HH:mm'))
                  }
                  if(dev.zone.min_soil_moisture){
                    if(parseFloat((dev.info.data[dev.types[0].name].value * 100).toFixed(2)) < dev.zone.min_soil_moisture) this.advises.push("La humedad del suelo está por debajo del mínimo<br><b>Zona:</b> "+dev.zone.name+"<br><b>Dispositivo:</b> "+dev.name+"<br><b>Fecha:</b> "+moment().format('DD/MM/YYYY HH:mm'))
                  }

                }
                var res = new Date();
                res.setDate(res.getDate() - this.dataService.actPanel.diference_days);
                if(dev.types[0].name!="camera" && dev.types[0].name!="irrigate" && dev.info && dev.info.data[dev.types[0].name].date && res.valueOf()>dev.info.data[dev.types[0].name].date.$date.$numberLong){
                  if (this.activateddevices.has("Inactivos")) {
                    this.activateddevices.set("Inactivos", this.activateddevices.get("Inactivos")! + 1);
                  } else {
                    this.activateddevices.set("Inactivos", 1);
                  }
                }else if(dev.types[0].name=="camera" || dev.types[0].name=="irrigate" || !dev.info || !dev.info.data[dev.types[0].name].date || res.valueOf()<=dev.info.data[dev.types[0].name].date!.$date.$numberLong){
                  if (this.activateddevices.has("Activos")) {
                    this.activateddevices.set("Activos", this.activateddevices.get("Activos")! + 1);
                  } else {
                    this.activateddevices.set("Activos", 1);
                  }
                }
              })
              this.devchartOptions['series']=Array.from(this.activateddevices.values())
              this.devchartOptions['labels']=Array.from(this.activateddevices.keys())
              this.devchartOptions['events'] = {
                click: (event:any, chartContext:any, config:any) => {
                  console.log("Data point selected:", chartContext, config);
                }
              };
              this.backUpdevices= [...this.dataService.devices] as Devices[]
              this.initialLoading=false;
            },
            error: (err) => {
              console.error('Error al obtener los dispositivos:', err);
              this.initialLoading=false;
            }
        })
        this.initialLoading=false
  }


  filter(elem:any){
    this.activateddevices=new Map
    this.activateddevices.set("Activos",0)
    this.activateddevices.set("Inactivos",0)
    if(elem.target.value==""){
      this.backUpZones=this.dataService.zones
      this.backUpdevices=this.dataService.devices
      this.backUpdevices.forEach(dev=>{
        var res = new Date();
        res.setDate(res.getDate() - this.dataService.actPanel.diference_days);
        if(dev.types[0].name!="camera" && dev.types[0].name!="irrigate" && res.valueOf()>dev.info.data[dev.types[0].name].date.$date.$numberLong){
          if (this.activateddevices.has("Inactivos")) {
            this.activateddevices.set("Inactivos", this.activateddevices.get("Inactivos")! + 1);
          } else {
            this.activateddevices.set("Inactivos", 1);
          }
        }else if(dev.types[0].name=="camera" || dev.types[0].name=="irrigate" || res.valueOf()<=dev.info.data[dev.types[0].name].date!.$date.$numberLong){
          if (this.activateddevices.has("Activos")) {
            this.activateddevices.set("Activos", this.activateddevices.get("Activos")! + 1);
          } else {
            this.activateddevices.set("Activos", 1);
          }
        }
      })
      this.devchartOptions['series']=Array.from(this.activateddevices.values())
      this.devchartOptions['labels']=Array.from(this.activateddevices.keys())
      this.zonechartOptions['series']=Array.from(this.countries.values())
      this.zonechartOptions['labels']=Array.from(this.countries.keys())
      return
    }

    this.backUpZones=this.dataService.zones.filter(zone=>zone.country==elem.target.value)
    this.backUpdevices=this.dataService.devices.filter(dev=>dev.zone.country==elem.target.value)

    this.backUpdevices.forEach(dev=>{
      var res = new Date();
      res.setDate(res.getDate() - this.dataService.actPanel.diference_days);
      if(dev.types[0].name!="camera" && dev.types[0].name!="irrigate" && res.valueOf()>dev.info.data[dev.types[0].name].date.$date.$numberLong){
        if (this.activateddevices.has("Inactivos")) {
          this.activateddevices.set("Inactivos", this.activateddevices.get("Inactivos")! + 1);
        } else {
          this.activateddevices.set("Inactivos", 1);
        }
      }else if(dev.types[0].name=="camera" || dev.types[0].name=="irrigate" || res.valueOf()<=dev.info.data[dev.types[0].name].date!.$date.$numberLong){
        if (this.activateddevices.has("Activos")) {
          this.activateddevices.set("Activos", this.activateddevices.get("Activos")! + 1);
        } else {
          this.activateddevices.set("Activos", 1);
        }
      }
    })
    this.devchartOptions['series']=Array.from(this.activateddevices.values())
    this.devchartOptions['labels']=Array.from(this.activateddevices.keys())
    this.zonechartOptions['series']=[this.backUpZones.length]
    this.zonechartOptions['labels']=[elem.target.value]

  }

  countryKeys():Array<string>{
    return Array.from(this.countries.keys())
  }

  getDate2(date:any){
    if(date){
      let tempdate=date.$date.$numberLong
      return moment(parseInt(tempdate)).format('DD/MM/YYYY HH:mm')
    }else{
      return "Sin datos"
    }

  }

  reloadPanels(){
    this.error=false
    this.loading=true
    this.panelService.getPanels()?.subscribe({
      next:(response)=>{
        this.dataService.updatePanels(response.data as Panels[])
        this.loading=false
        if(this.dataService.panels.length<=0){
          this.error=true
        }else{
          this.route.navigateByUrl('/', { skipLocationChange: true }).then(() =>
          this.route.navigate(["/home"]))
        }
      },
      error:(error)=>{
        this.error=true
      }
    });
  }

  closeSes(){
    this.loginservice.logout()
    this.route.navigate(['/'])
  }

  createPanel($elements:any){
    this.panelService.setPanel($elements.name)?.subscribe({
      next:(response)=>{
        this.route.navigate(["/loading"])
      },
      error:(error)=>{
        this.errorMessage=""
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
