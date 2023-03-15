import { AppState, StateTracker } from "state/state";
import { Canvas } from "views/canvas";
import { IdleState } from "./idle";

export class DrawInitState extends AppState {
    constructor(tracker: StateTracker, private canvas: Canvas) {
        super(tracker);
        canvas.darken();
    }

    override onEscape(): void {
        this.canvas.lighten();
        this.stateTracker.setCurrentState(new IdleState(this.stateTracker));
    }
}