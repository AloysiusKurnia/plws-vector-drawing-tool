import { AppState, StateTracker } from "state/state";
import { StateFactory } from "state/state-factory";
import { Canvas } from "views/canvas";

export class DrawInitState extends AppState {
    constructor(tracker: StateTracker, factory: StateFactory, private canvas: Canvas) {
        super(tracker, factory);
        canvas.darken();
    }

    override onEscape(): void {
        this.canvas.lighten();
        this.stateTracker.setCurrentState(this.factory.idle());
    }
}