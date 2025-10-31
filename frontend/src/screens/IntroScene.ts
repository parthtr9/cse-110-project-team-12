import Konva from "konva";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../constants.ts";

export class IntroScene{
    private group: Konva.Group;
    private layer : Konva.Layer;
    private stage : Konva.Stage;
    private story: string;
    private rules: string;


	//constructor(onStartClick: () => void) {
    constructor(layer:Konva.Layer, stage:Konva.Stage){
		this.group = new Konva.Group({ visible: true });
        this.rules = "Rules";
        this.story = "story";
        this.layer = layer;
        this.stage = stage;
       
		// Title text
        const title = new Konva.Text({
			x: STAGE_WIDTH / 2,
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
			x: STAGE_WIDTH / 2 - 100,
			y: 300,
			width: 200,
			height: 60,
			fill: "green",
			cornerRadius: 10,
			stroke: "darkgreen",
			strokeWidth: 3,
		});
		const startText = new Konva.Text({
			x: STAGE_WIDTH / 2,
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


    getRules(): boolean{
        this.rules = "Yes";
        return true;
    }
    displayStory(): void{
       const storyText = new Konva.Text({
			x: STAGE_WIDTH / 2,
			y: 150,
			text: this.story,
			fontSize: 48,
			fontFamily: "Arial",
			fill: "yellow",
			stroke: "orange",
			strokeWidth: 2,
			align: "center",
		});
		// Center the text using offsetX
		storyText.offsetX(storyText.width() / 2);
        this.group.add(storyText);

        const nextButtonGroup = new Konva.Group();
		const nextButton = new Konva.Rect({
			x: STAGE_WIDTH / 2 - 100,
			y: 300,
			width: 200,
			height: 60,
			fill: "green",
			cornerRadius: 10,
			stroke: "darkgreen",
			strokeWidth: 3,
		});
		const nextText = new Konva.Text({
			x: STAGE_WIDTH / 2,
			y: 315,
			text: "NEXT",
			fontSize: 24,
			fontFamily: "Arial",
			fill: "white",
			align: "center",
		});
		nextText.offsetX(nextText.width() / 2);
		nextButtonGroup.add(nextButton);
		nextButtonGroup.add(nextText);
		nextButtonGroup.on("click", this.onNextClick);
		this.group.add(nextButtonGroup);
    }
    displayRules(): void{
        const ruleText = new Konva.Text({
			x: STAGE_WIDTH / 2,
			y: 150,
			text: this.rules,
			fontSize: 48,
			fontFamily: "Arial",
			fill: "yellow",
			stroke: "orange",
			strokeWidth: 2,
			align: "center",
		});
		// Center the text using offsetX
		ruleText.offsetX(ruleText.width() / 2);
        this.group.add(ruleText);

        const nextButtonGroup = new Konva.Group();
		const nextButton = new Konva.Rect({
			x: STAGE_WIDTH / 2 - 100,
			y: 300,
			width: 200,
			height: 60,
			fill: "green",
			cornerRadius: 10,
			stroke: "darkgreen",
			strokeWidth: 3,
		});
		const nextText = new Konva.Text({
			x: STAGE_WIDTH / 2,
			y: 315,
			text: "PLAY GAME",
			fontSize: 24,
			fontFamily: "Arial",
			fill: "white",
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