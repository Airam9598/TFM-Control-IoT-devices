import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Users } from 'src/app/models/users.model';
import { AccessService } from 'src/app/services/access-service.service';
import { UserService } from 'src/app/services/user.service';
import { SharedDataService } from 'src/app/shared/data-service';

@Component({
  selector: 'modal-editUser',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent {
  userform = new FormGroup({
    name: new FormControl('',[Validators.required,Validators.minLength(2),Validators.maxLength(50)]),
    email: new FormControl('',[Validators.required, Validators.email]),
    oldpassword: new FormControl('',[]),
    password: new FormControl('',[]),
  });

  error:boolean
  errorMessage: string
  text:string
  @Output() dataEvent = new EventEmitter();
  actUser:Users
  constructor(private route:Router,private userService:UserService,private loginservice:AccessService, private dataService:SharedDataService){
    this.text="Usuario"
    this.error=false
    this.errorMessage=""
    this.actUser=this.loginservice.user
    this.dataService.getUser().then((userData: Users) => {
      this.actUser=userData
      this.userform.patchValue({name: this.actUser.name,email: this.actUser.email});
    }).catch((error) => {});
  }

  editUser(){
    this.errorMessage=""
    if(((this.userform.value.oldpassword && this.userform.value.oldpassword != "") || (this.userform.value.password && this.userform.value.password != "" ))  && this.userform.value.oldpassword == this.userform.value.password){
      this.errorMessage="Las contraseñas no pueden ser iguales" 
      this.error=true;
      return
    }
    let info=this.userform.value
    if(this.userform.value.oldpassword == "" && this.userform.value.password == "" ){
      delete info.password
      delete info.oldpassword
    }
    if(this.userform.value.email == this.actUser.email){
      delete info.email
    }

    if(this.userform.value.name == this.actUser.name){
      delete info.name
    }
    if (Object.keys(info).length>0) {
      console.log(info)
      this.userService.editUser(info)?.subscribe({
        next:(response)=>{
          (document.getElementById("closeEditUser") as HTMLButtonElement).click()
          this.dataService.addUser(response.data as Users)
          this.actUser=(response.data as Users)
          this.dataEvent.emit();
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

  checkvalid(input:any){
    input.target.classList.remove(input.target.checkValidity()? 'is-invalid':'is-valid')
    input.target.classList.add(input.target.checkValidity()? 'is-valid':'is-invalid')
  }

  deleteUser(){
    this.userService.deleteUser()?.subscribe({
      next:(response)=>{
        this.loginservice.logout()
        this.route.navigate(["/"])
      },
      error:(error)=>{
      }
    })
  }
}
