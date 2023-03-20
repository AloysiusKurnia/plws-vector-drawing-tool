function createSVGFromTag<T extends keyof SVGElementTagNameMap>(tag: T): SVGElementTagNameMap[T] {
    return document.createElementNS("http://www.w3.org/2000/svg", tag);
}


const NONE = "none";

export abstract class ElementWrapper<E extends SVGElement = SVGElement> {
    constructor(private wrappedElement: E) { }

    appendTo(parent: ElementWrapper<SVGElement>) {
        this.appendToElement(parent.wrappedElement);
    }

    appendToElement(parent: SVGElement | HTMLElement) {
        parent.appendChild(this.wrappedElement);
    }

    destroy() {
        this.wrappedElement.remove();
    }

    setAttribute(name: string, value: string) {
        this.wrappedElement.setAttribute(name, value);
    }

    setID(id: string) {
        this.wrappedElement.id = id;
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
        return this.wrappedElement.getBoundingClientRect();
    }

    get style() {
        return this.wrappedElement.style;
    }

    addEvent<T extends keyof SVGElementEventMap>(
        eventName: T,
        listener: (ev: SVGElementEventMap[T]) => void
    ) {
        this.wrappedElement.addEventListener(eventName, listener);
    }

    makeIntangible(): void {
        this.wrappedElement.style.pointerEvents = NONE;
    }

    makeTangible(): void {
        this.wrappedElement.style.pointerEvents = 'auto';
    }

    makeHidden(): void {
        this.wrappedElement.style.display = NONE;
    }

    makeShown(): void {
        this.wrappedElement.style.display = 'block';
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
            `M ${this.originX} ${this.originY}C ${this.otherPoints.join(' ')}`
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