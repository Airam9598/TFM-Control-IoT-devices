import { AfterViewInit, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { data } from 'jquery';
import { CookieService } from 'ngx-cookie-service';
import { GeneralForm } from 'src/app/models/generalform.model';
import { Panels } from 'src/app/models/panels.model';
import { Users } from 'src/app/models/users.model';
import { AccessService } from 'src/app/services/access-service.service';
import { PanelService } from 'src/app/services/panel.service';
import { UserService } from 'src/app/services/user.service';
import { SharedDataService } from 'src/app/shared/data-service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})

export class ConfigurationComponent implements AfterViewInit {
  userFormGroup=new FormGroup({
    email: new FormControl('',[Validators.required, Validators.email]),
  })
  userElements=[new GeneralForm("email","email","Correo electrónico",true)]

  permsFormGroup = new FormGroup({
    admin: new FormControl(true,[Validators.required]),
    history: new FormControl(true,[Validators.required]),
    camera: new FormControl(true,[Validators.required]),
    devices: new FormControl(true,[Validators.required]),
    zones: new FormControl(true,[Validators.required]),
    irrigate: new FormControl(true,[Validators.required]),
  });
  permsElements=[new GeneralForm("perms","perms","Permisos",true)]

  errorMessage:string
  showUser:boolean
  showPerms:boolean
  activePanel:string;
  error:boolean
  text:string="panel"
  users:Users[]
  editedUser:Users
  delete:boolean

  panelform = new FormGroup({
    name: new FormControl('',[Validators.required,Validators.minLength(2),Validators.maxLength(50)]),
    diference_days: new FormControl(0,[Validators.required,Validators.min(0)])
  });

  constructor(protected userService:UserService,protected panelservice:PanelService,protected route2:Router,protected loginService: AccessService,protected dataService:SharedDataService , protected cookieService:CookieService){
    if(dataService.userData.id<=0){
      this.route2.navigate(['/loading'])
    }
    this.delete=false;
    this.showPerms=false
    this.showUser=false
    this.error=false
    this.errorMessage=""
    this.activePanel="Panel"
    this.users=[]
    this.editedUser=new Users(-1,"","","",[],{})
    this.panelform.patchValue({name: this.dataService.actPanel.name,diference_days:this.dataService.actPanel.diference_days});
    this.updatePanels()
  }

  ngAfterViewInit(): void {
    if(!this.checkPerms(['admin'])){

      (document.getElementById('UsersbutConfig') as HTMLLIElement)?.click()
    }
  }

  updatePanels(){
    if(this.checkPerms(['admin'])){
      this.userService.getUsersPanel(this.dataService.actPanel.id)?.subscribe({
        next:(response)=>{
          this.users=response.data as Users[]
        }
      })
    }
  }

  changeEditedUser(user:Users){
    this.editedUser=user
    this.showPerms=true
  }

  changePanel(elem:any){
    (document.querySelectorAll(`.menu li`)).forEach(element => {
      element.classList.remove("active")
    })
    elem.target.classList.add('active')
    this.activePanel=elem.target.textContent
  }


  editPanel(){
    const panelName = this.panelform.value.name??this.dataService.actPanel.name;
    const panelDays = (this.panelform.value.diference_days! * parseInt((document.getElementById("dayMultiplier") as HTMLSelectElement).value))??this.dataService.actPanel.diference_days;
    if (this.panelform.valid ) {
      this.panelservice.editPanel(this.dataService.actPanel.id,panelName,panelDays)?.subscribe({
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
          console.log(error)
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

  checkvalid(input:any){
    input.target.classList.remove(input.target.checkValidity()? 'is-invalid':'is-valid')
    input.target.classList.add(input.target.checkValidity()? 'is-valid':'is-invalid')
  }

  logincheck() {
    if(!this.cookieService.check("token")) this.route2.navigate(['/'])

    this.loginService.isLoggedIn().subscribe((isLoggedIn) => {
      if (!isLoggedIn){
        this.loginService.deleteToken()
        this.route2.navigate(['/'])
      }
      this.dataService.addUser(this.loginService.user)
      this.panelform.patchValue({
        name: this.dataService.actPanel.name
      });
    });
  }

  editPerms(info:any){
    this.userService.editUserPanel(this.dataService.actPanel.id,this.editedUser.id,info)?.subscribe({
      next:(response)=>{
        this.updatePanels()
        this.showPerms=false
      }

    })
  }

  deleteUserPanel(user:Users){
    this.userService.deleteUserPanel(this.dataService.actPanel.id,user.id)?.subscribe({
      next:(reponse)=>{
        this.users=this.users.filter(elem=>elem.id!= (reponse.data as Users).id)
        if(this.dataService.userData.id==user.id){
          this.dataService.updatePanels(this.dataService.panels.filter(elem=> elem.id != this.dataService.actPanel.id))
          this.route2.navigateByUrl('/home')
        }
      }
    })
  }

  addUserPanel(info:any){
    this.userService.setUserPanel(this.dataService.actPanel.id,info)?.subscribe({
      next:(response)=>{
        (document.getElementById("closegeneralForm") as HTMLButtonElement).click()
        this.users.push(response.data as Users)
      },
      error:(error)=>{
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
    })
  }

  checkPerms(array:Array<string>):boolean{
    let value=false;
    array.forEach(elem=>{
      let temp=this.dataService.userData.panels.find(elem => elem.id === this.dataService.actPanel.id)
      if(temp) if(!!+temp.pivot[elem]) value=true
    })
    return (this.dataService.userData.id >= 0 && value)
  }
}
