import { DrawingElement } from "models/element";
import { BezierWrapper } from "util/svg-wrapper";
import { Pair, Pointlike, Quadruple } from "util/utility-types";
import { EndPoint } from "./end-point";
import { COLOR, DIMENSION } from "constants/settings";
import { SplineSegmentView } from "views/spline-segment-view";

function getLengthFactor(x1: number, y1: number, x2: number, y2: number) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    // return 1                                 // Use for uniform CR splines
    // return Math.sqrt(Math.hypot(dx, dy));    // Use for centripetal CR splines
    return Math.hypot(dx, dy);               // Use for chordal CR splines
}

function averagePointsWeightedToSecond(
    p1: Pointlike,
    p2: Pointlike
): Pointlike {
    return { x: (p1.x + 2 * p2.x) / 3, y: (p1.y + 2 * p2.y) / 3 };
}

function reflectThroughBisector(
    p3: Pointlike,
    p1: Pointlike,
    p2: Pointlike
): Pointlike {
    const vx = p2.x - p1.x;
    const vy = p2.y - p1.y;
    const rx = p3.x - p2.x;
    const ry = p3.y - p2.y;

    const projectionScalar = (rx * vx + ry * vy) / (vx * vx + vy * vy);
    return {
        x: p1.x + rx - 2 * projectionScalar * vx,
        y: p1.y + ry - 2 * projectionScalar * vy
    };
}

function completeCatmullRomControlPoint(
    p0: Pointlike | null,
    p1: Pointlike,
    p2: Pointlike,
    p3: Pointlike | null
): Quadruple<Pointlike> {
    if (p0) {
        return [p0, p1, p2, p3 ?? getMissingCatmullRomControlPoint(p0, p1, p2)];
    }
    return p3 ?
        [getMissingCatmullRomControlPoint(p3, p2, p1), p1, p2, p3] :
        [reflectPoint(p2, p1), p1, p2, reflectPoint(p1, p2)];
}

function reflectPoint(point: Pointlike, pivot: Pointlike): Pointlike {
    return {
        x: 2 * pivot.x - point.x,
        y: 2 * pivot.y - point.y
    };
}

function getMissingCatmullRomControlPoint(
    pOpposite: Pointlike,
    pFar: Pointlike,
    pNear: Pointlike
) {
    return averagePointsWeightedToSecond(
        reflectThroughBisector(pOpposite, pFar, pNear),
        reflectPoint(pFar, pNear)
    );
}

function calculateCatmullRomIntermediatePoints(
    [p0, p1, p2, p3]: Quadruple<Pointlike>
): Pair<Pointlike> {
    const l0 = getLengthFactor(p0.x, p0.y, p1.x, p1.y);
    const l1 = getLengthFactor(p1.x, p1.y, p2.x, p2.y);
    const l2 = getLengthFactor(p2.x, p2.y, p3.x, p3.y);
    const l01 = l0 + l1;
    const l12 = l1 + l2;

    const a0 = -l1 * l1 / (l01 * l0);
    const a1 = (l1 - l0) / l0 + 3;
    const a2 = l0 / l01;

    const b0 = -l1 * l1 / (l12 * l2);
    const b1 = (l1 - l2) / l2 + 3;
    const b2 = l2 / l12;

    const z0x = (p0.x * a0 + p1.x * a1 + p2.x * a2) / 3;
    const z0y = (p0.y * a0 + p1.y * a1 + p2.y * a2) / 3;
    const z1x = (p3.x * b0 + p2.x * b1 + p1.x * b2) / 3;
    const z1y = (p3.y * b0 + p2.y * b1 + p1.y * b2) / 3;

    // return [[z0x, z0y], [z1x, z1y]] as Pair<Pair<number>>;
    return [{ x: z0x, y: z0y }, { x: z1x, y: z1y }];
}

export class SplineSegment extends DrawingElement<BezierWrapper> {
    constructor(
        private p0: EndPoint | null,
        private p1: EndPoint,
        private p2: EndPoint,
        private p3: EndPoint | null,
        element: SplineSegmentView
    ) {
        super(element);
        this.updateGraphicsToDefault();
    }

    updateGraphicsToHovered(): void {
        this.viewElement.setStroke(COLOR.lightBlack, DIMENSION.segmentWidth);
    }

    updateGraphicsToDefault(): void {
        this.viewElement.setStroke(COLOR.black, DIMENSION.segmentWidth);
    }

    setNextPoint(point: EndPoint | null) {
        this.p3 = point;
    }

    setCurrentPoint(point: EndPoint) {
        this.p2 = point;
    }

    getPoints() {
        const out = [this.p1, this.p2];
        if (this.p0) out.unshift(this.p0);
        if (this.p3) out.push(this.p3);

        return out;
    }

    updateTransform() {
        const coords = completeCatmullRomControlPoint(this.p0, this.p1, this.p2, this.p3);
        const [z0, z1] = calculateCatmullRomIntermediatePoints(coords);
        this.viewElement.endpoint0 = this.p1;
        this.viewElement.endpoint1 = this.p2;
        this.viewElement.intermediatePoint0 = z0;
        this.viewElement.intermediatePoint1 = z1;
        this.viewElement.update();
    }


}