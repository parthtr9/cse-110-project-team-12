import { describe, it, expect } from "vitest";

import { TravelModel } from "../src/TransitionScreen/TravelModel.ts";
import { JourneyData } from "../src/TransitionScreen/TravelModel.ts";

const j: JourneyData = {currentDest: "SD",
  nextDest: "La Jolla",
  progress: 0, // 0-1
  visitedPlaces: ["Ocean"],
  totalDays: 1};

let t = new TravelModel(j, onDataChanged);

describe("TravelModel", () => {
  it("Travel Model Current Data Test", () => {
    expect(t.getCurrentData()).toEqual(j);
  });
});

function onDataChanged(data: JourneyData) {
    // if (data.progress >= 1) {
    //   this.view.showCompletionScreen({
    //     visitedPlaces: data.visitedPlaces,
    //     totalDays: data.totalDays,
    //   });
    // } else {
    //   this.view.showTravelingScreen({
    //     currentDest: data.currentDest,
    //     nextDest: data.nextDest,
    //     progress: data.progress,
    //   });
    // }
  }