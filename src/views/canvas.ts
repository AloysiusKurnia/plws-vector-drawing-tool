import { COLOR } from "constants/settings";
import { ZoomController } from "observers/zoom-controller";
import { SVGWrapper } from "util/svg-wrapper";
import { EndPointGroup } from "./groups/end-point-group";
import { GroupCarrier } from "./groups/group-carrier";
import { IntermediatePointGroup } from "./groups/intermediate-point-group";
import { SplineSegmentGroup } from "./groups/spline-segment-group";

/**
 * The canvas is the SVG element that contains all the other SVG elements.
 * This canvas will fill the entire screen, and any other SVG elements will
 * be drawn on top of it.
 */
export class SVGCanvas extends SVGWrapper implements GroupCarrier {
    public readonly splineSegmentGroup = new SplineSegmentGroup();
    public readonly endPointGroup = new EndPointGroup();
    public readonly intermediatePointGroup = new IntermediatePointGroup();

    /**
     * Creates a new canvas.
     * @param parent The parent element that the canvas will be appended to.
     */
    constructor(parent: HTMLElement) {
        super();
        this.splineSegmentGroup.appendTo(this);
        this.intermediatePointGroup.appendTo(this);
        this.endPointGroup.appendTo(this);
        this.appendToElement(parent);
    }

    /** Darkens the canvas. */
    darken() {
        this.style.backgroundColor = COLOR.darkWhite;
    }

    /** Lightens the canvas. */
    lighten() {
        this.style.backgroundColor = COLOR.white;
    }

    /**
     * Subscribes the canvas to the zoom controller.
     * @param zoomer The zoom controller.
     */
    setupZoomingAttributes(zoomer: ZoomController) {
        zoomer.doOnPanning(() => {
            const scaleFactor = zoomer.getScaleFactor();
            this.splineSegmentGroup.rescale(scaleFactor);
            this.endPointGroup.rescale(scaleFactor);
            this.intermediatePointGroup.rescale(scaleFactor);
        });
    }
}