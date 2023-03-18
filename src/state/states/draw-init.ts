import { App } from "app";
import { AppState, StateTracker } from "state/state";
import { StateFactory } from "state/state-factory";
import { ControlPoint } from "models/components/control-point";

export class DrawInitState extends AppState {
    constructor(tracker: StateTracker, factory: StateFactory, private app: App) {
        super(tracker, factory);
        app.darkenCanvas();
    }

    override onEscape(): void {
        this.cancel();
    }

    private cancel(): void {
        this.app.lightenCanvas();
        this.stateTracker.setCurrentState(this.factory.idle());
    }

    override onSpace(): void {
        this.cancel();
    }

    override onEmptyClick(x: number, y: number): void {
        this.app.lightenCanvas();
        this.stateTracker.setCurrentState(this.factory.drawing(x, y));
    }

    override onControlPointClick(point: ControlPoint): void {
        this.app.lightenCanvas();
        const [x, y] = point.getCoordinate();
        this.stateTracker.setCurrentState(this.factory.drawing(x, y, point));
    }
}