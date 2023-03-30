import { ElementFactory } from "controllers/element-factory";
import { AnimationFrameController } from "observers/animation-frame-controller";
import { EventController } from "observers/event-controller";
import { ZoomController } from "observers/zoom-controller";
import { AppState, StateTracker } from "state/abstract-state";
import { StateFactory } from "state/state-factory";
import { SVGCanvas } from "views/canvas";
import { TextPopUp } from "views/gui/text-popup";

export class App implements StateTracker {
    private animationController = new AnimationFrameController();
    private svgCanvas: SVGCanvas;
    private zoomManager: ZoomController;
    private currentAppState: AppState;
    private controlManager: EventController;

    private elementFactory: ElementFactory;
    private stateFactory: StateFactory;
    private textPopUp: TextPopUp;

    constructor(parent: HTMLElement) {
        this.svgCanvas = new SVGCanvas(parent);
        this.zoomManager = new ZoomController(this.animationController, this.svgCanvas);
        this.svgCanvas.setupZoomingAttributes(this.zoomManager);
        this.controlManager = new EventController(this, this.zoomManager, this.svgCanvas);
        this.elementFactory = new ElementFactory(
            this.controlManager,
            this.svgCanvas);
        this.textPopUp = new TextPopUp(
            this.svgCanvas,
            this.zoomManager,
            this.animationController);

        this.stateFactory = new StateFactory(
            this,
            this.svgCanvas,
            this.elementFactory,
            this.textPopUp);
        this.currentAppState = this.stateFactory.idle();
    }

    getCurrentState(): AppState {
        return this.currentAppState;
    }

    setCurrentState(state: AppState) {
        this.currentAppState = state;
    }
}