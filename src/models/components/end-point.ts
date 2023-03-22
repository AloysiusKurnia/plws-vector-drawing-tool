import { COLOR, DIMENSION } from "constants/settings";
import { DrawingElement } from "models/element";
import { UseWrapper } from "util/svg-wrapper";
import { Pointlike } from "util/utility-types";
import { EndPointView } from "views/end-point-view";

export class EndPoint extends DrawingElement<UseWrapper> implements Pointlike {
    constructor(public x: number, public y: number, element: EndPointView) {
        super(element);
        this.updateGraphicsToDefault();
    }

    updateGraphicsToHovered(): void {
        this.viewElement.setFill(COLOR.endPointHover);
        this.viewElement.setStroke(COLOR.lightBlack, 1);
    }

    getCoordinate(): [number, number] {
        return [this.x, this.y];
    }

    getCoordinateReflectedTo(pivot: EndPoint): [number, number] {
        return [2 * pivot.x - this.x, 2 * pivot.y - this.y];
    }

    updateGraphicsToDefault(): void {
        this.viewElement.setFill(COLOR.endPoint);
        this.viewElement.setStroke(COLOR.black, DIMENSION.endPointStrokeWidth);
    }

    updateTransform(): void {
        this.viewElement.setPosition(this.x, this.y);
    }

    moveTo(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }
}