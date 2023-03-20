import { App } from "app";
import { AppState, StateTracker } from "state/state";
import { StateFactory } from "state/state-factory";
import { EndPoint } from "models/components/end-point";
import { Canvas } from "views/canvas";

export class DrawInitState extends AppState {
    constructor(tracker: StateTracker, factory: StateFactory, private canvas: Canvas) {
        super(tracker, factory);
        canvas.darken();
    }

    override onEscape(): void {
        this.cancel();
    }

    private cancel(): void {
        this.canvas.lighten();
        this.stateTracker.setCurrentState(this.factory.idle());
    }

    override onSpace(): void {
        this.cancel();
    }

    override onEmptyClick(x: number, y: number): void {
        this.canvas.lighten();
        this.stateTracker.setCurrentState(this.factory.drawing(x, y));
    }

    override onControlPointClick(point: EndPoint): void {
        this.canvas.lighten();
        const [x, y] = point.getCoordinate();
        this.stateTracker.setCurrentState(this.factory.drawing(x, y, point));
    }
}