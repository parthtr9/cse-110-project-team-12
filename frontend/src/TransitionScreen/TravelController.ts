// TravelController.ts
import { TravelModel, JourneyData } from './TravelModel';
import { TravelView } from './TravelView';

export class TravelController {
  private model: TravelModel;
  private view: TravelView;

  constructor(
    config: { width: number; height: number; containerId: string },
    initialData: JourneyData
  ) {
    this.view = new TravelView(config);
    this.model = new TravelModel(initialData, this.onDataChanged.bind(this));
    
    // Show initial screen
    this.onDataChanged(this.model.getCurrentData());
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
    }
  }

  updateProgress(progress: number) {
    this.model.updateProgress(progress);
  }

  completeJourney() {
    this.model.completeJourney();
  }

  destroy() {
    this.view.destroy();
  }
}