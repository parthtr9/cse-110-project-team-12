import { describe, it, expect } from "vitest";
import { PostcardModel } from "../src/Postcard/PostcardModel.ts";
import {Location} from "../src/Postcard/Location.ts";
import {Coordinate} from "../src/Postcard/Location.ts";

let c:Coordinate = {x:0, y:0};
let l = new Location("SD", c , "San Diego", 0);
let s = new PostcardModel(l);

describe("PostCard Scene Model", () => {
  it("PostCard Model location", () => {
    expect(s.getLocation().getName()).toEqual(l.getName());
  });
});

