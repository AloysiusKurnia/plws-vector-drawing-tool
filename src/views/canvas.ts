import { COLOR, DIMENSION, ID } from "constants/settings";
import { BezierWrapper, CircleWrapper, DefsWrapper, SVGWrapper, UseWrapper } from "util/svg-wrapper";
import { EndPointGroup } from "./end-point-group";
import { SplineSegmentGroup } from "./spline-segment-group";



export class SVGCanvas extends SVGWrapper {
    public readonly splineSegmentGroup = new SplineSegmentGroup();
    public readonly controlPointGroup = new EndPointGroup();
    private defintions = new DefsWrapper();

    constructor(parent: HTMLElement) {
        super();
        this.splineSegmentGroup.appendTo(this);
        this.controlPointGroup.appendTo(this);

        this.initializeDefs();
        this.defintions.appendTo(this);
        this.appendToElement(parent);
    }
    private initializeDefs() {
        const controlPoint = new CircleWrapper();
        controlPoint.setRadius(DIMENSION.endPointRadius);
        this.defintions.add(controlPoint, ID.endPoint);
        console.log(`Initialized defs`);
    }

    addSplineSegment(segment: BezierWrapper) {
        segment.appendTo(this.splineSegmentGroup);
    }

    getDefs() {
        return this.defintions;
    }

    addControlPoint(point: UseWrapper) {
        point.appendTo(this.controlPointGroup);
    }


    darken() {
        this.style.backgroundColor = COLOR.darkWhite;
    }

    lighten() {
        this.style.backgroundColor = COLOR.white;
    }
}