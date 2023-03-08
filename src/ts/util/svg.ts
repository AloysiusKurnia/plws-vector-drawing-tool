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

    setStroke(color: string, width: number) {
        this.setAttribute("stroke", color);
        this.setAttribute("stroke-width", `${width}`);
    }

    setFill(color: string) {
        this.setAttribute("fill", color);
    }

    getBoundingBox() {
        return this.element.getBoundingClientRect();
    }
}

export class SVGGroup extends SVGWrapper<SVGGElement> {
    constructor() {
        super(createSVGFromTag("g"));
    }
}

export class CircleWrapper extends SVGWrapper<SVGCircleElement> {
    constructor() {
        super(createSVGFromTag("circle"));
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