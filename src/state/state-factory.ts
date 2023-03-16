import { App } from "app";
import { AppState, StateTracker } from "./state";
import { DrawInitState } from "./states/draw-init";
import { DrawingState } from "./states/drawing";
import { IdleState } from "./states/idle";

export class StateFactory {
    constructor(
        private tracker: StateTracker,
        private app: App,
    ) { }

    idle(): AppState {
        return new IdleState(this.tracker, this);
    }

    drawInit(): AppState {
        return new DrawInitState(this.tracker, this, this.app);
    }

    drawing(pointX: number, pointY: number): AppState {
        return new DrawingState(this.tracker, this, this.app, pointX, pointY);
    }
}