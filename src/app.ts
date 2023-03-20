import { AnimationFrameController } from "controller/animation-frame-controller";
import { ControlManager } from "controller/event-controller";
import { ZoomController } from "controller/zoom";
import { DrawingElement } from "models/element";
import { ElementFactory } from "models/element-factory";
import { AppState, StateTracker } from "state/state";
import { StateFactory } from "state/state-factory";
import { Canvas } from "views/canvas";

export class App implements StateTracker {
    private animationController = new AnimationFrameController();
    private canvas: Canvas;
    private zoomManager: ZoomController;
    private currentState: AppState;
    private controlManager: ControlManager;

    private elementFactory: ElementFactory;
    private stateFactory: StateFactory;

    constructor(parent: HTMLElement) {
        this.canvas = new Canvas(parent);
        this.zoomManager = new ZoomController(this.animationController, this.canvas);
        this.controlManager = new ControlManager(this, this.zoomManager, this.canvas);
        this.elementFactory = new ElementFactory(
            this.controlManager,
            this.canvas.controlPointGroup,
            this.canvas.splineSegmentGroup);
        this.stateFactory = new StateFactory(this, this.canvas, this.elementFactory);
        this.currentState = this.stateFactory.idle();
    }

    darkenCanvas() {
        this.canvas.darken();
    }

    lightenCanvas() {
        this.canvas.lighten();
    }

    remove(element: DrawingElement) {
        element.remove();
    }

    getCurrentState(): AppState {
        return this.currentState;
    }

    setCurrentState(state: AppState) {
        this.currentState = state;
    }
}