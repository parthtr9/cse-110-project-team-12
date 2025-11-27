// index.ts - Entry point for MapView module

import { MapModel } from "./MapModel";
import { MapView } from "./MapView";
import { MapController } from "./MapController";

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
}

