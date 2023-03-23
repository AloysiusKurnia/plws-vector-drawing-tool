import { CatmullRomSplineBuilder } from "builders/spline-segment-builder";
import { EndPoint } from "controllers/components/end-point";
import { SplineSegment } from "controllers/components/spline-segment";
import { ElementFactory } from "controllers/element-factory";
import { AppState, StateTracker } from "state/state";
import { StateFactory } from "state/state-factory";
import { Pointlike } from "util/utility-types";

export class DrawingState extends AppState {
    private previousPoint: EndPoint;
    private currentPoint: EndPoint;

    private previousSegment: SplineSegment | null = null;
    private currentSegment: SplineSegment;

    private previousSegmentBuilder: CatmullRomSplineBuilder | null = null;
    private currentSegmentBuilder: CatmullRomSplineBuilder;
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
        this.previousPoint.updateView();
        this.currentPoint = this.elementFactory.createControlPoint(pointX, pointY);
        this.currentPoint.makeHidden();
        this.currentSegment = this.elementFactory.createSplineSegment(
            this.previousPoint,
            this.currentPoint);
        this.currentSegmentBuilder = new CatmullRomSplineBuilder(
            null, null,
            this.currentSegment
        );
        this.currentSegmentBuilder.updatePoints();

        this.currentPoint.makeIntangible();
        this.currentSegment.makeIntangible();
    }

    override onMouseMove(x: number, y: number): void {
        this.currentPoint.copyFrom({ x, y });
        this.currentPoint.updateView();
        this.currentSegmentBuilder.updatePoints();
        this.previousSegmentBuilder?.updatePoints();
        this.currentSegment.updateView();
        this.previousSegment?.updateView();
    }

    override onEmptyClick(x: number, y: number): void {
        this.addPoint(this.currentPoint, false, { x, y });
    }

    private addPoint(
        currentPoint: EndPoint,
        removeCurrentPoint: boolean = true,
        cursorPosition: Pointlike
    ): void {
        const prepreviousPoint = this.previousPoint;
        this.previousPoint = currentPoint;
        this.previousSegment = this.currentSegment;
        this.previousSegmentBuilder = this.currentSegmentBuilder;

        this.previousPoint.makeTangible();
        this.previousSegment.makeTangible();
        if (removeCurrentPoint) {
            this.currentPoint.removeElement();
        } else {
            this.currentPoint.makeShown();
        }

        this.currentPoint = this.elementFactory.createControlPoint(
            cursorPosition.x,
            cursorPosition.y
        );
        this.currentPoint.makeHidden();
        this.previousSegment.endPoint1 = this.previousPoint;
        this.previousSegmentBuilder.outerPoint1 = this.currentPoint;

        this.currentSegment = this.elementFactory.createSplineSegment(
            this.previousPoint,
            this.currentPoint);
        this.currentSegmentBuilder = new CatmullRomSplineBuilder(
            prepreviousPoint,
            null,
            this.currentSegment
        );

        this.currentPoint.makeIntangible();
        this.currentSegment.makeIntangible();
    }


    override onControlPointClick(currentPoint: EndPoint): void {
        if (currentPoint === this.previousPoint) { return; }
        this.addPoint(currentPoint, true, currentPoint);
    }

    private finishDrawing(): void {
        if (this.previousSegmentBuilder) {
            this.previousSegmentBuilder.outerPoint1 = null;
            this.previousSegmentBuilder.updatePoints();
            this.previousSegment!.updateView();
        }
        this.currentPoint.removeElement();
        this.currentSegment.removeElement();
    }

    override onEscape(): void {
        this.finishDrawing();
        this.stateTracker.setCurrentState(this.factory.idle());
    }

    override onSpace(): void {
        this.finishDrawing();
        this.stateTracker.setCurrentState(this.factory.drawInit());
    }
}