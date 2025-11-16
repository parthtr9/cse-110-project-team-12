import Konva from "konva";

// Draw a quick ring that expands and fades out.
// kind: "good" = green ring, "bad" = red ring
export function pulseAt(
  layer: Konva.Layer,
  pt: { x: number; y: number },
  kind: "good" | "bad"
) {
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
  new Konva.Tween({
    node: ring,
    radius: 28,
    opacity: 0,
    duration: 0.5,
    onFinish: () => ring.destroy(),
  }).play();

  if (kind === "good") {
    const text = new Konva.Text({
      x: pt.x + 10,
      y: pt.y - 20,
      text: "Correct!",
      fontSize: 16,
      fill: color,
      opacity: 0,
    });
    layer.add(text);
    new Konva.Tween({
      node: text,
      opacity: 1,
      duration: 0.12,
      onFinish: () =>
        new Konva.Tween({
          node: text,
          opacity: 0,
          y: text.y() - 8,
          duration: 0.5,
          onFinish: () => text.destroy(),
        }).play(),
    }).play();
  }
}
