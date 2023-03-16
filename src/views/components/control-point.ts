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

    move(dx: number, dy: number): void {
        this.x += dx;
        this.y += dy;
    }

    makeIntangible(): void {
        this.element.style.pointerEvents = 'none';
        this.element.style.opacity = '0.5';
    }

    makeTangible(): void {
        this.element.style.pointerEvents = 'auto';
        this.element.style.opacity = '1';
    }
}