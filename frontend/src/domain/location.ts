export type XY = { x: number; y: number };

export interface Location {
  id: string;
  name: string;
  // Coordinates are in pixels relative to the map image (not the screen)
  coord: XY;
  // How close a click must be (in pixels) at zoom scale = 1
  tolerancePx: number;
}
