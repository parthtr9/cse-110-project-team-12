export interface Coordinate {
  x: number;
  y: number;
}

export class Location {
  private name: string;
  private coords: Coordinate;
  private story: string;
  private numDays: number;
  private hint: string;
  private image: string;

  constructor(
    name: string,
    coords: Coordinate,
    story: string,
    numDays: number,
    hint?: string,
    image?: string
  ) {
    this.name = name;
    this.coords = coords;
    this.story = story;
    this.numDays = numDays;
    this.hint = hint || "";
    this.image = image || "";
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

  getHint(): string {
    return this.hint;
  }

  getImage(): string {
    return this.image;
  }
}
