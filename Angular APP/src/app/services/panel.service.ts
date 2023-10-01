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
    if(token == null) return null
    const headers = new HttpHeaders().set('authorization', `Bearer ${token}`)
    return this.http.get<any>(this.baseUrl+"panels",{ "headers":headers })
  }

  setPanel(name:string): Observable<any> | null {
    let token=this.authService.getToken()
    if(token == null) return null
    const headers = new HttpHeaders().set('authorization', `Bearer ${token}`)
    return this.http.post<any>(this.baseUrl+"panels",{ "name": name, "diference_days":0 },{ "headers":headers })
  }

  editPanel(id:number,name:string,day:number): Observable<any> | null {
    let token=this.authService.getToken()
    if(token == null || id==null || name==null || day== null) return null
    const headers = new HttpHeaders().set('authorization', `Bearer ${token}`)
    return this.http.patch(`${this.baseUrl}panels/${id}`,{ "name": name, "diference_days":day }, { "headers":headers })
  }

  deletePanel(id:number): Observable<any> | null {
    let token=this.authService.getToken()
    if(token == null || id==null) return null
    const headers = new HttpHeaders().set('authorization', `Bearer ${token}`)
    return this.http.delete(`${this.baseUrl}panels/${id}`, { "headers":headers })
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
   }*/
}
