import { Location } from "./Location";

export class PostcardModel {
  private location: Location;
  private isFlipped: boolean;
  private isMinimized: boolean;

  constructor(location: Location) {
    this.location = location;
    this.isFlipped = false;
    this.isMinimized = false;
  }

  flip(): void {
    this.isFlipped = !this.isFlipped;
  }

  toggleMinimize(): void {
    this.isMinimized = !this.isMinimized;
  }

  getLocation(): Location {
    return this.location;
  }

  isShowingBack(): boolean {
    return this.isFlipped;
  }

  getIsMinimized(): boolean {
    return this.isMinimized;
  }
}
