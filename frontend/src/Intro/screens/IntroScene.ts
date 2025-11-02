import Konva from "konva";
//import * as fs from 'fs'; // For Node.js
import ruleData from "../Data/rules.json";
import storyData from '../Data/story.json';

export class IntroScene{
    private group: Konva.Group;
    private layer : Konva.Layer;
    private stage : Konva.Stage;
    private story: string [];
    private rules: string [];
    private state: number;
    private meimeiRed: Konva.Image | null = null;
    private meimeiBlue: Konva.Image | null = null;
    private meimeiYellow: Konva.Image | null = null;
    private background: Konva.Rect;
    
	//constructor(onStartClick: () => void) {
    constructor(layer:Konva.Layer, stage:Konva.Stage){
		this.group = new Konva.Group({ visible: true });
        this.rules = ["Rules"];
        this.story = ["story"];
        this.layer = layer;
        this.stage = stage;
        this.state = 0;
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


        this.rules = this.getData(ruleData);
        this.story = this.getData(storyData);

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
		startButtonGroup.on("click", this.handleNextClick);
		this.group.add(startButtonGroup);
        //this.displayPage(["Mei Mei's Adventure"], "START GAME", this.meimeiYellow, "green");

	}
    private handleNextClick = () => {
        let red: string = 'rgb(198,56,56)';
        let blue: string = 'rgb(69, 81, 196)';
        this.group.destroyChildren();
        if(this.state == 0){
            this.displayPage(this.story, "NEXT", this.meimeiRed, red);
            this.state = 1;
        }
        else if(this.state == 1){
            this.displayPage(this.rules, "PLAY GAME", this.meimeiBlue, blue);
        }
        this.layer.add(this.group);
        this.layer.draw();
        this.stage.add(this.layer);
    }

    getData(data: Object):string[]{
        const jsonString = JSON.stringify(data);
        const parsedData: any = JSON.parse(jsonString);
        const stringArray: string[] = Object.values(parsedData).map(String);
        return stringArray;
    }
    
    displayPage(text:string[], buttonText:string, img:Konva.Image|null, bgColor:string):void{
        console.log("displayPAge");
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
		nextButtonGroup.on("click", this.handleNextClick);
		this.group.add(nextButtonGroup);
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