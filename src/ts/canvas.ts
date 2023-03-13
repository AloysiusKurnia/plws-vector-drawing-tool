import { BezierWrapper, GroupWrapper, SVGWrapper } from "util/svg-wrapper";

export class Canvas extends SVGWrapper {
    private segmentGroup: GroupWrapper;
    private controlPointGroup: GroupWrapper;
    constructor(parent: HTMLElement) {
        super();
        this.setAttribute("width", "100%");
        this.setAttribute("height", "100%");
        
        this.segmentGroup = new GroupWrapper();
        this.controlPointGroup = new GroupWrapper();
        this.segmentGroup.appendTo(this);
        this.controlPointGroup.appendTo(this);

        this.appendToElement(parent);
    }

    addSplineSegment(segment: BezierWrapper) {
        segment.appendTo(this.segmentGroup);
    }

    addControlPoint(point: BezierWrapper) {
        point.appendTo(this.controlPointGroup);
    }
}