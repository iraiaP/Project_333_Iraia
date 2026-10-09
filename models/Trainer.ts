export class Trainer {

    private price: number = 0; //price for 1hr session
    private static id: number = 0; //unique identifier for the trainer    

    public trainerId: number;
    constructor(
        public name: string,
        public city: string,
        public suburb: string,
        public bio: string
    ) {
        this.trainerId = Trainer.id++;
    }

    public setPrice1hr(price: number): void {
        this.price = price;
    }

}