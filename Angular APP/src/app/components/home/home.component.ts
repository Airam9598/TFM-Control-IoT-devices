import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Panels } from 'src/app/models/panels.model';
import { Users } from 'src/app/models/users.model';
import { AccessService } from 'src/app/services/access-service.service';
import { PanelService } from 'src/app/services/panel.service';
import { ChartComponent } from "ng-apexcharts";

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ApexFill,
  ApexTitleSubtitle
} from "ng-apexcharts";
import { Devices } from 'src/app/models/devices.model';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  fill: ApexFill;
  title:ApexTitleSubtitle;
  responsive: ApexResponsive[];
  labels: any;
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers:[PanelService, AccessService]
})
export class HomeComponent {

  panels:Panels[]
  user:Users
  actPanel:Panels
  devices:Devices[]
  panelUpdate:any
  @ViewChild("chartdev") chartdev!: ChartComponent;
  @ViewChild("chartcountryzones") chartzone!: ChartComponent;

  public devchartOptions: Partial<any>;
  public zonechartOptions: Partial<any>;

  constructor(private panelservice:PanelService,private loginservice:AccessService, private route: Router, private cookieService:CookieService){
    this.panels=[]
    this.devices=[]
    this.actPanel=new Panels(-1,"","")
    this.user=new Users(-1,"","","",[],"")
    this.devchartOptions = {
      series: [1,1],
      chart: {
        width: 380,
        type: "pie"
      },
      dataLabels: {
        enabled: true,
        formatter: function (val:any, opts:any) {
          return Math.trunc(val).toString()
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
          return Math.trunc(val).toString()
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
    
    this.logincheck()
    this.panelUpdate = setInterval(() => this.reloadPanels(), 5000);
  }


  logincheck() {
    this.loginservice.isLoggedIn().subscribe((isLoggedIn) => {
      if (!isLoggedIn){
        this.loginservice.deleteToken()
        this.route.navigate(['/'])
      }
      this.user=this.loginservice.user
      this.panels=this.user.panels
      let panelId=this.cookieService.get("panel");
      if(this.panels.length >0 && panelId != null){
        const panel = this.panels.find(panel => panel.id === parseInt(panelId));
        if (panel) {
          this.actPanel=panel
        }else{
          this.actPanel=this.panels[0]
          this.cookieService.set("panels",this.actPanel.id.toString())
        }
      }
    });
  }

  reloadPanels(){
    if(this.panels && this.panels.length > 0)  clearInterval(this.panelUpdate)
    this.panelservice.getPanels()?.subscribe({
      next:(response)=>{
        this.panels = response.data as Panels[]
        //this.loading=false
      },
      error:(error)=>{
        //this.loading=false
        //this.error=true;
       /* if(error.error.message!=null){
          this.errorMessage = error.error.message
        }else{
          Object.keys(error.error).forEach((key: string) => {
            Object.keys(error.error[key]).forEach((key2: string) => {
            if(this.errorMessage.length>0) this.errorMessage+='<br><br>'
            this.errorMessage = this.errorMessage + error.error[key][key2][error.error[key][key2].length - 1];
            })
          })
          
        }*/
      } 
    });
  }

  closeSes(){
    this.loginservice.logout()?.subscribe({
      next:(response)=>{
        this.route.navigate(['/'])
      },
      error:(error)=>{
        this.route.navigate(['/'])
      } 
    });
  }

}
