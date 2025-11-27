// TravelController.ts
import { TravelModel, JourneyData } from './TravelModel';
import { TravelView } from './TravelView';

export class TravelController {
  private model: TravelModel;
  private view: TravelView;
  private animationFrameId: number | null = null;
  private startTime: number | null = null;
  private animationDuration: number = 5000; // 5 seconds to complete the journey

  constructor(
    config: { width: number; height: number; containerId: string },
    initialData: JourneyData
  ) {
    this.view = new TravelView(config);
    this.model = new TravelModel(initialData, this.onDataChanged.bind(this));
    
    // Show initial screen
    this.onDataChanged(this.model.getCurrentData());
    
    // Start animation if not already complete
    if (initialData.progress < 1) {
      this.startProgressAnimation();
    }
  }

  private startProgressAnimation() {
    this.startTime = Date.now();
    const animate = () => {
      if (!this.startTime) return;
      
      const elapsed = Date.now() - this.startTime;
      const progress = Math.min(1, elapsed / this.animationDuration);
      
      this.model.updateProgress(progress);
      
      if (progress < 1) {
        this.animationFrameId = requestAnimationFrame(animate);
      } else {
        this.animationFrameId = null;
        // Automatically show completion screen when done
        this.model.completeJourney();
      }
    };
    
    this.animationFrameId = requestAnimationFrame(animate);
  }

  private onDataChanged(data: JourneyData) {
    if (data.progress >= 1) {
      this.view.showCompletionScreen({
        visitedPlaces: data.visitedPlaces,
        totalDays: data.totalDays,
      });
    } else {
      this.view.showTravelingScreen({
        currentDest: data.currentDest,
        nextDest: data.nextDest,
        progress: data.progress,
      });
      this.view.updateProgress(data.progress);
    }
  }

  updateProgress(progress: number) {
    this.model.updateProgress(progress);
  }

  completeJourney() {
    this.model.completeJourney();
  }

  destroy() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.view.destroy();
  }
}