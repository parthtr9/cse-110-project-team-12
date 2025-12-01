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

    const imagePath = location.getImage();
    
    if (imagePath) {
      // Use Konva.Image.fromURL for better error handling and async loading
      // The path should be relative to public folder or absolute from root
      Konva.Image.fromURL(
        imagePath,
        (konvaImage) => {
          // Remove any existing image
          group.find(".content-image").forEach((node) => node.destroy());
          
          // Get the natural dimensions of the image
          const imgElement = konvaImage.image();
          if (!imgElement) {
            console.error("Image element not available");
            return;
          }
          
          // Get dimensions from the HTMLImageElement
          const naturalWidth = (imgElement as HTMLImageElement).naturalWidth || konvaImage.width();
          const naturalHeight = (imgElement as HTMLImageElement).naturalHeight || konvaImage.height();
          
          // Calculate dimensions to fit within the card while maintaining aspect ratio
          const maxWidth = this.cardWidth - 40;
          const maxHeight = this.cardHeight - 80;
          const imageAspect = naturalWidth / naturalHeight;
          const cardAspect = maxWidth / maxHeight;
          
          let imgWidth: number;
          let imgHeight: number;
          
          if (imageAspect > cardAspect) {
            // Image is wider - fit to width
            imgWidth = maxWidth;
            imgHeight = maxWidth / imageAspect;
          } else {
            // Image is taller - fit to height
            imgHeight = maxHeight;
            imgWidth = maxHeight * imageAspect;
          }
          
          // Center the image
          const imgX = 20 + (maxWidth - imgWidth) / 2;
          const imgY = 20 + (maxHeight - imgHeight) / 2;
          
          // Set properties directly on the konvaImage
          konvaImage.name("content content-image");
          konvaImage.x(imgX);
          konvaImage.y(imgY);
          konvaImage.width(imgWidth);
          konvaImage.height(imgHeight);
          konvaImage.cornerRadius(5);
          
          group.add(konvaImage);
          group.getLayer()?.batchDraw();
        },
        (error) => {
          console.error("Failed to load image:", imagePath, error);
          // Fallback to placeholder if image fails to load
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
          group.getLayer()?.batchDraw();
        }
      );
    } else {
      // Fallback placeholder if no image path
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
    }

    const nameText = new Konva.Text({
      name: "content",
      text: location.getName(),
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
