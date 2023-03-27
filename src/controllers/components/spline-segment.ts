import { COLOR } from "constants/settings";
import { DrawingElement } from "controllers/element";
import { SplineSegmentView } from "views/component/spline-segment-view";
import { IntermediatePointGroup } from "views/groups/intermediate-point-group";
import { SplineSegmentGroup } from "views/groups/spline-segment-group";
import { EndPoint } from "./end-point";
import { IntermediatePoint } from "./intermediate-point";

/** 
 * A single piece of cubic Bezier curve that is part of a spline.
 */
export class SplineSegment extends DrawingElement<SplineSegmentView> {
    /** The first intermediate point of the spline segment. */
    public readonly intermediatePoint0: IntermediatePoint;
    /** The second intermediate point of the spline segment. */
    public readonly intermediatePoint1: IntermediatePoint;
    private endPoint0_: EndPoint;
    private endPoint1_: EndPoint;
    /**
     * Creates a new spline segment.
     * @param endPoint0 The first end point of the spline segment. Mutable.
     * @param endPoint1 The second end point of the spline segment. Mutable.
     * @param group The group that contains the spline segment.
     * @param intermediatePointGroup
     * The group that contains the intermediate points.
     */
    constructor(
        endPoint0: EndPoint, endPoint1: EndPoint,
        group: SplineSegmentGroup,
        intermediatePointGroup: IntermediatePointGroup,
    ) {
        super(new SplineSegmentView(group));
        this.endPoint0_ = endPoint0;
        this.endPoint1_ = endPoint1;
        this.intermediatePoint0 = new IntermediatePoint(endPoint0, this, intermediatePointGroup);
        this.intermediatePoint1 = new IntermediatePoint(endPoint1, this, intermediatePointGroup);
        this.updateGraphicsToDefault();
    }

    /**
     * Couples the first intermediate point of this spline segment to the
     * second intermediate point of another spline segment.
     * @param other The other spline segment.
     */
    coupleIntermediatePoint(other: SplineSegment): void {
        this.intermediatePoint0.couple = other.intermediatePoint1;
        other.intermediatePoint1.couple = this.intermediatePoint0;
    }

    /** The first end point of the spline segment. Mutable. */
    get endPoint0(): EndPoint { return this.endPoint0_; }
    set endPoint0(endPoint: EndPoint) {
        this.endPoint0_ = endPoint;
        this.intermediatePoint0.endPoint = endPoint;
    }

    /** The second end point of the spline segment. Mutable. */
    get endPoint1(): EndPoint { return this.endPoint1_; }
    set endPoint1(endPoint: EndPoint) {
        this.endPoint1_ = endPoint;
        this.intermediatePoint1.endPoint = endPoint;
    }

    override updateGraphicsToHovered(): void {
        this.viewElement.setStroke(COLOR.lightBlack);
    }

    override updateGraphicsToDefault(): void {
        this.viewElement.setStroke(COLOR.black);
    }

    override updateView() {
        this.viewElement.endpoint0 = this.endPoint0;
        this.viewElement.endpoint1 = this.endPoint1;
        this.viewElement.intermediatePoint0 = this.intermediatePoint0;
        this.viewElement.intermediatePoint1 = this.intermediatePoint1;
        this.viewElement.update();

        this.intermediatePoint0.updateView();
        this.intermediatePoint1.updateView();
    }

    override removeElement(): void {
        this.intermediatePoint0.removeElement();
        this.intermediatePoint1.removeElement();
        super.removeElement();
    }
}

