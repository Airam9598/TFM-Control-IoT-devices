import { AfterViewInit, Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import * as ApexCharts from 'apexcharts';
import { ChartComponent } from 'ng-apexcharts';
import { Devices } from 'src/app/models/devices.model';
import { Zones } from 'src/app/models/zones.model';
import * as moment from 'moment';
@Component({
  selector: 'modal-history-show',
  templateUrl: './history-show.component.html',
  styleUrls: ['./history-show.component.css']
})
export class HistoryShowComponent implements OnChanges {
  @Input() devices:Devices[]
  @Input() zone:Zones
  reloadChart:boolean
  values:{[key:string]:{[key2:string]:Array<{[key:string]:number}>}}
  @ViewChild("chartdev") chartdev!: ChartComponent;
  @ViewChild("chartdevchart") chartdev2!: ChartComponent;
  public devchartOptions: Partial<any>;
  constructor(){
    this.devices=[]
    this.values={}
    this.zone=new Zones(-1,"","",0,0,0)
    this.reloadChart=true
    
    this.devchartOptions = {
      series: [],
      chart: {
      type: 'line',
      height: 350,
      stroke: {
        curve: 'straight',
      },
      animations: {
        enabled: false,
    },
      zoom: {
        type: 'x',
        enabled: true,
        //autoScaleYaxis: true
      },
      toolbar: {
        autoSelected: 'zoom'
      }
    },
    dataLabels: {
      enabled: false
    },
    markers: {
      size: 0,
    },
    labels: [],
    yaxis: {
    },
    xaxis: {
      type: 'datetime',
      tooltip: { enabled: false }
    },
    tooltip: {
      shared: true,
      y: {
        formatter: function (val:any) {
          return (val / 1000000).toFixed(0)
        }
      }
    }
    };

  }

  ngOnChanges(changes: SimpleChanges) {
    this.values={}
    this.devchartOptions['series']=[]
    if(this.devices.length>0){
      this.devices=this.devices.filter(elem=>elem.types[0].name!="irrigate" && elem.types[0].name!="camera" )
      this.devices.forEach(dev=>{
        if(Array.isArray(dev.info.data[dev.types[0].name])){
          dev.info.data[dev.types[0].name].sort((a:any, b:any) => {
            const dateA = parseInt(a.date.$date.$numberLong);
            const dateB = parseInt(b.date.$date.$numberLong);
            return dateA - dateB;
          });
          dev.info.data[dev.types[0].name].forEach((elem:any)=>{
            if(this.values[dev.types[0].name]==undefined) this.values[dev.types[0].name]={}
            if(this.values[dev.types[0].name][dev.id]==undefined) this.values[dev.types[0].name][dev.id]=[]
            this.values[dev.types[0].name][dev.id].push({ x: moment(parseInt(elem.date.$date.$numberLong)).valueOf(), y:parseFloat(elem.value) })
            //this.values[dev.types[0].name][dev.id].push(parseFloat(elem.value))
          })
        }else{
          this.values[dev.types[0].name][dev.id].push({ x: moment(parseInt(dev.info.data[dev.types[0].name].date.$date.$numberLong)).valueOf(), y:parseFloat(dev.info.data[dev.types[0].name].value) })
        }
      })
    }

    let types:{[key:string]:string}={
      "soil temperature":'Temperatura del suelo',
      "air temperature":'Temperatura del aire',
      "soil Moisture":'Humedad del suelo'
      
    }

    let i=0
    Object.keys(this.values).forEach(elem=>{
      if(this.values[elem]!= undefined){
        this.multieject(elem,i,types)
        setTimeout(()=>{
          (document.getElementById(elem) as HTMLSelectElement).value=Object.keys(this.values[elem])[0]
        },500)
      }
      i++
    })
  } 

  async multieject(elem:string,i:number,types:{[key:string]:string}){
      this.devchartOptions['series'].push({name: types[elem],data: []})
      this.devchartOptions['series'][i].data= this.values[elem][Object.keys(this.values[elem])[0]]

      if (elem === "soil Moisture") {
        const dataPoints = this.values[elem][Object.keys(this.values[elem])[0]];
        this.devchartOptions['series'][i].data = dataPoints.map(dataPoint => ({
          x: dataPoint["x"],
          y: (dataPoint["y"] * 100).toFixed(2)
        }));
      }
  }

  changeDevice(elem:any){
    let types:{[key:string]:string}={
      "soil temperature":'Temperatura del suelo',
      "air temperature":'Temperatura del aire',
      "soil Moisture":'Humedad del suelo'
    }
    if(elem.target.value==""){
      this.devchartOptions['series'][Object.keys(this.values).findIndex(val=> elem.target.id==val)].name=""
      this.devchartOptions['series'][Object.keys(this.values).findIndex(val=> elem.target.id==val)].data=[]
      this.reloadChart=false
      setTimeout(()=>{
        this.reloadChart=true
      },50)
      return 
    }
    this.devchartOptions['series'][Object.keys(this.values).findIndex(val=> elem.target.id==val)].name=types[(elem.target.options[elem.target.selectedIndex] as HTMLOptionElement).innerText.split("(")[1].split("/")[0].trim()]
    this.devchartOptions['series'][Object.keys(this.values).findIndex(val=> elem.target.id==val)].data=this.values[(elem.target.options[elem.target.selectedIndex] as HTMLOptionElement).innerText.split("(")[1].split("/")[0].trim()][elem.target.value]
    if((elem.target.options[elem.target.selectedIndex] as HTMLOptionElement).innerText.split("(")[1].split("/")[0].trim()=="soil Moisture"){
      this.devchartOptions['series'][Object.keys(this.values).findIndex(val=> elem.target.id==val)].data=this.values[(elem.target.options[elem.target.selectedIndex] as HTMLOptionElement).innerText.split("(")[1].split("/")[0].trim()][elem.target.value].map(dataPoint =>({
        x: dataPoint["x"],
        y: (dataPoint["y"] * 100).toFixed(2)
      }));
    }
    this.reloadChart=false
    setTimeout(()=>{
      this.reloadChart=true
    },50)
    
    
  }
}
