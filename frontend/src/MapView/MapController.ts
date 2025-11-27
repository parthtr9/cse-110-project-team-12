// MapController.ts - Handles user interactions and coordinates between Model and View

import Konva from "konva";

import { MapModel } from "./MapModel";
import { MapView } from "./MapView";
import correctBuzzer from "../public/correct_buzzer.mp3";
import wrongBuzzer from "../public/wrong_buzzer.mp3";


// Controller class to handle user interactions
export class MapController {
  private model: MapModel;
  private view: MapView;
  public correctBuzzer: HTMLAudioElement;
  public wrongBuzzer: HTMLAudioElement;

  constructor(model: MapModel, view: MapView) {
    this.model = model;
    this.view = view;
    this.initEventHandlers();
    this.correctBuzzer = new Audio(correctBuzzer);
    this.wrongBuzzer = new Audio(wrongBuzzer);
  }

  // Initialize all event handlers
  private initEventHandlers(): void {
    const stage = this.view.getStage();
    // Remove any existing click handlers to avoid duplicates
    stage.off("click");
    // Attach new click handler
    stage.on("click", (e) => this.handleStageClick(e));
  }

  // Main click handler
  private handleStageClick(e: Konva.KonvaEventObject<MouseEvent>): void {
    const pointerPos = this.view.getStage().getPointerPosition();
    if (!pointerPos) {
      console.log("No pointer position");
      return;
    }
    
    console.log("Click detected", {
      messageBoxVisible: this.model.messageBoxVisible,
      showingTravelPath: this.model.showingTravelPath,
      nonGame: this.view.nonGame
    });


    // Handle Instructions button
    if(this.view.nonGame){
      this.showInstructions();
      return;
    }

    // Handle travel path scene
    if (this.model.showingTravelPath) {
      this.handleTravelPathClick(e);
      return;
    }

    // Handle message box visible - check if clicking on continue button
    if (this.model.messageBoxVisible) {
      const wasContinueButton = this.handleMessageBoxClick(e);
      // If not clicking on continue button, allow map clicks to continue guessing
      if (!wasContinueButton) {
        // Check if click is on the message box itself (not the map)
        let shape: Konva.Node | null = e.target as Konva.Node;
        let isMessageBoxClick = false;
        while (shape) {
          if (shape.name() === "messageBox") {
            isMessageBoxClick = true;
            break;
          }
          shape = shape.getParent();
        }
        
        // If not clicking on message box, and previous guess was incorrect, allow new guess
        if (!isMessageBoxClick) {
          const wasCorrectGuess = this.model.getLastClickedLocationCorrectness();
          if (!wasCorrectGuess) {
            // Previous guess was incorrect, allow new guess
            this.view.removeMessageBoxes();
            this.model.messageBoxVisible = false;
            this.handleMapClick(pointerPos.x, pointerPos.y);
          }
          // If previous guess was correct, only continue button works
        }
      }
      return;
    }

    // Handle map click
    console.log("Processing map click");
    this.handleMapClick(pointerPos.x, pointerPos.y);
  }

  // Handle clicks when travel path is showing
  private handleTravelPathClick(e: Konva.KonvaEventObject<MouseEvent>): void {
    let shape: Konva.Node | null = e.target as Konva.Node;
    while (shape) {
      if (shape.name() === "travelPathContinueButton") {
        // Hide travel path and return to map
        this.hideTravelPath();
        return;
      }
      shape = shape.getParent();
    }
    // Ignore all other clicks when travel path is visible
  }

  // Hide travel path and return to map view
  private hideTravelPath(): void {
    this.model.showingTravelPath = false;
    // Remove travel path elements
    const travelPathElements = this.view.getLayer().find((node: Konva.Node) =>
      node.name() === "travelPath" || node.name() === "travelPathContinueButton"
    );
    travelPathElements.forEach((node) => node.destroy());

    // Show target location marker for the new location
    this.view.showTargetLocation();
    this.view.draw();
  }

  // Handle clicks when message box is visible
  // Returns true if continue button was clicked, false otherwise
  private handleMessageBoxClick(e: Konva.KonvaEventObject<MouseEvent>): boolean {
    let shape: Konva.Node | null = e.target as Konva.Node;
    while (shape) {
      if (shape.name() === "continueButton") {
        const wasCorrectGuess = this.model.getLastClickedLocationCorrectness();
        this.dismissMessageBox(wasCorrectGuess);
        return true;
      }
      shape = shape.getParent();
    }
    // Not clicking on continue button
    return false;
  }

  // Handle clicks on the map
  private handleMapClick(clickX: number, clickY: number): void {

    // Convert click coordinates from displayed space to original image space
    const originalClick = this.view.unscaleCoordinates({ x: clickX, y: clickY });

    // Check if click is correct (using original image coordinates)
    const wasCorrect = this.model.isClickCorrect(originalClick.x, originalClick.y);

    // Debug: Log click coordinates and target location
    const target = this.model.correctLocation;
    const distance = Math.sqrt(
      Math.pow(originalClick.x - target.x, 2) + Math.pow(originalClick.y - target.y, 2)
    );

    // Store the clicked location in model (using original coordinates)
    this.model.addClickedLocation({
      x: originalClick.x,
      y: originalClick.y,
      wasCorrect: wasCorrect,
    });

    // Remove existing markers
    this.view.removeMarkers();

    // Create and display marker (using displayed coordinates for rendering)
    const marker = wasCorrect
      ? this.view.createStar(clickX, clickY)
      : this.view.createX(clickX, clickY);

    this.view.addShape(marker);

    // Show appropriate message
    if (wasCorrect) {
      this.view.hideHintCircle();
      this.correctBuzzer.play();
		  this.correctBuzzer.currentTime = 0;
      this.model._daysTraveled += this.model.days;
      this.model.days = 1;
      // Mark this location as visited so it won't be shown again
      this.model.markCurrentLocationAsVisited();
      this.showSuccessMessage();
    } 
    else {
      this.view.hideHintCircle();
      this.wrongBuzzer.play();
      this.wrongBuzzer.currentTime = 0;
      this.model.days++;
      this.showIncorrectMessage();

      if(this.model.days >= 3){
        this.view.showHintCircle();
      }
    }

    this.view.draw();
  }

  // Show success message
  private showSuccessMessage(): void {
    const messageBox = this.view.createSuccessMessage();
    this.view.addShape(messageBox);
    this.model.messageBoxVisible = true;
  }

  // Show incorrect message
  private showIncorrectMessage(): void {
    const messageBox = this.view.createIncorrectMessage();
    this.view.addShape(messageBox);
    this.model.messageBoxVisible = true;
  }

  // show instructions
  private showInstructions(): void{
    const messageBox = this.view.createInstructionsMessage();
    this.view.addShape(messageBox);
    this.model.messageBoxVisible = true;
  }

  private onLocationFound: ((locationData: any) => void) | null = null;

  setOnLocationFound(callback: (locationData: any) => void) {
    this.onLocationFound = callback;
  }

  // Dismiss message box
  private dismissMessageBox(wasCorrectGuess: boolean): void {
    this.view.removeMessageBoxes();
    this.model.messageBoxVisible = false;

    if (wasCorrectGuess) {
      if (this.onLocationFound) {
        const currentLocation = this.model.getCurrentLocationData();
        if (currentLocation) {
          this.onLocationFound(currentLocation);
        }
      }

      const hasMoreLocations = this.model.advanceToNextLocation();

      this.view.updateHint();
      this.view.hideTargetLocation();
      this.view.showTargetLocation();
      
      // Update path visualization to show all correct locations
      this.view.updatePathVisualization();

      if (this.model.hasClickedLocations()) {
        this.showTravelPath();
      } else if (hasMoreLocations) {
        this.view.draw();
      } else {
        console.log("Game complete!");
        this.view.draw();
      }
    } else {
      this.view.draw();
    }
  }

  // Show travel path visualization
  private showTravelPath(): void {
    this.model.showingTravelPath = true;
    const correctLocations = this.model.getCorrectLocations();
    this.view.renderTravelPath(correctLocations);
  }

  // Cleanup method to remove event handlers
  destroy(): void {
    const stage = this.view.getStage();
    if (stage) {
      stage.off("click");
    }
  }
}

