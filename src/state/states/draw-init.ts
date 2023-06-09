import { EndPoint } from "controllers/components/end-point";
import { AppState, StateTracker } from "state/abstract-state";
import { StateFactory } from "state/state-factory";
import { SVGCanvas } from "views/canvas";

/**
 * The state when the user is about to start drawing a new path.
 */
export class DrawInitState extends AppState {
    constructor(tracker: StateTracker, factory: StateFactory, private svgCanvas: SVGCanvas) {
        super(tracker, factory);
        svgCanvas.darken();
    }

    override onEscape(): void {
        this.cancel();
    }

    private cancel(): void {
        this.svgCanvas.lighten();
        this.stateTracker.setCurrentState(this.factory.idle());
    }

    override onSpace(): void {
        this.cancel();
    }

    override onEmptyClick(x: number, y: number): void {
        this.svgCanvas.lighten();
        this.stateTracker.setCurrentState(this.factory.drawing(x, y));
    }

    override onEndPointClick(point: EndPoint): void {
        this.svgCanvas.lighten();
        const { x, y } = point;
        this.stateTracker.setCurrentState(this.factory.drawing(x, y, point));
    }
}