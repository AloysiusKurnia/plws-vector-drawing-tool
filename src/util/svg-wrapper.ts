function createSVGFromTag<T extends keyof SVGElementTagNameMap>(tag: T): SVGElementTagNameMap[T] {
    return document.createElementNS("http://www.w3.org/2000/svg", tag);
}


const NONE = "none";

export abstract class ElementWrapper<E extends SVGElement = SVGElement> {
    constructor(private element: E) { }

    appendTo(parent: ElementWrapper<SVGElement>) {
        this.appendToElement(parent.element);
    }

    appendToElement(parent: SVGElement | HTMLElement) {
        parent.appendChild(this.element);
    }

    remove() {
        this.element.remove();
    }

    setAttribute(name: string, value: string) {
        this.element.setAttribute(name, value);
    }

    setID(id: string) {
        this.element.id = id;
    }

    setStroke(color: string, width: number | null = null) {
        this.setAttribute("stroke", color);
        if (width !== null)
            this.setAttribute("stroke-width", `${width}`);
    }

    setFill(color: string) {
        this.setAttribute("fill", color);
    }

    getBoundingBox() {
        return this.element.getBoundingClientRect();
    }

    get style() {
        return this.element.style;
    }

    addEvent<T extends keyof SVGElementEventMap>(
        eventName: T,
        listener: (ev: SVGElementEventMap[T]) => void
    ) {
        this.element.addEventListener(eventName, listener);
    }

    makeIntangible(): void {
        this.element.style.pointerEvents = NONE;
    }

    makeTangible(): void {
        this.element.style.pointerEvents = 'auto';
    }

    hide(): void {
        this.element.style.display = NONE;
    }

    show(): void {
        this.element.style.display = 'block';
    }
}

export class UseWrapper extends ElementWrapper<SVGUseElement> {
    constructor(href: string) {
        super(createSVGFromTag("use"));
        this.setAttribute("href", href);
    }

    setPosition(x: number, y: number) {
        this.setAttribute("x", `${x}`);
        this.setAttribute("y", `${y}`);
    }
}

export class GroupWrapper extends ElementWrapper<SVGGElement> {
    constructor() {
        super(createSVGFromTag("g"));
    }

    add(...children: ElementWrapper<SVGElement>[]) {
        children.forEach(child => child.appendTo(this));
    }
}

export class CircleWrapper extends ElementWrapper<SVGCircleElement> {
    constructor() {
        super(createSVGFromTag("circle"));
    }

    setCenter(x: number, y: number) {
        this.setAttribute("cx", `${x}`);
        this.setAttribute("cy", `${y}`);
    }

    setRadius(r: number) {
        this.setAttribute("r", `${r}`);
    }
}

export class PathWrapper extends ElementWrapper<SVGPathElement> {
    constructor() {
        super(createSVGFromTag("path"));
    }

    setD(d: string) {
        this.setAttribute("d", d);
    }
}

export class BezierWrapper extends PathWrapper {
    private originX = 0;
    private originY = 0;
    private otherPoints = [0, 0, 0, 0, 0, 0];
    constructor() {
        super();
        this.update();
    }

    update() {
        this.setD(
            `M ${this.originX} ${this.originY}
            C ${this.otherPoints.join(' ')}`
        );
    }

    setEndpoint0(x: number, y: number) {
        this.originX = x;
        this.originY = y;
    }

    setControlPoint0(x: number, y: number) {
        this.otherPoints[0] = x;
        this.otherPoints[1] = y;
    }

    setControlPoint1(x: number, y: number) {
        this.otherPoints[2] = x;
        this.otherPoints[3] = y;
    }

    setEndpoint1(x: number, y: number) {
        this.otherPoints[4] = x;
        this.otherPoints[5] = y;
    }
}

export class SVGWrapper extends ElementWrapper<SVGSVGElement> {
    constructor() {
        super(createSVGFromTag("svg"));
    }

    setViewBox(x: number, y: number, width: number, height: number) {
        this.setAttribute("viewBox", `${x} ${y} ${width} ${height}`);
    }
}

export class DefsWrapper extends ElementWrapper<SVGDefsElement> {
    constructor() {
        super(createSVGFromTag("defs"));
    }

    add(elem: ElementWrapper<SVGElement>, id: string) {
        elem.appendTo(this);
        elem.setAttribute("id", id);
    }

    use(id: string) {
        return new UseWrapper(`#${id}`);
    }
}