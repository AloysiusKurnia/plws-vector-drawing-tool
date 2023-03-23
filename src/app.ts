import { AnimationFrameController } from "observers/animation-frame-controller";
import { EventController } from "observers/event-controller";
import { ZoomController } from "observers/zoom";
import { DrawingElement } from "controllers/element";
import { ElementFactory } from "controllers/element-factory";
import { AppState, StateTracker } from "state/state";
import { StateFactory } from "state/state-factory";
import { SVGCanvas } from "views/canvas";

export class App implements StateTracker {
    private animationController = new AnimationFrameController();
    private svgCanvas: SVGCanvas;
    private zoomManager: ZoomController;
    private currentAppState: AppState;
    private controlManager: EventController;

    private elementFactory: ElementFactory;
    private stateFactory: StateFactory;

    constructor(parent: HTMLElement) {
        this.svgCanvas = new SVGCanvas(parent);
        this.zoomManager = new ZoomController(this.animationController, this.svgCanvas);
        this.controlManager = new EventController(this, this.zoomManager, this.svgCanvas);
        this.elementFactory = new ElementFactory(
            this.controlManager,
            this.svgCanvas.controlPointGroup,
            this.svgCanvas.splineSegmentGroup);
        this.stateFactory = new StateFactory(this, this.svgCanvas, this.elementFactory);
        this.currentAppState = this.stateFactory.idle();
    }

    darkenCanvas() {
        this.svgCanvas.darken();
    }

    lightenCanvas() {
        this.svgCanvas.lighten();
    }

    getCurrentState(): AppState {
        return this.currentAppState;
    }

    setCurrentState(state: AppState) {
        this.currentAppState = state;
    }
}