export class Panels {
    constructor(
        public id:number,
        public name:string, 
        public diference_days:number,
        public pivot:{[key:string]:string},
       
    ){}
}
