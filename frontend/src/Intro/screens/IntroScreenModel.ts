
export class IntroScreenModel{
    private state: number;

    constructor(){
        this.state = 0;
    }
    getState(): number{
        return this.state;
    }
    setState(num: number): void{
        this.state = num;
    }
}