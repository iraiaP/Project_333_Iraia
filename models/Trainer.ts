export class Trainer {

    private price: number = 0; //price for 1hr session
    
    constructor(
        public id: string,
        public name: string,
        public location: string  
    ){}

    public setPrice1hr(price: number): void {
        this.price = price;
    }

}