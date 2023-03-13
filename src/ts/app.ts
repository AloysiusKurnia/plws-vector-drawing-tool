import { Canvas } from "canvas";
import { ControlManager } from "observer/event-manager";
import { ZoomManager } from "observer/zoom";
import { StateTracker } from "state/state";

export class App {
    private zoomManager = new ZoomManager();
    private stateTracker = new StateTracker();
    private eventManager = new ControlManager(this.stateTracker, this.zoomManager);

    private canvas: Canvas;

    constructor(parent: HTMLElement) {
        this.canvas = new Canvas(parent);
    }
}