import Konva from "konva";
import { Location } from "./Location";

export class PostcardBackView {
  private cardWidth: number;
  private cardHeight: number;

  constructor(cardWidth: number, cardHeight: number) {
    this.cardWidth = cardWidth;
    this.cardHeight = cardHeight;
  }

  render(group: Konva.Group, location: Location): void {
    // Clear previous content
    group.find(".content").forEach((node) => node.destroy());

    const padding = 20;

    // "Dear Mei Mei" greeting
    const greeting = new Konva.Text({
      name: "content",
      text: "Dear Mei Mei,",
      x: padding,
      y: padding + 10,
      fontSize: 30,
      fontFamily: "cursive",
      fill: "#333",
    });
    group.add(greeting);

    // Story text
    const story = new Konva.Text({
      name: "content",
      text: location.getStory(),
      x: padding,
      y: padding + 70,
      width: (this.cardWidth - padding * 2) * 0.6,
      fontSize: 20,
      fontFamily: "Arial",
      fill: "#333",
      lineHeight: 1.5,
    });
    group.add(story);

    // Stamp
    const stamp = new Konva.Rect({
      name: "content",
      x: this.cardWidth - padding - 60,
      y: padding,
      width: 60,
      height: 60,
      fill: "#c41e3a",
      stroke: "#8b0000",
      strokeWidth: 2,
      cornerRadius: 3,
    });
    group.add(stamp);

    const stampText = new Konva.Text({
      name: "content",
      text: "✈",
      x: this.cardWidth - padding - 60,
      y: padding,
      width: 60,
      height: 60,
      fontSize: 30,
      fill: "#ffffff",
      align: "center",
      verticalAlign: "middle",
    });
    group.add(stampText);

    // Address lines
    for (let i = 0; i < 3; i++) {
      const line = new Konva.Line({
        name: "content",
        points: [
          this.cardWidth - padding - 250,
          padding + 100 + i * 30,
          this.cardWidth - padding,
          padding + 100 + i * 30,
        ],
        stroke: "#999",
        strokeWidth: 1,
      });
      group.add(line);
    }
  }
}
