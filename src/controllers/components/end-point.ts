import { COLOR } from "constants/settings";
import { DrawingElement } from "controllers/element";
import { UseWrapper } from "util/svg-wrapper";
import { Pointlike } from "util/utility-types";
import { EndPointView } from "views/component/end-point-view";
import { EndPointGroup } from "views/groups/end-point-group";

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
}