import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Panels } from 'src/app/models/panels.model';
import { PanelService } from 'src/app/services/panel.service';

@Component({
  selector: 'modal-createPanel',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent {
  panelform = new FormGroup({
    name: new FormControl('',[Validators.required,Validators.minLength(2),Validators.maxLength(50)])
  });

  error:boolean
  errorMessage: string
  @Output() dataEvent = new EventEmitter();
  
  constructor(private panelservice:PanelService,private modalService: NgbModal){
    this.error=false
    this.errorMessage=""
  }

  createPanel(){
    const panelName = this.panelform.value.name;
    if (panelName) {
      this.panelservice.setPanel(panelName)?.subscribe({
        next:(response)=>{
          (document.getElementById("close") as HTMLButtonElement).click()
          this.dataEvent.emit();

          //this.loading=false
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

  checkvalid(input:any){
    input.target.classList.remove(input.target.checkValidity()? 'is-invalid':'is-valid')
    input.target.classList.add(input.target.checkValidity()? 'is-valid':'is-invalid')
  }
}
