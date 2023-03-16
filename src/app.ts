import { AnimationFrameController } from "controller/animation-frame-controller";
import { ControlManager } from "controller/event-controller";
import { ZoomController } from "controller/zoom";
import { AppState, StateTracker } from "state/state";
import { StateFactory } from "state/state-factory";
import { IdleState } from "state/states/idle";
import { Canvas } from "views/canvas";
import { ControlPoint } from "views/components/control-point";
import { DrawingElement } from "views/element";
import { ElementFactory } from "views/element-factory";

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
        this.elementFactory = new ElementFactory(this.controlManager);
        this.stateFactory = new StateFactory(this, this);
        this.currentState = this.stateFactory.idle();
    }

    addNewPoint(x: number, y: number) {
        const point = this.elementFactory.createControlPoint(x, y);
        this.canvas.addControlPoint(point.getElement());
        return point;
    }

    addNewSegment(
        p0: ControlPoint | null,
        p1: ControlPoint,
        p2: ControlPoint,
        p3: ControlPoint | null
    ) {
        const segment = this.elementFactory.createSplineSegment(p0, p1, p2, p3);
        this.canvas.addSplineSegment(segment.getElement());
        return segment;
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