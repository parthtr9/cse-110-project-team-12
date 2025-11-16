import type { Location } from "../domain/location";

export const MOCK_LOCATIONS = [
  {
    id: "sf",
    name: "San Francisco",
    coord: { x: 312, y: 145 },
    tolerancePx: 40,
  },
  { id: "la", name: "Los Angeles", coord: { x: 290, y: 260 }, tolerancePx: 40 },
  { id: "nyc", name: "New York", coord: { x: 780, y: 165 }, tolerancePx: 40 },
];
