function createSVGFromTag<T extends keyof SVGElementTagNameMap>(tag: T): SVGElementTagNameMap[T] {
    return document.createElementNS("http://www.w3.org/2000/svg", tag);
}

export abstract class ElementWrapper<E extends SVGElement> {
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

    addEvent<T extends keyof SVGElementEventMap>(
        eventName: T,
        listener: (ev: SVGElementEventMap[T]) => void
    ) {
        this.element.addEventListener(eventName, listener);
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
    constructor(x = 0, y = 0, r = 0) {
        super(createSVGFromTag("circle"));
        this.setCenter(x, y);
        this.setRadius(r);
    }

    setCenter(x: number, y: number) {
        this.setAttribute("cx", x.toString());
        this.setAttribute("cy", y.toString());
    }

    setRadius(r: number) {
        this.setAttribute("r", r.toString());
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