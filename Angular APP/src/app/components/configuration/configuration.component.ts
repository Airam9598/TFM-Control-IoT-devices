import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { data } from 'jquery';
import { CookieService } from 'ngx-cookie-service';
import { Panels } from 'src/app/models/panels.model';
import { Users } from 'src/app/models/users.model';
import { AccessService } from 'src/app/services/access-service.service';
import { PanelService } from 'src/app/services/panel.service';
import { SharedDataService } from 'src/app/shared/data-service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})

export class ConfigurationComponent {

  activePanel:string;
  error:boolean
  errorMessage: string
  actPanel:Panels
  loginService:AccessService
  route:Router
  text:string="Panel"
  panelform = new FormGroup({
    name: new FormControl('',[Validators.required,Validators.minLength(2),Validators.maxLength(50)]),
    diference_days: new FormControl(0,[Validators.required,Validators.min(0)])
  });

  constructor(private panelservice:PanelService,private route2:Router,private loginService2: AccessService,private dataService:SharedDataService , private cookieService:CookieService){
    this.error=false
    this.errorMessage=""
    this.activePanel="Panel"
    this.loginService=loginService2
    this.route=route2
    this.actPanel=new Panels(-1, "",0,"")
    this.dataService.getUser().then((userData: Users) => {
      this.actPanel=this.dataService.actPanel
      this.panelform.patchValue({name: this.actPanel.name,diference_days:this.actPanel.diference_days});
    }).catch((error) => {});
    
    /*if(this.actPanel==undefined){
      this.logincheck()
    }else{
      this.panelform.patchValue({
        name: this.actPanel.name
      });
    }*/
  }


  changePanel(elem:any){
    (document.querySelectorAll(`.menu li`)).forEach(element => {
      element.classList.remove("active")
    })
    elem.target.classList.add('active')
    this.activePanel=elem.target.textContent
  }


  editPanel(){
    const panelName = this.panelform.value.name;
    const panelDays = this.panelform.value.diference_days;
    if (panelName && panelDays ) {
      this.panelservice.editPanel(parseInt(this.cookieService.get("panels")),panelName,panelDays)?.subscribe({
        next:(response)=>{
          let Temppanel= response.data as Panels
          let Tempapnels= this.dataService.panels
          const foundIndex = Tempapnels.findIndex(panel => panel.id === Temppanel.id);
          if (foundIndex !== -1) {
            Tempapnels[foundIndex] = Temppanel;
          }
          this.dataService.actPanel=Temppanel
          this.dataService.updatePanels(Tempapnels)
        },
        error:(error)=>{
          //this.loading=false
          //this.error=true;
        /* if(error.error.message!=null){
            this.errorMessage = error.error.message
          }else{
            Object.keys(error.error).forEach((key: string) => {
              Object.keys(error.error[key]).forEach((key2: string) => {
              if(this.errorMessage.length>0) this.errorMessage+='<br><br>'
              this.errorMessage = this.errorMessage + error.error[key][key2][error.error[key][key2].length - 1];
              })
            })
            
          }*/
        } 
      });
    }
  }

  deletePanel(){
    this.panelservice.deletePanel(this.dataService.actPanel.id)?.subscribe({
      next:(response)=>{
        this.dataService.updatePanels(this.dataService.panels.filter(elem=> elem.id != this.dataService.actPanel.id))
        this.route.navigate(['/home'])
      },
      error:(error)=>{
        //this.loading=false
        //this.error=true;
      /* if(error.error.message!=null){
          this.errorMessage = error.error.message
        }else{
          Object.keys(error.error).forEach((key: string) => {
            Object.keys(error.error[key]).forEach((key2: string) => {
            if(this.errorMessage.length>0) this.errorMessage+='<br><br>'
            this.errorMessage = this.errorMessage + error.error[key][key2][error.error[key][key2].length - 1];
            })
          })
          
        }*/
      } 
    });
  }

  checkvalid(input:any){
    input.target.classList.remove(input.target.checkValidity()? 'is-invalid':'is-valid')
    input.target.classList.add(input.target.checkValidity()? 'is-valid':'is-invalid')
  }

  logincheck() {
    if(!this.cookieService.check("token")) this.route.navigate(['/'])
    
    this.loginService.isLoggedIn().subscribe((isLoggedIn) => {
      if (!isLoggedIn){
        this.loginService.deleteToken()
        this.route.navigate(['/'])
      }
      this.dataService.addUser(this.loginService.user)
      this.actPanel=this.dataService.actPanel
      this.panelform.patchValue({
        name: this.actPanel.name
      });
    });
  }
}
