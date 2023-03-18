import { ControlManager } from "controller/event-controller";
import { DefsWrapper } from "util/svg-wrapper";
import { ControlPoint } from "./components/control-point";
import { SplineSegment } from "./components/spline-segment";

export class ElementFactory {
    constructor(
        private readonly controlManager: ControlManager,
        private readonly defs: DefsWrapper
    ) { }

    createControlPoint(x: number, y: number): ControlPoint {
        const elem = new ControlPoint(x, y, this.defs);
        this.controlManager.registerControlPointClick(elem);
        return elem;
    }

    createSplineSegment(
        p0: ControlPoint | null,
        p1: ControlPoint,
        p2: ControlPoint,
        p3: ControlPoint | null
    ): SplineSegment {
        const elem = new SplineSegment(p0, p1, p2, p3);
        this.controlManager.registerSegmentClick(elem);
        return elem;
    }

}