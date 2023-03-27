import { Pointlike } from "./utility-types";

/**
 * Creates a new SVG element of the given tag name.
 */
function createSVGFromTag<T extends keyof SVGElementTagNameMap>(
    tag: T
): SVGElementTagNameMap[T] {
    return document.createElementNS("http://www.w3.org/2000/svg", tag);
}

const NONE = "none";

/** 
 * A wrapper around an SVG element that provides a more convenient API.
 */
export abstract class ElementWrapper<E extends SVGElement = SVGElement> {
    /**
     * Creates a new wrapper around the given element.
     * @param wrappedElement The element to be wrapped.
     */
    constructor(private wrappedElement: E) { }

    /**
     * Appends this element to the given parent wrapper.
     * @param parent
     * The wrapper whose element will be the parent of this element.
     */
    appendTo(parent: ElementWrapper<SVGElement>) {
        this.appendToElement(parent.wrappedElement);
    }

    /**
     * Appends this element to the given parent element.
     * @param parent The parent element to be appended this element to.
     */
    appendToElement(parent: SVGElement | HTMLElement) {
        parent.appendChild(this.wrappedElement);
    }

    /**
     * Removes this element from the DOM.
     */
    destroy() {
        this.wrappedElement.remove();
    }

    /**
     * Sets the value of the given attribute.
     * @param name The name of the attribute.
     * @param value The value of the attribute.
     */
    setAttribute(name: string, value: string) {
        this.wrappedElement.setAttribute(name, value);
    }

    /**
     * Sets the ID of this element.
     * @param id The new ID of this element.
     */
    setID(id: string) {
        this.wrappedElement.id = id;
    }

    /**
     * Sets the stroke color and optionally the stroke width.
     * @param color The new stroke color.
     * @param width
     * The new stroke width. If omitted, the stroke width is not changed.
     */
    setStroke(color: string, width: number | null = null) {
        this.setAttribute("stroke", color);
        if (width !== null)
            this.setAttribute("stroke-width", `${width}`);
    }

    /**
     * Sets the fill color.
     * @param color The new fill color.
     */
    setFill(color: string) {
        this.setAttribute("fill", color);
    }

    /**
     * Returns the bounding box of this element.
     */
    getBoundingBox() {
        return this.wrappedElement.getBoundingClientRect();
    }

    /**
     * The style object of this element.
     */
    get style() {
        return this.wrappedElement.style;
    }

    /**
     * Adds an event listener to this element.
     * @param eventName The name of the event to listen for.
     * @param listener The listener function. Should return void.
     */
    addEvent<T extends keyof SVGElementEventMap>(
        eventName: T,
        listener: (ev: SVGElementEventMap[T]) => void
    ) {
        this.wrappedElement.addEventListener(eventName, listener);
    }

    /**
     * Makes this element invisible to pointer events.
     */
    makeIntangible(): void {
        this.style.pointerEvents = NONE;
    }

    /**
     * Makes this element visible to pointer events.
     */
    makeTangible(): void {
        this.style.pointerEvents = 'auto';
    }

    /**
     * Makes this element invisible (by setting its display to "none").
     */
    makeHidden(): void {
        this.style.display = NONE;
    }

    /**
     * Makes this element visible.
     */
    makeShown(): void {
        this.style.display = 'block';
    }
}

/**
 * A wrapper around an SVG <use> element.
 */
export class UseWrapper extends ElementWrapper<SVGUseElement> {
    /**
     * Creates a new <use> element with the given href.
     * @param href The href of the new <use> element.
     */
    constructor(href: string) {
        super(createSVGFromTag("use"));
        this.setAttribute("href", href);
    }

    /** 
     * Sets the position of this element.
     * @param x The new x coordinate.
     * @param y The new y coordinate.
     */
    setPosition(x: number, y: number) {
        this.setAttribute("x", `${x}`);
        this.setAttribute("y", `${y}`);
    }
}

/**
 * A wrapper around an SVG <rect> element.
 */
export class GroupWrapper extends ElementWrapper<SVGGElement> {
    /** Creates a new <g> element. */
    constructor() {
        super(createSVGFromTag("g"));
    }

    /**
     * Adds the given children to this group.
     * @param children The children to be added.
     */
    add(...children: ElementWrapper<SVGElement>[]) {
        children.forEach(child => child.appendTo(this));
    }
}

/**
 * A wrapper around an SVG <circle> element.
 */
export class CircleWrapper extends ElementWrapper<SVGCircleElement> {
    /** Creates a new <circle> element. */
    constructor() {
        super(createSVGFromTag("circle"));
    }

    /**
     * Sets the center of this circle.
     * @param x The new x coordinate of the center.
     * @param y The new y coordinate of the center.
     */
    setCenter(x: number, y: number) {
        this.setAttribute("cx", `${x}`);
        this.setAttribute("cy", `${y}`);
    }

    /**
     * Sets the radius of this circle.
     * @param r The new radius.
     */
    setRadius(r: number) {
        this.setAttribute("r", `${r}`);
    }
}

/**
 * A wrapper around an SVG <path> element.
 */
export class PathWrapper extends ElementWrapper<SVGPathElement> {
    /** Creates a new <path> element. */
    constructor() {
        super(createSVGFromTag("path"));
    }

    /**
     * Sets the path data of this path.
     * @param d The new path data.
     */
    setD(d: string) {
        this.setAttribute("d", d);
    }
}

/**
 * A specialized wrapper around an SVG <path> element that represents a
 * Bezier curve.
 */
export class BezierWrapper extends PathWrapper {
    private originX = 0;
    private originY = 0;
    private otherPoints = [0, 0, 0, 0, 0, 0];
    /** Creates a new <path> element. */
    constructor() {
        super();
        this.update();
    }

    /** Updates the path data of this path. */
    update() {
        this.setD(
            `M ${this.originX} ${this.originY}C ${this.otherPoints.join(' ')}`
        );
    }

    /**
     * The first endpoint of this curve. Can be assigned from any object that
     * is a Pointlike. Write-only.
     */
    set endpoint0(p: Pointlike) {
        this.originX = p.x;
        this.originY = p.y;
    }

    /**
     * The first intermediate point of this curve. Can be assigned from any
     * object that is a Pointlike. Write-only.
     */
    set intermediatePoint0(p: Pointlike) {
        this.otherPoints[0] = p.x;
        this.otherPoints[1] = p.y;
    }

    /**
     * The second intermediate point of this curve. Can be assigned from any
     * object that is a Pointlike. Write-only.
     */
    set intermediatePoint1(p: Pointlike) {
        this.otherPoints[2] = p.x;
        this.otherPoints[3] = p.y;
    }

    /**
     * The second endpoint of this curve. Can be assigned from any object that
     * is a Pointlike. Write-only.
     */
    set endpoint1(p: Pointlike) {
        this.otherPoints[4] = p.x;
        this.otherPoints[5] = p.y;
    }
}

/**
 * A specialized wrapper around an SVG <path> element that represents a
 * line.
 */
export class LineWrapper extends PathWrapper {
    /** The x coordinate of the first endpoint of this line. */
    public x1: number;
    /** The y coordinate of the first endpoint of this line. */
    public y1: number;
    /** The x coordinate of the second endpoint of this line. */
    public x2: number;
    /** The y coordinate of the second endpoint of this line. */
    public y2: number;
    /** Creates a new <path> element. */
    constructor() {
        super();
        this.update();
    }

    /** Updates the path data of this path. */
    update() {
        this.setD(
            `M ${this.x1} ${this.y1}L ${this.x2} ${this.y2}`
        );
    }

    /**
     * The first endpoint of this line. Can be assigned from any object that
     * is a Pointlike. Write-only.
     */
    set point0(p: Pointlike) {
        this.x1 = p.x;
        this.y1 = p.y;
    }

    /**
     * The second endpoint of this line. Can be assigned from any object that
     * is a Pointlike. Write-only.
     */
    set point1(p: Pointlike) {
        this.x2 = p.x;
        this.y2 = p.y;
    }
}

/**
 * The wrapper of the <svg> element.
 */
export class SVGWrapper extends ElementWrapper<SVGSVGElement> {
    /** Creates a new <svg> element. */
    constructor() {
        super(createSVGFromTag("svg"));
    }

    /**
     * Sets the viewBox of this SVG.
     * @param x The x coordinate of the top left corner of the viewBox.
     * @param y The y coordinate of the top left corner of the viewBox.
     * @param width The width of the viewBox.
     * @param height The height of the viewBox.
     */
    setViewBox(x: number, y: number, width: number, height: number) {
        this.setAttribute("viewBox", `${x} ${y} ${width} ${height}`);
    }
}

/**
 * A wrapper around an SVG <defs> element.
 */
export class DefsWrapper extends ElementWrapper<SVGDefsElement> {
    /** Creates a new <defs> element. */
    constructor() {
        super(createSVGFromTag("defs"));
    }

    /**
     * Adds the given element to this defs.
     * @param elem The element to be added.
     * @param id The id of the element.
     */
    add(elem: ElementWrapper<SVGElement>, id: string) {
        elem.appendTo(this);
        elem.setAttribute("id", id);
    }

    /**
     * Returns a new UseWrapper that references the element with the given id.
     * @param id The id of the element to be referenced.
     */
    use(id: string) {
        return new UseWrapper(`#${id}`);
    }
}