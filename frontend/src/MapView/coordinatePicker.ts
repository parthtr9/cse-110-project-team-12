// coordinatePicker.ts - Helper tool to pick coordinates from the map

/**
 * Coordinate Picker Tool
 * 
 * Usage:
 * 1. Open browser console (F12)
 * 2. Call enableCoordinatePicker()
 * 3. Click anywhere on the map
 * 4. Console will show: "Click at: x, y"
 * 5. Use those coordinates to update mockLocations.json
 * 
 * To disable: Call disableCoordinatePicker()
 */

let coordinatePickerEnabled = false;
let coordinatePickerHandler: ((x: number, y: number) => void) | null = null;

/**
 * Enable coordinate picker mode
 * When enabled, clicking on the map will log coordinates to console
 */
export function enableCoordinatePicker(stage: any): void {
  if (coordinatePickerEnabled) {
    console.log("Coordinate picker is already enabled");
    return;
  }

  coordinatePickerEnabled = true;
  console.log("=== COORDINATE PICKER ENABLED ===");
  console.log("Click anywhere on the map to get coordinates");
  console.log("Format: { x: XXX, y: YYY }");
  console.log("Call disableCoordinatePicker() to disable");

  coordinatePickerHandler = (x: number, y: number) => {
    console.log(`Click at: { x: ${x}, y: ${y} }`);
    console.log(`JSON format: "x": ${x}, "y": ${y}`);
  };

  stage.on("click", coordinatePickerHandler);
}

/**
 * Disable coordinate picker mode
 */
export function disableCoordinatePicker(stage: any): void {
  if (!coordinatePickerEnabled) {
    console.log("Coordinate picker is not enabled");
    return;
  }

  if (coordinatePickerHandler) {
    stage.off("click", coordinatePickerHandler);
    coordinatePickerHandler = null;
  }

  coordinatePickerEnabled = false;
  console.log("Coordinate picker disabled");
}

/**
 * Get coordinates for a specific location
 * Shows a marker at the location and logs coordinates when clicked nearby
 */
export function pickCoordinatesForLocation(
  stage: any,
  locationName: string,
  currentX: number,
  currentY: number
): void {
  console.log(`=== PICKING COORDINATES FOR: ${locationName} ===`);
  console.log(`Current coordinates: x: ${currentX}, y: ${currentY}`);
  console.log("Click on the map where this location should be");
  console.log("The coordinates will be logged to console");

  if (coordinatePickerHandler) {
    stage.off("click", coordinatePickerHandler);
  }

  coordinatePickerHandler = (x: number, y: number) => {
    const distance = Math.sqrt(
      Math.pow(x - currentX, 2) + Math.pow(y - currentY, 2)
    );
    console.log(`\n=== ${locationName.toUpperCase()} ===`);
    console.log(`Click coordinates: { x: ${x}, y: ${y} }`);
    console.log(`Distance from current: ${distance.toFixed(2)} pixels`);
    console.log(`\nUpdate mockLocations.json with:`);
    console.log(`"worldMap": {`);
    console.log(`  "x": ${x},`);
    console.log(`  "y": ${y},`);
    console.log(`  "tolerance": 30`);
    console.log(`}`);
  };

  stage.on("click", coordinatePickerHandler);
}

