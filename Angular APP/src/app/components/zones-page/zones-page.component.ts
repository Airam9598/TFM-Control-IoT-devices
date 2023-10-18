import { Component , OnInit} from '@angular/core';
import { Zones } from 'src/app/models/zones.model';
import { ZoneService } from 'src/app/services/zone.service';
import { SharedDataService } from 'src/app/shared/data-service';
import * as L from 'leaflet';
import { Devices } from 'src/app/models/devices.model';
import { DeviceService } from 'src/app/services/device.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GeneralForm } from 'src/app/models/generalform.model';

@Component({
  selector: 'app-zones-page',
  templateUrl: './zones-page.component.html',
  styleUrls: ['./zones-page.component.css']
})
export class ZonesPageComponent  implements OnInit{
    initialLoading:boolean
    backUpZones:Zones[]
    map:any
    loadedDevices:boolean
    showZone:boolean
    showHistory:boolean
    tempZone:any
    zoneFormGroup = new FormGroup({
      name: new FormControl('',[Validators.required,Validators.minLength(2),Validators.maxLength(50)]),
      country: new FormControl('',[Validators.required]),
      lat: new FormControl(0,[Validators.required]),
      lng: new FormControl(0,[Validators.required]),
      max_soil_temp: new FormControl(),
      min_soil_temp: new FormControl(),
      max_soil_moisture: new FormControl(),
      min_soil_moisture: new FormControl(),
      max_air_temp: new FormControl(),
      min_air_temp: new FormControl(),
    });
    zoneElements=[new GeneralForm("name","text","Nombre",true),new GeneralForm("country","country","País",true)]

    errorMessage:string
    constructor(protected zoneService:ZoneService,protected dataService:SharedDataService,protected deviceService:DeviceService,protected router:Router){
      if(dataService.userData.id<=0){
        this.router.navigate(['/loading'])
      }
      this.backUpZones=[]
      this.errorMessage=""
      this.showZone=false
      this.initialLoading=true
      this.showHistory=false
      this.loadedDevices=false
      this.dataService.devices=[]
      this.dataService.actZone=new Zones(-1,"","",-1,-1,-1)
      this.tempZone=this.router.getCurrentNavigation()!.extras.state
    }

    ngOnInit(): void {
      this.filter([...this.dataService.zones]as Zones[])
      if(this.tempZone){
        this.dataService.actZone=this.tempZone['name'] as Zones
        this.openZonesInfo(this.dataService.actZone)
      }
    }

    openZonesInfo(zone:Zones){
      this.loadedDevices=false
      this.dataService.actZone=zone;
      if(this.router.url=="/zones"){
        this.deviceService.getDevicesRecent(this.dataService.actPanel.id,this.dataService.actZone.id)?.subscribe({
          next:(result)=>{
            this.dataService.devices=(result.data as Devices[])
            this.loadedDevices=true
          },
          error: (err) => {
            this.dataService.devices=[]
            console.error('Error al obtener los dispositivos:', err);
          }
        })
      }else if(this.router.url=="/history"){
        this.deviceService.getDevicesHistory(this.dataService.actPanel.id,this.dataService.actZone.id)?.subscribe({
          next:(result)=>{
            this.dataService.devices=(result.data as Devices[]);
            this.loadedDevices=true;
            this.showHistory=true;

          },
          error: (err) => {
            console.error('Error al obtener los dispositivos:', err);
          }
        })
      }
    }

    loaddata(){
      let llatlngmark:any=[];
      this.backUpZones.forEach((zone:Zones)=>{
        var basicBeachIcon = new L.Icon({ iconUrl: "../../../assets/pointer.png", iconAnchor: new L.Point(19, 20),iconSize: [35, 50] ,scrollWheelZoom:'center' });
          let markerOptions = {
            clickable: false,
            icon: basicBeachIcon
          }
          let mark=L.marker(new L.LatLng(zone.lat, zone.lng), markerOptions);
          mark.bindPopup('<div><strong>'+zone.name+'</strong></div>').openPopup();
          mark.addTo(this.map);
          mark.on('mouseover',function(ev:any) {
            mark.openPopup();
          });

          mark.on('mouseout',(ev:any)=> {
            this.map.closePopup();
          });

          mark.on('click',()=> {
           this.openZonesInfo(zone)
          });
      });
      this.initialLoading=false
    }

    updateZone(info:any){
      if(this.dataService.actZone.id>0){
        this.dataService.actZone=info as Zones
      }
      this.zoneService.getZones(this.dataService.actPanel.id)?.subscribe({
        next: (zones) => {
          this.backUpZones=zones.data as Zones[]
          this.filter(zones.data as Zones[])
        },
        error: (error2) => {
          this.backUpZones=[]
          this.filter([])
        }
      });
    }

    addDevice(device:Devices){
      if(!this.dataService.devices.find(elem=>elem.id==device.id)){
        this.dataService.devices.push(device)
      }
      this.dataService.actDev=device
      this.deviceService.getDevicesRecent(this.dataService.actPanel.id,this.dataService.actZone.id)?.subscribe({
        next:(result)=>{
          this.dataService.devices=(result.data as Devices[])
          this.loadedDevices=true
        },
        error: (err) => {
          this.dataService.devices=[]
          console.error('Error al obtener los dispositivos:', err);
        }
      })
    }

    deleteDevice(dev:Devices){
      this.dataService.devices = this.dataService.devices.filter(dev2 => dev2.id !== dev.id);
    }

    changeDevice(device:Devices){
      this.dataService.actDev=device
      this.deviceService.getDevicesRecent(this.dataService.actPanel.id,this.dataService.actZone.id)?.subscribe({
        next:(result)=>{
          this.dataService.devices=(result.data as Devices[])
          this.loadedDevices=true
        },
        error: (err) => {
          this.dataService.devices=[]
          console.error('Error al obtener los dispositivos:', err);
        }
      })
    }

    filter(elem:Zones[]){
      this.backUpZones=elem;
      try {
        this.map.off();
        this.map.remove();
      } catch (error) {}
      let map = L.map("map",{scrollWheelZoom:true,minZoom: 2}).setView([27.96, -15.6], 3);
      let osm = L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        noWrap: true // Set the noWrap option to true
      }),
      satellite = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
        noWrap: true // Set the noWrap option to true
      });
      map.addLayer(osm);
      var baseMaps = {
        "OpenStreetMap": osm,
        "Satélite": satellite,
      };
      L.control.layers(baseMaps,{}, {position: 'bottomleft'}).addTo(map);
      this.map=map;
      this.loaddata();
    }

    isButtonVisible(array:Array<string>):boolean{
      let value=false;
      array.forEach(elem=>{
        let temp=this.dataService.userData.panels.find(elem => elem.id === this.dataService.actPanel.id)
        if(temp) if(!!+temp.pivot[elem]) value=true
      })
      return (this.dataService.userData.id >= 0 && value)
    }

    createZone(info:any){
      this.errorMessage=""
      if(info){
        for(let val of Object.keys(info)){
          if (info[val as keyof typeof info] == undefined) {
            delete info[val as keyof typeof info]
          }
        }
      }
      if (Object.keys(info).length>0) {
        if(this.dataService.actZone.id>0){
          this.zoneService.editZone(this.dataService.actPanel.id,this.dataService.actZone.id,info)?.subscribe({
            next:(response)=>{
              this.dataService.actZone=response.data as Zones
              this.showZone=false;
              this.updateZone(this.dataService.actZone)
             // this.restore()
            },
            error:(error)=>{
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

        }else{
          this.zoneService.setZone(this.dataService.actPanel.id,info)?.subscribe({
            next:(response)=>{
              this.showZone=false
              this.updateZone(null)
              //this.restore()
            },
            error:(error)=>{
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
  }

  }

