import { Panels } from "./panels.model";

export class Users {
    constructor(
        public id:number,
        public name:string,
        public email:string,
        public passwd:string,
        public panels:Panels[],
        public pivot:{[key:string]:string},
    ){}
}
