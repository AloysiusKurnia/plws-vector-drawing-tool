import { EventController } from "observers/event-controller";
import { EndPointGroup } from "views/groups/end-point-group";
import { SplineSegmentGroup } from "views/groups/spline-segment-group";
import { EndPoint } from "./components/end-point";
import { SplineSegment } from "./components/spline-segment";

export class ElementFactory {
    constructor(
        private readonly controlManager: EventController,
        private readonly controlPointGroup: EndPointGroup,
        private readonly splineSegmentGroup: SplineSegmentGroup
    ) { }

    createControlPoint(x: number, y: number): EndPoint {
        const elem = new EndPoint(x, y, this.controlPointGroup);
        this.controlManager.registerControlPointClick(elem);
        return elem;
    }

    createSplineSegment(
        endPoint0: EndPoint,
        endPoint1: EndPoint
    ): SplineSegment {
        const intermediatePoint0 = this.createControlPoint(0, 0);
        const intermediatePoint1 = this.createControlPoint(0, 0);
        intermediatePoint0.makeHidden();
        intermediatePoint1.makeHidden();
        const elem = new SplineSegment(
            endPoint0,
            intermediatePoint0,
            intermediatePoint1,
            endPoint1,
            this.splineSegmentGroup
        );
        this.controlManager.registerSegmentClick(elem);
        return elem;
    }

}