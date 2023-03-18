import { ControlManager } from "controller/event-controller";
import { EndPointGroup } from "views/end-point-group";
import { SplineSegmentGroup } from "views/spline-segment-group";
import { EndPoint } from "./components/end-point";
import { SplineSegment } from "./components/spline-segment";

export class ElementFactory {
    constructor(
        private readonly controlManager: ControlManager,
        private readonly controlPointGroup: EndPointGroup,
        private readonly splineSegmentGroup: SplineSegmentGroup
    ) { }

    createControlPoint(x: number, y: number): EndPoint {        
        const elem = new EndPoint(x, y, this.controlPointGroup.createControlPoint());
        this.controlManager.registerControlPointClick(elem);
        return elem;
    }

    createSplineSegment(
        p0: EndPoint | null,
        p1: EndPoint,
        p2: EndPoint,
        p3: EndPoint | null
    ): SplineSegment {
        const elem = new SplineSegment(p0, p1, p2, p3, this.splineSegmentGroup.createSplineSegment());
        this.controlManager.registerSegmentClick(elem);
        return elem;
    }

}