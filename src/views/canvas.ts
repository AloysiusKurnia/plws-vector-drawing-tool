import { COLOR } from "constants/settings";
import { ZoomController } from "observers/zoom";
import { SVGWrapper } from "util/svg-wrapper";
import { EndPointGroup } from "./groups/end-point-group";
import { IntermediatePointGroup } from "./groups/intermediate-point-group";
import { SplineSegmentGroup } from "./groups/spline-segment-group";


export class SVGCanvas extends SVGWrapper {
    public readonly splineSegmentGroup = new SplineSegmentGroup();
    public readonly controlPointGroup = new EndPointGroup();
    public readonly intermediatePointGroup = new IntermediatePointGroup();

    constructor(parent: HTMLElement) {
        super();
        this.splineSegmentGroup.appendTo(this);
        this.intermediatePointGroup.appendTo(this);
        this.controlPointGroup.appendTo(this);
        this.appendToElement(parent);
    }

    darken() {
        this.style.backgroundColor = COLOR.darkWhite;
    }

    lighten() {
        this.style.backgroundColor = COLOR.white;
    }

    setupZoomingAttributes(zoomer: ZoomController) {
        this.splineSegmentGroup.setDefaultScaleFactor(zoomer.DEFAULT_SCALE_FACTOR);
        this.controlPointGroup.setDefaultScaleFactor(zoomer.DEFAULT_SCALE_FACTOR);
        this.intermediatePointGroup.setDefaultScaleFactor(zoomer.DEFAULT_SCALE_FACTOR);

        zoomer.doOnPanning(() => {
            this.splineSegmentGroup.rescale(zoomer.getScaleFactor());
            this.controlPointGroup.rescale(zoomer.getScaleFactor());
            this.intermediatePointGroup.rescale(zoomer.getScaleFactor());
        });
    }
}