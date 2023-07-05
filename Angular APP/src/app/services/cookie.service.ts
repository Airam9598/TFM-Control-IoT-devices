import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class CookiesService {

  constructor( private cookieService: CookieService) { }

  setCookie(name:string,value:string){
    this.cookieService.set(name, value);
   }

   getCookie(name:string):string{
    return this.cookieService.get(name);
  }

  deleteToken(name:string){
    return this.cookieService.delete(name);
  }
  
}
