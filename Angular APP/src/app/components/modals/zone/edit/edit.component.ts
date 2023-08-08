import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Panels } from 'src/app/models/panels.model';
import { Users } from 'src/app/models/users.model';
import { Zones } from 'src/app/models/zones.model';
import { AccessService } from 'src/app/services/access-service.service';
import { SharedDataService } from 'src/app/shared/data-service';
import * as L from 'leaflet';
import { ZoneService } from 'src/app/services/zone.service';

@Component({
  selector: 'module-zone-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditZoneComponent implements AfterViewInit{
  countries:Array<string>=['Afganistan','Albania','Alemania','Andorra','Angola','Antigua y Barbuda','Arabia Saudita / Arabia Saudí','Argelia','Argentina','Armenia','Australia','Austria','Azerbaiyán','Bahamas','Bangladés','Barbados','Baréin','Bélgica','Belice',
  'Bielorrusia','Benín','Birmania / Myanmar','Bolivia','Bosnia y Herzegovina / Bosnia-Herzegovina','Botsuana','Brasil','Brunei','Bulgaria','Burkina Faso','Burundi','Bután','Cabo Verde','Camboya','Camerún','Canadá','Catar','República Centroafricana','Chad',
  'República Checa / Chequia','Chile','China','Chipre','Colombia','Comoras','República del Congo','República Democrática del Congo','Corea del Norte','Corea del Sur','Costa de Marfil','Costa Rica','Croacia','Cuba','Dinamarca','Dominica','República Dominicana',
  'Ecuador','Egipto','El Salvador','Emiratos Árabes Unidos','Eritrea','Eslovaquia','Eslovenia','España','Estados Unidos','Estonia','Etiopía','Filipinas','Finlandia','Fiyi','Francia','Gabón','Gambia','Georgia','Ghana','Granada','Grecia','Guatemala','Guinea',
  'Guinea-Bisáu','Guinea Ecuatorial','Guyana','Haití','Honduras','Hungría','India','Indonesia','Irak','Irán','Irlanda','Islandia','Israel','Italia','Jamaica','Japón','Jordania','Kazajistán','Kenia','Kirguistán','Kiribati','Kuwait','Laos','Lesoto','Letonia','Líbano',
  'Liberia','Libia','Liechtenstein','Lituania','Luxemburgo','Macedonia del Norte','Madagascar','Malasia','Malaui','Maldivas','Mali / Malí','Malta','Marruecos','Islas Marshall','Mauricio','Mauritania','México','Micronesia','Moldavia','Mónaco','Mongolia',
  'Montenegro','Mozambique','Namibia','Nauru','Nepal','Nicaragua','Níger','Nigeria','Noruega','Nueva Zelanda / Nueva Zelandia','Omán','Países Bajos','Pakistán','Palaos','Palestina','Panamá','Papúa Nueva Guinea','Paraguay','Perú','Polonia','Portugal',
  'Reino Unido','Ruanda','Rumania / Rumanía','Rusia','Islas Salomón','Samoa','San Cristóbal y Nieves','San Marino','San Vicente y las Granadinas','Santa Lucía','Santo Tomé y Príncipe','Senegal','Serbia','Seychelles','Sierra Leona','Singapur','Siria',
  'Somalia','Sri Lanka','Suazilandia / Esuatini','Sudáfrica','Sudán','Sudán del Sur','Suecia','Suiza','Surinam','Tailandia','Tanzania','Tayikistán','Timor Oriental','Togo','Tonga','Trinidad y Tobago','Túnez','Turkmenistán','Turquía','Tuvalu','Ucrania','Uganda',
  'Uruguay','Uzbekistán','Vanuatu','Ciudad del Vaticano','Venezuela','Vietnam','Yemen','Yibuti','Zambia','Zimbabue']
  
  zoneform = new FormGroup({
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

  error:boolean
  errorMessage: string
  actPanel:Panels
  map:any;
  button:string;
  mark:any
  init:boolean
  showExtra:boolean
  @Output() dataEvent = new EventEmitter<any>();
  @Input() actZone:Zones
  constructor(private route:Router,private loginservice:AccessService, private dataService:SharedDataService, public zoneService:ZoneService){
    this.error=false
    this.showExtra=false
    this.errorMessage=""
    this.button="Crear"
    this.actZone=new Zones(-1,"","",0,0,-1)
    this.actPanel=new Panels(-1,"",0,{})
    if(this.actZone.id >0){
      this.button="Editar"
      this.zoneform.patchValue({name: this.actZone.name,country: this.actZone.country,lat: this.actZone.lat,lng: this.actZone.lng});
    }
    this.dataService.getUser().then((userData: Users) => {
      this.actPanel=this.dataService.actPanel
    }).catch((error) => {});
    this.init=false
  }
  restore() {
    if(this.mark != undefined) this.map.removeLayer(this.mark)
    if(this.actZone.id>0){
      this.button="Editar"
      this.zoneform.patchValue({
        name: this.actZone.name,
        country: this.actZone.country,
        lat: this.actZone.lat,
        lng: this.actZone.lng,
        max_air_temp:this.actZone.max_air_temp,
        min_air_temp:this.actZone.min_air_temp,
        max_soil_moisture:this.actZone.max_soil_moisture,
        min_soil_moisture:this.actZone.min_soil_moisture,
        max_soil_temp:this.actZone.max_soil_temp,
        min_soil_temp:this.actZone.min_soil_temp
      });
      var basicBeachIcon = new L.Icon({ iconUrl: "../../../../assets/pointer.png", iconAnchor: new L.Point(19, 20),iconSize: [30, 45] ,scrollWheelZoom:'center' });
      let markerOptions = {
        clickable: false,
        icon: basicBeachIcon
      }
      this.mark=L.marker(new L.LatLng(this.actZone.lat, this.actZone.lng), markerOptions);
      this.mark.addTo(this.map);
      
    }else{
      this.zoneform.patchValue({
        name: "",
        country: "",
        lat: 0,
        lng: 0,
        max_air_temp:undefined,
        min_air_temp:undefined,
        max_soil_moisture:undefined,
        min_soil_moisture:undefined,
        max_soil_temp:undefined,
        min_soil_temp:undefined
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
      if(this.init)this.restore()
    
    }
    /*if(this.actZone.id >0){
      this.button="Editar"
      this.zoneform.patchValue({
        name: this.actZone.name,
        country: this.actZone.country,
        lat: this.actZone.lat,
        lng: this.actZone.lng,
        max_air_temp:this.actZone.max_air_temp,
        min_air_temp:this.actZone.min_air_temp,
        max_soil_moisture:this.actZone.max_soil_moisture,
        min_soil_moisture:this.actZone.min_soil_moisture,
        max_soil_temp:this.actZone.max_soil_temp,
        min_soil_temp:this.actZone.min_soil_temp
      });
      var basicBeachIcon = new L.Icon({ iconUrl: "../../../../assets/pointer.png", iconAnchor: new L.Point(19, 20),iconSize: [30, 45] ,scrollWheelZoom:'center' });
        let markerOptions = {
          clickable: false,
          icon: basicBeachIcon
        }
        this.mark=L.marker(new L.LatLng(this.actZone.lat, this.actZone.lng), markerOptions);
        this.mark.addTo(this.map);
    }*/

  ngAfterViewInit(): void {
    setTimeout(()=>{
      if(this.actZone.id >0){
        this.button="Editar"
        this.zoneform.patchValue({
          name: this.actZone.name,
          country: this.actZone.country,
          lat: this.actZone.lat,
          lng: this.actZone.lng,
          max_air_temp:this.actZone.max_air_temp,
          min_air_temp:this.actZone.min_air_temp,
          max_soil_moisture:this.actZone.max_soil_moisture,
          min_soil_moisture:this.actZone.min_soil_moisture,
          max_soil_temp:this.actZone.max_soil_temp,
          min_soil_temp:this.actZone.min_soil_temp
        });
      }
    try {
      this.map.off();
      this.map.remove();
    } catch (error) {}
      let map = L.map("map2",{scrollWheelZoom:true,minZoom: 1}).setView([0,0], 1);
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
      
      map.on('click', (e)=> {
        this.loaddata(map,Number(e.latlng.lat.toFixed(4)),Number(e.latlng.lng.toFixed(4)))
      });
      map.invalidateSize(true)
      this.map=map;
      if(this.actZone.id>0)this.restore()
      this.init=true
    },5000)
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
    this.zoneform.patchValue({lat:lat,lng: lng});
      var basicBeachIcon = new L.Icon({ iconUrl: "../../../../assets/pointer.png", iconAnchor: new L.Point(19, 20),iconSize: [30, 45] ,scrollWheelZoom:'center' });
        let markerOptions = {
          clickable: false,
          icon: basicBeachIcon
        }
        this.mark=L.marker(new L.LatLng(lat, lng), markerOptions);
        this.mark.addTo(map);
  }


  editZone(){
    this.errorMessage=""
    let info=this.zoneform.value
    if(info){
      for(let val of Object.keys(info)){
        if (info[val as keyof typeof info] == undefined) {
          delete info[val as keyof typeof info]
        }
      }
    }
    if (Object.keys(info).length>0) {
      if(this.actZone.id>0){
        this.zoneService.editZone(this.actPanel.id,this.actZone.id,info)?.subscribe({
          next:(response)=>{
            this.dataService.getZones();
            (document.getElementById("closeEditZone") as HTMLButtonElement).click()
            this.dataEvent.emit(response.data as Zones);
            this.restore()
          },
          error:(error)=>{
            this.error=true;
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
        this.zoneService.setZone(this.actPanel.id,info)?.subscribe({
          next:(response)=>{
            this.dataService.getZones();
            (document.getElementById("closeEditZone") as HTMLButtonElement).click()
            this.dataEvent.emit(info);
            this.restore()
          },
          error:(error)=>{
            this.error=true;
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

  checkvalid(input:any){
    input.target.classList.remove(input.target.checkValidity()? 'is-invalid':'is-valid')
    input.target.classList.add(input.target.checkValidity()? 'is-valid':'is-invalid')
  }

  changeCountry(info:any){
    if(info.target){
      this.zoneform.patchValue({country:info.target.value})
    }else{
      this.zoneform.patchValue({country:info.value})
    }
  }

}
