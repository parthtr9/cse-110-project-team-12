import Konva from "konva";
import { GOOD_SCORE } from "./constants";

export class MoneyView{
    private group: Konva.Group;
    private boxMeiMei: Konva.Image |  null = null;
    private scoreText: Konva.Text;
    private timerText: Konva.Text;
    private stage : Konva.Stage;
    private layer: Konva.Layer;
    private moneyGroup : Array<Konva.Circle>;
    private boxGroup : Array<Konva.Rect>;
    private box : Konva.Rect;
    private width = 0;
    private height = 0;
    private flowerMeiMei: Konva.Image | null = null;
    private instructionText: Konva.Text;

    constructor(handleNextClick: () => void, stage:Konva.Stage,layer: Konva.Layer, width: number = 800, height: number = 600) {
        this.group = new Konva.Group({ visible: false });
        this.stage = stage;
        this.layer = layer;
        this.moneyGroup = [];
        this.boxGroup = [];
        this.box = new Konva.Rect();
        this.width = width;
        this.height = height;

        // Score display (top-left)
        this.scoreText = new Konva.Text({
            x: 20,
            y: 20,
            text: "Score: 0",
            fontSize: 32,
            fontFamily: "Arial",
            fill: "black",
        });
        //this.group.add(this.scoreText);

        // Timer display (top-right)
        this.timerText = new Konva.Text({
            x: width - 150,
            y: 20,
            text: "Time: ",
            fontSize: 32,
            fontFamily: "Arial",
            fill: "red",
        });
        //this.group.add(this.timerText);
        this.instructionText = new Konva.Text({
            x: 0,
            y: height/9,
            text: `Help Mei Mei catch the falling money by dragging her around in her box! Get at least ${GOOD_SCORE} to make Mei Mei proud.`,
            fontSize: 30,
            fontFamily: "Arial",
            fill: "black",
            width: this.width,
            height: this.height/4,
            align: 'center'
        });

        // TODO: Task 2 - Load and display lemon image using Konva.Image.fromURL()
        // Placeholder circle (remove this when implementing the image)
        Konva.Image.fromURL("./src/MoneyMiniGame/Data/BoxMeiMei.png", (image) => {
            image.x(width / 2);
            image.y(width / 2);
            image.offsetX( image.width() / 2);
            image.offsetY( image.height() / 2);
            image.draggable(true);
            image.height(image.height()/2);
            image.width(image.width()/2);

            this.boxMeiMei = image;
            //this.group.add(this.boxMeiMei);
            console.log("Image exists");
        });
        const startButtonGroup = new Konva.Group();
        const startButton = new Konva.Rect({
            x: this.width / 2 - 100,
            y: this.height - 95,
            width: 200,
            height: 60,
            fill: "green",
            cornerRadius: 10,
            stroke: "darkgreen",
            strokeWidth: 3,
        });
        const startText = new Konva.Text({
            x: this.width / 2, 
            y: this.height - 80,
            text: "START GAME",
            fontSize: 24,
            fontFamily: "Arial",
            fill: "white",
            align: "center",
        });
        startText.offsetX(startText.width() / 2);
        startButtonGroup.add(startButton);
        startButtonGroup.add(startText);
        startButtonGroup.on("click", handleNextClick);
        this.group.add(startButtonGroup);
        
        
        this.layer.add(this.group);
        this.stage.add(this.layer);

    }
    displayIntro():void{
        Konva.Image.fromURL("./src/MoneyMiniGame/Data/meimeiFlower.jpg", (image) => {
            image.x(this.width / 2);
            image.y(this.height / 2);
            image.offsetX( image.width() / 2);
            image.offsetY( image.height() / 2);
            image.draggable(true);

            this.flowerMeiMei = image;
            this.group.add(this.flowerMeiMei);
            console.log("Flower Image exists");
        });

        this.group.add(this.instructionText);
        this.layer.add(this.group);
        this.layer.draw();
        this.stage.add(this.layer);

    }
    displayGame(): void{
        this.group.destroyChildren();
        this.group = new Konva.Group({ visible: true });

        this.group.add(this.scoreText);
        this.group.add(this.timerText);
        if(this.boxMeiMei!= null)
            this.group.add(this.boxMeiMei);

        this.layer.add(this.group);
        this.layer.draw();
        this.stage.add(this.layer);
    }
    displayEndScreen(score:number):void{
        this.group.destroyChildren();
        this.group = new Konva.Group({ visible: true });
        if(score < GOOD_SCORE){
            this.badEndScreen(score);
        }
        else{
            this.goodEndScreen(score);
        }
        this.layer.add(this.group);
        this.layer.draw();
        this.stage.add(this.layer);
    }
    badEndScreen(score:number) : void{
        var scoreText = new Konva.Text({
            x: 0,
            y: 20,
            text: `Your score was ${Math.trunc(score)}, Mei Mei wanted more money`,
            fontSize: 32,
            fontFamily: "Arial",
            fill: "black",
            width: this.width,
            align: 'center'
        });
        this.group.add(scoreText);
        Konva.Image.fromURL("./src/MoneyMiniGame/Data/meimeiAngry.jpg", (image) => {
            image.x(this.width / 2);
            image.y(this.height/2);
            image.height(image.height()/ 1.5);
            image.width(image.width()/1.5);
            image.offsetX( image.width() / 2);
            image.offsetY( image.height() / 2);            

            var img = image;
            this.group.add(img);
            console.log("Bad Image exists");
        });
        console.log("Draw Bad");
    }
    goodEndScreen(score : number) : void{
        var scoreText = new Konva.Text({
            x: 0,
            y: 20,
            text: `Your score was ${Math.trunc(score)}, Mei Mei can sleep happily with her money`,
            fontSize: 32,
            fontFamily: "Arial",
            fill: "black",
            width: this.width,
            align: 'center'
        });
        this.group.add(scoreText);
        Konva.Image.fromURL("./src/MoneyMiniGame/Data/meimeiHappy2.jpeg", (image) => {
            image.x(this.width / 2);
            image.y(this.height/2);
            image.height(image.height() * 1.5);
            image.width(image.width() * 1.5);
            image.offsetX( image.width() / 2);
            image.offsetY( image.height() / 2);
            

            var img = image;
            this.group.add(img);
            console.log("good Image exists");
        });
        console.log("Draw good");
    }
    updateScore(score: number): void {
		this.scoreText.text(`Score: ${Math.trunc(score)}`);
		this.group.getLayer()?.draw();
	}
    updateTimer(timeRemaining: number): void {
		this.timerText.text(`Time: ${timeRemaining}`);
		this.group.getLayer()?.draw();
	}
    handleCollision() : number{
        let col = 0;
        if(this.boxMeiMei != null){
            let boundingBox =this.boxMeiMei?.getClientRect()
            let box  = new Konva.Rect({
                    x: boundingBox.x,
                    y: boundingBox.y,
                    width: boundingBox.width,
                    height: boundingBox.height,
            });
            for(let i = 0; i < this.moneyGroup.length; i++){

                if(this.haveIntersection(box, this.boxGroup[i])){
                    this.moneyGroup[i].remove();
                    this.boxGroup[i].remove();
                    this.boxGroup[i].y(1000);
                    
                    col++;
                }
            }
        }
        return col;
    }
    haveIntersection(r1: Konva.Rect, r2:Konva.Rect | null): boolean {
        if(r1 == null || r2 == null){
            return false;
        }
    return !(
        r2.x() > r1.x() + r1.width() ||
        r2.x() + r2.width() < r1.x() ||
        r2.y() > r1.y() + r1.height() ||
        r2.y() + r2.height() < r1.y()
    );
    }
    updateY():void{
        for(let i = 0; i < this.moneyGroup.length; i++){
            this.moneyGroup[i].y(this.moneyGroup[i].y() + 4);
            this.boxGroup[i].y(this.boxGroup[i].y() + 4);
        }
    }
    addMoneyImg() : void{
        var circle = new Konva.Circle({
            x: Math.random() * (this.stage.width() - 10) + 10,
            //y: this.stage.height(),
            y:0,
            radius: 10,
            fill: "yellow",
            stroke: "black",
            strokeWidth: 4,
        });
        this.moneyGroup.push(circle);
        this.group.add(circle);

        var boundingBox = circle.getClientRect({ relativeTo: this.group });
        var box = new Konva.Rect({
            x: boundingBox.x,
            y: boundingBox.y,
            width: boundingBox.width,
            height: boundingBox.height,
            stroke: 'red',
            strokeWidth: 1,
            visible: false
        });
        this.group.add(box);
        this.boxGroup.push(box);
        
    }
    /**
     * Show the screen
     */
    show(): void {
        this.group.visible(true);
        this.group.getLayer()?.draw();
    }

    /**
     * Hide the screen
     */
    hide(): void {
        this.group.visible(false);
        this.group.getLayer()?.draw();
    }

    getGroup(): Konva.Group {
        return this.group;
    }
    destroy(): void {
        this.stage.destroy();
    }
}