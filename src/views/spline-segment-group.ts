import { GroupWrapper } from "util/svg-wrapper";
import { SplineSegmentView } from "./spline-segment-view";

export class SplineSegmentGroup extends GroupWrapper {
    constructor() {
        super();
        this.setFill('none');
    }

    createSplineSegment() {
        const splineSegment = new SplineSegmentView();
        splineSegment.appendTo(this);
        return splineSegment;
    }
}