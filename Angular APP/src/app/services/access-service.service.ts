import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable, catchError, map, of, retry, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccessService {

  
  baseUrl="http://localhost:8000/api/"

  constructor(private http: HttpClient,private cookieService: CookieService) {
   }

  getToken():string{
    return this.cookieService.get('token');
  }

  setToken(token:string){
    this.cookieService.set('token', token);
  }

  deleteToken(){
    return this.cookieService.delete('token');
  }
  
  login(email: string, password: string) : Observable<any> {
    /*const saltRounds = 10;
    bcrypt.hash(password, saltRounds).then((hash) => {
      password=hash;
    });*/
    return this.http.post<any>(this.baseUrl+"login",{ "email":email, "password":password })
  }

  registry(name:string, email: string, password: string ,repassword:string) : Observable<any> {
    /*const saltRounds = 10;
    bcrypt.hash(password, saltRounds).then((hash) => {
      password=hash;
    });*/
    return this.http.post<any>(this.baseUrl+"users",{ "email":email, "password":password, "repassword":repassword, "name":name })
  }

  logout(): void {
    this.cookieService.deleteAll();
  }

  isLoggedIn(): Observable<boolean> {
    if (this.cookieService.check('token')) {
      let token=this.getToken()
      const headers = new HttpHeaders().set('authorization', `Bearer ${token}`);
      return this.http.get<any>(this.baseUrl + 'me', { headers: headers }).pipe(
        map((response) => true),
        catchError((error) => {
          console.error('Error al realizar la solicitud:', error);
          return of(false);  
        })
      );
    } else {
      return of(false);
    }
  }
/*
    
    if(token != null){
      const headers = new HttpHeaders().set('authorization', `Bearer ${token}`)
      if (!this.isLoggedInt) {
          try {
              const result = await this.http.get<any>(this.baseUrl+"me", { "headers":headers }).toPromise();
              (result.success)? this.isLoggedInt = true : this.isLoggedInt = false
          } catch (error) {
              this.isLoggedInt = false
          }
      }
      return this.isLoggedInt;
    }
    return false;
  }*/


}
