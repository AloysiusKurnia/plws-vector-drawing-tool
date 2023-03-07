type Point = readonly [number, number];

type ControlPointGeneratingFunction = (p0: Point, p1: Point, pPrev: Point, pNext: Point) => [Point, Point];

function add(...points: Point[]): Point {
    const out = [0, 0] as [number, number];
    for (const point of points) {
        out[0] += point[0];
        out[1] += point[1];
    }
    return out;
}

function sub(p1: Point, p2: Point): Point {
    return [p1[0] - p2[0], p1[1] - p2[1]];
}

function scale(p: Point, scale: number): Point {
    return [p[0] * scale, p[1] * scale];
}

function distance(p1: Point, p2: Point): number {
    return Math.hypot(p1[0] - p2[0], p1[1] - p2[1]);
}

export const linearGenerator: ControlPointGeneratingFunction = (p0, p1, pPrev, pNext) => {
    const midPoint = scale(add(p0, p1), 0.5);
    return [midPoint, midPoint];
};

export const cardinalGenerator: (tension: number) => ControlPointGeneratingFunction
    = (tension) => (p0, p1, pPrev, pNext) => {
        const d1 = scale(sub(p1, pPrev), tension / 3);
        const d2 = scale(sub(pNext, p0), tension / 3);
        return [add(p0, d1), sub(p1, d2)];
    };

export const uniformCatmullRomGenerator = cardinalGenerator(0.5);

export const symmetricCCRGenerator: ControlPointGeneratingFunction = (p0, p1, pPrev, pNext) => {
    const l0 = Math.sqrt(distance(pPrev, p0));
    const l1 = Math.sqrt(distance(p0, p1));
    const l2 = Math.sqrt(distance(p1, pNext));
    const l01 = l0 + l1;
    const l12 = l1 + l2;

    const c10 = -l1 * l1 / (l01 * l0);
    const c11 = (l1 - l0) / l0;
    const c12 = l0 / l01;

    const c20 = -l1 * l1 / (l12 * l2);
    const c21 = (l1 - l2) / l2;
    const c22 = l2 / l12;

    const cp0 = scale(add(
        scale(pPrev, c10),
        scale(p0, 3 + c11),
        scale(p1, c12),
    ), 1 / 3);
    const cp1 = scale(add(
        scale(pNext, c20),
        scale(p1, 3 + c21),
        scale(p0, c22)
    ), 1 / 3);
    return [cp0, cp1];
};

export function pathFromPoints(points: Point[], controlPointGenerator: ControlPointGeneratingFunction): string {
    let output = '';
    for (let i = 1; i < points.length; i++) {
        const p0 = points[i - 1];
        const p1 = points[i];
        const pPrev = points[i - 2] ?? add(p0, sub(p0, p1));
        const pNext = points[i + 1] ?? add(p1, sub(p1, p0));
        const [cp1, cp2] = controlPointGenerator(p0, p1, pPrev, pNext);
        if (i === 1) {
            output += `M${p0[0]} ${p0[1]}`;
        }
        output += ` C${cp1[0]} ${cp1[1]},${cp2[0]} ${cp2[1]},${p1[0]} ${p1[1]}`;
    }
    return output;
}