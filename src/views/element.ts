import { ElementWrapper } from "util/svg-wrapper";

export abstract class DrawingElement<T extends ElementWrapper<SVGElement> = ElementWrapper<SVGElement>> {
    constructor(
        protected readonly element: T
    ) {
        element.addEvent('mouseenter', () => this.updateGraphicsToHovered());
        element.addEvent('mouseleave', () => this.updateGraphicsToDefault());
    }

    abstract updateGraphicsToHovered(): void;
    abstract updateGraphicsToDefault(): void;
    abstract updateTransform(): void;

    protected addOnMouseDown(callback: (event: MouseEvent) => void) {
        this.element.addEvent('mousedown', callback);
    }

    getElement(): T {
        return this.element;
    }

    remove() {
        this.element.remove();
    }

    makeIntangible(): void {
        this.element.style.pointerEvents = 'none';
    }

    makeTangible(): void {
        this.element.style.pointerEvents = 'auto';
    }
}
