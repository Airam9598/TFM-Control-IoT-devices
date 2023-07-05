import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccessService } from 'src/app/services/access-service.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers:[AccessService]
})


export class LoginComponent {
  
  login = new FormGroup({
      email: new FormControl('',[Validators.required,Validators.email,Validators.minLength(5),Validators.maxLength(50)]),
      password: new FormControl('',Validators.required),
  });
  errorMessage: string
  error:boolean
  loading:boolean
  constructor(private loginservice:AccessService, private route: Router){
    this.error=false
    this.loading=false
    this.errorMessage=""
    this.loginservice.isLoggedIn().subscribe((isLoggedIn) => {
      if (isLoggedIn){
        this.route.navigate(['/home'])
      }else{
        this.loginservice.deleteToken()
      }
    });
  }

  onSubmit() {
    this.loading=true
    this.error=false
    if(this.login.value.email != null && this.login.value.password != null){
      this.loginservice.login(this.login.value.email, this.login.value.password).subscribe({
        next:(token)=>{
          this.loading=false
          this.loginservice.setToken(token.token);
          this.route.navigate(['/home'])
        },
        error:(error)=>{
          this.loading=false
          this.error=true;
          this.errorMessage = error.error.message;
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
