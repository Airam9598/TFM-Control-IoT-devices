import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Users } from 'src/app/models/users.model';
import { UserService } from 'src/app/services/user.service';
import { SharedDataService } from 'src/app/shared/data-service';

@Component({
  selector: 'modal-add-panel',
  templateUrl: './add-panel.component.html',
  styleUrls: ['./add-panel.component.css']
})
export class AddPanelComponent {
  userform = new FormGroup({
    email: new FormControl('',[Validators.required, Validators.email]),
  });

  error:boolean
  errorMessage: string
  text:string
  @Output() dataEvent = new EventEmitter();
  constructor(private userService:UserService, private dataService:SharedDataService){
    this.text="Usuario"
    this.error=false
    this.errorMessage=""
  }

  editUser(){
    this.errorMessage=""
    let info=this.userform.value
    if (Object.keys(info).length>0) {
      this.userService.setUserPanel(this.dataService.actPanel.id,info)?.subscribe({
        next:(response)=>{
          (document.getElementById("closeAddUserPanel") as HTMLButtonElement).click()
          this.dataEvent.emit(response.data as Users);
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
}
