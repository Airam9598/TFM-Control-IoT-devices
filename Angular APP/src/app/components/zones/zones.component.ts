import { AfterViewInit, Component } from '@angular/core';
import { Users } from 'src/app/models/users.model';
import { Zones } from 'src/app/models/zones.model';
import { ZoneService } from 'src/app/services/zone.service';
import { SharedDataService } from 'src/app/shared/data-service';
import * as L from 'leaflet';
import { Devices } from 'src/app/models/devices.model';
import { DeviceService } from 'src/app/services/device.service';
import { Panels } from 'src/app/models/panels.model';
import { Router } from '@angular/router';
@Component({
  selector: 'app-zones',
  templateUrl: './zones.component.html',
  styleUrls: ['./zones.component.css']
})
export class ZonesComponent implements AfterViewInit {
  initialLoading:boolean
  backUpZones:Zones[]
  map:any
  loadedDevices:boolean
  countries:Array<string>
  actUser:Users
  tempZone:any
  constructor(protected zoneService:ZoneService,protected dataService:SharedDataService,protected deviceService:DeviceService,protected router:Router){
    this.actUser=new Users(-1,"","","",[],{})
    this.backUpZones=[]
    this.initialLoading=true
    this.countries=[]
    this.loadedDevices=false
    this.dataService.devices=[]
    this.tempZone=this.router.getCurrentNavigation()!.extras.state
  }

  ngAfterViewInit(): void {
    this.dataService.getUser().then((userData: Users) => {
      this.actUser=userData
      this.backUpZones=[...this.dataService.zones.sort((a, b) => {
        if (a.country < b.country) {
          return -1;
        } else if (a.country > b.country) {
          return 1;
        } else {
          return 0;
        }
      })] as Zones[]

      this.backUpZones.filter(elem=>{
          if(!this.countries.find(country=> elem.country==country)){
            this.countries.push(elem.country)
          }
      })

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

    if(this.tempZone){
      this.dataService.actZone=this.tempZone['name'] as Zones
      this.openZonesInfo(this.dataService.actZone)
    }
  }

  openZonesInfo(zone:Zones){
    this.dataService.actZone=zone;
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
          this.dataService.actZone=zone
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
        });
    });
    this.initialLoading=false
  }

  updateZone(info:any){
    if(this.dataService.actZone.id>0){
      this.dataService.actZone=info as Zones
    }
    this.dataService.zones=[]
    this.dataService.getZones().then((zones: Zones[]) => {
      this.backUpZones=[...zones] as Zones[]
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
    this.dataService.actZone=new Zones(-1,"","",0,0,0)
    this.loadedDevices=false
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

  filter(elem:any){
    if(elem.target.value==""){
      this.backUpZones=[...this.dataService.zones] as Zones[]
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



    if(elem.target.id=="filtercountry") this.backUpZones=this.dataService.zones.filter(zone=>zone.country==elem.target.value)
    if(elem.target.id=="filtername") this.backUpZones=this.dataService.zones.filter(zone=>zone.name.toLowerCase().includes(elem.target.value.toLowerCase()))
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

  isButtonVisible(array:Array<string>):boolean{
    let value=false;
    array.forEach(elem=>{
      let temp=this.actUser.panels.find(elem => elem.id === this.dataService.actPanel.id)
      if(temp) if(!!+temp.pivot[elem]) value=true
    })
    return (this.actUser.id >= 0 && value)
  }

}
