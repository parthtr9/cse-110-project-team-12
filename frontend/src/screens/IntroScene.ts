import Konva from "konva";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../constants.ts";
//import * as fs from 'fs'; // For Node.js
import ruleData from "../Data/rules.json";
import storyData from '../Data/story.json'

export class IntroScene{
    private group: Konva.Group;
    private layer : Konva.Layer;
    private stage : Konva.Stage;
    private story: string [];
    private rules: string [];
    // private rulesPath = './Data/rules.json';
    // private storyPath = './Data/story.json';



	//constructor(onStartClick: () => void) {
    constructor(layer:Konva.Layer, stage:Konva.Stage){
		this.group = new Konva.Group({ visible: true });
        this.rules = ["Rules"];
        this.story = ["story"];
        this.layer = layer;
        this.stage = stage;

        console.log("Here");
        console.log(ruleData);
        console.log(storyData);

        this.getRules();
        this.getStory();
       
		// Title text
        const title = new Konva.Text({
			x: this.stage.width() / 2,
			y: 150,
			text: "Group 12 Game",
			fontSize: 48,
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
			y: 300,
			width: 200,
			height: 60,
			fill: "green",
			cornerRadius: 10,
			stroke: "darkgreen",
			strokeWidth: 3,
		});
		const startText = new Konva.Text({
			x: this.stage.width() / 2,
			y: 315,
			text: "START GAME",
			fontSize: 24,
			fontFamily: "Arial",
			fill: "white",
			align: "center",
		});
		startText.offsetX(startText.width() / 2);
		startButtonGroup.add(startButton);
		startButtonGroup.add(startText);
		startButtonGroup.on("click", this.onStartClick);
		this.group.add(startButtonGroup);

		
	}
    private onStartClick = () => {
        console.log('Button clicked!');
        // Add any other logic you want to perform here
		this.group.destroyChildren();
        
        this.displayStory();
        this.layer.add(this.group);
        this.layer.draw();
        this.stage.add(this.layer);
    };
    private onNextClick = () => {
        console.log('Button clicked!');
        // Add any other logic you want to perform here
		this.group.destroyChildren();
        
        this.displayRules();
        this.layer.add(this.group);
        this.layer.draw();
        this.stage.add(this.layer);
    };


    getRules(): void{
        const jsonString = JSON.stringify(ruleData);
        const parsedData: any = JSON.parse(jsonString);
        const stringArray: string[] = Object.values(parsedData).map(String);
        this.rules = stringArray;
        console.log(this.rules);
    }
    getStory():void{
        const jsonString = JSON.stringify(storyData);
        const parsedData: any = JSON.parse(jsonString);
        const stringArray: string[] = Object.values(parsedData).map(String);
        this.story = stringArray;
        console.log(this.story);
    }
    displayStory(): void{
        for(let i = 0; i < this.story.length; i++){
             const storyText = new Konva.Text({
                x: this.stage.width() / 2,
                y: 150 + i * 100,
                text: this.story[i],
                fontSize: 20,
                fontFamily: "Arial",
                fill: "yellow",
                stroke: "orange",
                strokeWidth: 2,
                align: "center",
            });
            console.log(this.story[i]);
            // Center the text using offsetX
            storyText.offsetX(storyText.width() / 2);
            this.group.add(storyText);
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
			text: "NEXT",
			fontSize: 24,
			fontFamily: "Arial",
			fill: "black",
			align: "center",
		});
		nextText.offsetX(nextText.width() / 2);
		nextButtonGroup.add(nextButton);
		nextButtonGroup.add(nextText);
		nextButtonGroup.on("click", this.onNextClick);
		this.group.add(nextButtonGroup);
    }
    displayRules(): void{
        for(let i = 0; i < this.rules.length; i++){
            const ruleText = new Konva.Text({
            x: this.stage.width() / 2,
			y: 150 + i * 100,
			text: this.rules[i],
			fontSize: 20,
			fontFamily: "Arial",
			fill: "yellow",
			stroke: "orange",
			strokeWidth: 2,
			align: "center",
		});
		// Center the text using offsetX
		ruleText.offsetX(ruleText.width() / 2);
        this.group.add(ruleText);

        }
        
        const nextButtonGroup = new Konva.Group();
		const nextButton = new Konva.Rect({
			x: this.stage.width() / 2 -100,

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
			text: "PLAY GAME",
			fontSize: 24,
			fontFamily: "Arial",
			fill: "black",
			align: "center",
		});
		nextText.offsetX(nextText.width() / 2);
		nextButtonGroup.add(nextButton);
		nextButtonGroup.add(nextText);
		nextButtonGroup.on("click", this.onNextClick);
		this.group.add(nextButtonGroup);
    }
    handleNextClick(){

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