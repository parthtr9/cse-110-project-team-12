import Konva from "konva";
import ruleData from "../Data/rules.json";
import storyData from '../Data/story.json';
import IntroScreenModel from "./IntroScreenModel";
import { IntroScreenView } from "./IntroScreenView";

export class IntroScreenController {
    private model: IntroScreenModel;
    private view: IntroScreenView;
    private story: string[];
    private rules: string[];

    private onFinish: (() => void) | null = null;

    constructor(layer:Konva.Layer, stage:Konva.Stage, onFinish?: () => void){
        this.model = new IntroScreenModel();
        this.onFinish = onFinish ?? null;
        this.view = new IntroScreenView(this.handleNextClick, layer, stage);
        this.rules = this.getData(ruleData);
        this.story = this.getData(storyData);
    }

    setOnComplete(callback: () => void) {
        this.onComplete = callback;
    }

    private handleNextClick = () => {
        if (this.model.getState() == 0) {
            this.model.setState(1);
            this.view.displayPage(this.model.getState(), this.story, this.handleNextClick);
        }
        else if (this.model.getState() == 1) {
            this.model.setState(2);
            this.view.displayPage(this.model.getState(), this.rules, this.handleNextClick);
        }
        else if (this.model.getState() == 2) {
            if (this.onComplete) {
                this.onComplete();
            }
        }
        else if(this.model.getState() == 2){
            // Intro finished; notify coordinator
            if (this.onFinish) this.onFinish();
        }
    }

    getData(data: Object): string[] {
        const jsonString = JSON.stringify(data);
        const parsedData: any = JSON.parse(jsonString);
        const stringArray: string[] = Object.values(parsedData).map(String);
        return stringArray;
    }
    getView(): IntroScreenView {
        return this.view;
    }

    destroy() {
    }
}