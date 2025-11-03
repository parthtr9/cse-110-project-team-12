// TravelGame.ts
import { TravelController } from './TravelController';
import { JourneyData } from './TravelModel';

export interface TravelGameConfig {
  width: number;
  height: number;
  containerId: string;
}

class TravelGame {
  private controller: TravelController;

  constructor(config: TravelGameConfig, initialData: JourneyData) {
    this.controller = new TravelController(config, initialData);
  }

  updateProgress(progress: number) {
    this.controller.updateProgress(progress);
  }

  completeJourney() {
    this.controller.completeJourney();
  }

  destroy() {
    this.controller.destroy();
  }
}

export default TravelGame;