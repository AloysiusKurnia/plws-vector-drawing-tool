import { COLOR } from "util/colors";
import { BezierWrapper, CircleWrapper, GroupWrapper, SVGWrapper } from "util/svg-wrapper";

export class Canvas extends SVGWrapper {
    private segmentGroup: GroupWrapper;
    private controlPointGroup: GroupWrapper;
    constructor(parent: HTMLElement) {
        super();
        this.segmentGroup = new GroupWrapper();
        this.controlPointGroup = new GroupWrapper();
        this.segmentGroup.appendTo(this);
        this.controlPointGroup.appendTo(this);

        this.appendToElement(parent);
    }

    addSplineSegment(segment: BezierWrapper) {
        segment.appendTo(this.segmentGroup);
    }

    addControlPoint(point: CircleWrapper) {
        point.appendTo(this.controlPointGroup);
    }

    darken() {
        this.style.backgroundColor = COLOR.darkWhite;
    }

    lighten() {
        this.style.backgroundColor = COLOR.white;
    }
}