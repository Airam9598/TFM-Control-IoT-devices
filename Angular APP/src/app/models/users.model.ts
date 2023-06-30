export class Users {
    constructor(
        public id:number,
        public name:string,
        public email:string,
        public passwd:string,
        public token:string,
        public pivot:Object,
    ){}
}
