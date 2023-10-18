import { Component, Input,Output ,OnChanges, SimpleChanges, EventEmitter, ElementRef, ViewChild } from '@angular/core';
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
  @ViewChild("filtername") filterName: ElementRef | undefined;
  @ViewChild("filtercountry") filterCountry: ElementRef | undefined;
  constructor(protected dataService:SharedDataService){
    this.countries=[]
    this.backUpZones=[]
    this.updateCountries()
  }

  filter(elem:any){
    this.backUpZones=[...this.dataService.zones] as Zones[]
    if(this.filterCountry && this.filterCountry.nativeElement.value != ""){
      this.backUpZones=this.backUpZones.filter(zone=>zone.country==this.filterCountry?.nativeElement.value)
    }
    if(this.filterName && this.filterName.nativeElement.value != ""){
      this.backUpZones=this.backUpZones.filter(zone=>zone.name.toLowerCase().includes(this.filterName?.nativeElement.value.toLowerCase()))
    }
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
