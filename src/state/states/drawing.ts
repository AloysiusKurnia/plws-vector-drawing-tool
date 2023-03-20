import { EndPoint } from "models/components/end-point";
import { SplineSegment } from "models/components/spline-segment";
import { ElementFactory } from "models/element-factory";
import { AppState, StateTracker } from "state/state";
import { StateFactory } from "state/state-factory";

export class DrawingState extends AppState {
    private previousPoint: EndPoint;
    private currentPoint: EndPoint;

    private previousSegment: SplineSegment | null = null;
    private currentSegment: SplineSegment;
    constructor(
        tracker: StateTracker,
        stateFactory: StateFactory,
        private elementFactory: ElementFactory,
        pointX: number,
        pointY: number,
        firstPoint: EndPoint | null = null,
    ) {
        super(tracker, stateFactory);
        this.previousPoint = firstPoint ?? this.elementFactory.createControlPoint(pointX, pointY);
        this.previousPoint.updateTransform();
        this.currentPoint = this.elementFactory.createControlPoint(pointX, pointY);
        this.currentPoint.hide();
        this.currentSegment = this.elementFactory.createSplineSegment(
            null,
            this.previousPoint,
            this.currentPoint,
            null);
        this.currentPoint.makeIntangible();
        this.currentSegment.makeIntangible();
    }

    override onMouseMove(x: number, y: number): void {
        this.currentPoint.moveTo(x, y);
        this.currentPoint.updateTransform();
        this.currentSegment.updateTransform();
        this.previousSegment?.updateTransform();
    }

    override onEmptyClick(x: number, y: number): void {
        this.addPoint(this.currentPoint, false, x, y);
    }

    private addPoint(
        currentPoint: EndPoint,
        removeCurrentPoint: boolean = true,
        cursorX: number, cursorY: number
    ): void {
        const prepreviousPoint = this.previousPoint;
        this.previousPoint = currentPoint;
        this.previousSegment = this.currentSegment;

        this.previousPoint.makeTangible();
        this.previousSegment.makeTangible();
        if (removeCurrentPoint) {
            this.currentPoint.remove();
        } else {
            this.currentPoint.show();
        }

        this.currentPoint = this.elementFactory.createControlPoint(cursorX, cursorY);
        this.currentPoint.hide();
        this.previousSegment.setCurrentPoint(this.previousPoint);
        this.previousSegment.setNextPoint(this.currentPoint);

        this.currentSegment = this.elementFactory.createSplineSegment(
            prepreviousPoint,
            this.previousPoint,
            this.currentPoint,
            null);

        this.currentPoint.makeIntangible();
        this.currentSegment.makeIntangible();
    }


    override onControlPointClick(currentPoint: EndPoint): void {
        this.addPoint(currentPoint, true, ...currentPoint.getCoordinate());
    }

    private finish(): void {
        this.previousSegment?.setNextPoint(null);
        this.previousSegment?.updateTransform();
        this.currentPoint.remove();
        this.currentSegment.remove();
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