export interface Coordinate {
  x: number;
  y: number;
}

export class Location {
  private name: string;
  private coords: Coordinate;
  private story: string;
  private numDays: number;

  constructor(
    name: string,
    coords: Coordinate,
    story: string,
    numDays: number
  ) {
    this.name = name;
    this.coords = coords;
    this.story = story;
    this.numDays = numDays;
  }

  getNumDays(): number {
    return this.numDays;
  }

  getName(): string {
    return this.name;
  }

  getStory(): string {
    return this.story;
  }

  getCoords(): Coordinate {
    return this.coords;
  }
}
