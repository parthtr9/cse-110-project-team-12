// src/model/gameState.ts
import { MOCK_LOCATIONS } from "../data/mocklocations";
export const gameState = {
  idx: 0,
  current() {
    return MOCK_LOCATIONS[this.idx % MOCK_LOCATIONS.length];
  },
  advance() {
    this.idx = (this.idx + 1) % MOCK_LOCATIONS.length;
  },
};
