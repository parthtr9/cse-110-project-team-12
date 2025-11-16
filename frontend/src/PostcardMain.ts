import Konva from "konva";
import { Location } from "./Postcard/Location";
import { PostcardModel } from "./Postcard/PostcardModel";
import { PostcardView } from "./Postcard/PostcardView";
import { PostcardController } from "./Postcard/PostcardController";

// Create stage
const stage = new Konva.Stage({
  container: "container",
  width: window.innerWidth,
  height: window.innerHeight,
});

// Create layer
const layer = new Konva.Layer();
stage.add(layer);

// Mock locations
const sampleLocations = [
  new Location(
    "Paris",
    { x: 5, y: 10 },
    "In my travels I found this beautiful city in the\nmiddle of Europe known for its art culture and\nfashion. I hope one day you'll get a chance\nto see it.",
    5
  ),
  new Location(
    "Tokyo",
    { x: 5, y: 10 },
    "A bustling metropolis where ancient temples\nstand beside neon-lit skyscrapers. The sushi\nhere is unforgettable! You would love the\ncherry blossoms.",
    7
  ),
  new Location(
    "Cairo",
    { x: 5, y: 10 },
    "Standing before the pyramids, I felt the weight\nof thousands of years of history. The Sphinx\nseems to guard eternal secrets. Incredible!",
    4
  ),
  new Location(
    "New York",
    { x: 5, y: 10 },
    "The city that never sleeps! From Broadway\nshows to Central Park picnics, every corner\npulses with energy and possibility.",
    6
  ),
  new Location(
    "Sydney",
    { x: 5, y: 10 },
    "The Opera House gleaming by the harbor took\nmy breath away. The beaches here are stunning\nand the people so friendly. What a gem!",
    8
  ),
];

// Pick a random location
const randomLocation =
  sampleLocations[Math.floor(Math.random() * sampleLocations.length)];

const postcardModel = new PostcardModel(randomLocation);
const postcardView = new PostcardView(layer);
const postcardController = new PostcardController(postcardModel, postcardView);
