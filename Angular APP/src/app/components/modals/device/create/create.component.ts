import { Type } from '@angular/compiler';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Devices } from 'src/app/models/devices.model';
import { Panels } from 'src/app/models/panels.model';
import { Types } from 'src/app/models/types.model';
import { Users } from 'src/app/models/users.model';
import { Zones } from 'src/app/models/zones.model';
import { AccessService } from 'src/app/services/access-service.service';
import { DeviceService } from 'src/app/services/device.service';
import { SharedDataService } from 'src/app/shared/data-service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'modal-createDev',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateDevComponent {
  
  devform = new FormGroup({
    name: new FormControl('',[Validators.required,Validators.minLength(2),Validators.maxLength(50)]),
    dev_id: new FormControl('',[Validators.required]),
  });

  error:boolean
  errorMessage: string
  map:any;
  button:string;
  actPanel:Panels
  mark:any
  showExtra:boolean
  @Output() dataEvent = new EventEmitter<any>();
  @Output() dataEvent2 = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Input() actZone:Zones
  @Input() actDev:Devices
  types:Types[]
  createdTypes:Array<string>
  constructor(public translate:TranslateService,private route:Router,private loginservice:AccessService, private dataService:SharedDataService, public deviceService:DeviceService){
    this.error=false
    this.createdTypes=[]
    this.showExtra=false
    this.types=[]
    this.deviceService.getTypes()?.subscribe({
      next:(reponse)=>{
        this.types=reponse.data as Types[]
      }
    })
    this.errorMessage=""
    this.button="Crear"
    this.actZone=new Zones(-1,"","",0,0,-1)
    this.actDev=new Devices("",-1,"","",0,this.actZone,[],[])
    this.actPanel=new Panels(-1,"",0,"")
    /*if(this.actZone.id >0){
      this.button="Editar"
      this.devform.patchValue({name: this.actZone.name,country: this.actZone.country,lat: this.actZone.lat,lng: this.actZone.lng});
    }*/
    this.dataService.getUser().then((userData: Users) => {
      this.actPanel=this.dataService.actPanel
    }).catch((error) => {});
  }

  close(){
    this.actDev.id=-1
    this.button="Crear"
    this.devform.patchValue({
      name: "",
      dev_id:""
    });
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      (checkbox as HTMLInputElement).checked = false;
    });
  }
 
  ngOnChanges(changes: SimpleChanges) {
    if(this.actDev.id >0){
      this.button="Editar"
      
      this.devform.patchValue({
        name: this.actDev.name,
        dev_id:this.actDev.dev_id
      });

      this.actDev.types.forEach(value=>{
        (document.getElementById(value.name) as HTMLInputElement).checked=true
        this.createdTypes.push(value.id.toString())
      })
    }
  } 

  ngAfterViewInit(): void {
      if(this.actDev.id >0){
        this.button="Editar"
        this.devform.patchValue({
          name: this.actDev.name,
          dev_id:this.actDev.dev_id
        });
      }
  }

  editType(info:any){
    if((info.target as HTMLInputElement).checked){
      this.createdTypes.push(info.target.value)
    }else{
      this.createdTypes=this.createdTypes.filter(elem=>elem!= info.target.value)
    }
  }

  editDev(){
    this.errorMessage=""
    let info={
      'name':this.devform.value.name,
      'dev_id':this.devform.value.dev_id,
      'type':this.createdTypes
    }

    if(info){
      for(let val of Object.keys(info)){
        if (info[val as keyof typeof info] == undefined) {
          delete info[val as keyof typeof info]
        }
      }
    }
    if(this.createdTypes.length<=0){
      this.error=true;
      this.errorMessage = "Hay que elegir un tipo de dispositivo"
      return
    }
    
    if (Object.keys(info).length>0) {
      if(this.actDev.id>0){
        this.deviceService.editDevice(this.actPanel.id,this.actZone.id,this.actDev.id,info)?.subscribe({
          next:(response)=>{
            (document.getElementById("closeEditDev") as HTMLButtonElement).click()
            this.dataEvent2.emit(response.data as Devices);
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

      }else{
        this.deviceService.setDevice(this.actPanel.id,this.actZone.id,info)?.subscribe({
          next:(response)=>{
            (document.getElementById("closeEditDev") as HTMLButtonElement).click()
            this.dataEvent.emit(response.data as Devices);
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

  }

  checkvalid(input:any){
    input.target.classList.remove(input.target.checkValidity()? 'is-invalid':'is-valid')
    input.target.classList.add(input.target.checkValidity()? 'is-valid':'is-invalid')
  }

  tranlate(text: string): string {
    let type:{[key: string]: string}={
      'soil Moisture': 'Humedad del suelo',
      'soil temperature': 'Temperatura del suelo',
      'air temperature': 'Temperatura del aire',
      'precipitation': 'Precipitación',
      'camera': 'Cámara'
    }
    return type[text]|| text
  }

  DeleteDevice(){
    this.deviceService.deleteDevice(this.actPanel.id,this.actZone.id,this.actDev.id)?.subscribe({
      next:(reponse)=>{
        this.delete.emit(reponse.data as Devices);
        (document.getElementById("closeEditDev") as HTMLButtonElement).click()
      }
    })
  }


}