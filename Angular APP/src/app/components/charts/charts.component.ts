import { Component, ViewChild, Input,OnChanges, SimpleChanges} from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import { SharedDataService } from 'src/app/shared/data-service';
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
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnChanges {
  @Input() elements:any
  @Input() title:string
  @Input() labels:Array<string>
  @Input() colors:Array<string>
  @Input() action:string
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<any>;
  show=true;
  activateddevices:Map<string,number>
  countries:Map<string,number>

 constructor( protected dataService:SharedDataService){
  this.labels=[]
  this.colors=[]
  this.action=""
  this.title=""
  this.countries=new Map
  this.activateddevices=new Map
  this.activateddevices.set("Activos",0)
  this.activateddevices.set("Inactivos",0)
  this.chartOptions = {
    series: [] ,
    chart: {
      width: 380,
      type: "pie",
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
    labels: this.labels,
    colors: this.colors,
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
 }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.elements.length>0 && this.action=="dev"){
      this.activateddevices=new Map
      this.activateddevices.set("Activos",0)
      this.activateddevices.set("Inactivos",0)
      this.elements.forEach((dev:any)=>{
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
     this.chartOptions['series']=Array.from(this.activateddevices.values())
     this.chartOptions['labels']=Array.from(this.activateddevices.keys())
     this.chartOptions['colors']=Array.from(this.colors)
    }else if(this.elements.length>0 && this.action=="country"){
      this.countries=new Map
      for(let zone of this.elements){
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
      this.chartOptions['series']=Array.from(this.countries.values())
      this.chartOptions['labels']=Array.from(this.countries.keys())
    }

  }
}
