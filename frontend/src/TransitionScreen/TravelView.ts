// TravelView.ts
import Konva from 'konva';

export class TravelView {
  private stage: Konva.Stage;
  private layer: Konva.Layer;
  private config: { width: number; height: number; containerId: string };
  private currentScreen: 'traveling' | 'completed' = 'traveling';

  constructor(config: { width: number; height: number; containerId: string }) {
    this.config = config;
    
    // Create stage
    this.stage = new Konva.Stage({
      container: config.containerId,
      width: config.width,
      height: config.height,
    });

    // Create layer
    this.layer = new Konva.Layer();
    this.stage.add(this.layer);
  }

  showTravelingScreen(data: {
    currentDest: string;
    nextDest: string;
    progress: number;
  }) {
    this.currentScreen = 'traveling';
    this.layer.destroyChildren();

    const padding = 40;
    const borderWidth = 15;

    // Outer yellow background
    const outerBg = new Konva.Rect({
      x: 0,
      y: 0,
      width: this.config.width,
      height: this.config.height,
      fill: '#F4E96D',
    });

    // Olive border
    const border = new Konva.Rect({
      x: padding,
      y: padding,
      width: this.config.width - padding * 2,
      height: this.config.height - padding * 2,
      fill: '#9B8E3B',
    });

    // Inner cream background
    const innerBg = new Konva.Rect({
      x: padding + borderWidth,
      y: padding + borderWidth,
      width: this.config.width - (padding + borderWidth) * 2,
      height: this.config.height - (padding + borderWidth) * 2,
      fill: '#F9F3D9',
    });

    // Photo placeholder (checkered pattern)
    const photoSize = 60;
    const photoX = this.config.width - padding - borderWidth - photoSize - 20;
    const photoY = padding + borderWidth + 20;
    
    const photoRect = new Konva.Rect({
      x: photoX,
      y: photoY,
      width: photoSize,
      height: photoSize,
      fill: '#FFB3BA',
      stroke: '#FFA0A0',
      strokeWidth: 2,
    });

    // Title with airplane emoji
    const title = new Konva.Text({
      x: padding + borderWidth + 40,
      y: padding + borderWidth + 40,
      text: '✈️ Traveling...',
      fontSize: 48,
      fontFamily: 'Arial, sans-serif',
      fill: '#000',
      fontStyle: 'bold',
    });

    // Current destination label
    const currDestLabel = new Konva.Text({
      x: padding + borderWidth + 60,
      y: this.config.height / 2 - 50,
      text: data.currentDest,
      fontSize: 32,
      fontFamily: 'Arial, sans-serif',
      fill: '#000',
    });

    // Airplane icon (center)
    const planeCenter = new Konva.Text({
      x: this.config.width / 2 - 20,
      y: this.config.height / 2 - 55,
      text: '✈️',
      fontSize: 40,
    });

    // Next destination label
    const nextDestLabel = new Konva.Text({
      x: this.config.width / 2 + 40,
      y: this.config.height / 2 - 50,
      text: data.nextDest,
      fontSize: 32,
      fontFamily: 'Arial, sans-serif',
      fill: '#000',
    });

    // Progress bar background
    const progressBarBg = new Konva.Rect({
      x: padding + borderWidth + 100,
      y: this.config.height / 2 + 20,
      width: this.config.width - (padding + borderWidth + 100) * 2,
      height: 8,
      fill: '#E0E0E0',
      cornerRadius: 4,
    });

    // Progress bar fill
    const progressBarFill = new Konva.Rect({
      x: padding + borderWidth + 100,
      y: this.config.height / 2 + 20,
      width: (this.config.width - (padding + borderWidth + 100) * 2) * data.progress,
      height: 8,
      fill: '#4169E1',
      cornerRadius: 4,
    });

    // Frame label
    const frameLabel = new Konva.Text({
      x: padding + borderWidth + 100,
      y: this.config.height / 2 + 35,
      text: 'Frame',
      fontSize: 14,
      fontFamily: 'Arial, sans-serif',
      fill: '#999',
    });

    // Bottom tagline
    const tagline = new Konva.Text({
      x: padding + borderWidth + 40,
      y: this.config.height - padding - borderWidth - 60,
      text: "Following Grandma's footsteps around the world.....",
      fontSize: 20,
      fontFamily: 'Georgia, serif',
      fill: '#000',
      fontStyle: 'italic',
    });

    // Add all shapes to layer
    this.layer.add(
      outerBg,
      border,
      innerBg,
      photoRect,
      title,
      currDestLabel,
      planeCenter,
      nextDestLabel,
      progressBarBg,
      progressBarFill,
      frameLabel,
      tagline
    );

    this.layer.draw();
  }

  showCompletionScreen(data: {
    visitedPlaces: string[];
    totalDays: number;
  }) {
    this.currentScreen = 'completed';
    this.layer.destroyChildren();

    const padding = 20;

    // Background
    const bg = new Konva.Rect({
      x: 0,
      y: 0,
      width: this.config.width,
      height: this.config.height,
      fill: '#D3D3D3',
    });

    // Message box (top)
    const messageBox = new Konva.Rect({
      x: padding + 60,
      y: padding + 20,
      width: this.config.width - (padding + 60) * 2,
      height: 100,
      fill: '#F9F3D9',
      cornerRadius: 5,
    });

    const message = new Konva.Text({
      x: padding + 80,
      y: padding + 35,
      width: this.config.width - (padding + 80) * 2,
      text: '"You completed the journey! Just like I did years ago, you have seen the wonders of our beautiful world. I am so proud of you!"\n-Grandma ❤️',
      fontSize: 16,
      fontFamily: 'Arial, sans-serif',
      fill: '#000',
      lineHeight: 1.4,
    });

    // Main content box
    const mainBox = new Konva.Rect({
      x: padding + 30,
      y: padding + 140,
      width: this.config.width - (padding + 30) * 2,
      height: this.config.height - padding - 160,
      fill: '#DEB887',
      cornerRadius: 5,
    });

    // Title
    const title = new Konva.Text({
      x: padding + 50,
      y: padding + 160,
      width: this.config.width - (padding + 50) * 2,
      text: 'Journey completed in....',
      fontSize: 32,
      fontFamily: 'Arial, sans-serif',
      fill: '#000',
      align: 'center',
    });

    // Days
    const daysText = new Konva.Text({
      x: padding + 50,
      y: padding + 210,
      width: this.config.width - (padding + 50) * 2,
      text: `${data.totalDays} days`,
      fontSize: 36,
      fontFamily: 'Arial Black, sans-serif',
      fill: '#000',
      align: 'center',
      fontStyle: 'bold',
    });

    // Stats box
    const statsBox = new Konva.Rect({
      x: padding + 120,
      y: padding + 270,
      width: this.config.width - (padding + 120) * 2,
      height: 120,
      fill: '#FFB6C1',
      cornerRadius: 5,
    });

    const statsTitle = new Konva.Text({
      x: padding + 140,
      y: padding + 290,
      width: this.config.width - (padding + 140) * 2,
      text: 'Places you visited',
      fontSize: 24,
      fontFamily: 'Arial, sans-serif',
      fill: '#000',
      align: 'center',
      fontStyle: 'bold',
    });

    const statsSubtitle = new Konva.Text({
      x: padding + 140,
      y: padding + 330,
      width: this.config.width - (padding + 140) * 2,
      text: data.visitedPlaces.join(', '),
      fontSize: 20,
      fontFamily: 'Arial, sans-serif',
      fill: '#000',
      align: 'center',
    });

    // Add all shapes
    this.layer.add(
      bg,
      messageBox,
      message,
      mainBox,
      title,
      daysText,
      statsBox,
      statsTitle,
      statsSubtitle
    );

    this.layer.draw();
  }

  updateProgress(progress: number) {
    if (this.currentScreen !== 'traveling') return;
    
    // Find and update progress bar
    const progressBar = this.layer.findOne((node) => {
      return node.getAttr('fill') === '#4169E1';
    }) as Konva.Rect;

    if (progressBar) {
      const padding = 40;
      const borderWidth = 15;
      const maxWidth = this.config.width - (padding + borderWidth + 100) * 2;
      
      progressBar.width(maxWidth * progress);
      this.layer.batchDraw();
    }
  }

  destroy() {
    this.stage.destroy();
  }
}