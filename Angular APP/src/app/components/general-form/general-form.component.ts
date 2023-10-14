import { Component, EventEmitter, Output, Input, OnChanges, SimpleChanges,AfterViewInit, OnDestroy, Renderer2, ElementRef } from '@angular/core';
import {FormGroup } from '@angular/forms';
import { GeneralForm } from 'src/app/models/generalform.model';
import { Types } from 'src/app/models/types.model';
import { DeviceService } from 'src/app/services/device.service';
import { ZoneService } from 'src/app/services/zone.service';
import * as L from 'leaflet';
import { SharedDataService } from 'src/app/shared/data-service';

@Component({
  selector: 'app-general-form',
  templateUrl: './general-form.component.html',
  styleUrls: ['./general-form.component.css']
})
export class GeneralFormComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Output() submited = new EventEmitter();
  @Output() closeEvent = new EventEmitter<any>();
  @Output() deleteEvent = new EventEmitter<any>();
  @Input() formGroup:FormGroup
  @Input() title:string
  @Input() elements:GeneralForm[]
  @Input() error:string
  @Input() editedItem:any
  device:boolean
  zone:boolean
  perms:boolean
  showExtra:boolean
  delete:boolean
  types:Types[]
  button:string
  text:string
  createdTypes:Array<string>
  countries:Array<string>
  map:any;
  mark:any
  constructor(protected deviceService:DeviceService,protected zoneService:ZoneService,protected dataService:SharedDataService,
    private renderer: Renderer2, private el: ElementRef){
    this.error=""
    this.formGroup=new FormGroup({})
    this.title=""
    this.countries=this.zoneService.countries
    this.elements=[]
    this.createdTypes=[]
    this.device=false
    this.zone=false
    this.perms=false
    this.showExtra=false;
    this.delete=false
    this.text="";
    this.button="Crear"
    this.elements.find(elem=>{
      if(elem.type=="type_device") this.device=true
    });
    this.elements=this.elements.filter(elem=>elem.type!="type_device")
    this.types=[]
    this.preventScroll();
  }
  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'no-scroll');
  }
  preventScroll(){
    this.el.nativeElement.ownerDocument.body.scrollTop = 0;
    this.el.nativeElement.ownerDocument.documentElement.scrollTop = 0;
    this.renderer.addClass(document.body, 'no-scroll');
  }

  ngAfterViewInit(): void {
    if(this.zone){
      this.buildMap()
    }
  }

  ngOnChanges(change:SimpleChanges){
    this.device=false
    this.zone=false
    this.delete=false
    this.elements.find(elem=>{
      if(elem.type=="type_device") this.device=true
      if(elem.type=="country") this.zone=true
      if(elem.type=="password") this.text="user"
      if(elem.type=="perms") this.perms=true
    });
    if(this.device){
      this.elements=this.elements.filter(elem=>elem.type!="type_device")
      if(this.types.length==0){
        this.deviceService.getTypes()?.subscribe({
          next:(reponse)=>{
            this.types=reponse.data as Types[]
            setTimeout(()=>{
              this.configure()
            },500)
          }
        })
      }else{
        this.configure()
      }
    }else if(this.zone){
      this.elements=this.elements.filter(elem=>elem.type!="country")
      this.configure()
    }else if(this.perms){
      this.elements=[]
      this.configure()
    }else{
      this.configure()
    }

  }

  configure(){
    if(this.editedItem && this.editedItem.id>0){
      this.title=this.title.replace("Crear","Editar");
      this.button="Editar"
      let info:{[key: string]: any}={}
      Object.keys(this.formGroup.value).forEach((key:string) => {
        info[key]=this.editedItem[key]
      });
      if(this.device){
        this.text="device"
          this.editedItem.types.forEach((value:any)=>{
          if(this.editedItem.info && value.name=="camera"){
            this.formGroup.patchValue({
              url: this.editedItem.info["data"][value.name]
            });
          }
          (document.getElementById(value.name) as HTMLInputElement).checked=true
          this.createdTypes.push(value.id.toString())
        })
      }else if(this.zone){
        this.text="zone"
      }else if(this.perms){
        info={
          admin: !!+this.editedItem.pivot["admin"],
          history: !!+this.editedItem.pivot["history"],
          camera: !!+this.editedItem.pivot["camera"],
          devices: !!+this.editedItem.pivot["devices"],
          zones: !!+this.editedItem.pivot["zones"],
          irrigate: !!+this.editedItem.pivot["irrigate"],
        }
      }
      this.formGroup.patchValue(info)
    }else{
      this.button="Crear"
      this.formGroup.reset();
      this.createdTypes=[]
    }
  }

  closeDelete(){
    this.deleteEvent.emit()
    this.delete=false
  }

  closePanel(){
    this.closeEvent.emit()
    this.button="Crear"
    this.formGroup.reset();
    this.createdTypes=[]
  }

  submit(){
    this.error=""
    if(this.formGroup.valid){
      if(this.device){
        this.formGroup.value['type']=this.createdTypes
      }
      this.submited.emit(this.formGroup.value)
    }
  }

  checkvalid(input:any){
    input.target.classList.remove(input.target.checkValidity()? 'is-invalid':'is-valid')
    input.target.classList.add(input.target.checkValidity()? 'is-valid':'is-invalid')
  }

  editType(info:any){
    if((info.target as HTMLInputElement).checked){
      this.createdTypes.push(info.target.value)
    }else{
      this.createdTypes=this.createdTypes.filter(elem=>elem!= info.target.value)
    }
  }

  tranlate(text: string): string {
    let type:{[key: string]: string}={
      'soil Moisture': 'Humedad del suelo',
      'soil temperature': 'Temperatura del suelo',
      'air temperature': 'Temperatura del aire',
      'precipitation': 'Precipitación',
      'camera': 'Cámara',
      'irrigate':'Riego'
    }
    return type[text]|| text
  }

  changeCountry(info:any){
    if(info.target){
      this.formGroup.patchValue({country:info.target.value})
    }else{
      this.formGroup.patchValue({country:info.value})
    }
  }

  buildMap(){
    try {
      this.map.off();
      this.map.remove();
    } catch (error) {}
      let map = L.map("map3",{scrollWheelZoom:true,minZoom: 1}).setView([27.96, -15.6], 1);
      let osm = L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        noWrap: true
      }),
      satellite = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
        noWrap: true
      });
      map.addLayer(osm);
      var baseMaps = {
        "OpenStreetMap": osm,
        "Satélite": satellite,
      };
      L.control.layers(baseMaps,{}, {position: 'bottomleft'}).addTo(map);

      map.on('click', (e:any)=> {
        this.loaddata(map,Number(e.latlng.lat.toFixed(4)),Number(e.latlng.lng.toFixed(4)))
      });
      map.invalidateSize(true)
      this.map=map
      if(this.editedItem.id>0){
        var basicBeachIcon = new L.Icon({ iconUrl: "../../../../assets/pointer.png", iconAnchor: new L.Point(19, 20),iconSize: [30, 45] ,scrollWheelZoom:'center' });
        let markerOptions = {
          clickable: false,
          icon: basicBeachIcon
        }
        this.mark=L.marker(new L.LatLng(this.dataService.actZone.lat, this.dataService.actZone.lng), markerOptions);
        this.mark.addTo(this.map);
      }
  }

  loaddata(map:any,lat:number,lng:number){
    if ( this.mark!=undefined && this.map.hasLayer(this.mark)) {
      this.map.removeLayer(this.mark);
    }
    this.zoneService.getCountry(lat,lng)?.subscribe({
      next:(request)=>{
        let address= request.address
        if(address){
          (document.getElementById("countrySelect") as HTMLSelectElement).value=address.country
          this.changeCountry((document.getElementById("countrySelect") as HTMLSelectElement))
        }else{
          (document.getElementById("countrySelect") as HTMLSelectElement).value=''
        }
      }
    })
    this.formGroup.patchValue({lat:lat,lng: lng});
      var basicBeachIcon = new L.Icon({ iconUrl: "../../../../assets/pointer.png", iconAnchor: new L.Point(19, 20),iconSize: [30, 45] ,scrollWheelZoom:'center' });
        let markerOptions = {
          clickable: false,
          icon: basicBeachIcon
        }
        this.mark=L.marker(new L.LatLng(lat, lng), markerOptions);
        this.mark.addTo(map);
  }

  checkAdmin(elem:any){
    if(elem.target.checked){
      (document.getElementById("history") as HTMLInputElement).disabled=true;
      (document.getElementById("camera") as HTMLInputElement).disabled=true;
      (document.getElementById("devices") as HTMLInputElement).disabled=true;
      (document.getElementById("zones") as HTMLInputElement).disabled=true;
      (document.getElementById("irrigate") as HTMLInputElement).disabled=true;
      this.formGroup.patchValue({
        history: true,
        camera: true,
        devices: true,
        zones: true,
        irrigate: true,
      });
    }else{
      (document.getElementById("history") as HTMLInputElement).disabled=false;
      (document.getElementById("camera") as HTMLInputElement).disabled=false;
      (document.getElementById("devices") as HTMLInputElement).disabled=false;
      (document.getElementById("zones") as HTMLInputElement).disabled=false;
      (document.getElementById("irrigate") as HTMLInputElement).disabled=false;
    }
  }
}
