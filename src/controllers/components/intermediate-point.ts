import { DrawingElement } from "controllers/element";
import { Pointlike } from "util/utility-types";
import { IntermediatePointView } from "views/component/intermediate-point-view";
import { IntermediatePointGroup } from "views/groups/intermediate-point-group";
import { EndPoint } from "./end-point";
import { SplineSegment } from "./spline-segment";

export class IntermediatePoint extends DrawingElement<IntermediatePointView> implements Pointlike {
    public x = 0;
    public y = 0;
    private endPoint_: EndPoint;
    private selected = false;
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

    get endPoint(): EndPoint { return this.endPoint_; }
    
    set endPoint(newEndPoint: EndPoint) {
        this.endPoint_.removeIntermediatePoint(this);
        newEndPoint.addIntermediatePoint(this);
        this.endPoint_ = newEndPoint;
    }

    makeSelected(): void {
        this.viewElement.graphicsToSelected();
        this.selected = true;
    }

    makeDeslected(): void {
        this.selected = false;
        this.viewElement.graphicsToDefault();
    }

    updateGraphicsToHovered(): void {
        if (this.selected) return;
        this.viewElement.graphicsToHovered();
    }

    copyFrom(point: Pointlike): void {
        this.x = point.x;
        this.y = point.y;
    }

    updateGraphicsToDefault(): void {
        if (this.selected) return;
        this.viewElement.graphicsToDefault()
    }

    updateView(): void {
        this.viewElement.movePointTo(this);
        this.viewElement.moveOriginTo(this.endPoint);
    }

    override removeElement(): void {
        this.endPoint.removeIntermediatePoint(this);
        super.removeElement();
    }
}