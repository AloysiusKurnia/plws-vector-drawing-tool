import { COLOR, DIMENSION } from "constants/settings";
import { CircleWrapper } from "util/svg-wrapper";
import { DrawingElement } from "../element";

export class ControlPoint extends DrawingElement<CircleWrapper> {
    constructor(private x: number, private y: number) {
        super(new CircleWrapper());
        this.updateGraphicsToDefault();
        this.element.setRadius(DIMENSION.defaultPointRadius);
        this.element.setCenter(x, y);
    }

    updateGraphicsToHovered(): void {
        this.element.setFill(COLOR.pointHover);
        this.element.setStroke(COLOR.lightBlack, 1);
    }

    getCoordinate(): [number, number] {
        return [this.x, this.y];
    }

    getCoordinateReflectedTo(pivot: ControlPoint): [number, number] {
        return [2 * pivot.x - this.x, 2 * pivot.y - this.y];
    }

    updateGraphicsToDefault(): void {
        this.element.setFill(COLOR.point);
        this.element.setStroke(COLOR.black, DIMENSION.defaultPointStrokeWidth);
    }

    updateTransform(): void {
        this.element.setCenter(this.x, this.y);
    }

    moveTo(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }
}