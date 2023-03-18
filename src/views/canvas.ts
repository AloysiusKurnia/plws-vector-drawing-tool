import { COLOR, DIMENSION, ID } from "constants/settings";
import { BezierWrapper, CircleWrapper, DefsWrapper, SVGWrapper, UseWrapper } from "util/svg-wrapper";
import { ControlPointGroup } from "./control-point-group";
import { SplineSegmentGroup } from "./spline-segment-group";



export class Canvas extends SVGWrapper {
    private segmentGroup: SplineSegmentGroup;
    private controlPointGroup: ControlPointGroup;
    private defintions = new DefsWrapper();

    constructor(parent: HTMLElement) {
        super();
        this.segmentGroup = new SplineSegmentGroup();
        this.controlPointGroup = new ControlPointGroup();
        this.segmentGroup.appendTo(this);
        this.controlPointGroup.appendTo(this);

        this.initializeDefs();
        this.defintions.appendTo(this);
        this.appendToElement(parent);
    }
    private initializeDefs() {
        const controlPoint = new CircleWrapper();
        controlPoint.setRadius(DIMENSION.defaultPointRadius);
        this.defintions.add(controlPoint, ID.controlPoint);
        console.log(`Initialized defs`);
        
    }

    addSplineSegment(segment: BezierWrapper) {
        segment.appendTo(this.segmentGroup);
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