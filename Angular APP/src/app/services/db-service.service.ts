import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { catchError, map } from 'rxjs';
import { Panels } from '../models/panels.model';
import { Zones } from '../models/zones.model';
import { Devices } from '../models/devices.model';
import { Users } from '../models/users.model';
import { AccessService } from './access-service.service';


@Injectable({
  providedIn: 'root'
})
export class DbServiceService {

  baseUrl:string;
 // ApiKey ="yAIyErrGfRxVNdKiCrQcwVXxu085X1yKbZIJ5AfDK4hWAK"
  constructor(private http: HttpClient,private cookieService: CookieService, private authService:AccessService) { 
    this.baseUrl=authService.baseUrl;
  }

  //ZONES
  getZones(idPanel:number) {
    let token=this.authService.getToken()
    if(token != null){
      const headers = new HttpHeaders().set('authorization', `Bearer ${token}`);
      return this.http.get(`${this.baseUrl}panels/${idPanel}/zones`, { "headers":headers }).pipe(
        map(response => {
          return response as Zones[];
      }))
    }
  }

  getZone(idPanel:number,id:number) {
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
  }




  //DEVICES
  getDevices(idPanel:number, idZone:number) {
    let token=this.authService.getToken()
    if(token != null){
      const headers = new HttpHeaders().set('authorization', `Bearer ${token}`);
      return this.http.get(`${this.baseUrl}panels/${idPanel}/zones/${idZone}/devices`, { "headers":headers }).pipe(
        map(response => {
          return response as Devices[];
      }))
    }
  }

  getDevice(idPanel:number, idZone:number, id:number) {
    let token=this.authService.getToken()
    if(token != null){
      const headers = new HttpHeaders().set('authorization', `Bearer ${token}`)
      return this.http.get(`${this.baseUrl}panels/${idPanel}/zones/${idZone}/devices/${id}`, { "headers":headers }).pipe(
        map(response => {
          return response as Devices
      }))
    }
  }

  getDeviceHistory(idPanel:number, idZone:number, id:number) {
    let token=this.authService.getToken()
    if(token != null){
      const headers = new HttpHeaders().set('authorization', `Bearer ${token}`)
      return this.http.get(`${this.baseUrl}panels/${idPanel}/zones/${idZone}/devices/${id}/history`, { "headers":headers }).pipe(
        map(response => {
          return response as Devices
      }))
    }
  }

  getDeviceRecent(idPanel:number, idZone:number, id:number) {
    let token=this.authService.getToken()
    if(token != null){
      const headers = new HttpHeaders().set('authorization', `Bearer ${token}`)
      return this.http.get(`${this.baseUrl}panels/${idPanel}/zones/${idZone}/devices/${id}/recent`, { "headers":headers }).pipe(
        map(response => {
          return response as Devices
      }))
    }
  }

  setDevice(idPanel:number, idZone:number,info:any) {
    let token=this.authService.getToken()
    if(token != null){
      const headers = new HttpHeaders().set('authorization', `Bearer ${token}`)
      return this.http.post(`${this.baseUrl}panels/${idPanel}/zones/${idZone}/devices`,info, { "headers":headers }).pipe(
        map(response => {
          return response as Devices
      }))
    }
  }

  editDevice(idPanel:number, idZone:number,id:number,info:any) {
    let token=this.authService.getToken()
    if(token != null){
      const headers = new HttpHeaders().set('authorization', `Bearer ${token}`)
      return this.http.patch(`${this.baseUrl}panels/${idPanel}/zones/${idZone}/devices/${id}`,info, { "headers":headers }).pipe(
      map(response => {
        return response as Devices
      }));
    }
  }

  deleteDevice(idPanel:number, idZone:number,id:number) {
    let token=this.authService.getToken()
    if(token != null){
      const headers = new HttpHeaders().set('authorization', `Bearer ${token}`)
      return this.http.delete(`${this.baseUrl}panels/${idPanel}/zones/${idZone}/devices/${id}`, { "headers":headers }).pipe(
      map(response => {
        return response as Zones
      }))
    }
  }



  //USERS
  getUsers(idPanel:number) {
    let token=this.authService.getToken()
    if(token != null){
      const headers = new HttpHeaders().set('authorization', `Bearer ${token}`);
      return this.http.get(`${this.baseUrl}panels/${idPanel}/users`, { "headers":headers }).pipe(
        map(response => {
          return response as Users[];
      }))
    }
  }

  getUser(idPanel:number, id:number) {
    let token=this.authService.getToken()
    if(token != null){
      const headers = new HttpHeaders().set('authorization', `Bearer ${token}`)
      return this.http.get(`${this.baseUrl}panels/${idPanel}/users/${id}`, { "headers":headers }).pipe(
        map(response => {
          return response as Users
      }))
    }
  }

  setUserPanel(idPanel:number,info:any) {
    let token=this.authService.getToken()
    if(token != null){
      const headers = new HttpHeaders().set('authorization', `Bearer ${token}`)
      return this.http.post(`${this.baseUrl}panels/${idPanel}/users`,info, { "headers":headers }).pipe(
        map(response => {
          return response as Users
      }))
    }
  }

  setUser(info:any) {
    let token=this.authService.getToken()
    if(token != null){
      const headers = new HttpHeaders().set('authorization', `Bearer ${token}`)
      return this.http.post(`${this.baseUrl}users`,info, { "headers":headers }).pipe(
        map(response => {
          return response as Users
      }))
    }
  }

  editUserPanel(idPanel:number,id:number,info:any) {
    let token=this.authService.getToken()
    if(token != null){
      const headers = new HttpHeaders().set('authorization', `Bearer ${token}`)
      return this.http.patch(`${this.baseUrl}panels/${idPanel}/users/${id}`,info, { "headers":headers }).pipe(
      map(response => {
        return response as Users
      }));
    }
  }

  editUser(info:any) {
    let token=this.authService.getToken()
    if(token != null){
      const headers = new HttpHeaders().set('authorization', `Bearer ${token}`)
      return this.http.patch(`${this.baseUrl}users`,info, { "headers":headers }).pipe(
      map(response => {
        return response as Users
      }));
    }
  }

  deleteUserPanel(idPanel:number, id:number) {
    let token=this.authService.getToken()
    if(token != null){
      const headers = new HttpHeaders().set('authorization', `Bearer ${token}`)
      return this.http.delete(`${this.baseUrl}panels/${idPanel}/users/${id}`, { "headers":headers }).pipe(
      map(response => {
        return response as Users
      }))
    }
  }

  deleteUser(idPanel:number, id:number) {
    let token=this.authService.getToken()
    if(token != null){
      const headers = new HttpHeaders().set('authorization', `Bearer ${token}`)
      return this.http.delete(`${this.baseUrl}panels/${idPanel}/users/${id}`, { "headers":headers }).pipe(
      map(response => {
        return response as Users
      }))
    }
  }
}
