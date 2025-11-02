import Konva from "konva";
//import * as fs from 'fs'; // For Node.js

export class IntroScreenView{
    private group: Konva.Group;
    private layer : Konva.Layer;
    private stage : Konva.Stage;
    private meimeiRed: Konva.Image | null = null;
    private meimeiBlue: Konva.Image | null = null;
    private meimeiYellow: Konva.Image | null = null;
    private background: Konva.Rect;

    constructor(handleNextClick: () => void, layer:Konva.Layer, stage:Konva.Stage){
        this.group = new Konva.Group({ visible: true });
        this.layer = layer;
        this.stage = stage;
        Konva.Image.fromURL("./src/Intro/Data/meimeiRed.jpg", (image) => {
            image.width(300);
            image.height(300);
			image.x(this.stage.width() / 2 + 400);
			image.y(600);
			image.offsetX( image.width() / 2);
			image.offsetY( image.height() / 2);
			this.meimeiRed = image;
		}, (error) =>{console.log(error)});
        Konva.Image.fromURL("./src/Intro/Data/meimeiBlue.jpg", (image) => {
            image.width(300);
            image.height(300);
			image.x(this.stage.width() / 2 - 400);
			image.y(650);
			image.offsetX( image.width() / 2);
			image.offsetY( image.height() / 2);
			this.meimeiBlue = image;
		}, (error) =>{console.log(error)});
        Konva.Image.fromURL("./src/Intro/Data/meimeiYellow.jpg", (image) => {
            image.width(300);
            image.height(300);
			image.x(this.stage.width() / 2);
			image.y(400);
			image.offsetX( image.width() / 2);
			image.offsetY( image.height() / 2);
			this.meimeiYellow = image;
            this.group.add(this.meimeiYellow);
		}, (error) =>{console.log(error)});

        this.background = new Konva.Rect({
            x:0,
            y:0,
            width: stage.width(),
            height: stage.height(),
            fill: "rgb(235, 153, 46)"
        });
        this.group.add(this.background);

        //this.displayPage(["Mei Mei's Adventure"], "START GAME", this.meimeiYellow, "green");
        
		// Title text
        const title = new Konva.Text({
			x: this.stage.width() / 2,
			y: 150,
			text: "Mei Mei's Adventure",
			fontSize: 70,
			fontFamily: "Arial",
			fill: "yellow",
			stroke: "orange",
			strokeWidth: 2,
			align: "center",
		});
		// Center the text using offsetX
		title.offsetX(title.width() / 2);
		this.group.add(title);

		const startButtonGroup = new Konva.Group();
		const startButton = new Konva.Rect({
			x: this.stage.width() / 2 - 100,
			y: 600,
			width: 200,
			height: 60,
			fill: "green",
			cornerRadius: 10,
			stroke: "darkgreen",
			strokeWidth: 3,
		});
		const startText = new Konva.Text({
			x: this.stage.width() / 2, 
			y: 615,
			text: "START INTRO",
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
    } 
    displayPage(state: number, text:string[],handleNextClick: () => void):void{
        console.log("displayPAge");
        let img = null;
        let bgColor = "pink";
        let buttonText = "Placeholder";
        if(state == 1){
            img = this.meimeiRed;
            bgColor = 'rgb(198,56,56)';
            buttonText = "NEXT";
        }
        else if(state == 2){
            img = this.meimeiBlue;
            bgColor = 'rgb(69, 81, 196)';
            buttonText = "PLAY GAME";
        }

        this.group.destroyChildren();
        this.background.fill(bgColor);
        this.group.add(this.background);
        for(let i = 0; i < text.length; i++){
                const pageText = new Konva.Text({
                x: this.stage.width() / 2,
                y: 150 + i * 100,
                text: text[i],
                fontSize: 25,
                fontFamily: "Arial",
                fill: "orange",
                //stroke: "orange",
                strokeWidth: 2,
                align: "center",
            });
            // Center the text using offsetX
            pageText.offsetX(pageText.width() / 2);
            this.group.add(pageText);
        }
        if(img)
            this.group.add(img);
        else{
            console.log("No image");
        }
        const nextButtonGroup = new Konva.Group();
        const nextButton = new Konva.Rect({
            x: this.stage.width() / 2 - 100,
            y: 600,
            width: 200,
            height: 60,
            fill: "green",
            cornerRadius: 10,
            stroke: "darkgreen",
            strokeWidth: 3,
        });
        const nextText = new Konva.Text({
            x: this.stage.width() / 2, 
            y: 615,
            text: buttonText,
            fontSize: 24,
            fontFamily: "Arial",
            fill: "white",
            align: "center",
        });
        nextText.offsetX(nextText.width() / 2);
        nextButtonGroup.add(nextButton);
        nextButtonGroup.add(nextText);
        nextButtonGroup.on("click", handleNextClick);
        this.group.add(nextButtonGroup);
        this.layer.add(this.group);
        this.layer.draw();
        this.stage.add(this.layer);
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
}