// TravelModel.ts
export interface JourneyData {
  currentDest: string;
  nextDest: string;
  progress: number; // 0-1
  visitedPlaces: string[];
  totalDays: number;
}

export class TravelModel {
  private journeyData: JourneyData;
  private onDataChanged: (data: JourneyData) => void;

  constructor(initialData: JourneyData, onDataChanged: (data: JourneyData) => void) {
    this.journeyData = { ...initialData };
    this.onDataChanged = onDataChanged;
  }

  updateProgress(progress: number) {
    this.journeyData.progress = Math.min(1, Math.max(0, progress));
    this.notifyChange();
  }

  completeJourney() {
    this.journeyData.progress = 1;
    this.notifyChange();
  }

  private notifyChange() {
    this.onDataChanged({ ...this.journeyData });
  }

  getCurrentData(): JourneyData {
    return { ...this.journeyData };
  }
}