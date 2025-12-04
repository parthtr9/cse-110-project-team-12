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
import { MoneyController } from "./MoneyMiniGame/MoneyController";
import { CompletionController } from "./Completion/CompletionController";

export class GameManager {
    private containerId: string;
    private currentController: any = null;
    private mapModel: MapModel | null = null;
    private mapView: MapView | null = null;
    private mapController: MapController | null = null;
    private postcardController: PostcardController | null = null;
    private postcardView: PostcardView | null = null;
    private readonly TARGET_LOCATIONS = 10; 

    constructor(containerId: string) {
        this.containerId = containerId;
    }

    async start() {
        this.showIntro();
    }

    private clearContainer(preserveGameButtons: boolean = true) {
        const container = document.getElementById(this.containerId);
        if (container) {
            if (preserveGameButtons) {
                // Remove all children except our game buttons
                const buttons = container.querySelectorAll('button');
                buttons.forEach(button => {
                    if (button.textContent !== 'Flag Game' && button.textContent !== 'Currency Game') {
                        button.remove();
                    }
                });
                
                // Remove all non-button elements
                Array.from(container.children).forEach(child => {
                    if (child.tagName !== 'DIV' || !child.querySelector('button')) {
                        container.removeChild(child);
                    }
                });
            } else {
                // Remove everything including game buttons
                container.innerHTML = '';
            }
        }
        
        if (this.currentController && this.currentController.destroy) {
            this.currentController.destroy();
        }
        this.currentController = null;
    }

    private showCompletionScreen() {
        console.log("showCompletionScreen called");
        
        // Clear the container but keep game buttons
        this.clearContainer();
        
        // Clean up any existing controllers or views
        if (this.mapView && this.mapView.destroy) {
            this.mapView.destroy();
        }
        
        // Create a new stage for the completion screen
        const stage = new Konva.Stage({
            container: this.containerId,
            width: window.innerWidth,
            height: window.innerHeight,
        });
        
        const layer = new Konva.Layer();
        stage.add(layer);

        // Create and show the completion screen
        const completionController = new CompletionController(layer, stage);
        this.currentController = completionController;
        
        // Get days traveled from mapModel or default to 1
        const daysTraveled = this.mapModel ? this.mapModel.daysTraveled : 1;
        
        // Show completion screen
        completionController.showCompletionScreen(daysTraveled);
        
        // Set up play again callback using the proper setter method
        if (completionController && typeof completionController.setOnPlayAgain === 'function') {
            completionController.setOnPlayAgain(() => {
                console.log("Play again clicked, resetting game...");
                
                // Reset the game state
                this.mapModel = null;
                this.mapView = null;
                this.mapController = null;
                this.postcardController = null;
                this.postcardView = null;
                
                // Restart the game
                this.showIntro();
            });
        } else {
            console.error("setOnPlayAgain is not available on completionController");
        }
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

        // Add game buttons
        this.createGameButtons();

        const introController = new IntroScreenController(layer, stage);
        this.currentController = introController;

        (introController as any).setOnComplete(() => {
            this.showMap();
        });
    }

    private async showMap() {
        // Check if we have a model and if we've reached the target number of locations
        if (this.mapModel) {
            const visitedCount = this.mapModel.getVisitedLocationCount();
            console.log(`[showMap] Visited locations: ${visitedCount}/${this.TARGET_LOCATIONS}`);
            
            if (visitedCount >= this.TARGET_LOCATIONS) {
                console.log("[showMap] Showing completion screen");
                this.showCompletionScreen();
                return;
            }
        }

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

        this.createGameButtons();
        
        // Ensure the stage is ready before creating controller
        // Recreate controller with the new view
        this.mapController = new MapController(this.mapModel, this.mapView);
        this.mapController.setOnLocationFound((data: any) => {
            console.log("onLocationFound callback:", data); // Debug log
            if (data.isGameComplete) {
                console.log("Game complete, showing completion screen");
                this.showCompletionScreen();
            }
        });
        
        // Force a redraw to ensure everything is ready
        this.mapView.draw();
        
        this.currentController = this.mapController;

        // Show postcard at the start of the map
        const currentLocationData = this.mapModel.getCurrentLocationData();
        if (currentLocationData) {
            this.showPostcard(currentLocationData);
        }

        (this.mapController as any).setOnLocationFound((data: any) => {
            console.log("onLocationFound callback:", data);
            
            if (data.isGameComplete) {
                console.log("Game complete, showing completion screen");
                this.showCompletionScreen();
            } else {
                // Only show postcard if not game complete
                this.showPostcard(data);
            }
        });
    }

    private showPostcard(locationData: any) {
        // Don't show postcard if game is complete
        if (this.mapModel && this.mapModel.getVisitedLocationCount() >= this.TARGET_LOCATIONS) {
            console.log("Game complete, skipping postcard");
            return;
        }

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
    // In GameManager.ts
    private createGameButtons(): void {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        // Create container for game buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.style.position = 'fixed';
        buttonContainer.style.bottom = '20px';
        buttonContainer.style.right = '20px';
        buttonContainer.style.display = 'flex';
        buttonContainer.style.gap = '10px';
        buttonContainer.style.zIndex = '1000'; // Ensure it's above other elements

        // Flag Game Button
        const flagButton = document.createElement('button');
        flagButton.textContent = 'Flag Game';
        flagButton.style.padding = '10px 15px';
        flagButton.style.backgroundColor = '#4CAF50';
        flagButton.style.color = 'white';
        flagButton.style.border = 'none';
        flagButton.style.borderRadius = '5px';
        flagButton.style.cursor = 'pointer';
        flagButton.addEventListener('click', () => this.startFlagGame());

        // Currency Game Button
        const currencyButton = document.createElement('button');
        currencyButton.textContent = 'Currency Game';
        currencyButton.style.padding = '10px 15px';
        currencyButton.style.backgroundColor = '#2196F3';
        currencyButton.style.color = 'white';
        currencyButton.style.border = 'none';
        currencyButton.style.borderRadius = '5px';
        currencyButton.style.cursor = 'pointer';
        currencyButton.addEventListener('click', () => this.startCurrencyGame());

        buttonContainer.appendChild(flagButton);
        buttonContainer.appendChild(currencyButton);
        container.appendChild(buttonContainer);
    }
    private startFlagGame(): void {
    // Clean up any existing postcard
    if (this.postcardView) {
        this.postcardView.destroy();
        this.postcardView = null;
        this.postcardController = null;
    }

    // Start the flag game
    const flagController = new FlagGameController();
    this.currentController = flagController;
    flagController.start();

    // Handle game completion
    (flagController as any).setOnFinish(() => {
        this.showMap();  // Return to map when game is done
    });
}

private startCurrencyGame(): void {
    // Clean up any existing postcard
    if (this.postcardView) {
        this.postcardView.destroy();
        this.postcardView = null;
        this.postcardController = null;
    }

    // Start the money mini game
    const moneyGameController = new MoneyController();
    this.currentController = moneyGameController;
    moneyGameController.startGame();

    // Since MoneyController doesn't have a setOnFinish method,
    // we'll use a polling approach to detect when the game is done
    const checkGameEnded = setInterval(() => {
        // Check if the overlay is still in the DOM
        const overlay = document.querySelector('div[style*="position: fixed"][style*="background-color: rgba(0, 0, 0, 0.7)"]');
        if (!overlay) {
            clearInterval(checkGameEnded);
            this.showMap();
        }
    }, 500);
}
}
