import { COLOR, DIMENSION } from "constants/settings";
import { DrawingElement } from "models/element";
import { UseWrapper } from "util/svg-wrapper";
import { Pointlike } from "util/utility-types";
import { EndPointGroup } from "views/groups/end-point-group";
import { EndPointView } from "views/end-point-view";

export class EndPoint extends DrawingElement<UseWrapper> implements Pointlike {
    constructor(
        public x: number, public y: number,
        group: EndPointGroup,
    ) {
        super(new EndPointView(group));
        this.updateGraphicsToDefault();
    }

    updateGraphicsToHovered(): void {
        this.viewElement.setFill(COLOR.endPointHover);
        this.viewElement.setStroke(COLOR.lightBlack, 1);
    }

    copyFrom(point: Pointlike): void {
        this.x = point.x;
        this.y = point.y;
    }

    updateGraphicsToDefault(): void {
        this.viewElement.setFill(COLOR.endPoint);
        this.viewElement.setStroke(COLOR.black, DIMENSION.endPointStrokeWidth);
    }

    updateView(): void {
        this.viewElement.setPosition(this.x, this.y);
    }
}