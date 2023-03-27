import { ElementWrapper } from "util/svg-wrapper";

/**
 * The controller for a drawing element.
 * @template T
 * The type of the view element that this controller control. This view element
 * must be a subclass of ElementWrapper.
 */
export abstract class DrawingElement<T extends ElementWrapper = ElementWrapper> {
    /**
     * Creates a new drawing element.
     * @param viewElement The view element that this controller control.
     */
    constructor(
        protected readonly viewElement: T
    ) {
        viewElement.addEvent('mouseenter', () => this.updateGraphicsToHovered());
        viewElement.addEvent('mouseleave', () => this.updateGraphicsToDefault());
    }

    /** Updates the graphics of the view element to the hovered state. */
    abstract updateGraphicsToHovered(): void;
    /** Updates the graphics of the view element to the default state. */
    abstract updateGraphicsToDefault(): void;
    /** Updates the view element. */
    abstract updateView(): void;

    /**
     * Adds a callback to the mouse down event of the view element.
     * @param callback The callback to add.
     */
    protected addOnMouseDown(callback: (event: MouseEvent) => void) {
        this.viewElement.addEvent('mousedown', callback);
    }

    /** Returns the view element. */
    getElement(): T {
        return this.viewElement;
    }

    /** Removes the view element from the DOM. */
    removeElement() {
        this.viewElement.destroy();
    }

    /** Makes the view element tangible (interactable with the mouse). */
    makeTangible() {
        this.viewElement.makeTangible();
    }

    /** Makes the view element intangible (not interactable with the mouse). */
    makeIntangible() {
        this.viewElement.makeIntangible();
    }

    /** Hides the view element. */
    makeHidden() {
        this.viewElement.makeHidden();
    }

    /** Shows the view element. */
    makeShown() {
        this.viewElement.makeShown();
    }
}
