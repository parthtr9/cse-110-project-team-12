// src/view/mapView.ts
import Konva from "konva";
import type { Transform } from "../map/selection";

export function createMapView(container: HTMLElement | string, w = 1024, h = 640) {
  // Konva expects HTMLDivElement | string for container; cast here since callers may pass HTMLElement
  const stage = new Konva.Stage({ container: container as unknown as HTMLDivElement, width: w, height: h });
  const layer = new Konva.Layer();
  stage.add(layer);

  function getTransform(): Transform {
    return {
      scale: layer.scaleX() || 1,
      offsetX: layer.x() || 0,
      offsetY: layer.y() || 0,
    };
  }
  function pulse(pt: { x: number; y: number }, kind: "good" | "bad") {
    const color = kind === "good" ? "lime" : "crimson";
    const ring = new Konva.Circle({
      x: pt.x,
      y: pt.y,
      radius: 8,
      stroke: color,
      strokeWidth: 3,
      opacity: 0.9,
    });
    layer.add(ring);
    layer.batchDraw();
    // use the node.to animation API instead of Konva.Tween for better typings
    ring.to({
      radius: 28,
      opacity: 0,
      duration: 0.5,
      onFinish: () => ring.destroy(),
    });
  }
  return { stage, layer, getTransform, pulse };
}
