import { CircleWrapper, SVGWrapper } from "util/svg";
import { Element } from "../element";

const RED = '#FF0000';
const BRIGHT_RED = '#FFAAAA';
const BLACK = 'black';
const BRIGHT_BLACK = '#AAAAAA';

export class ControlPoint extends Element<CircleWrapper> {
    constructor(private x: number, private y: number) {
        super(new CircleWrapper());
        this.element.setFill(RED);
        this.element.setStroke(BLACK, 1);
        this.element.setCenter(x, y);
    }

    updateGraphicsToSelected(): void {
        this.element.setFill(BRIGHT_RED);
        this.element.setStroke(BRIGHT_BLACK, 1);
    }

    getCoordinate(): [number, number] {
        return [this.x, this.y];
    }

    getCoordinateReflectedTo(pivot: ControlPoint): [number, number] {
        return [2 * pivot.x - this.x, 2 * pivot.y - this.y];
    }

    updateGraphicsToDeselected(): void {
        this.element.setFill(RED);
        this.element.setStroke(BLACK, 1);
    }

    drag(dx: number, dy: number): void {
        this.x += dx;
        this.y += dy;
        this.element.setCenter(this.x, this.y);
    }
}