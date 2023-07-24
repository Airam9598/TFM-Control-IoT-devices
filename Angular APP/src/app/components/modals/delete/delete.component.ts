import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'modal-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class DeleteComponent {
  @Input() item:any
  @Input() text:string
  @Output()activedelete: EventEmitter<null> = new EventEmitter()

  mem:{ [key: string]: string } ={
    "Panel": "el panel",
    "Zona": "la zona",
    "Dispositivo": "el dispositivo",
    "Usuario" : "tu usuario"
  }
  constructor(){
    this.text=""
  }

  delete(){
    (document.getElementById("close") as HTMLButtonElement).click()
    this.activedelete.emit();
  }

  close(){
    (document.getElementById("close") as HTMLButtonElement).click()
  }

}
