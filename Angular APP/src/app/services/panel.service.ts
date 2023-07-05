import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AccessService } from './access-service.service';
import { Observable, map } from 'rxjs';
import { Panels } from '../models/panels.model';

@Injectable({
  providedIn: 'root'
})
export class PanelService {

  baseUrl:string;
  // ApiKey ="yAIyErrGfRxVNdKiCrQcwVXxu085X1yKbZIJ5AfDK4hWAK"
   constructor(private http: HttpClient,private cookieService: CookieService, private authService:AccessService) { 
     this.baseUrl=authService.baseUrl;
   }
 
   //PANELS
   getPanels(): Observable<any> | null {
     let token=this.authService.getToken()
     if(token != null){
      const headers = new HttpHeaders().set('authorization', `Bearer ${token}`)
      return this.http.get<any>(this.baseUrl+"panels",{ "headers":headers })
     }
     return null
   }
 
   setPanel(name:string): Observable<any> | null {
     let token=this.authService.getToken()
     if(token != null){
      const headers = new HttpHeaders().set('authorization', `Bearer ${token}`)
      return this.http.post<any>(this.baseUrl+"panels",{ "name": name },{ "headers":headers })
     }
     return null
   }
 
  /* 
   getPanel(id:number) {
     let token=this.authService.getToken()
     if(token != null){
       const headers = new HttpHeaders().set('authorization', `Bearer ${token}`)
       return this.http.get(`${this.baseUrl}panels/${id}`, { "headers":headers }).pipe(
         map(response => {
           return response as Panels
       }))
     }
   }
  
  editPanel(id:number,name:string) {
     let token=this.authService.getToken()
     if(token != null){
       const headers = new HttpHeaders().set('authorization', `Bearer ${token}`)
       return this.http.patch(`${this.baseUrl}panels/${id}`,{ "name": name }, { "headers":headers }).pipe(
       map(response => {
         return response as Panels
       }));
     }
   }
 
   deletePanel(id:number) {
     let token=this.authService.getToken()
     if(token != null){
       const headers = new HttpHeaders().set('authorization', `Bearer ${token}`)
       return this.http.delete(`${this.baseUrl}panels/${id}`, { "headers":headers }).pipe(
       map(response => {
         return response as Panels
       }))
     }
   }*/
}
