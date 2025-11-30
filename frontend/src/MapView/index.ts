// index.ts - Entry point for MapView module

import { MapModel } from "./MapModel";
import { MapView } from "./MapView";
import { MapController } from "./MapController";
import { enableCoordinatePicker } from "./coordinatePicker";

// Main initialization function
export async function initMapView(): Promise<void> {
  // Create Model
  const model = new MapModel();

  // Create View
  const view = new MapView("container", model);

  // Initialize view (load map, etc.)
  await view.init();

  // Create Controller (sets up event handlers)
  const controller = new MapController(model, view);

  // Expose coordinate picker to window for easy debugging
  // Usage: In browser console, type: enableCoordinatePicker()
  (window as any).enableCoordinatePicker = () => {
    enableCoordinatePicker(view.getStage());
    console.log("Coordinate picker enabled! Click on the map to get coordinates.");
  };
  
  (window as any).getCurrentLocationCoords = () => {
    const loc = model.correctLocation;
    const city = model.city;
    console.log(`\n=== ${city.toUpperCase()} ===`);
    console.log(`Current coordinates: { x: ${loc.x}, y: ${loc.y} }`);
    console.log(`Tolerance: ${model.clickTolerance}`);
    console.log(`\nTo update in mockLocations.json, find "${city}" and update:`);
    console.log(`"worldMap": {`);
    console.log(`  "x": ${loc.x},`);
    console.log(`  "y": ${loc.y},`);
    console.log(`  "tolerance": ${model.clickTolerance}`);
    console.log(`}`);
    return { x: loc.x, y: loc.y, city, tolerance: model.clickTolerance };
  };
}

