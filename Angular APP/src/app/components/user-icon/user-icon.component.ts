import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GeneralForm } from 'src/app/models/generalform.model';
import { Panels } from 'src/app/models/panels.model';
import { Users } from 'src/app/models/users.model';
import { AccessService } from 'src/app/services/access-service.service';
import { PanelService } from 'src/app/services/panel.service';
import { UserService } from 'src/app/services/user.service';
import { SharedDataService } from 'src/app/shared/data-service';

@Component({
  selector: 'app-user-icon',
  templateUrl: './user-icon.component.html',
  styleUrls: ['./user-icon.component.css']
})
export class UserIconComponent {
  panelFormGroup=new FormGroup({
    name: new FormControl('',[Validators.required,Validators.minLength(2),Validators.maxLength(50)])
  })
  panelElements=[new GeneralForm("name","text","Nombre",true)]
  userFormGroup = new FormGroup({
    name: new FormControl('',[Validators.required,Validators.minLength(2),Validators.maxLength(50)]),
    email: new FormControl('',[Validators.required, Validators.email]),
    oldpassword: new FormControl('',[]),
    password: new FormControl('',[]),
  });
  userElements=[new GeneralForm("name","text","Nombre",true),new GeneralForm("email","email","Correo electrónico",true),new GeneralForm("oldpassword","password","Contraseña actual",false),new GeneralForm("password","password","Nueva contraseña",false)]
  errorMessage:string
  showPanel:boolean
  showUser:boolean
  constructor(private loginservice:AccessService, private route: Router, protected dataService:SharedDataService, protected panelService:PanelService,protected userService:UserService){
    this.errorMessage=""
    this.showPanel=false
    this.showUser=false
  }

  createPanel($elements:any){
    this.panelService.setPanel($elements.name)?.subscribe({
      next:(response)=>{
        (document.getElementById("closegeneralForm") as HTMLButtonElement).click()
        this.dataService.panels.push(response.data as Panels)
      },
      error:(error)=>{
        this.errorMessage=""
        if(error.error.message!=null){
          this.errorMessage = error.error.message
        }else{
          Object.keys(error.error).forEach((key: string) => {
            Object.keys(error.error[key]).forEach((key2: string) => {
            if(this.errorMessage.length>0) this.errorMessage+='<br><br>'
            this.errorMessage = this.errorMessage + error.error[key][key2][error.error[key][key2].length - 1];
            })
          })

        }
      }
    });
  }

  editUser(info:any){
    this.errorMessage=""
    if(((info.oldpassword && info.oldpassword != "") || (info.password && info.password != "" ))  && info.oldpassword == info.password){
      this.errorMessage="Las contraseñas no pueden ser iguales"
      return
    }
    if(info.oldpassword == "" && info.password == "" ){
      delete info.password
      delete info.oldpassword
    }
    if(info.email == this.dataService.userData.email){
      delete info.email
    }

    if(info.name == this.dataService.userData.name){
      delete info.name
    }
    if (Object.keys(info).length>0) {
      this.userService.editUser(info)?.subscribe({
        next:(response)=>{
          this.dataService.userData=(response.data as Users)
          this.showUser=false
        },
        error:(error)=>{
          if(typeof error.error.error === 'string'){
            this.errorMessage = error.error.error
          }else{
            Object.keys(error.error).forEach((key: string) => {
              Object.keys(error.error[key]).forEach((key2: string) => {
              if(this.errorMessage.length>0) this.errorMessage+='<br><br>'
              this.errorMessage = this.errorMessage + error.error[key][key2][error.error[key][key2].length - 1];
              })
            })

          }
        }
      });
    }

  }

  closeSes(){
    this.loginservice.logout()
    this.dataService.logout()
    this.route.navigate(['/'])
  }
}
