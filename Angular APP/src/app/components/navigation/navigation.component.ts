import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Panels } from 'src/app/models/panels.model';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {
  routes: { [key: string]: string } = {
    "/home" :"1",
    "/zones" :"2",
    "/history" :"3",
    "/config" :"4",

  }

  @Input() panels:Panels[]=[]

  constructor(private router:Router,private cookieService:CookieService){
    
  }

  ngOnInit(): void {
    this.updateSelector()
  }

  updateSelector(){
    const currentRoute = this.router.url;
    if(this.routes[currentRoute] ==null) return
    (document.querySelectorAll(`.main-menu ul li`)).forEach(element => {
      element.classList.remove("active")
    });
    const menuElement = document.querySelector(`.main-menu ul li:nth-child(${this.routes[currentRoute]})`) as HTMLLIElement;
    if (menuElement) {
      menuElement.classList.add('active');
    }
  }

  changePanel(input:any){
    this.cookieService.set("panel",input.target.value)
  }

}
