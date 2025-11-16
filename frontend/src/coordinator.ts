// coordinator: intro -> map -> postcard -> transition
import Konva from "konva";
import { isCorrectSelection } from "./map/selection";
import { createMapView } from "./view/mapView";
import { MOCK_LOCATIONS } from "./data/mocklocations";
import { IntroScreenController } from "./Intro/screens/IntroScreenController";
import { PostcardModel } from "./Postcard/PostcardModel";
import { PostcardView } from "./Postcard/PostcardView";
import { PostcardController } from "./Postcard/PostcardController";
import { Location as PostcardLocation } from "./Postcard/Location";
import { TravelController } from "./TransitionScreen/TravelController";
import { FlagGameController } from "./FlagMinigame/FlagGameController";

const container = document.getElementById("app")!;

// Add floating FlagMinigame button
const flagBtn = document.createElement("button");
flagBtn.textContent = "🏳️ Flag Minigame";
flagBtn.style.position = "fixed";
flagBtn.style.right = "32px";
flagBtn.style.bottom = "32px";
flagBtn.style.zIndex = "10001";
flagBtn.style.padding = "16px 24px";
flagBtn.style.fontSize = "20px";
flagBtn.style.background = "#4169E1";
flagBtn.style.color = "white";
flagBtn.style.border = "none";
flagBtn.style.borderRadius = "12px";
flagBtn.style.boxShadow = "0 4px 16px rgba(0,0,0,0.15)";
flagBtn.style.cursor = "pointer";
flagBtn.style.transition = "background 0.2s";
flagBtn.onmouseenter = () => flagBtn.style.background = "#27408B";
flagBtn.onmouseleave = () => flagBtn.style.background = "#4169E1";
document.body.appendChild(flagBtn);

let flagGame: FlagGameController | null = null;
flagBtn.onclick = () => {
  if (!flagGame) {
    flagGame = new FlagGameController();
    flagGame.start();
    // Clean up reference when closed
    const origDestroy = flagGame.destroy.bind(flagGame);
    flagGame.destroy = () => {
      origDestroy();
      flagGame = null;
    };
  }
};

const view = createMapView(container, window.innerWidth, window.innerHeight);
const stage = view.stage;
const layer = view.layer;

layer.add(new Konva.Rect({ x: 0, y: 0, width: stage.width(), height: stage.height(), fill: "#e6e6e6", listening: false }));

// show intro. when finished -> start map
const intro = new IntroScreenController(layer, stage, startMap);
layer.add(intro.getView().getGroup());
intro.getView().show();

function startMap() {
  // Completely remove intro from layer
  intro.getView().getGroup().destroy();
  
  // Load and display the world map image
  const imageObj = new Image();
  imageObj.src = "/world_map.jpg";

  imageObj.onload = () => {
    const worldMap = new Konva.Image({
      x: 0,
      y: 0,
      image: imageObj,
      width: stage.width(),
      height: stage.height(),
      listening: false,
    });

    // Clear the entire layer and rebuild it
    layer.destroyChildren();
    
    // Add background color first
    layer.add(new Konva.Rect({ 
      x: 0, 
      y: 0, 
      width: stage.width(), 
      height: stage.height(), 
      fill: "#e6e6e6", 
      listening: false 
    }));

    // Add map image on top of background
    layer.add(worldMap);
    layer.draw();
    
    // Now add markers after map is loaded
    drawMarkers();
  };

  imageObj.onerror = (error) => {
    console.error("Failed to load world map image:", error);
  };

  stage.on("click", onMapClick);
}

function drawMarkers() {
  layer.find(".marker-dot").forEach((n) => n.destroy());
  for (const loc of MOCK_LOCATIONS) {
    const dot = new Konva.Circle({
      name: "marker-dot",
      x: loc.coord.x,
      y: loc.coord.y,
      radius: 8,
      fill: "#00c853",
      stroke: "#003300",
      strokeWidth: 2,
      listening: false,
    });
    // ts-ignore: attach custom data
    // @ts-ignore
    (dot as any).locationId = loc.id;
    layer.add(dot);
    dot.moveToTop();
  }
  layer.draw();
}

let disabled = false;
let lastLocationName: string | null = null;

function onMapClick(e: any) {
  if (disabled) return;
  const pos = stage.getPointerPosition();
  if (!pos) return;

  for (const loc of MOCK_LOCATIONS) {
    if (isCorrectSelection(pos, loc as any, view.getTransform())) {
      view.pulse(pos, "good");
      disabled = true;

      const pcLoc = new PostcardLocation(loc.name, loc.coord as any, `A postcard from ${loc.name}.`, 3);
      const pcModel = new PostcardModel(pcLoc);
      const pcView = new PostcardView(layer);
      const pcController = new PostcardController(pcModel, pcView, undefined, () => {
        // when user presses Travel on the postcard, destroy the map stage and start transition
        try { stage.destroy(); } catch (err) { /* ignore */ }
        const journey = {
          currentDest: lastLocationName || "San Diego",
          nextDest: pcLoc.getName(),
          progress: 0,
          visitedPlaces: lastLocationName ? [lastLocationName, pcLoc.getName()] : ["San Diego", pcLoc.getName()],
          totalDays: pcLoc.getNumDays(),
        };
        lastLocationName = pcLoc.getName();
        new TravelController({ width: window.innerWidth, height: window.innerHeight, containerId: container.id }, journey);
      });

      return;
    }
  }

  view.pulse(pos, "bad");
}
