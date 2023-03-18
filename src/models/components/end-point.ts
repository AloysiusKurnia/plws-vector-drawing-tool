import { COLOR, DIMENSION } from "constants/settings";
import { DrawingElement } from "models/element";
import { UseWrapper } from "util/svg-wrapper";
import { EndPointView } from "views/end-point-view";

export class EndPoint extends DrawingElement<UseWrapper> {
    constructor(private x: number, private y: number, element: EndPointView) {
        console.log(`Creating control point at (${x}, ${y})`);

        super(element);
        this.updateGraphicsToDefault();
    }

    updateGraphicsToHovered(): void {
        this.element.setFill(COLOR.pointHover);
        this.element.setStroke(COLOR.lightBlack, 1);
    }

    getCoordinate(): [number, number] {
        return [this.x, this.y];
    }

    getCoordinateReflectedTo(pivot: EndPoint): [number, number] {
        return [2 * pivot.x - this.x, 2 * pivot.y - this.y];
    }

    updateGraphicsToDefault(): void {
        this.element.setFill(COLOR.point);
        this.element.setStroke(COLOR.black, DIMENSION.defaultPointStrokeWidth);
    }

    updateTransform(): void {
        this.element.setPosition(this.x, this.y);
    }

    moveTo(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }
}