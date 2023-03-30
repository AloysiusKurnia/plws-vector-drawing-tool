import { DrawingElement } from "controllers/element";
import { Pointlike } from "util/utility-types";
import { IntermediatePointView } from "views/component/intermediate-point-view";
import { IntermediatePointGroup } from "views/groups/intermediate-point-group";
import { EndPoint } from "./end-point";
import { SplineSegment } from "./spline-segment";

/**
 * An intermediate point of a spline segment. In other words, the second and
 * third points of a cubic Bezier curve.
 */
export class IntermediatePoint
    extends DrawingElement<IntermediatePointView> implements Pointlike {

    /** @implements {Pointlike.x} */
    public x = 0;
    /** @implements {Pointlike.y} */
    public y = 0;
    private endPoint_: EndPoint;
    private selected = false;
    /** Another intermediate point that is colinear with this one. */
    public couple: IntermediatePoint | null = null;
    /**
     * Creates a new intermediate point.
     * @param endPoint The end point that the intermediate point is attached to.
     * @param owner The spline segment that the intermediate point is part of.
     * @param group The group that contains the intermediate point.
     */
    constructor(
        endPoint: EndPoint,
        public readonly owner: SplineSegment,
        group: IntermediatePointGroup,
    ) {
        super(new IntermediatePointView(group));
        this.endPoint_ = endPoint;
        endPoint.addIntermediatePoint(this);
        this.updateGraphicsToDefault();
    }

    /** The end point that the intermediate point is attached to. Mutable. */
    get endPoint(): EndPoint { return this.endPoint_; }
    set endPoint(newEndPoint: EndPoint) {
        this.endPoint_.removeIntermediatePoint(this);
        newEndPoint.addIntermediatePoint(this);
        this.endPoint_ = newEndPoint;
    }

    /** Selects the intermediate point. */
    makeSelected(asCouple = false): void {
        this.selected = true;
        if (asCouple) {
            this.viewElement.graphicsToCoupled();
        } else {
            this.viewElement.graphicsToSelected();
        }
    }

    /** Deselects the intermediate point. */
    makeDeslected(): void {
        this.selected = false;
        this.viewElement.graphicsToDefault();
    }

    /**
     * Copies the coordinates of this point from another pointlike object.
     * @param point The pointlike object to copy from.
     */
    copyFrom(point: Pointlike): void {
        this.x = point.x;
        this.y = point.y;
    }

    /** Returns the distance from this point to the end point. */
    getDistanceToEndpoint(): number {
        return Math.hypot(this.x - this.endPoint.x, this.y - this.endPoint.y);
    }

    /** Returns the angle from this point to the end point. */
    getAngleToEndpoint(): number {
        return Math.atan2(this.y - this.endPoint.y, this.x - this.endPoint.x);
    }

    override updateGraphicsToHovered(): void {
        if (this.selected) return;
        this.viewElement.graphicsToHovered();
    }

    override updateGraphicsToDefault(): void {
        if (this.selected) return;
        this.viewElement.graphicsToDefault();
    }

    override updateView(): void {
        this.viewElement.movePointTo(this);
        this.viewElement.moveOriginTo(this.endPoint);
    }

    override removeElement(): void {
        this.endPoint.removeIntermediatePoint(this);
        super.removeElement();
    }
}