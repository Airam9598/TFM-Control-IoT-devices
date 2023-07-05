import { Component, Input } from '@angular/core';
import { Zones } from 'src/app/models/zones.model';

@Component({
  selector: 'app-advisor',
  templateUrl: './advisor.component.html',
  styleUrls: ['./advisor.component.css']
})
export class AdvisorComponent {
  @Input() user:Zones=new Zones(-1,"","",-1,0,0)
  
  advices:Array<String>;
  constructor(){
    this.advices=[]
  }
}
