import { EventController } from "observers/event-controller";
import { EndPointGroup } from "views/groups/end-point-group";
import { IntermediatePointGroup } from "views/groups/intermediate-point-group";
import { SplineSegmentGroup } from "views/groups/spline-segment-group";
import { EndPoint } from "./components/end-point";
import { IntermediatePoint } from "./components/intermediate-point";
import { SplineSegment } from "./components/spline-segment";

export class ElementFactory {
    constructor(
        private readonly controlManager: EventController,
        private readonly controlPointGroup: EndPointGroup,
        private readonly splineSegmentGroup: SplineSegmentGroup,
        private readonly intermediatePointGroup: IntermediatePointGroup,
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
        const intermediatePoint0 = new IntermediatePoint(endPoint0, this.intermediatePointGroup);
        const intermediatePoint1 = new IntermediatePoint(endPoint1, this.intermediatePointGroup);
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