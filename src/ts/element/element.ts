import { EventManager } from "observer/event-manager";
import { Selectable } from "selection-manager/selectable";
import { SVGWrapper } from "util/wrapper";
import { ControlPoint } from "./elements/control-point";

export abstract class DrawingElement<T extends SVGWrapper<SVGElement> = SVGWrapper<SVGElement>> implements Selectable {
    constructor(
        protected readonly element: T
    ) {
        element.addEvent('mouseenter', () => this.updateGraphicsToHovered());
        element.addEvent('mouseleave', () => this.updateGraphicsToUnhovered());
    }

    abstract updateGraphicsToHovered(): void;
    abstract updateGraphicsToUnhovered(): void;
    abstract drag(dx: number, dy: number): void;

    abstract registerEventManager(eventManager: EventManager): void;

    protected addOnMouseDown(callback: (event: MouseEvent) => void) {
        this.element.addEvent('mousedown', callback);
    }
}

export class ElementFactory {
    constructor(private readonly eventManager: EventManager) {}

    createControlPoint(x: number, y: number): DrawingElement {
        const elem = new ControlPoint(x, y);
        elem.registerEventManager(this.eventManager);
        return elem;
    }

}