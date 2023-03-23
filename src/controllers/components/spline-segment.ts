import { COLOR } from "constants/settings";
import { DrawingElement } from "controllers/element";
import { BezierWrapper } from "util/svg-wrapper";
import { Pair, Pointlike, Quadruple } from "util/utility-types";
import { SplineSegmentGroup } from "views/groups/spline-segment-group";
import { SplineSegmentView } from "views/component/spline-segment-view";
import { EndPoint } from "./end-point";
import { IntermediatePoint } from "./intermediate-point";

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

function completeControlPoint(
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

    return [{ x: z0x, y: z0y }, { x: z1x, y: z1y }];
}

export class SplineSegment extends DrawingElement<BezierWrapper> {
    constructor(
        public endPoint0: EndPoint,
        public intermediatePoint0: IntermediatePoint,
        public intermediatePoint1: IntermediatePoint,
        public endPoint1: EndPoint,
        group: SplineSegmentGroup
    ) {
        super(new SplineSegmentView(group));
        this.updateGraphicsToDefault();
    }

    updateGraphicsToHovered(): void {
        this.viewElement.setStroke(COLOR.lightBlack);
    }

    updateGraphicsToDefault(): void {
        this.viewElement.setStroke(COLOR.black);
    }

    updateView() {
        this.viewElement.endpoint0 = this.endPoint0;
        this.viewElement.endpoint1 = this.endPoint1;
        this.viewElement.intermediatePoint0 = this.intermediatePoint0;
        this.viewElement.intermediatePoint1 = this.intermediatePoint1;
        this.viewElement.update();

        this.intermediatePoint0.updateView();
        this.intermediatePoint1.updateView();
    }

    override removeElement(): void {
        this.intermediatePoint0.removeElement();
        this.intermediatePoint1.removeElement();
        super.removeElement();
    }
}

export class CatmullRomSplineBuilder {
    public endPoint0: EndPoint
    public endPoint1: EndPoint
    constructor(
        public outerPoint0: EndPoint | null,
        public outerPoint1: EndPoint | null,
        public readonly segment: SplineSegment
    ) { }

    updatePoints() {
        const coords = completeControlPoint(
            this.outerPoint0,
            this.segment.endPoint0,
            this.segment.endPoint1,
            this.outerPoint1);
        const [z0, z1] = calculateCatmullRomIntermediatePoints(coords);
        this.segment.intermediatePoint0.copyFrom(z0);
        this.segment.intermediatePoint1.copyFrom(z1);
    }
}