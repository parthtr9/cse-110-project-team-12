// MapView.ts - Handles UI rendering with Konva

import Konva from "konva";
import nAmericaMapSrc from "../public/namerica_map.jpg";
import sAmericaMapSrc from "../public/samerica_map.jpg";
import europeMapSrc from "../public/europe_map.jpg";
import africaMapSrc from "../public/africa_map.jpg";
import asiaMapSrc from "../public/asia_map.jpg";
import australiaMapSrc from "../public/australia_map.jpg";
import worldMapImageSrc from "../public/WorldMap1.png";
import { MapModel, Location } from "./MapModel";

// View class to manage Konva rendering
export class MapView {
  private stage: Konva.Stage;
  private layer: Konva.Layer;
  private model: MapModel;
  private originalImageWidth: number = 0;
  private originalImageHeight: number = 0;
  private worldMapImage: Konva.Image | null = null;
  public nonGame: boolean = false;

  constructor(containerId: string, model: MapModel) {
    this.model = model;

    // Create stage
    this.stage = new Konva.Stage({
      container: containerId,
      width: window.innerWidth,
      height: window.innerHeight,
    });

    // Create layer
    this.layer = new Konva.Layer();
    this.stage.add(this.layer);

    // Handle window resize
    window.addEventListener("resize", () => this.handleResize());
  }

  // Initialize the map view
  async init(): Promise<void> {
    await this.loadWorldMap();
    // Clear any existing message boxes
    this.removeMessageBoxes();
    // Show target location marker for debugging
    this.showTargetLocation();
    this.addInstructions();
    // Show path visualization if there are any correct locations
    this.updatePathVisualization();
  }

  // Show target location marker (for debugging - shows where the game thinks the location is)
  showTargetLocation(): void {
    const target = this.model.correctLocation;
    const tolerance = this.model.clickTolerance;
    
    // Scale coordinates to match current image size
    const scaledTarget = this.scaleCoordinates(target);
    const scaledTolerance = tolerance * this.calculateImageScale();
    
    // Draw a circle showing the target area
    const targetCircle = new Konva.Circle({
      x: scaledTarget.x,
      y: scaledTarget.y,
      radius: scaledTolerance,
      stroke: "red",
      strokeWidth: 2,
      dash: [5, 5],
      name: "targetLocation",
    });

    // Draw center point
    const centerPoint = new Konva.Circle({
      x: scaledTarget.x,
      y: scaledTarget.y,
      radius: 5,
      fill: "red",
      name: "targetLocation",
    });

    // Add label
    const label = new Konva.Text({
      x: scaledTarget.x + scaledTolerance + 5,
      y: scaledTarget.y - 10,
      text: `${this.model.city}\n(${target.x}, ${target.y})`,
      fontSize: 12,
      fontFamily: "Arial",
      fill: "red",
      name: "targetLocation",
    });

    this.layer.add(targetCircle);
    this.layer.add(centerPoint);
    this.layer.add(label);
    this.layer.draw();
  }

  // Hide target location marker
  hideTargetLocation(): void {
    const markers = this.layer.find((node: Konva.Node) => 
      node.name() === "targetLocation"
    );
    markers.forEach((node) => node.destroy());
    this.layer.draw();
  }

  showHintCircle(): void{
    const location = this.scaleCoordinates(this.model.correctLocation);
    let radial: number = 50;
    let dist: number = 6;
    if(this.model.days >= 9){
      radial = 25;
      dist = 2;
    }
    else if(this.model.days >= 6){
      radial = 50;
      dist = 3;
    }
    else if(this.model.days == 5){
      dist = 4.5;
    }
    else if(this.model.days == 4){
      dist = 5.5;
    }

    const randomX = location.x + Math.floor(Math.random() * (radial - 1)) * (Math.round(Math.random()) * 2-1);
    const randomY = location.y + Math.floor(Math.random() * (radial - 1)) * (Math.round(Math.random()) * 2-1);
    const hintCircle = new Konva.Circle({
      x: randomX,
      y: randomY,
      radius: this.model.clickTolerance * this.calculateImageScale() * dist,
      stroke: "yellow",
      strokeWidth: 2,
      name: "hintCircle",
    });

    this.layer.add(hintCircle);
    this.layer.draw();
  }

  hideHintCircle(): void{
    const found = this.layer.find((node: Konva.Node) =>
      node.name() === "hintCircle"
    );
    found.forEach((node) => node.destroy());
    this.layer.draw();
  }

  // Get the stage for event handling
  getStage(): Konva.Stage {
    return this.stage;
  }

  // Get the layer for manipulation
  getLayer(): Konva.Layer {
    return this.layer;
  }

  // Load and display world map
  private loadWorldMap(): Promise<void> {
    return new Promise((resolve, reject) => {
      const imageObj = new Image();
      imageObj.src = worldMapImageSrc;

      imageObj.onload = () => {
        // Store original image dimensions
        this.originalImageWidth = imageObj.width;
        this.originalImageHeight = imageObj.height;

        // Calculate scale to fit window while maintaining aspect ratio
        const scale = this.calculateImageScale();
        const position = this.calculateImagePosition(scale);

        // Create image with scaled dimensions, centered
        this.worldMapImage = new Konva.Image({
          x: position.x,
          y: position.y,
          image: imageObj,
          width: this.originalImageWidth * scale,
          height: this.originalImageHeight * scale,
          name: "worldMap",
        });

        this.layer.add(this.worldMapImage);
        this.renderDaysTraveledText();
        this.layer.draw();
        resolve();
      };

      imageObj.onerror = (error) => {
        console.error("Failed to load world map image:", error);
        reject(error);
      };
    });
  }

  // Calculate scale factor to fit image in window while maintaining aspect ratio
  private calculateImageScale(): number {
    if (this.originalImageWidth === 0 || this.originalImageHeight === 0) {
      return 1;
    }

    const stageWidth = this.stage.width();
    const stageHeight = this.stage.height();
    
    const scaleX = stageWidth / this.originalImageWidth;
    const scaleY = stageHeight / this.originalImageHeight;
    
    // Use the smaller scale to ensure image fits entirely
    return Math.min(scaleX, scaleY);
  }

  // Calculate centered position for the image
  private calculateImagePosition(scale: number): { x: number; y: number } {
    const scaledWidth = this.originalImageWidth * scale;
    const scaledHeight = this.originalImageHeight * scale;
    const stageWidth = this.stage.width();
    const stageHeight = this.stage.height();

    return {
      x: (stageWidth - scaledWidth) / 2,
      y: (stageHeight - scaledHeight) / 2,
    };
  }

  // Handle window resize
  private handleResize(): void {
    this.stage.width(window.innerWidth);
    this.stage.height(window.innerHeight);

    if (this.worldMapImage && this.originalImageWidth > 0) {
      const scale = this.calculateImageScale();
      const position = this.calculateImagePosition(scale);
      
      this.worldMapImage.width(this.originalImageWidth * scale);
      this.worldMapImage.height(this.originalImageHeight * scale);
      this.worldMapImage.x(position.x);
      this.worldMapImage.y(position.y);
      
      // Redraw target location marker if it exists
      const existingTarget = this.layer.find((node: Konva.Node) => 
        node.name() === "targetLocation"
      );
      if (existingTarget.length > 0) {
        existingTarget.forEach((node) => node.destroy());
        this.showTargetLocation();
      }
      
      // Update path visualization to match new scale
      this.updatePathVisualization();
      
      // Redraw everything
      this.layer.draw();
    }
  }

  // Convert coordinates from original image space to current displayed space
  scaleCoordinates(location: Location): Location {
    if (this.originalImageWidth === 0 || !this.worldMapImage) {
      return location;
    }

    const scale = this.calculateImageScale();
    const position = this.calculateImagePosition(scale);
    
    return {
      x: location.x * scale + position.x,
      y: location.y * scale + position.y,
    };
  }

  // Convert coordinates from current displayed space to original image space
  unscaleCoordinates(location: Location): Location {
    if (this.originalImageWidth === 0 || !this.worldMapImage) {
      return location;
    }

    const scale = this.calculateImageScale();
    const position = this.calculateImagePosition(scale);
    
    return {
      x: (location.x - position.x) / scale,
      y: (location.y - position.y) / scale,
    };
  }

  // Render days traveled text and current hint
  private renderDaysTraveledText(): void {
    // Remove existing text if it exists
    const existingText = this.layer.find((node: Konva.Node) => 
      node.name() === "daysTraveledText" || node.name() === "hintText"
    );
    existingText.forEach((node) => node.destroy());

    // Render days traveled
    const daysText = new Konva.Text({
      x: this.stage.width() - 250,
      y: 20,
      text: `Days Traveled: ${this.model.daysTraveled}`,
      fontSize: 20,
      fontFamily: "Arial",
      fill: "black",
      name: "daysTraveledText",
    });

    this.layer.add(daysText);
    daysText.moveToTop();

    // Render current hint
    const hintText = new Konva.Text({
      x: 20,
      y: 20,
      text: `Hint: ${this.model.hint}`,
      fontSize: 16,
      fontFamily: "Arial",
      fill: "black",
      width: this.stage.width() - 300,
      wrap: "word",
      name: "hintText",
    });

    this.layer.add(hintText);
    hintText.moveToTop();
  }

  // Update the hint text (call this when location changes)
  updateHint(): void {
    this.renderDaysTraveledText();
    this.layer.draw();
  }

  // Create a star marker
  createStar(x: number, y: number): Konva.Star {
    return new Konva.Star({
      x: x,
      y: y,
      numPoints: 5,
      innerRadius: 8,
      outerRadius: 15,
      fill: "gold",
      stroke: "orange",
      strokeWidth: 2,
      name: "marker",
    });
  }

  // Create an X marker
  createX(x: number, y: number): Konva.Group {
    const group = new Konva.Group({
      x: x,
      y: y,
      name: "marker",
    });

    const line1 = new Konva.Line({
      points: [-10, -10, 10, 10],
      stroke: "red",
      strokeWidth: 3,
      lineCap: "round",
      lineJoin: "round",
    });

    const line2 = new Konva.Line({
      points: [-10, 10, 10, -10],
      stroke: "red",
      strokeWidth: 3,
      lineCap: "round",
      lineJoin: "round",
    });

    group.add(line1);
    group.add(line2);
    return group;
  }

  // Create success message box
  createSuccessMessage(): Konva.Group {
    const messageGroup = new Konva.Group({
      name: "messageBox",
    });

    const messageText = `You clicked on the correct city! This postcard of ${this.model.hint} belongs to: ${this.model.city}, ${this.model.country}!`;
    
    const { background, text, buttonBackground, buttonText } = this.createMessageBox(messageText);

    messageGroup.add(background);
    messageGroup.add(text);
    messageGroup.add(buttonBackground);
    messageGroup.add(buttonText);
    return messageGroup;
  }

  // Create incorrect message box
  createIncorrectMessage(): Konva.Group {
    const messageGroup = new Konva.Group({
      name: "messageBox",
    });

    const messageText = `Oh no! Your next location is ${this.model.hint}. Good luck!`;
    
    const { background, text, buttonBackground, buttonText } = this.createMessageBox(messageText);

    messageGroup.add(background);
    messageGroup.add(text);
    messageGroup.add(buttonBackground);
    messageGroup.add(buttonText);
    return messageGroup;
  }

  // Helper to create message box components
  private createMessageBox(messageText: string) {
    const padding = 20;
    const maxWidth = Math.min(this.stage.width() * 0.7, 600);
    
    // Create text with wrapping to measure height
    const text = new Konva.Text({
      text: messageText,
      fontSize: 18,
      fontFamily: "Arial",
      fill: "black",
      width: maxWidth - padding * 2,
      align: "center",
      wrap: "word",
    });

    const textHeight = text.height();
    const boxWidth = maxWidth;
    const boxHeight = textHeight + padding * 2;

    // Center the box on the stage
    const boxX = (this.stage.width() - boxWidth) / 2;
    const boxY = (this.stage.height() - boxHeight) / 2;

    // Create white translucent background
    const background = new Konva.Rect({
      x: boxX,
      y: boxY,
      width: boxWidth,
      height: boxHeight,
      fill: "rgba(255, 255, 255, 0.9)",
      cornerRadius: 10,
      stroke: "black",
      strokeWidth: 2,
    });

    // Position the text
    text.x(boxX + padding);
    text.y(boxY + padding);

    // Create continue button
    const buttonWidth = 120;
    const buttonHeight = 40;
    const buttonX = boxX + (boxWidth - buttonWidth) / 2;
    const buttonY = boxY + boxHeight + 10;

    const buttonBackground = new Konva.Rect({
      x: buttonX,
      y: buttonY,
      width: buttonWidth,
      height: buttonHeight,
      fill: "red",
      cornerRadius: 5,
      name: "continueButton",
      listening: true, // Enable click events
    });

    const buttonText = new Konva.Text({
      x: buttonX + buttonWidth / 2,
      y: buttonY + buttonHeight / 2,
      text: "Continue",
      fontSize: 16,
      fontFamily: "Arial",
      fill: "white",
      align: "center",
      verticalAlign: "middle",
      name: "continueButton",
      listening: false, // Text doesn't need to listen, parent does
    });

    buttonText.offsetX(buttonText.width() / 2);
    buttonText.offsetY(buttonText.height() / 2);
    
    // Add hover effect
    buttonBackground.on("mouseenter", () => {
      document.body.style.cursor = "pointer";
      buttonBackground.fill("#cc0000");
      this.layer.draw();
    });
    buttonBackground.on("mouseleave", () => {
      document.body.style.cursor = "default";
      buttonBackground.fill("red");
      this.layer.draw();
    });

    return { background, text, buttonBackground, buttonText };
  }

  private addInstructions(): void{
    const inButton = new Konva.Group;
    const inBack = new Konva.Rect({
      x: this.stage.width() - 250,
      y: 70,
      width: 100,
      height: 40,
      fill: "red",
      cornerRadius: 10,
      stroke: "black",
      strokeWidth: 3,
    });
    const inText = new Konva.Text({
      x: this.stage.width()-230,
      y: 80,
      text: "Instructions",
      fontSize: 13,
      fontFamily: "Arial",
      fill: "white",
      align: "center",
    })
    inButton.add(inBack);
    inButton.add(inText);
    this.layer.add(inButton);
    inButton.moveToTop();
    this.layer.draw();

    inBack.on("click", () => {
      this.nonGame = true;
    });
    inText.on("click", () => {
      this.nonGame = true;
    });

  }

  createInstructionsMessage(): Konva.Group{
    const instMessage = new Konva.Group({
      name: "messageBox",
    });
    const inst = "To play the map game, click on a point in the map to guess where this mystery location is! After your first 2 attempts, a yellow circle will appear as a hint! Your location is inside of that circle. After clicking on the correct location, a message will appear congratulating then you need to click on the red \"Continue\" button and you can continue playing the game!";
    const { background, text, buttonBackground, buttonText } = this.createMessageBox(inst);
    instMessage.add(background);
    instMessage.add(text);
    instMessage.add(buttonBackground);
    instMessage.add(buttonText);
    this.nonGame = false;
    return instMessage;
  }

  instructionsHide(): void{

  }

  // Remove existing markers from the layer
  removeMarkers(): void {
    const markers = this.layer.find((node: Konva.Node) => node.name() === "marker");
    markers.forEach((node) => node.destroy());
  }

  // Remove message boxes from the layer
  removeMessageBoxes(): void {
    const messages = this.layer.find((node: Konva.Node) => node.name() === "messageBox");
    messages.forEach((node) => node.destroy());
  }

  // Add a shape to the layer and move it to top
  addShape(shape: Konva.Shape | Konva.Group): void {
    this.layer.add(shape);
    shape.moveToTop();
  }

  // Update path visualization during gameplay (shows path without continue button)
  updatePathVisualization(): void {
    // Remove existing path visualization
    const existingPath = this.layer.find((node: Konva.Node) => 
      node.name() === "gameplayPath"
    );
    existingPath.forEach((node) => node.destroy());

    const correctLocations = this.model.getCorrectLocations();
    if (correctLocations.length === 0) {
      this.layer.draw();
      return;
    }

    const pathGroup = new Konva.Group({
      name: "gameplayPath",
    });

    // Scale all coordinates to match current image size
    const scaledLocations = correctLocations.map(loc => this.scaleCoordinates(loc));

    // Draw lines connecting correct locations in order
    if (scaledLocations.length > 1) {
      for (let i = 0; i < scaledLocations.length - 1; i++) {
        const start = scaledLocations[i];
        const end = scaledLocations[i + 1];
        
        const line = new Konva.Line({
          points: [start.x, start.y, end.x, end.y],
          stroke: "red",
          strokeWidth: 2,
        });
        
        pathGroup.add(line);
      }
    }

    // Draw yellow dots at each correct location
    scaledLocations.forEach((location, index) => {
      const dot = new Konva.Circle({
        x: location.x,
        y: location.y,
        radius: 6,
        fill: "yellow",
        stroke: "black",
        strokeWidth: 1,
      });
      
      // Add number label
      const label = new Konva.Text({
        x: location.x,
        y: location.y - 20,
        text: `${index + 1}`,
        fontSize: 14,
        fontFamily: "Arial",
        fill: "black",
        align: "center",
      });
      label.offsetX(label.width() / 2);
      
      pathGroup.add(dot);
      pathGroup.add(label);
    });

    this.layer.add(pathGroup);
    pathGroup.moveToTop();
    this.layer.draw();
  }

  // Render travel path visualization (full-screen with continue button)
  renderTravelPath(correctLocations: Location[]): void {
    // Hide markers but keep map and text visible
    const markers = this.layer.find((node: Konva.Node) => node.name() === "marker");
    markers.forEach((node) => node.hide());
    
    const pathGroup = new Konva.Group({
      name: "travelPath",
    });

    // Scale all coordinates to match current image size
    const scaledLocations = correctLocations.map(loc => this.scaleCoordinates(loc));

    // Draw lines connecting correct locations in order
    if (scaledLocations.length > 1) {
      for (let i = 0; i < scaledLocations.length - 1; i++) {
        const start = scaledLocations[i];
        const end = scaledLocations[i + 1];
        
        const line = new Konva.Line({
          points: [start.x, start.y, end.x, end.y],
          stroke: "red",
          strokeWidth: 2,
        });
        
        pathGroup.add(line);
      }
    }

    // Draw yellow dots at each correct location
    scaledLocations.forEach((location, index) => {
      const dot = new Konva.Circle({
        x: location.x,
        y: location.y,
        radius: 6,
        fill: "yellow",
        stroke: "black",
        strokeWidth: 1,
      });
      
      // Add number label
      const label = new Konva.Text({
        x: location.x,
        y: location.y - 20,
        text: `${index + 1}`,
        fontSize: 14,
        fontFamily: "Arial",
        fill: "black",
        align: "center",
      });
      label.offsetX(label.width() / 2);
      
      pathGroup.add(dot);
      pathGroup.add(label);
    });

    this.layer.add(pathGroup);
    pathGroup.moveToTop();

    // Create continue button for travel path
    const buttonWidth = 120;
    const buttonHeight = 40;
    const buttonX = (this.stage.width() - buttonWidth) / 2;
    const buttonY = this.stage.height() - 60;

    const buttonBackground = new Konva.Rect({
      x: buttonX,
      y: buttonY,
      width: buttonWidth,
      height: buttonHeight,
      fill: "red",
      cornerRadius: 5,
      name: "travelPathContinueButton",
      listening: true, // Enable click events
    });

    const buttonText = new Konva.Text({
      x: buttonX + buttonWidth / 2,
      y: buttonY + buttonHeight / 2,
      text: "Continue",
      fontSize: 16,
      fontFamily: "Arial",
      fill: "white",
      align: "center",
      verticalAlign: "middle",
      name: "travelPathContinueButton",
      listening: false, // Text doesn't need to listen
    });

    buttonText.offsetX(buttonText.width() / 2);
    buttonText.offsetY(buttonText.height() / 2);
    
    // Add hover effect
    buttonBackground.on("mouseenter", () => {
      document.body.style.cursor = "pointer";
      buttonBackground.fill("#cc0000");
      this.layer.draw();
    });
    buttonBackground.on("mouseleave", () => {
      document.body.style.cursor = "default";
      buttonBackground.fill("red");
      this.layer.draw();
    });

    this.layer.add(buttonBackground);
    this.layer.add(buttonText);
    buttonBackground.moveToTop();
    buttonText.moveToTop();
    this.layer.draw();
  }

  // Redraw the layer
  draw(): void {
    this.layer.draw();
  }

  // Cleanup method to properly destroy the stage
  destroy(): void {
    if (this.stage) {
      this.stage.destroy();
    }
  }
}
