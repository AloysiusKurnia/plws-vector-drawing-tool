import { DrawingElement } from "controllers/element";
import { Pointlike } from "util/utility-types";
import { IntermediatePointView } from "views/component/intermediate-point-view";
import { IntermediatePointGroup } from "views/groups/intermediate-point-group";
import { EndPoint } from "./end-point";
import { SplineSegment } from "./spline-segment";

export class IntermediatePoint extends DrawingElement<IntermediatePointView> implements Pointlike {
    public x = 0;
    public y = 0;
    constructor(
        public readonly endPoint: EndPoint,
        public readonly owner: SplineSegment,
        group: IntermediatePointGroup,
    ) {
        super(new IntermediatePointView(group));
        endPoint.addIntermediatePoint(this);
        this.updateGraphicsToDefault();
    }

    updateGraphicsToHovered(): void {
        this.updateGraphicsToHovered();
    }

    copyFrom(point: Pointlike): void {
        this.x = point.x;
        this.y = point.y;
    }

    updateGraphicsToDefault(): void {
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