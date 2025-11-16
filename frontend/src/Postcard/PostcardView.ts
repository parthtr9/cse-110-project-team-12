import Konva from "konva";
import { PostcardModel } from "./PostcardModel";
import { PostcardFrontView } from "./PostcardFrontView";
import { PostcardBackView } from "./PostcardBackView";

export class PostcardView {
  private layer: Konva.Layer;
  private cardWidth: number;
  private cardHeight: number;
  private normalX: number;
  private normalY: number;
  private minimizedX: number;
  private minimizedY: number;
  private group: Konva.Group;
  private frontView: PostcardFrontView;
  private backView: PostcardBackView;
  private cardBg: Konva.Rect;
  private closeButton: Konva.Group | null;

  constructor(layer: Konva.Layer) {
    this.layer = layer;

    // Calculate card dimensions based on stage size
    const stage = layer.getStage()!;
    const stageWidth = stage.width();
    const stageHeight = stage.height();

    // Card size is 80% of smaller dimension, with max size
    const minDimension = Math.min(stageWidth, stageHeight);
    this.cardWidth = Math.min(800, minDimension * 0.8);
    this.cardHeight = this.cardWidth * 0.5625; // 16:9 aspect ratio

    // Center position
    this.normalX = (stageWidth - this.cardWidth) / 2;
    this.normalY = (stageHeight - this.cardHeight) / 2;

    // Minimized position: bottom left corner with padding
    this.minimizedX = 20;
    this.minimizedY = stageHeight - this.cardHeight * 0.3 - 20;

    this.group = new Konva.Group();
    this.frontView = new PostcardFrontView(this.cardWidth, this.cardHeight);
    this.backView = new PostcardBackView(this.cardWidth, this.cardHeight);
    this.closeButton = null;

    this.cardBg = new Konva.Rect();
    this.setupCard();
  }

  private setupCard(): void {
    this.group.x(this.normalX);
    this.group.y(this.normalY);

    // Card background
    this.cardBg = new Konva.Rect({
      width: this.cardWidth,
      height: this.cardHeight,
      fill: "#ffffff",
      stroke: "#333",
      strokeWidth: 2,
      shadowBlur: 10,
      shadowOpacity: 0.3,
      shadowOffsetX: 5,
      shadowOffsetY: 5,
      cornerRadius: 5,
    });

    this.group.add(this.cardBg);
    this.createCloseButton();
    this.layer.add(this.group);
  }

  private createCloseButton(): void {
    this.closeButton = new Konva.Group({
      name: "closeButton",
      x: this.cardWidth,
      y: 0,
    });
    const buttonBg = new Konva.Circle({
      radius: 15,
      fill: "#ff4444",
      stroke: "#cc0000",
      strokeWidth: 2,
    });

    // X text for button
    const xText = new Konva.Text({
      text: "×",
      fontSize: 20,
      fontStyle: "bold",
      fill: "#ffffff",
      align: "center",
      verticalAlign: "middle",
      x: -7,
      y: -10,
      width: 14,
      height: 20,
    });

    this.closeButton.add(buttonBg);
    this.closeButton.add(xText);

    // Hover effect
    this.closeButton.on("mouseenter", () => {
      buttonBg.fill("#ff6666");
      this.layer.batchDraw();
    });

    this.closeButton.on("mouseleave", () => {
      buttonBg.fill("#ff4444");
      this.layer.batchDraw();
    });

    this.group.add(this.closeButton);
  }

  render(model: PostcardModel): void {
    const location = model.getLocation();
    const isMinimized = model.getIsMinimized();

    if (isMinimized) {
      this.renderMinimized();
    } else {
      this.renderNormal(model);
    }

    this.layer.batchDraw();
  }

  private renderMinimized(): void {
    // Animate to minimized position and scale
    this.group.to({
      x: this.minimizedX,
      y: this.minimizedY,
      scaleX: 0.3,
      scaleY: 0.3,
      duration: 0.3,
    });

    if (this.closeButton) {
      this.closeButton.hide();
    }
  }

  private renderNormal(model: PostcardModel): void {
    // Animate back to normal position and scale
    this.group.to({
      x: this.normalX,
      y: this.normalY,
      scaleX: 1,
      scaleY: 1,
      duration: 0.2,
    });

    // Show close button when normal
    if (this.closeButton) {
      this.closeButton.show();
    }

    const location = model.getLocation();

    if (model.isShowingBack()) {
      this.cardBg.fill("#f5f5dc");
      this.backView.render(this.group, location);
    } else {
      this.cardBg.fill("#ffffff");
      this.frontView.render(this.group, location);
    }
  }

  setClickHandler(handler: () => void): void {
    this.group.on("click", (e) => {
      if (
        e.target === this.closeButton ||
        e.target.parent === this.closeButton
      ) {
        return;
      }
      handler();
    });
    this.group.on("tap", (e) => {
      if (
        e.target === this.closeButton ||
        e.target.parent === this.closeButton
      ) {
        return;
      }
      handler();
    });
  }

  setCloseHandler(handler: () => void): void {
    if (this.closeButton) {
      this.closeButton.on("click", (e) => {
        e.cancelBubble = true;
        handler();
      });
      this.closeButton.on("tap", (e) => {
        e.cancelBubble = true;
        handler();
      });
    }
  }

  destroy(): void {
    this.group.destroy();
  }
}
