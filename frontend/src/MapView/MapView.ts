import Konva from "konva";
import worldMapImageSrc from "../public/world_map.jpg";

// Days traveled variable
let daysTraveled = 0;

// Postcard information variables
const hint = "example hint";
const city = "Example City";
const country = "Example Country";

// Correct coordinate location (in pixels) - update these with your target location
const correctLocation = {
  x: 300,
  y: 400,
};

// Tolerance distance for considering a click "correct" (in pixels)
const clickTolerance = 30;

// Track if message box is currently showing
let messageBoxVisible = false;

// Store all clicked locations in order
interface ClickedLocation {
  x: number;
  y: number;
  wasCorrect: boolean;
}

const clickedLocations: ClickedLocation[] = [];

// Track if we're showing the travel path scene
let showingTravelPath = false;

// Stage and layer variables
let stage: Konva.Stage;
let layer: Konva.Layer;

// Function to create a star shape
function createStar(x: number, y: number) {
  const star = new Konva.Star({
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
  return star;
}

// Function to create an X shape
function createX(x: number, y: number) {
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

// Function to create success message box
function createSuccessMessage() {
  const messageGroup = new Konva.Group({
    name: "messageBox",
  });

  const messageText = `You clicked on the correct city! This postcard of ${hint} belongs to: ${city}, ${country}!`;
  
  const padding = 20;
  const maxWidth = Math.min(stage.width() * 0.7, 600);
  
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

  const textWidth = maxWidth - padding * 2;
  const textHeight = text.height();
  const boxWidth = maxWidth;
  const boxHeight = textHeight + padding * 2;

  // Center the box on the stage
  const boxX = (stage.width() - boxWidth) / 2;
  const boxY = (stage.height() - boxHeight) / 2;

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
  });

  // Center text properly
  buttonText.offsetX(buttonText.width() / 2);
  buttonText.offsetY(buttonText.height() / 2);

  messageGroup.add(background);
  messageGroup.add(text);
  messageGroup.add(buttonBackground);
  messageGroup.add(buttonText);
  return messageGroup;
}

// Function to create incorrect location message box
function createIncorrectMessage() {
  const messageGroup = new Konva.Group({
    name: "messageBox",
  });

  const messageText = `Oh no! Your next location is ${hint}. Good luck!`;
  
  const padding = 20;
  const maxWidth = Math.min(stage.width() * 0.7, 600);
  
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

  const textWidth = maxWidth - padding * 2;
  const textHeight = text.height();
  const boxWidth = maxWidth;
  const boxHeight = textHeight + padding * 2;

  // Center the box on the stage
  const boxX = (stage.width() - boxWidth) / 2;
  const boxY = (stage.height() - boxHeight) / 2;

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
  });

  // Center text properly
  buttonText.offsetX(buttonText.width() / 2);
  buttonText.offsetY(buttonText.height() / 2);

  messageGroup.add(background);
  messageGroup.add(text);
  messageGroup.add(buttonBackground);
  messageGroup.add(buttonText);
  return messageGroup;
}

// Function to dismiss message box
function dismissMessageBox(wasCorrectGuess: boolean = false) {
  const existingMessages = layer.find((node: Konva.Node) => node.name() === "messageBox");
  existingMessages.forEach((node) => node.destroy());
  messageBoxVisible = false;
  
  // If it was a correct guess, show the travel path
  if (wasCorrectGuess && clickedLocations.length > 0) {
    showTravelPath();
  } else {
    layer.draw();
  }
}

// Function to show travel path visualization
function showTravelPath() {
  showingTravelPath = true;
  
  // Hide markers but keep map and text visible
  layer.find((node: Konva.Node) => node.name() === "marker").forEach((node) => node.hide());
  
  // Filter to only correct locations
  const correctLocations = clickedLocations.filter(loc => loc.wasCorrect);
  
  const pathGroup = new Konva.Group({
    name: "travelPath",
  });

  // Draw lines connecting correct locations in order
  if (correctLocations.length > 1) {
    for (let i = 0; i < correctLocations.length - 1; i++) {
      const start = correctLocations[i];
      const end = correctLocations[i + 1];
      
      const line = new Konva.Line({
        points: [start.x, start.y, end.x, end.y],
        stroke: "red",
        strokeWidth: 2,
      });
      
      pathGroup.add(line);
    }
  }

  // Draw yellow dots at each correct location
  correctLocations.forEach((location, index) => {
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

  layer.add(pathGroup);
  pathGroup.moveToTop();

  // Create continue button for travel path
  const buttonWidth = 120;
  const buttonHeight = 40;
  const buttonX = (stage.width() - buttonWidth) / 2;
  const buttonY = stage.height() - 60;

  const buttonBackground = new Konva.Rect({
    x: buttonX,
    y: buttonY,
    width: buttonWidth,
    height: buttonHeight,
    fill: "red",
    cornerRadius: 5,
    name: "travelPathContinueButton",
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
  });

  buttonText.offsetX(buttonText.width() / 2);
  buttonText.offsetY(buttonText.height() / 2);

  layer.add(buttonBackground);
  layer.add(buttonText);
  buttonBackground.moveToTop();
  buttonText.moveToTop();
  
  layer.draw();
}

// Initialize click handler
function initClickHandler() {
  stage.on("click", (e) => {
    const pointerPos = stage.getPointerPosition();
    if (!pointerPos) return;

    // Check if travel path is showing
    if (showingTravelPath) {
      // Check if click is on travel path continue button
      let shape: Konva.Node | null = e.target as Konva.Node;
      while (shape) {
        if (shape.name() === "travelPathContinueButton") {
          // Do nothing for now as requested
          return;
        }
        shape = shape.getParent();
      }
      // Ignore all other clicks when travel path is visible
      return;
    }

    // Check if message box is visible
    if (messageBoxVisible) {
      // Check if click is on continue button (check target and all parents)
      let shape: Konva.Node | null = e.target as Konva.Node;
      let wasCorrectGuess = false;
      while (shape) {
        if (shape.name() === "continueButton") {
          // Check if the last clicked location was correct
          if (clickedLocations.length > 0) {
            wasCorrectGuess = clickedLocations[clickedLocations.length - 1].wasCorrect;
          }
          dismissMessageBox(wasCorrectGuess);
          return;
        }
        shape = shape.getParent();
      }
      // Ignore all other clicks when message box is visible
      return;
    }

    const clickX = pointerPos.x;
    const clickY = pointerPos.y;

    // Calculate distance from correct location
    const distance = Math.sqrt(
      Math.pow(clickX - correctLocation.x, 2) +
        Math.pow(clickY - correctLocation.y, 2)
    );

    // Remove any existing markers
    const existingMarkers = layer.find((node: Konva.Node) => node.name() === "marker");
    existingMarkers.forEach((node) => node.destroy());

    // Determine if click is correct
    const wasCorrect = distance <= clickTolerance;

    // Store the clicked location
    clickedLocations.push({
      x: clickX,
      y: clickY,
      wasCorrect: wasCorrect,
    });

    // Create marker based on whether click is correct
    let marker;
    if (wasCorrect) {
      marker = createStar(clickX, clickY);
      // Show success message
      const messageBox = createSuccessMessage();
      layer.add(messageBox);
      messageBox.moveToTop();
      messageBoxVisible = true;
    } else {
      marker = createX(clickX, clickY);
      // Show incorrect message
      const messageBox = createIncorrectMessage();
      layer.add(messageBox);
      messageBox.moveToTop();
      messageBoxVisible = true;
    }

    layer.add(marker);
    marker.moveToTop();
    layer.draw();
  });
}

// Main initialization function
export function initMapView() {
  // Create stage
  stage = new Konva.Stage({
    container: "container",
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Create layer
  layer = new Konva.Layer();
  stage.add(layer);

  // Load and display the world map image
  const imageObj = new Image();
  imageObj.src = worldMapImageSrc;

  imageObj.onload = () => {
    const worldMap = new Konva.Image({
      x: 0,
      y: 0,
      image: imageObj,
      width: stage.width(),
      height: stage.height(),
    });

    // add the image to the layer
    layer.add(worldMap);

    // create text for days traveled in top right
    const daysTraveledText = new Konva.Text({
      x: stage.width() - 250,
      y: 20,
      text: `Days Traveled: ${daysTraveled}`,
      fontSize: 20,
      fontFamily: "Arial",
      fill: "black",
    });

    // add text on top of the image
    layer.add(daysTraveledText);
    daysTraveledText.moveToTop();

    // redraw the layer
    layer.draw();
  };

  imageObj.onerror = (error) => {
    console.error("Failed to load world map image:", error);
  };

  // Initialize click handler
  initClickHandler();
}

