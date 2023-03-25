import { CatmullRomSplineBuilder } from "builders/spline-segment-builder";
import { EndPoint } from "controllers/components/end-point";
import { SplineSegment } from "controllers/components/spline-segment";
import { ElementFactory } from "controllers/element-factory";
import { AppState, StateTracker } from "state/abstract-state";
import { StateFactory } from "state/state-factory";
import { Pointlike } from "util/utility-types";

export class DrawingState extends AppState {
    private previousPoint: EndPoint;
    private currentPoint: EndPoint;

    private currentSegment: SplineSegment;

    private currentSegmentBuilder: CatmullRomSplineBuilder;
    // private previousSegment: SplineSegment | null = null;
    // private previousSegmentBuilder: CatmullRomSplineBuilder | null = null;

    private previousSegment: {
        segment: SplineSegment,
        builder: CatmullRomSplineBuilder,
    } | null = null;
    private snap: Pointlike | null = null;
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
        if (this.snap) {
            this.currentPoint.copyFrom(this.snap);
        } else {
            this.currentPoint.copyFrom({ x, y });
        }
        this.currentPoint.updateView();
        this.currentSegmentBuilder.updatePoints();
        this.currentSegment.updateView();
        this.previousSegment?.builder.updatePoints();
        this.previousSegment?.segment.updateView();
    }

    override onEmptyClick(x: number, y: number): void {
        this.addPoint(this.currentPoint, false, { x, y });
    }

    private addPoint(
        currentPoint: EndPoint,
        removeCurrentPoint = true,
        cursorPosition: Pointlike
    ): void {
        const prepreviousPoint = this.previousPoint;
        this.previousPoint = currentPoint;
        this.previousSegment = {
            segment: this.currentSegment,
            builder: this.currentSegmentBuilder,
        };

        this.previousPoint.makeTangible();
        this.previousSegment.segment.makeTangible();
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
        this.previousSegment.segment.endPoint1 = this.previousPoint;
        this.previousSegment.builder.outerPoint1 = this.currentPoint;

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


    override onEndPointClick(currentPoint: EndPoint): void {
        if (currentPoint === this.previousPoint) { return; }
        this.addPoint(currentPoint, true, currentPoint);
        if (this.snap) { this.snap = null; }
    }

    override onEndPointEnter(point: EndPoint): void {
        if (point === this.previousPoint) { return; }
        this.snap = point;
    }

    override onEndPointLeave(): void {
        this.snap = null;
    }

    private finishDrawing(): void {
        if (this.previousSegment) {
            this.previousSegment.builder.outerPoint1 = null;
            this.previousSegment.builder.updatePoints();
            this.previousSegment.segment.updateView();
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