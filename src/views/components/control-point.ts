import { COLOR, DIMENSION, ID } from "constants/settings";
import { CircleWrapper, DefsWrapper, UseWrapper } from "util/svg-wrapper";
import { DrawingElement } from "../element";

export class ControlPoint extends DrawingElement<UseWrapper> {
    constructor(private x: number, private y: number, private defs: DefsWrapper) {
        super(defs.use(ID.controlPoint));
        this.updateGraphicsToDefault();
        this.updateTransform();
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
        this.element.setAttribute('x', `${this.x}`);
        this.element.setAttribute('y', `${this.y}`);
    }

    moveTo(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }
}