import { Canvas } from "views/canvas";
import { AppState, StateTracker } from "./state";
import { DrawInitState } from "./states/draw-init";
import { IdleState } from "./states/idle";

export class StateFactory {
    constructor(
        private tracker: StateTracker,
        private canvas: Canvas
    ) { }

    idle(): AppState {
        return new IdleState(this.tracker, this);
    }

    drawInit(): AppState {
        return new DrawInitState(this.tracker, this, this.canvas);
    }
}