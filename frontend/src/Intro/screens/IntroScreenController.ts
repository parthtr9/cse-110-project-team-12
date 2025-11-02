import Konva from "konva";
//import * as fs from 'fs'; // For Node.js
import ruleData from "../Data/rules.json";
import storyData from '../Data/story.json';
import { IntroScreenModel } from "./IntroScreenModel";
import { IntroScreenView } from "./IntroScreenView";

export class IntroScreenController{
    private model: IntroScreenModel;
    private view: IntroScreenView;
    private story: string [];
    private rules: string [];

    constructor(layer:Konva.Layer, stage:Konva.Stage){
        this.model = new IntroScreenModel();
        this.view = new IntroScreenView(this.handleNextClick, layer, stage);
        this.rules = this.getData(ruleData);
        this.story = this.getData(storyData);
    }
    private handleNextClick = () => {
        if(this.model.getState() == 0){
            this.model.setState(1);
            this.view.displayPage(this.model.getState(),this.story, this.handleNextClick);
        }
        else if(this.model.getState() == 1){
            this.model.setState(2);
            this.view.displayPage(this.model.getState(),this.rules, this.handleNextClick);
        }
    }

    getData(data: Object):string[]{
        const jsonString = JSON.stringify(data);
        const parsedData: any = JSON.parse(jsonString);
        const stringArray: string[] = Object.values(parsedData).map(String);
        return stringArray;
    }
    getView(): IntroScreenView {
		return this.view;
	}
}