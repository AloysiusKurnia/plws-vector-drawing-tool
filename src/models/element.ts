import { ElementWrapper } from "util/svg-wrapper";

export abstract class DrawingElement<T extends ElementWrapper = ElementWrapper> {
    constructor(
        protected readonly viewElement: T
    ) {
        viewElement.addEvent('mouseenter', () => this.updateGraphicsToHovered());
        viewElement.addEvent('mouseleave', () => this.updateGraphicsToDefault());
    }

    abstract updateGraphicsToHovered(): void;
    abstract updateGraphicsToDefault(): void;
    abstract updateView(): void;

    protected addOnMouseDown(callback: (event: MouseEvent) => void) {
        this.viewElement.addEvent('mousedown', callback);
    }

    getElement(): T {
        return this.viewElement;
    }

    removeElement() {
        this.viewElement.destroy();
    }

    makeTangible() {
        this.viewElement.makeTangible();
    }

    makeIntangible() {
        this.viewElement.makeIntangible();
    }

    makeHidden() {
        this.viewElement.makeHidden();
    }

    makeShown() {
        this.viewElement.makeShown();
    }
}
