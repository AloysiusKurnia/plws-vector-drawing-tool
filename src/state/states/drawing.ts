import { App } from "app";
import { AppState, StateTracker } from "state/state";
import { StateFactory } from "state/state-factory";
import { ControlPoint } from "views/components/control-point";
import { SplineSegment } from "views/components/spline-segment";

export class DrawingState extends AppState {
    private previousPoint: ControlPoint;
    private currentPoint: ControlPoint;

    private previousSegment: SplineSegment | null = null;
    private currentSegment: SplineSegment;
    constructor(
        tracker: StateTracker,
        factory: StateFactory,
        private app: App,
        pointX: number,
        pointY: number
    ) {
        super(tracker, factory);
        this.previousPoint = this.app.addNewPoint(pointX, pointY);
        this.currentPoint = this.app.addNewPoint(pointX, pointY);
        this.currentPoint.makeIntangible();
        this.currentSegment = this.app.addNewSegment(
            null,
            this.previousPoint,
            this.currentPoint,
            null);
    }

    override onMouseMove(x: number, y: number): void {
        this.currentPoint.moveTo(x, y);
        this.currentPoint.updateTransform();
        this.currentSegment.updateTransform();
        this.previousSegment?.updateTransform();
    }

    override onEmptyClick(x: number, y: number): void {
        const prepreviousPoint = this.previousPoint;
        this.previousPoint = this.currentPoint;
        this.previousSegment = this.currentSegment;

        this.previousPoint.makeTangible();

        this.currentPoint = this.app.addNewPoint(x, y);
        this.currentPoint.makeIntangible();
        this.previousSegment.setNextPoint(this.currentPoint);

        this.currentSegment = this.app.addNewSegment(
            prepreviousPoint,
            this.previousPoint,
            this.currentPoint,
            null);
    }

    private finish(): void {
        this.previousSegment?.setNextPoint(null);
        this.previousSegment?.updateTransform();
        this.app.remove(this.currentPoint);
        this.app.remove(this.currentSegment);
    }

    override onEscape(): void {
        this.finish();
        this.stateTracker.setCurrentState(this.factory.idle());
    }

    override onSpace(): void {
        this.finish();
        this.stateTracker.setCurrentState(this.factory.drawInit());
    }
}