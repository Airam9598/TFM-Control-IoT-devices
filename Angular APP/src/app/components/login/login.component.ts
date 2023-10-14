import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { Users } from 'src/app/models/users.model';
import { AccessService } from 'src/app/services/access-service.service';
import { SharedDataService } from 'src/app/shared/data-service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent {

  login = new FormGroup({
      email: new FormControl('',[Validators.required,Validators.email,Validators.minLength(5),Validators.maxLength(50)]),
      password: new FormControl('',Validators.required),
  });
  errorMessage: string
  error:boolean
  loading:boolean
  constructor(private loginservice:AccessService, private route: Router, private dataService:SharedDataService){
    this.error=false
    this.loading=false
    this.errorMessage=""
    if(dataService.userData.id>=0){
      this.route.navigate(['/loading'])
    }
  }

  onSubmit() {
    this.loading=true
    this.error=false
    this.loginservice.user=new Users(-1,"","","",[],{})
    if(this.login.value.email != null && this.login.value.password != null){
      this.loginservice.login(this.login.value.email, this.login.value.password).subscribe({
        next:(token)=>{
          this.loginservice.isLoggedIn().subscribe({
            next:(user)=>{
              this.loginservice.setToken(token.token);
              this.route.navigate(['/home'])
              this.loading=false
            },
            error:(error2)=>{
              this.loading=false
              this.error=true;
              this.errorMessage = error2.error.message;
            }
          });
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
