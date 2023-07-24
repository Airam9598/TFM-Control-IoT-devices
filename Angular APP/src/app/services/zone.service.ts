import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AccessService } from './access-service.service';

@Injectable({
  providedIn: 'root'
})
export class ZoneService {

  baseUrl:string;
  // ApiKey ="yAIyErrGfRxVNdKiCrQcwVXxu085X1yKbZIJ5AfDK4hWAK"
   constructor(private http: HttpClient, private authService:AccessService) { 
     this.baseUrl=authService.baseUrl;
   }
 
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
