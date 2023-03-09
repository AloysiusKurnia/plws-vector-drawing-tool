function createSVGFromTag<T extends keyof SVGElementTagNameMap>(tag: T): SVGElementTagNameMap[T] {
    return document.createElementNS("http://www.w3.org/2000/svg", tag);
}

export abstract class SVGWrapper<E extends SVGElement> {
    constructor(private element: E) { }

    appendTo(parent: SVGWrapper<SVGElement>) {
        parent.element.appendChild(this.element);
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

export class SVGGroup extends SVGWrapper<SVGGElement> {
    constructor() {
        super(createSVGFromTag("g"));
    }
}

export class CircleWrapper extends SVGWrapper<SVGCircleElement> {
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

export class PathWrapper extends SVGWrapper<SVGPathElement> {
    constructor() {
        super(createSVGFromTag("path"));
    }

    setD(d: string) {
        this.setAttribute("d", d);
    }
}

export class BezierWrapper extends PathWrapper {
    constructor(
        private endpoint0: [number, number],
        private controlPoint0: [number, number],
        private controlPoint1: [number, number],
        private endpoint1: [number, number]
    ) {
        super();
        this.update();
    }

    update() {
        this.setD(
            `M ${this.endpoint0[0]} ${this.endpoint0[1]}
            C ${this.controlPoint0[0]} ${this.controlPoint0[1]}
              ${this.controlPoint1[0]} ${this.controlPoint1[1]}
              ${this.endpoint1[0]} ${this.endpoint1[1]}`
        );
    }

    setEndpoint0(x: number, y: number) {
        this.endpoint0 = [x, y];
    }

    setControlPoint0(x: number, y: number) {
        this.controlPoint0 = [x, y];
    }

    setControlPoint1(x: number, y: number) {
        this.controlPoint1 = [x, y];
    }

    setEndpoint1(x: number, y: number) {
        this.endpoint1 = [x, y];
    }
}