import { Component, EventEmitter, Input, Output,OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Users } from 'src/app/models/users.model';
import { AccessService } from 'src/app/services/access-service.service';
import { UserService } from 'src/app/services/user.service';
import { SharedDataService } from 'src/app/shared/data-service';

@Component({
  selector: 'modals-edit-perms',
  templateUrl: './edit-perms.component.html',
  styleUrls: ['./edit-perms.component.css']
})
export class EditPermsComponent implements OnChanges {
  userform = new FormGroup({
    admin: new FormControl(true,[Validators.required]),
    history: new FormControl(true,[Validators.required]),
    camera: new FormControl(true,[Validators.required]),
    devices: new FormControl(true,[Validators.required]),
    zones: new FormControl(true,[Validators.required]),
    irrigate: new FormControl(true,[Validators.required]),
  });

  error:boolean
  errorMessage: string
  text:string
  @Input() editedUser:Users
  @Output() dataEvent = new EventEmitter();
  actUser:Users
  constructor(public userService:UserService,private loginservice:AccessService, private dataService:SharedDataService){
    this.text="Usuario"
    this.error=false
    this.editedUser=new Users(-1,"","","",[],{})
    this.errorMessage=""
    this.actUser=this.loginservice.user
    if(this.editedUser.id>0){
      this.userform.patchValue({
        admin: !!+this.editedUser.pivot["admin"],
        history: !!+this.editedUser.pivot["history"],
        camera: !!+this.editedUser.pivot["camera"],
        devices: !!+this.editedUser.pivot["devices"],
        zones: !!+this.editedUser.pivot["zones"],
        irrigate: !!+this.editedUser.pivot["irrigate"],
      });

    }
    this.dataService.getUser().then((userData: Users) => {
      this.actUser=userData
    }).catch((error) => {});
  }

  editUser(){
    this.errorMessage=""
    let info=this.userform.value
    if (Object.keys(info).length>0) {
      this.userService.editUser(info)?.subscribe({
        next:(response)=>{
          (document.getElementById("closeEditUserPerms") as HTMLButtonElement).click()
          //this.dataService.addUser(response.data as Users)
          //this.actUser=(response.data as Users)
          this.dataEvent.emit(info);
        },
        error:(error)=>{
          this.error=true;
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

  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.editedUser.id>0){
      this.userform.patchValue({
        admin: !!+this.editedUser.pivot["admin"],
        history: !!+this.editedUser.pivot["history"],
        camera: !!+this.editedUser.pivot["camera"],
        devices: !!+this.editedUser.pivot["devices"],
        zones: !!+this.editedUser.pivot["zones"],
        irrigate: !!+this.editedUser.pivot["irrigate"],
      });
      if(!!+this.editedUser.pivot["admin"]){
        (document.getElementById("history") as HTMLInputElement).disabled=true;
        (document.getElementById("camera") as HTMLInputElement).disabled=true;
        (document.getElementById("devices") as HTMLInputElement).disabled=true;
        (document.getElementById("zones") as HTMLInputElement).disabled=true;
        (document.getElementById("irrigate") as HTMLInputElement).disabled=true;
        this.userform.patchValue({
          history: true,
          camera: true,
          devices: true,
          zones: true,
          irrigate: true,
        });
      }
    }
  }

  checkvalid(input:any){
    input.target.classList.remove(input.target.checkValidity()? 'is-invalid':'is-valid')
    input.target.classList.add(input.target.checkValidity()? 'is-valid':'is-invalid')
  }

  checkAdmin(elem:any){
    if(elem.target.checked){
      (document.getElementById("history") as HTMLInputElement).disabled=true;
      (document.getElementById("camera") as HTMLInputElement).disabled=true;
      (document.getElementById("devices") as HTMLInputElement).disabled=true;
      (document.getElementById("zones") as HTMLInputElement).disabled=true;
      (document.getElementById("irrigate") as HTMLInputElement).disabled=true;
      this.userform.patchValue({
        history: true,
        camera: true,
        devices: true,
        zones: true,
        irrigate: true,
      });
    }else{
      (document.getElementById("history") as HTMLInputElement).disabled=false;
      (document.getElementById("camera") as HTMLInputElement).disabled=false;
      (document.getElementById("devices") as HTMLInputElement).disabled=false;
      (document.getElementById("zones") as HTMLInputElement).disabled=false;
      (document.getElementById("irrigate") as HTMLInputElement).disabled=false;
    }
  }

}
