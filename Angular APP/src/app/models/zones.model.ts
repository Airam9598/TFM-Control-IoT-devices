export class Zones {
    constructor(
        public id:number,
        public name:string,
        public country:string,
        public lat: number,
        public lng: number,
        public max_soil_moisture: number,
        public min_soil_moisture: number,
        public max_soil_temp: number,
        public min_soil_temp: number,
        public min_air_temp: number,
        public max_air_temp: number,
        public panel_id:number
    ){}
}
