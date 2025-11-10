/*
Source: https://medium.com/@dimi_2011/tdd-unit-testing-typescript-project-with-jest-2557e8b84414
*/
import { IntroScreenModel } from "../src/Intro/screens/IntroScreenModel.ts";
import { describe, it, expect } from "vitest";

let s = new IntroScreenModel();
// describe("Sample test suite", () => {
//   test("Initial test", () => {
//      expect(3).toEqual(3);
//   });
//   test("Intro Scene Model", () => {
//     let s = new IntroScreenModel();
//     expect(s.getState()).toEqual(0);  
//   });
// });
describe("IntroSceneModel", () => {
  it("Intro Scene Model state", () => {
    expect(s.getState()).toEqual(0);
  });
});

