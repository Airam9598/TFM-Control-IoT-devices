import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AccessService } from './access-service.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl:string;
  constructor(private http: HttpClient,private cookieService: CookieService, private authService:AccessService) {
    this.baseUrl=authService.baseUrl;
  }

  getUsersPanel(idPanel:number):Observable<any> | null  {
    let token=this.authService.getToken()
    if(token == null || idPanel==null || idPanel<0) return null
    const headers = new HttpHeaders().set('authorization', `Bearer ${token}`)
    return  this.http.get(`${this.baseUrl}panels/${idPanel}/users`, { "headers":headers })
  }

  editUserPanel(idPanel:number,id:number,info:any):Observable<any> | null  {
    let token=this.authService.getToken()
    if(token == null || idPanel==null || idPanel<0|| id==null || id<0|| info==null) return null
    const headers = new HttpHeaders().set('authorization', `Bearer ${token}`)
    return  this.http.patch(`${this.baseUrl}panels/${idPanel}/users/${id}`,info, { "headers":headers })
  }

  //USERS
  /*

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
  }*/

  setUserPanel(idPanel:number,info:any):Observable<any> | null  {
    let token=this.authService.getToken()
    if(token == null || idPanel==null || idPanel<0|| info==null) return null
    const headers = new HttpHeaders().set('authorization', `Bearer ${token}`)
    return this.http.post(`${this.baseUrl}panels/${idPanel}/users`,info, { "headers":headers })
  }

  editUser(info:any):Observable<any> | null  {
    let token=this.authService.getToken()
    if(token == null || info==null) return null
    const headers = new HttpHeaders().set('authorization', `Bearer ${token}`)
    return  this.http.patch(`${this.baseUrl}users`,info, { "headers":headers })
  }

  deleteUser():Observable<any> | null  {
    let token=this.authService.getToken()
    if(token == null) return null
    const headers = new HttpHeaders().set('authorization', `Bearer ${token}`)
    return this.http.delete(`${this.baseUrl}/users`, { "headers":headers })

  }

  deleteUserPanel(idPanel:number, id:number):Observable<any> | null  {
    let token=this.authService.getToken()
    if(token == null || idPanel==null || idPanel<0|| id==null || id<0) return null
    const headers = new HttpHeaders().set('authorization', `Bearer ${token}`)
    return this.http.delete(`${this.baseUrl}panels/${idPanel}/users/${id}`, { "headers":headers })
  }
}
