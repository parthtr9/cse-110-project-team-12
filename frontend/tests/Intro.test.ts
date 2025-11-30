//npm install --save-dev vitest
//npm test
import { IntroScreenModel } from "../src/Intro/screens/IntroScreenModel.ts";
import { describe, it, expect } from "vitest";

let s = new IntroScreenModel();

describe("IntroSceneModel", () => {
  it("Intro Scene Model state", () => {
    expect(s.getState()).toEqual(0);
  });
});
