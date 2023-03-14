import { ControlManager } from "controller/event-controller";
import { Selectable } from "selection-manager/selectable";
import { ElementWrapper } from "util/svg-wrapper";
import { ControlPoint } from "./elements/control-point";
import { SplineSegment } from "./elements/spline-segment";

export abstract class DrawingElement<T extends ElementWrapper<SVGElement> = ElementWrapper<SVGElement>> implements Selectable {
    constructor(
        protected readonly element: T
    ) {
        element.addEvent('mouseenter', () => this.updateGraphicsToHovered());
        element.addEvent('mouseleave', () => this.updateGraphicsToUnhovered());
    }

    abstract updateGraphicsToHovered(): void;
    abstract updateGraphicsToUnhovered(): void;
    abstract drag(dx: number, dy: number): void;

    protected addOnMouseDown(callback: (event: MouseEvent) => void) {
        this.element.addEvent('mousedown', callback);
    }

    getElement(): T {
        return this.element;
    }
}

export class ElementFactory {
    constructor(private readonly controlManager: ControlManager) { }

    createControlPoint(x: number, y: number): DrawingElement {
        const elem = new ControlPoint(x, y);
        this.controlManager.registerControlPointClick(elem);
        return elem;
    }

    createSplineSegment(
        p0: ControlPoint | null,
        p1: ControlPoint,
        p2: ControlPoint,
        p3: ControlPoint | null
    ): DrawingElement {
        const elem = new SplineSegment(p0, p1, p2, p3);
        this.controlManager.registerSegmentClick(elem);
        return elem;
    }

}