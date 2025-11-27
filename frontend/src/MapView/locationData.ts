// locationData.ts - Helper functions for loading and working with location data

import locationsData from "./mockLocations.json";

// Interface matching the JSON structure
export interface LocationCoordinates {
  x: number;
  y: number;
  tolerance: number;
}

export interface LocationEntry {
  id: string;
  name: string;
  continent: string;
  hint: string;
  worldMap: LocationCoordinates;
  continentMap: LocationCoordinates;
}

export interface LocationsData {
  locations: LocationEntry[];
}

// Type guard to ensure we have the right structure
function isLocationsData(data: any): data is LocationsData {
  return (
    data &&
    Array.isArray(data.locations) &&
    data.locations.every(
      (loc: any) =>
        loc.id &&
        loc.name &&
        loc.continent &&
        loc.hint &&
        loc.worldMap &&
        loc.continentMap
    )
  );
}

// Load and validate the locations data
let cachedLocations: LocationsData | null = null;

export function getLocationsData(): LocationsData {
  if (cachedLocations) {
    return cachedLocations;
  }

  // Type assertion - we know the JSON structure matches
  const data = locationsData as unknown as LocationsData;

  if (!isLocationsData(data)) {
    throw new Error("Invalid locations data structure");
  }

  cachedLocations = data;
  return cachedLocations;
}

// Get all locations for a specific map type
export function getLocationsForMap(
  mapType: "worldMap" | "continentMap" = "worldMap"
): Array<{
  id: string;
  name: string;
  continent: string;
  hint: string;
  x: number;
  y: number;
  tolerance: number;
}> {
  const data = getLocationsData();
  return data.locations.map((loc) => ({
    id: loc.id,
    name: loc.name,
    continent: loc.continent,
    hint: loc.hint,
    x: loc[mapType].x,
    y: loc[mapType].y,
    tolerance: loc[mapType].tolerance,
  }));
}

// Get all locations for a specific continent
export function getLocationsByContinent(
  continent: string,
  mapType: "worldMap" | "continentMap" = "worldMap"
): Array<{
  id: string;
  name: string;
  continent: string;
  hint: string;
  x: number;
  y: number;
  tolerance: number;
}> {
  return getLocationsForMap(mapType).filter(
    (loc) => loc.continent === continent
  );
}

// Get a specific location by ID
export function getLocationById(
  id: string,
  mapType: "worldMap" | "continentMap" = "worldMap"
): {
  id: string;
  name: string;
  continent: string;
  hint: string;
  x: number;
  y: number;
  tolerance: number;
} | null {
  const data = getLocationsData();
  const location = data.locations.find((loc) => loc.id === id);
  if (!location) return null;

  return {
    id: location.id,
    name: location.name,
    continent: location.continent,
    hint: location.hint,
    x: location[mapType].x,
    y: location[mapType].y,
    tolerance: location[mapType].tolerance,
  };
}

// Export the raw data for direct access if needed
export const MOCK_LOCATIONS = getLocationsData();

