import { COLOR } from "constants/settings";
import { BezierWrapper, SVGWrapper, UseWrapper } from "util/svg-wrapper";
import { EndPointGroup } from "./groups/end-point-group";
import { SplineSegmentGroup } from "./groups/spline-segment-group";


export class SVGCanvas extends SVGWrapper {
    public readonly splineSegmentGroup = new SplineSegmentGroup();
    public readonly controlPointGroup = new EndPointGroup();

    constructor(parent: HTMLElement) {
        super();
        this.splineSegmentGroup.appendTo(this);
        this.controlPointGroup.appendTo(this);
        this.appendToElement(parent);
    }

    darken() {
        this.style.backgroundColor = COLOR.darkWhite;
    }

    lighten() {
        this.style.backgroundColor = COLOR.white;
    }
}