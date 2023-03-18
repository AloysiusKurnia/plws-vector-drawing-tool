import { COLOR, DIMENSION, ID } from "constants/settings";
import { BezierWrapper, CircleWrapper, DefsWrapper, GroupWrapper, SVGWrapper, UseWrapper } from "util/svg-wrapper";



export class Canvas extends SVGWrapper {
    private segmentGroup: GroupWrapper;
    private controlPointGroup: GroupWrapper;
    private defintions = new DefsWrapper();

    constructor(parent: HTMLElement) {
        super();
        this.segmentGroup = new GroupWrapper();
        this.controlPointGroup = new GroupWrapper();
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