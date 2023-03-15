import { Selectable } from "selection-manager/selectable";
import { ElementWrapper } from "util/svg-wrapper";

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
