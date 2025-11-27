import { initMapView } from "./MapView";

// Initialize the map view when the page loads
initMapView().catch((error) => {
  console.error("Failed to initialize map view:", error);
});
