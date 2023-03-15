import { CircleWrapper } from "util/svg-wrapper";
import { DrawingElement } from "../element";

const RED = '#FF0000';
const YELLOW = '#FFFF00';
const BLACK = 'black';
const BRIGHT_BLACK = '#AAAAAA';

export class ControlPoint extends DrawingElement<CircleWrapper> {
    constructor(private x: number, private y: number) {
        super(new CircleWrapper());
        this.element.setFill(RED);
        this.element.setStroke(BLACK, 1);
        this.element.setRadius(5);
        this.element.setCenter(x, y);
    }

    updateGraphicsToHovered(): void {
        this.element.setFill(YELLOW);
        this.element.setStroke(BRIGHT_BLACK, 1);
    }

    getCoordinate(): [number, number] {
        return [this.x, this.y];
    }

    getCoordinateReflectedTo(pivot: ControlPoint): [number, number] {
        return [2 * pivot.x - this.x, 2 * pivot.y - this.y];
    }

    updateGraphicsToUnhovered(): void {
        this.element.setFill(RED);
        this.element.setStroke(BLACK, 1);
    }

    drag(dx: number, dy: number): void {
        this.x += dx;
        this.y += dy;
        this.element.setCenter(this.x, this.y);
    }
}