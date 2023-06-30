import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccessService } from 'src/app/services/access-service.service';


@Component({
  selector: 'app-registry',
  templateUrl: './registry.component.html',
  styleUrls: ['./registry.component.css'],
  providers:[AccessService]
})
export class RegistryComponent {
  registry = new FormGroup({
    email: new FormControl('',[Validators.required,Validators.email,Validators.minLength(5),Validators.maxLength(50)]),
    password: new FormControl('',Validators.required),
    repassword: new FormControl('',Validators.required),
    name: new FormControl('',[Validators.required,Validators.minLength(2),Validators.maxLength(50)]),
});
errorMessage: string
error:boolean
loading:boolean
constructor(private loginservice:AccessService, private route: Router){
  this.error=false
  this.loading=false
  this.errorMessage=""
}

onSubmit() {
  this.loading=true
  this.error=false
  this.errorMessage=""
  if(this.registry.value.repassword != this.registry.value.password){
    this.errorMessage="Las contraseñas no son iguales" 
    this.error=true
    this.loading=false
    return
  }
  if(this.registry.value.email != null && this.registry.value.password != null && this.registry.value.repassword != null && this.registry.value.name != null){
    this.loginservice.registry(this.registry.value.name,this.registry.value.email, this.registry.value.password,this.registry.value.repassword).subscribe({
      next:(token)=>{
        this.loading=false
        console.log(token)
        this.route.navigate(['/'])
      },
      error:(error)=>{
        this.loading=false
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

  }else{
      this.errorMessage="Existen campos vacíos" 
      this.error=true;
  }
}

checkvalid(input:any){
  input.target.classList.remove(input.target.checkValidity()? 'is-invalid':'is-valid')
  input.target.classList.add(input.target.checkValidity()? 'is-valid':'is-invalid')
}
}
