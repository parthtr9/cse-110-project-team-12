// MapModel.ts - Handles data and business logic

import { getLocationsForMap } from "./locationData";

// Interface for clicked locations
export interface ClickedLocation {
  x: number;
  y: number;
  wasCorrect: boolean;
}

// Interface for location coordinates
export interface Location {
  x: number;
  y: number;
}

// Model class to manage application state
export class MapModel {
  // Game state
  public _daysTraveled: number = 0;
  public days: number = 1;
  private _hint: string = "";
  private _city: string = "";
  private _country: string = "";

  // Current location tracking
  private _currentLocationIndex: number = 0;
  private _currentLocationId: string | null = null;
  public _mapType: "worldMap" | "continentMap" = "worldMap";

  // Target location and tolerance
  private _correctLocation: Location = { x: 0, y: 0 };
  private _clickTolerance: number = 30;

  // Clicked locations history
  private _clickedLocations: ClickedLocation[] = [];

  // Track which locations have been correctly guessed (visited)
  private _visitedLocationIds: Set<string> = new Set();

  // UI state flags
  private _messageBoxVisible: boolean = false;
  private _showingTravelPath: boolean = false;
  private _mapSwitch: boolean = false;

  constructor() {
    // Initialize with a random location
    const locations = getLocationsForMap(this._mapType);
    if (locations.length > 0) {
      const randomIndex = Math.floor(Math.random() * locations.length);
      this.initializeLocation(randomIndex);
    } else {
      // Fallback to 0 if no locations available
      this.initializeLocation(0);
    }
  }

  // Getters
  get daysTraveled(): number {
    return this._daysTraveled;
  }

  get hint(): string {
    return this._hint;
  }

  get city(): string {
    return this._city;
  }

  get country(): string {
    return this._country;
  }

  get correctLocation(): Location {
    return this._correctLocation;
  }

  get clickTolerance(): number {
    return this._clickTolerance;
  }

  get clickedLocations(): ClickedLocation[] {
    return [...this._clickedLocations];
  }

  get messageBoxVisible(): boolean {
    return this._messageBoxVisible;
  }

  get showingTravelPath(): boolean {
    return this._showingTravelPath;
  }

  get currentLocationIndex(): number {
    return this._currentLocationIndex;
  }

  get currentLocationId(): string | null {
    return this._currentLocationId;
  }

  get mapType(): "worldMap" | "continentMap" {
    return this._mapType;
  }

  get mapSwitch(): boolean{
    return this._mapSwitch;
  }

  // Setters
  set messageBoxVisible(value: boolean) {
    this._messageBoxVisible = value;
  }

  set showingTravelPath(value: boolean) {
    this._showingTravelPath = value;
  }

  set mapType(value: "worldMap" | "continentMap") {
    this._mapType = value;
    // Reinitialize current location with new map type
    this.initializeLocation(this._currentLocationIndex);
  }

  set mapSwitch(value: boolean){
    this._mapSwitch = value;
  }

  // Initialize or update the current location
  private initializeLocation(index: number): void {
    const locations = getLocationsForMap(this._mapType);
    
    if (locations.length === 0) {
      console.error("No locations available");
      return;
    }

    // Clamp index to valid range
    if (index < 0) index = 0;
    if (index >= locations.length) index = locations.length - 1;

    const location = locations[index];
    this._currentLocationIndex = index;
    this._currentLocationId = location.id;
    
    // Update game state with real location data
    this._hint = location.hint;
    this._city = location.name;
    this._country = location.continent;
    this._correctLocation = { x: location.x, y: location.y };
    this._clickTolerance = location.tolerance;
  }

  // Advance to the next location (called after correct guess)
  advanceToNextLocation(): boolean {
    const locations = getLocationsForMap(this._mapType);
    
    if (locations.length === 0) {
      // No locations available
      return false;
    }

    // Filter out all visited locations (locations that have been correctly guessed)
    const availableLocations = locations.filter(
      (loc) => !this._visitedLocationIds.has(loc.id)
    );

    if (availableLocations.length === 0) {
      // All locations have been visited - game complete!
      console.log("All locations have been visited! Game complete!");
      return false;
    }

    // Pick a random location from the available (unvisited) ones
    const randomIndex = Math.floor(Math.random() * availableLocations.length);
    const randomLocation = availableLocations[randomIndex];
    
    // Find the index of this location in the original array
    const newIndex = locations.findIndex(loc => loc.id === randomLocation.id);
    
    if (newIndex === -1) {
      console.error("Could not find location index");
      return false;
    }

    this.initializeLocation(newIndex);
    return true;
  }

  // Get the current location data
  getCurrentLocationData(): {
    id: string;
    name: string;
    continent: string;
    hint: string;
    image: string;
    x: number;
    y: number;
    tolerance: number;
  } | null {
    if (!this._currentLocationId) return null;
    
    const locations = getLocationsForMap(this._mapType);
    return locations.find(loc => loc.id === this._currentLocationId) || null;
  }

  // Business logic methods
  addClickedLocation(location: ClickedLocation): void {
    this._clickedLocations.push(location);
  }

  // Mark the current location as visited (called when correctly guessed)
  markCurrentLocationAsVisited(): void {
    if (this._currentLocationId) {
      this._visitedLocationIds.add(this._currentLocationId);
    }
  }

  // Get the number of visited locations
  getVisitedLocationCount(): number {
    return this._visitedLocationIds.size;
  }

  // Check if all locations have been visited
  areAllLocationsVisited(): boolean {
    const locations = getLocationsForMap(this._mapType);
    return this._visitedLocationIds.size >= locations.length;
  }

  isClickCorrect(x: number, y: number): boolean {
    const distance = Math.sqrt(
      Math.pow(x - this._correctLocation.x, 2) +
        Math.pow(y - this._correctLocation.y, 2)
    );
    return distance <= this._clickTolerance;
  }

  getCorrectLocations(): Location[] {
    return this._clickedLocations
      .filter(loc => loc.wasCorrect)
      .map(loc => ({ x: loc.x, y: loc.y }));
  }

  getLastClickedLocationCorrectness(): boolean {
    if (this._clickedLocations.length === 0) return false;
    return this._clickedLocations[this._clickedLocations.length - 1].wasCorrect;
  }

  hasClickedLocations(): boolean {
    return this._clickedLocations.length > 0;
  }

  hasCorrectLocations(): boolean {
    return this.getCorrectLocations().length > 0;
  }
}

