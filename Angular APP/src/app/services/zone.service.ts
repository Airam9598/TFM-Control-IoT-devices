import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AccessService } from './access-service.service';

@Injectable({
  providedIn: 'root'
})
export class ZoneService {

  baseUrl:string;
   constructor(private http: HttpClient, private authService:AccessService) {
     this.baseUrl=authService.baseUrl;
   }

   public countries:Array<string>=['Afganistan','Albania','Alemania','Andorra','Angola','Antigua y Barbuda','Arabia Saudita / Arabia Saudí','Argelia','Argentina','Armenia','Australia','Austria','Azerbaiyán','Bahamas','Bangladés','Barbados','Baréin','Bélgica','Belice',
   'Bielorrusia','Benín','Birmania / Myanmar','Bolivia','Bosnia y Herzegovina / Bosnia-Herzegovina','Botsuana','Brasil','Brunei','Bulgaria','Burkina Faso','Burundi','Bután','Cabo Verde','Camboya','Camerún','Canadá','Catar','República Centroafricana','Chad',
   'República Checa / Chequia','Chile','China','Chipre','Colombia','Comoras','República del Congo','República Democrática del Congo','Corea del Norte','Corea del Sur','Costa de Marfil','Costa Rica','Croacia','Cuba','Dinamarca','Dominica','República Dominicana',
   'Ecuador','Egipto','El Salvador','Emiratos Árabes Unidos','Eritrea','Eslovaquia','Eslovenia','España','Estados Unidos','Estonia','Etiopía','Filipinas','Finlandia','Fiyi','Francia','Gabón','Gambia','Georgia','Ghana','Granada','Grecia','Guatemala','Guinea',
   'Guinea-Bisáu','Guinea Ecuatorial','Guyana','Haití','Honduras','Hungría','India','Indonesia','Irak','Irán','Irlanda','Islandia','Israel','Italia','Jamaica','Japón','Jordania','Kazajistán','Kenia','Kirguistán','Kiribati','Kuwait','Laos','Lesoto','Letonia','Líbano',
   'Liberia','Libia','Liechtenstein','Lituania','Luxemburgo','Macedonia del Norte','Madagascar','Malasia','Malaui','Maldivas','Mali / Malí','Malta','Marruecos','Islas Marshall','Mauricio','Mauritania','México','Micronesia','Moldavia','Mónaco','Mongolia',
   'Montenegro','Mozambique','Namibia','Nauru','Nepal','Nicaragua','Níger','Nigeria','Noruega','Nueva Zelanda / Nueva Zelandia','Omán','Países Bajos','Pakistán','Palaos','Palestina','Panamá','Papúa Nueva Guinea','Paraguay','Perú','Polonia','Portugal',
   'Reino Unido','Ruanda','Rumania / Rumanía','Rusia','Islas Salomón','Samoa','San Cristóbal y Nieves','San Marino','San Vicente y las Granadinas','Santa Lucía','Santo Tomé y Príncipe','Senegal','Serbia','Seychelles','Sierra Leona','Singapur','Siria',
   'Somalia','Sri Lanka','Suazilandia / Esuatini','Sudáfrica','Sudán','Sudán del Sur','Suecia','Suiza','Surinam','Tailandia','Tanzania','Tayikistán','Timor Oriental','Togo','Tonga','Trinidad y Tobago','Túnez','Turkmenistán','Turquía','Tuvalu','Ucrania','Uganda',
   'Uruguay','Uzbekistán','Vanuatu','Ciudad del Vaticano','Venezuela','Vietnam','Yemen','Yibuti','Zambia','Zimbabue']

   //ZONES
   getZones(idPanel:number):Observable<any> | null {
      let token=this.authService.getToken()
      if(token == null || idPanel==null || idPanel<0) return null
      const headers = new HttpHeaders().set('authorization', `Bearer ${token}`);
      return this.http.get(`${this.baseUrl}panels/${idPanel}/zones`, { "headers":headers })
   }

   setZone(idPanel:number,info:any):Observable<any> | null  {
    let token=this.authService.getToken()
    if(token == null || idPanel==null || idPanel<0 || info==null) return null
    const headers = new HttpHeaders().set('authorization', `Bearer ${token}`)
    return this.http.post(`${this.baseUrl}panels/${idPanel}/zones`,info, { "headers":headers })
  }

  irrigateZone(idPanel:number,id:number,value:string):Observable<any> | null  {
    let token=this.authService.getToken()
    if(token == null || idPanel==null || idPanel<0 || id==null || id<0 || value==null) return null
    const headers = new HttpHeaders().set('authorization', `Bearer ${token}`)
    return this.http.post(`${this.baseUrl}panels/${idPanel}/zones/${id}-irrigate`,{value:value}, { "headers":headers })
  }

  editZone(idPanel:number,id:number,info:any):Observable<any> | null  {
    let token=this.authService.getToken()
    if(token == null || idPanel==null || idPanel<0 || id==null || id<0 || info==null) return null
    const headers = new HttpHeaders().set('authorization', `Bearer ${token}`)
    return this.http.patch(`${this.baseUrl}panels/${idPanel}/zones/${id}`,info, { "headers":headers })
  }

  getCountry(lat:number,lng:number):Observable<any> | null{
    if(lat == null || lng==null) return null
    return this.http.get(`https://nominatim.openstreetmap.org/reverse.php?lat=${lat}&lon=${lng}&zoom=18&format=jsonv2`)
    //https://nominatim.openstreetmap.org/reverse.php?lat=40.13646&lon=-4.30664&zoom=18&format=jsonv2
  }

  deleteZone(id:number,zone_id:number): Observable<any> | null {
    let token=this.authService.getToken()
    if(token == null || id==null) return null
    const headers = new HttpHeaders().set('authorization', `Bearer ${token}`)
    return this.http.delete(`${this.baseUrl}panels/${id}/zones/${zone_id}`, { "headers":headers })
  }

  /* getZone(idPanel:number,id:number) {
     let token=this.authService.getToken()
     if(token != null){
       const headers = new HttpHeaders().set('authorization', `Bearer ${token}`)
       return this.http.get(`${this.baseUrl}panels/${idPanel}/zones/${id}`, { "headers":headers }).pipe(
         map(response => {
           return response as Zones
       }))
     }
   }

   setZone(idPanel:number,info:any) {
     let token=this.authService.getToken()
     if(token != null){
       const headers = new HttpHeaders().set('authorization', `Bearer ${token}`)
       return this.http.post(`${this.baseUrl}panels/${idPanel}/zones`,info, { "headers":headers }).pipe(
         map(response => {
           return response as Zones
       }))
     }
   }

   editZone(idPanel:number,id:number,info:any) {
     let token=this.authService.getToken()
     if(token != null){
       const headers = new HttpHeaders().set('authorization', `Bearer ${token}`)
       return this.http.patch(`${this.baseUrl}panels/${idPanel}/zones/${id}`,info, { "headers":headers }).pipe(
       map(response => {
         return response as Zones
       }));
     }
   }

   deleteZone(idPanel:number,id:number) {
     let token=this.authService.getToken()
     if(token != null){
       const headers = new HttpHeaders().set('authorization', `Bearer ${token}`)
       return this.http.delete(`${this.baseUrl}panels/${idPanel}/zones/${id}`, { "headers":headers }).pipe(
       map(response => {
         return response as Zones
       }))
     }
   }*/
}
