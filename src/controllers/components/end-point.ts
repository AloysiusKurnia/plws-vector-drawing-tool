import { COLOR } from "constants/settings";
import { DrawingElement } from "controllers/element";
import { Pointlike } from "util/utility-types";
import { EndPointView } from "views/component/end-point-view";
import { EndPointGroup } from "views/groups/end-point-group";
import { IntermediatePoint } from "./intermediate-point";

export class EndPoint extends DrawingElement<EndPointView> implements Pointlike {
    private connectedIntermediatePoints = new Set<IntermediatePoint>();

    constructor(
        public x: number, public y: number,
        group: EndPointGroup,
    ) {
        super(new EndPointView(group));
        this.updateGraphicsToDefault();
    }

    updateGraphicsToHovered(): void {
        this.viewElement.setFill(COLOR.endPointHover);
        this.viewElement.setStroke(COLOR.lightBlack);
    }

    copyFrom(point: Pointlike): void {
        this.x = point.x;
        this.y = point.y;
    }

    updateGraphicsToDefault(): void {
        this.viewElement.setFill(COLOR.endPoint);
        this.viewElement.setStroke(COLOR.black);
    }

    updateView(): void {
        this.viewElement.setPosition(this.x, this.y);
    }

    addIntermediatePoint(intermediatePoint: IntermediatePoint): void {
        this.connectedIntermediatePoints.add(intermediatePoint);
    }

    removeIntermediatePoint(intermediatePoint: IntermediatePoint): void {
        this.connectedIntermediatePoints.delete(intermediatePoint);
    }

    * getIntermediatePoints() {
        yield* this.connectedIntermediatePoints;
    }
}