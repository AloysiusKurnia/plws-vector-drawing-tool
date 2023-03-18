import { ElementWrapper } from "util/svg-wrapper";

export abstract class DrawingElement<T extends ElementWrapper = ElementWrapper> {
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

    makeTangible() {
        this.element.makeTangible();
    }

    makeIntangible() {
        this.element.makeIntangible();
    }

    hide() {
        this.element.hide();
    }

    show() {
        this.element.show();
    }
}
