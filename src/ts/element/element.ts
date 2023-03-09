import { Selectable } from "selection-manager/selectable";
import { SVGWrapper } from "util/svg";

export abstract class Element<T extends SVGWrapper<SVGElement>> implements Selectable {
    constructor(protected readonly element: T) {
        element.addEvent('mouseenter', () => this.updateGraphicsToSelected());
        element.addEvent('mouseleave', () => this.updateGraphicsToDeselected());
    }

    abstract updateGraphicsToSelected(): void;
    abstract updateGraphicsToDeselected(): void;
    abstract drag(dx: number, dy: number): void;
}