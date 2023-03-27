import { COLOR } from "constants/settings";
import { DrawingElement } from "controllers/element";
import { Pointlike } from "util/utility-types";
import { EndPointView } from "views/component/end-point-view";
import { EndPointGroup } from "views/groups/end-point-group";
import { IntermediatePoint } from "./intermediate-point";

/**
 * An end point of a spline segment. In other words, the first and last points
 * of a cubic Bezier curve.
 */
export class EndPoint extends DrawingElement<EndPointView> implements Pointlike {
    private connectedIntermediatePoints = new Set<IntermediatePoint>();
    private selected = false;
    /**
     * Creates a new end point.
     * @param x The x coordinate of the end point.
     * @param y The y coordinate of the end point.
     * @param group The group that contains the end point.
     */
    constructor(
        public x: number, public y: number,
        group: EndPointGroup,
    ) {
        super(new EndPointView(group));
        this.updateGraphicsToDefault();
    }

    /**
     * Copies the coordinates of the given pointlike object to this end point.
     * @param point The pointlike object to copy from.
     */
    copyFrom(point: Pointlike): void {
        this.x = point.x;
        this.y = point.y;
    }

    override updateGraphicsToHovered(): void {
        if (this.selected) return;
        this.viewElement.setFill(COLOR.endPointHover);
        this.viewElement.setStroke(COLOR.lightBlack);
    }

    override updateGraphicsToDefault(): void {
        if (this.selected) return;
        this.viewElement.setFill(COLOR.endPoint);
        this.viewElement.setStroke(COLOR.black);
    }

    // TODO: Abstract this out into a superclass.
    makeSelected(): void {
        this.selected = true;
        this.viewElement.setFill(COLOR.endPointSelected);
        this.viewElement.setStroke(COLOR.endPointSelectedStroke);
    }

    // TODO: This too.
    makeDeslected(): void {
        this.selected = false;
        this.updateGraphicsToDefault();
    }

    override updateView(): void {
        this.viewElement.setPosition(this.x, this.y);
    }

    /**
     * Registers an intermediate point as connected to this end point.
     * @param intermediatePoint The intermediate point to register.
     */
    addIntermediatePoint(intermediatePoint: IntermediatePoint): void {
        this.connectedIntermediatePoints.add(intermediatePoint);
    }

    /**
     * Unregisters an intermediate point as connected to this end point.
     * @param intermediatePoint The intermediate point to unregister.
     */
    removeIntermediatePoint(intermediatePoint: IntermediatePoint): void {
        this.connectedIntermediatePoints.delete(intermediatePoint);
    }

    /**
     * Returns an iterator over the intermediate points connected to this end
     * point.
     * @yields The intermediate points connected to this end point.
     */
    * getIntermediatePoints() {
        yield* this.connectedIntermediatePoints;
    }
}