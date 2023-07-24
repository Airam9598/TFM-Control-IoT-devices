import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AccessService } from './access-service.service';
import { Observable, catchError, map } from 'rxjs';
import { Devices } from '../models/devices.model';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  baseUrl:string;
  // ApiKey ="yAIyErrGfRxVNdKiCrQcwVXxu085X1yKbZIJ5AfDK4hWAK"
  constructor(private http: HttpClient,private cookieService: CookieService, private authService:AccessService) { 
    this.baseUrl=authService.baseUrl;
  }
 
  getTypes(): Observable<any> | null {
    let token=this.authService.getToken()
    if(token == null)return null
    const headers = new HttpHeaders().set('authorization', `Bearer ${token}`);
    return this.http.get(`${this.baseUrl}types`, { "headers":headers })
  }

  //DEVICES
  getDevices(idPanel:number, idZone:number): Observable<any> | null | undefined {
    let token=this.authService.getToken()
    if(token == null || idPanel==null || idPanel<0 || idZone<0 || idZone==null)return null
    const headers = new HttpHeaders().set('authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.baseUrl}panels/${idPanel}/zones/${idZone}/devices`, { headers })
  }

  getDevicesPanel(idPanel:number): Observable<any> | null | undefined {
    let token=this.authService.getToken()
    if(token == null || idPanel==null || idPanel<0)return null
    const headers = new HttpHeaders().set('authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.baseUrl}panels/${idPanel}/device`, { headers })
  }

  getDevicesHistory(idPanel:number, idZone:number): Observable<any> | null | undefined {
    let token=this.authService.getToken()
    if(token == null || idPanel==null || idPanel<0 || idZone<0 || idZone==null)return null
    const headers = new HttpHeaders().set('authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.baseUrl}panels/${idPanel}/zones/${idZone}/devices-history`, { headers })
  }

  getDevicesRecent(idPanel:number, idZone:number): Observable<any> | null | undefined {
    let token=this.authService.getToken()
    if(token == null || idPanel==null || idPanel<0 || idZone<0 || idZone==null)return null
    const headers = new HttpHeaders().set('authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.baseUrl}panels/${idPanel}/zones/${idZone}/devices-recent`, { headers })
  }

  getDevice(idPanel:number, idZone:number, id:number): Observable<any> | null {
    let token=this.authService.getToken()
    if(token == null || idPanel==null || idPanel<0 || idZone<0 || idZone==null|| id<0 || id==null)return null
    const headers = new HttpHeaders().set('authorization', `Bearer ${token}`)
    return this.http.get(`${this.baseUrl}panels/${idPanel}/zones/${idZone}/devices/${id}`, { "headers":headers })
  }

 /* getDeviceHistory(idPanel:number, idZone:number, id:number): Observable<any> | null {
    let token=this.authService.getToken()
    if(token != null){
      const headers = new HttpHeaders().set('authorization', `Bearer ${token}`)
      return this.http.get(`${this.baseUrl}panels/${idPanel}/zones/${idZone}/devices/${id}/history`, { "headers":headers }).pipe(
        map(response => {
          return response as Devices
      }))
    }
  }*/

  getDeviceRecent(idPanel:number, idZone:number, id:number): Observable<any> | null {
    let token=this.authService.getToken()
    if(token == null || idPanel==null || idPanel<0 || idZone<0 || idZone==null|| id<0 || id==null)return null
    const headers = new HttpHeaders().set('authorization', `Bearer ${token}`)
    return this.http.get(`${this.baseUrl}panels/${idPanel}/zones/${idZone}/devices/${id}/recent`, { "headers":headers })
  }

  setDevice(idPanel:number, idZone:number,info:any): Observable<any> | null {
    let token=this.authService.getToken()
    if(token == null || idPanel==null || idPanel<0 || idZone<0 || idZone==null|| info==null)return null
    const headers = new HttpHeaders().set('authorization', `Bearer ${token}`)
    return this.http.post(`${this.baseUrl}panels/${idPanel}/zones/${idZone}/devices`,info, { "headers":headers })
  }

  editDevice(idPanel:number, idZone:number,id:number,info:any): Observable<any> | null {
    let token=this.authService.getToken()
    if(token == null || idPanel==null || idPanel<0 || idZone<0 || idZone==null|| id<0 || id==null || info==null)return null
    const headers = new HttpHeaders().set('authorization', `Bearer ${token}`)
    return this.http.patch(`${this.baseUrl}panels/${idPanel}/zones/${idZone}/devices/${id}`,info, { "headers":headers })
  }

  deleteDevice(idPanel:number, idZone:number,id:number): Observable<any> | null {
    let token=this.authService.getToken()
    if(token == null || idPanel==null || idPanel<0 || idZone<0 || idZone==null|| id<0 || id==null)return null
    const headers = new HttpHeaders().set('authorization', `Bearer ${token}`)
    return this.http.delete(`${this.baseUrl}panels/${idPanel}/zones/${idZone}/devices/${id}`, { "headers":headers })
  }

}
