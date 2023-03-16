import { DrawingElement } from "views/element";
import { BezierWrapper } from "util/svg-wrapper";
import { Pair, Quadruple } from "util/utility-types";
import { ControlPoint } from "./control-point";

const DARK_YELLOW = '#AAAA00';
const BLACK = 'black';
const NO_FILL = 'none';

function getLengthFactor(x1: number, y1: number, x2: number, y2: number) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    // return 1                                 // Use for uniform CR splines
    // return Math.sqrt(Math.hypot(dx, dy));    // Use for centripetal CR splines
    return Math.hypot(dx, dy);               // Use for chordal CR splines
}

export class SplineSegment extends DrawingElement<BezierWrapper> {
    constructor(
        private p0: ControlPoint | null,
        private p1: ControlPoint,
        private p2: ControlPoint,
        private p3: ControlPoint | null
    ) {
        super(new BezierWrapper());
        this.element.setFill(NO_FILL);
        this.element.setStroke(BLACK, 1);
    }

    updateGraphicsToHovered(): void {
        this.element.setStroke(DARK_YELLOW, 1);
    }

    updateGraphicsToDefault(): void {
        this.element.setStroke(BLACK, 1);
    }

    setNextPoint(point: ControlPoint | null) {
        this.p3 = point;
    }

    private getControlPointCoordinates(): Quadruple<Pair<number>> {
        return [
            this.p0 ? this.p0.getCoordinate() : this.p2.getCoordinateReflectedTo(this.p1),
            this.p1.getCoordinate(),
            this.p2.getCoordinate(),
            this.p3 ? this.p3.getCoordinate() : this.p1.getCoordinateReflectedTo(this.p2)
        ];
    }

    getPoints() {
        const out = [this.p1, this.p2];
        if (this.p0) out.unshift(this.p0);
        if (this.p3) out.push(this.p3);

        return out;
    }

    update() {
        const [
            [x0, y0],
            [x1, y1],
            [x2, y2],
            [x3, y3]
        ] = this.getControlPointCoordinates();

        // Calculate Bezier curve control points given four points
        // according to centripetal Catmull-Rom splines

        const l0 = getLengthFactor(x0, y0, x1, y1);
        const l1 = getLengthFactor(x1, y1, x2, y2);
        const l2 = getLengthFactor(x2, y2, x3, y3);
        const l01 = l0 + l1;
        const l12 = l1 + l2;

        const a0 = -l1 * l1 / (l01 * l0);
        const a1 = (l1 - l0) / l0 + 3;
        const a2 = l0 / l01;

        const b0 = -l1 * l1 / (l12 * l2);
        const b1 = (l1 - l2) / l2 + 3;
        const b2 = l2 / l12;

        const z0x = (x0 * a0 + x1 * a1 + x2 * a2) / 3;
        const z0y = (y0 * a0 + y1 * a1 + y2 * a2) / 3;
        const z1x = (x3 * b0 + x2 * b1 + x1 * b2) / 3;
        const z1y = (y3 * b0 + y2 * b1 + y1 * b2) / 3;

        this.element.setEndpoint0(x1, y1);
        this.element.setEndpoint1(x2, y2);
        this.element.setControlPoint0(z0x, z0y);
        this.element.setControlPoint1(z1x, z1y);
        this.element.update();
    }

    updateTransform(): void {
        this.update();
    }
}