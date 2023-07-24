import { Component, Input } from '@angular/core';
import { Zones } from 'src/app/models/zones.model';

@Component({
  selector: 'app-advisor',
  templateUrl: './advisor.component.html',
  styleUrls: ['./advisor.component.css']
})
export class AdvisorComponent {
  @Input() zone:Zones=new Zones(-1,"","",-1,0,0)
  @Input() advices:Array<string>
  constructor(){
    this.advices=[]
  }
}
