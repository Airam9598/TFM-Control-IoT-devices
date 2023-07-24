import { AfterViewInit, Component } from '@angular/core';
import { Users } from 'src/app/models/users.model';
import { Zones } from 'src/app/models/zones.model';
import { ZoneService } from 'src/app/services/zone.service';
import { SharedDataService } from 'src/app/shared/data-service';
import * as L from 'leaflet';
import { Devices } from 'src/app/models/devices.model';
import { DeviceService } from 'src/app/services/device.service';
@Component({
  selector: 'app-zones',
  templateUrl: './zones.component.html',
  styleUrls: ['./zones.component.css']
})
export class ZonesComponent implements AfterViewInit {

  zones:Zones[]
  devices:Devices[]
  backUpZones:Zones[]
  map:any
  countries:Array<string>
  actZone:Zones
  actDev:Devices
  constructor(public zoneService:ZoneService,public dataService:SharedDataService,public deviceService:DeviceService){
    this.zones=[]
    this.devices=[]
    this.actZone=new Zones(-1,"","",0,0,-1)
    this.actDev=new Devices("",-1,"","",0,this.actZone,[],[])
    this.backUpZones=[]
    this.countries=[]
  }

  ngAfterViewInit(): void {
    this.dataService.getUser().then((userData: Users) => {
      this.zones=this.dataService.zones.sort((a, b) => {
        if (a.country < b.country) {
          return -1;
        } else if (a.country > b.country) {
          return 1;
        } else {
          return 0;
        }
      })
      this.backUpZones=this.dataService.zones.sort((a, b) => {
        if (a.country < b.country) {
          return -1;
        } else if (a.country > b.country) {
          return 1;
        } else {
          return 0;
        }
      })

     this.backUpZones.filter(elem=>{
        if(!this.countries.find(country=> elem.country==country)){
          this.countries.push(elem.country)
        }
     })
      /*let i=0;
      while(this.zones.length<500){
        this.zones.push(new Zones(-1,"Test"+i,"España",(Math.random()*(180 - -180)+-180),(Math.random()*(180 - -180)+-180),this.dataService.actPanel.id))
      }*/

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

    
    }).catch((error) => {});
  }

  loaddata(){
    let llatlngmark:any=[];
    this.zones.forEach((zone:Zones)=>{
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
          this.actZone=zone
          this.deviceService.getDevicesRecent(this.dataService.actPanel.id,this.actZone.id)?.subscribe({
            next:(result)=>{
              this.devices=(result.data as Devices[])
            },
            error: (err) => {
              console.error('Error al obtener los dispositivos:', err);
            }
          })
        });     
    });
  }

  updateZone(info:any){
    if(this.actZone.id>0){
      this.actZone=info as Zones
    }
    this.dataService.zones=[]
    this.dataService.getZones().then((zones: Zones[]) => {
    this.zones=zones
    try {
      this.map.off()
      this.map.remove()
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
      this.map=map
      this.loaddata()
    
    })
  }

  resetZone(){
    this.actZone=new Zones(-1,"","",0,0,0)
  }

  addDevice(device:Devices){
    if(!this.devices.find(elem=>elem.id==device.id)){
      this.devices.push(device)
    }
    this.actDev=device
  }

  deleteDevice(dev:Devices){
    this.devices = this.devices.filter(dev2 => dev2.id !== dev.id);
  }

  changeDevice(device:Devices){
    this.actDev=device
  }

  filter(elem:any){
    if(elem.target.value==""){
      this.zones=this.backUpZones
      this.map.off();
      this.map.remove();
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
      return
    }

   
    
    this.zones=this.backUpZones.filter(zone=>zone.country==elem.target.value)
    this.map.off();
    this.map.remove();
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
    
}
