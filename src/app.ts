import { Canvas } from "canvas";
import { ControlPoint } from "element/elements/control-point";
import { ZoomManager } from "observer/zoom";
import { AppState, StateTracker } from "state/state";
import { IdleState } from "state/states/idle";

export class App implements StateTracker {
    private zoomManager = new ZoomManager();
    private currentState: AppState;
    private canvas: Canvas;

    constructor(parent: HTMLElement) {
        this.canvas = new Canvas(parent);
        this.currentState = new IdleState(this);
    }

    addNewPoint(x: number, y: number) {
        const point = new ControlPoint(x, y);
    }

    getCurrentState(): AppState {
        return this.currentState;
    }

    setCurrentState(state: AppState) {
        this.currentState = state;
    }
}