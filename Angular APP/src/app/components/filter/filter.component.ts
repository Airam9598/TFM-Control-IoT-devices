import { Component, Input,Output ,OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { Zones } from 'src/app/models/zones.model';
import { SharedDataService } from 'src/app/shared/data-service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnChanges {
  countries:Array<string>
  backUpZones:Zones[]
  @Output() filtered = new EventEmitter<Zones[]>();
  constructor(protected dataService:SharedDataService){
    this.countries=[]
    this.backUpZones=[]
    this.updateCountries()
  }

  filter(elem:any){
    if(elem.target.value==""){
      this.backUpZones=[...this.dataService.zones] as Zones[]
      this.filtered.emit(this.backUpZones)
      return
    }
    if(elem.target.id=="filtercountry") this.backUpZones=this.dataService.zones.filter(zone=>zone.country==elem.target.value)
    if(elem.target.id=="filtername") this.backUpZones=this.dataService.zones.filter(zone=>zone.name.toLowerCase().includes(elem.target.value.toLowerCase()))
    this.filtered.emit(this.backUpZones)
  }

  ngOnChanges(change:SimpleChanges){
    this.updateCountries()
  }

  updateCountries() {
    this.dataService.zones.filter(elem=>{
      if(!this.countries.find(country=> elem.country==country)){
        this.countries.push(elem.country)
      }
    })
  }
}
