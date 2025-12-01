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
    private mapModel: MapModel | null = null;
    private mapView: MapView | null = null;
    private mapController: MapController | null = null;
    private postcardController: PostcardController | null = null;
    private postcardView: PostcardView | null = null;

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
        // Don't clear if we're just returning to the map - preserve the model
        // Only clear if we're coming from intro or a different screen
        const shouldClear = !this.mapModel;
        
        if (shouldClear) {
            this.clearContainer();
        } else {
            // Just clear the container HTML, but keep model state
            // Destroy the old view's stage first
            if (this.mapView && this.mapView.destroy) {
                this.mapView.destroy();
            }
            if (this.currentController && this.currentController.destroy) {
                this.currentController.destroy();
            }
            const container = document.getElementById(this.containerId);
            if (container) {
                container.innerHTML = "";
            }
            this.currentController = null;
        }

        // Reuse existing model if it exists, otherwise create a new one
        if (!this.mapModel) {
            this.mapModel = new MapModel();
        } else {
            // Reset UI state flags when returning to map
            // This ensures clicks work properly after returning from other screens
            this.mapModel.messageBoxVisible = false;
            this.mapModel.showingTravelPath = false;
        }
        
        // Always recreate the view since the DOM was cleared
        // The view needs to be recreated because the Konva stage was destroyed
        this.mapView = new MapView(this.containerId, this.mapModel);
        await this.mapView.init();
        
        // Ensure the stage is ready before creating controller
        // Recreate controller with the new view
        this.mapController = new MapController(this.mapModel, this.mapView);
        
        // Force a redraw to ensure everything is ready
        this.mapView.draw();
        
        this.currentController = this.mapController;

        // Show postcard at the start of the map
        const currentLocationData = this.mapModel.getCurrentLocationData();
        if (currentLocationData) {
            this.showPostcard(currentLocationData);
        }

        (this.mapController as any).setOnLocationFound((locationData: any) => {
            // After correct guess, show new postcard for the next location
            // The old postcard will be replaced
            this.showPostcard(locationData);
        });
    }

    private showPostcard(locationData: any) {
        // Don't clear the map - show postcard on top of it
        // Get the map's layer to add the postcard to it
        if (!this.mapView) {
            console.error("Map view not available");
            return;
        }

        // Destroy existing postcard if there is one
        if (this.postcardView) {
            this.postcardView.destroy();
            this.postcardView = null;
            this.postcardController = null;
        }

        const mapLayer = this.mapView.getLayer();
        
        // Convert locationData to Postcard Location format
        const postcardLocation = new Location(
            locationData.name,
            { x: locationData.x, y: locationData.y },
            `A postcard from ${locationData.name}.`, // You can customize this story
            3, // Number of days - you can get this from locationData if available
            locationData.hint || "", // Include the hint from locationData
            locationData.image || "" // Include the image path from locationData
        );

        // Create postcard model and view
        const postcardModel = new PostcardModel(postcardLocation);
        const postcardView = new PostcardView(mapLayer);
        this.postcardView = postcardView;
        
        // Create postcard controller with callbacks
        const postcardController = new PostcardController(
            postcardModel,
            postcardView,
            () => {
                // On close: just minimize the postcard, keep map visible
                // The postcard will be minimized to bottom-left
            },
            () => {
                // On travel: destroy postcard and show flag game
                if (this.postcardView) {
                    this.postcardView.destroy();
                    this.postcardView = null;
                    this.postcardController = null;
                }
                const flagController = new FlagGameController();
                this.currentController = flagController;
                flagController.start();

                (flagController as any).setOnFinish(() => {
                    // After flag game, return to map
                    this.showMap();
                });
            }
        );
        this.postcardController = postcardController;

        // Ensure postcard appears on top of all map elements
        const postcardGroup = postcardView.getGroup();
        postcardGroup.moveToTop();
        mapLayer.draw();
    }
}
