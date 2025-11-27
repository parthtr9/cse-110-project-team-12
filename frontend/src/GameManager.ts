import Konva from "konva";
import { IntroScreenController } from "./Intro/screens/IntroScreenController";
import { initMapView } from "./MapView";
import { MapController } from "./MapView/MapController";
import { MapModel } from "./MapView/MapModel";
import { MapView } from "./MapView/MapView";
import { PostcardController } from "./Postcard/PostcardController";
import { PostcardModel } from "./Postcard/PostcardModel";
import { PostcardView } from "./Postcard/PostcardView";
import { Location } from "./Postcard/Location";
import { FlagGameController } from "./FlagMinigame/FlagGameController";

export class GameManager {
    private containerId: string;
    private currentController: any = null;

    constructor(containerId: string) {
        this.containerId = containerId;
    }

    async start() {
        this.showIntro();
    }

    private clearContainer() {
        const container = document.getElementById(this.containerId);
        if (container) {
            container.innerHTML = "";
        }
        if (this.currentController && this.currentController.destroy) {
            this.currentController.destroy();
        }
        this.currentController = null;
    }

    private showIntro() {
        this.clearContainer();

        const stage = new Konva.Stage({
            container: this.containerId,
            width: window.innerWidth,
            height: window.innerHeight,
        });
        const layer = new Konva.Layer();
        stage.add(layer);

        const introController = new IntroScreenController(layer, stage);
        this.currentController = introController;

        (introController as any).setOnComplete(() => {
            this.showMap();
        });
    }

    private async showMap() {
        this.clearContainer();

        const model = new MapModel();
        const view = new MapView(this.containerId, model);
        await view.init();
        const controller = new MapController(model, view);
        this.currentController = controller;

        (controller as any).setOnLocationFound((locationData: any) => {
            this.showPostcard(locationData);
        });
    }

    private showPostcard(locationData: any) {
        const controller = new FlagGameController();
        this.currentController = controller;
        controller.start();

        (controller as any).setOnFinish(() => {
            this.showMap();
        });
    }
}
