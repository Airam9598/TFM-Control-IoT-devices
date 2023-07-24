import { Types } from "./types.model";
import { Zones } from "./zones.model";

export class Devices {
    constructor(
        public name:string,
        public id:number,
        public data_id:string,
        public dev_id:string,
        public zone_id:number,
        public zone:Zones,
        public types:Types[],
        public info:any
    ){}
}
