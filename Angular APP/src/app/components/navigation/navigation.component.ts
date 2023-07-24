import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Panels } from 'src/app/models/panels.model';
import { PanelService } from 'src/app/services/panel.service';
import { SharedDataService } from 'src/app/shared/data-service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent   {
  routes: { [key: string]: string } = {
    "/home" :"1",
    "/zones" :"2",
    "/history" :"3",
    "/config" :"4",
  }

  pane:Panels[]
  panelUpdate:any
  Timer:any
  constructor(private router:Router,private cookieService:CookieService,public dataService:SharedDataService, private panelService:PanelService){
    this.pane=[]
    if(this.cookieService.check("panels") && this.pane.length>0){
      let panel= this.pane.find(elem=> elem.id.toString()==this.cookieService.get("panels"))
      if(panel != null){
        (document.getElementById("panelsSelector") as HTMLSelectElement).value=panel.id.toString()
      }
    }else{
      if(this.pane.length==0){
        if(dataService.panels != undefined) this.pane=dataService.panels
      }
    }
    this.Timer=setInterval(() => this.changeSelectedPanel(), 1000); 
  }

  changeSelectedPanel(){
    let panels=this.dataService.panels
    if(panels!= undefined){
      this.pane=panels
      this.dataService.updateActPanel()
      let panelsSelector = document.getElementById("panelsSelector") as HTMLSelectElement;
      if(panelsSelector==null){
        clearInterval(this.Timer)
        return 
      }
      let selected = panelsSelector.options[panelsSelector.selectedIndex];
      if(selected==undefined) return
      if (this.dataService.actPanel.id.toString() !== this.cookieService.get("panels") || this.dataService.actPanel.id.toString() !== selected.value) {
        let index = this.pane.findIndex(elem => elem.id.toString() === this.cookieService.get("panels"));
        if (index !== -1) {
          panelsSelector.selectedIndex = index;
        }
      }
      
    }
    
  }



  /*reloadPanels(){
    this.panelService.getPanels()?.subscribe({
      next:(response)=>{
        this.panels = response.data as Panels[]
        this.dataService.panels=this.panels
        if(!this.cookieService.check("panels") && this.panels.length >0)this.cookieService.set("panels",this.panels[0].id.toString())
        if(this.cookieService.check("panels") && this.panels.length>0){
          let panel= this.panels.find(elem=> elem.id.toString()==this.cookieService.get("panels"))
          if(panel != null){
            for(let i=0;i<this.panels.length;i++){
              if(this.panels[i].id.toString()==this.cookieService.get("panels")){
                 (document.getElementById("panelsSelector") as HTMLSelectElement).options.selectedIndex=i
              }
            }
          }
        }else{
          if(this.panels.length==0){
            if(this.dataService.panels != undefined) this.panels=this.dataService.panels
          }
        }
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
          
        }
      } 
    });
  }*/

  changePanel(input:any){
    this.cookieService.set("panels",input.target.value)
    this.dataService.updateActPanel()
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
    this.router.navigate(["/home"]))
  }


}
