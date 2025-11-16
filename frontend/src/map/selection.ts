import type { XY, Location } from "../domain/location";

export type Transform = {
  scale: number; // mapLayer.scaleX()
  offsetX: number; // mapLayer.x()
  offsetY: number; // mapLayer.y()
};

// Convert a screen click (stage space) into map-image coordinates
export function toMapCoords(p: XY, t: Transform): XY {
  return { x: (p.x - t.offsetX) / t.scale, y: (p.y - t.offsetY) / t.scale };
}

export function distance(a: XY, b: XY): number {
  const dx = a.x - b.x,
    dy = a.y - b.y;
  return Math.hypot(dx, dy);
}

// Main check: “is this click close enough to the target location?”
export function isCorrectSelection(
  stagePoint: XY,
  target: Location,
  t: Transform
): boolean {
  const mapPoint = toMapCoords(stagePoint, t);
  // Keep the same "feel" when zoomed-in or out
  const effectiveTol = target.tolerancePx / t.scale;
  return distance(mapPoint, target.coord) <= effectiveTol;
}
