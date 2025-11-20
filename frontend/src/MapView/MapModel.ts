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
  private _daysTraveled: number = 0;
  private _hint: string = "";
  private _city: string = "";
  private _country: string = "";

  // Current location tracking
  private _currentLocationIndex: number = 0;
  private _currentLocationId: string | null = null;
  private _mapType: "worldMap" | "continentMap" = "worldMap";

  // Target location and tolerance
  private _correctLocation: Location = { x: 0, y: 0 };
  private _clickTolerance: number = 30;

  // Clicked locations history
  private _clickedLocations: ClickedLocation[] = [];

  // UI state flags
  private _messageBoxVisible: boolean = false;
  private _showingTravelPath: boolean = false;

  constructor() {
    // Initialize with the first location
    this.initializeLocation(0);
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
    
    if (this._currentLocationIndex + 1 >= locations.length) {
      // No more locations - game complete!
      return false;
    }

    this._currentLocationIndex++;
    this.initializeLocation(this._currentLocationIndex);
    return true;
  }

  // Get the current location data
  getCurrentLocationData(): {
    id: string;
    name: string;
    continent: string;
    hint: string;
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

