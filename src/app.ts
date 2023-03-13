import { Canvas } from "canvas";
// import { ControlManager } from "observer/event-manager";
import { ZoomManager } from "observer/zoom";

export class App {
    private zoomManager = new ZoomManager();
    // private eventManager = new ControlManager(this.stateTracker, this.zoomManager);

    private canvas: Canvas;

    constructor(parent: HTMLElement) {
        this.canvas = new Canvas(parent);
    }
}