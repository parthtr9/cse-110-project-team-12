import Konva from "konva";
import { Location } from "./Location";

export class PostcardFrontView {
  private cardWidth: number;
  private cardHeight: number;

  constructor(cardWidth: number, cardHeight: number) {
    this.cardWidth = cardWidth;
    this.cardHeight = cardHeight;
  }

  render(group: Konva.Group, location: Location): void {
    // Clear previous content
    group.find(".content").forEach((node) => node.destroy());

    // Image placeholder
    const imgRect = new Konva.Rect({
      name: "content",
      x: 20,
      y: 20,
      width: this.cardWidth - 40,
      height: this.cardHeight - 80,
      fill: "#e0e0e0",
      cornerRadius: 5,
    });
    group.add(imgRect);

    const nameText = new Konva.Text({
      name: "content",
      text: location.getName() + " (This will not be here)",
      x: 20,
      y: this.cardHeight - 50,
      width: this.cardWidth - 40,
      fontSize: 28,
      fontStyle: "bold",
      fill: "black",
      align: "center",
    });
    group.add(nameText);
  }
}
