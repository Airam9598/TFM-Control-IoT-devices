import { Zones } from "./zones.model";

export class Devices {
    constructor(
        public id:number,
        public name:string,
        public data_id:string,
        public dev_id:string,
        public zone_id:number,
        public zone:Zones,
        public types:Array<Object>,
        public info:Object
    ){}
}
