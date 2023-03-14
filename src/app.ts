import { Canvas } from "views/canvas";
import { ControlPoint } from "views/components/control-point";
import { ZoomController } from "controller/zoom";
import { AppState, StateTracker } from "state/state";
import { IdleState } from "state/states/idle";

export class App implements StateTracker {
    private zoomManager = new ZoomController();
    private currentState: AppState;
    private canvas: Canvas;

    constructor(parent: HTMLElement) {
        this.canvas = new Canvas(parent);
        this.currentState = new IdleState(this);
    }

    addNewPoint(x: number, y: number) {
        const point = new ControlPoint(x, y);
        this.canvas.addControlPoint(point.getElement());
    }

    getCurrentState(): AppState {
        return this.currentState;
    }

    setCurrentState(state: AppState) {
        this.currentState = state;
    }
}